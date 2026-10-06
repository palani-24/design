import { Project, Garment } from '../../../shared/types.js';
import { createDefaultBasicTShirt } from '../../../shared/constants.js';
import { ProjectModel } from './ProjectModel.js';
import { isMongoConnected } from '../db/connection.js';

// In-memory fallback store
const inMemoryProjects = new Map<string, Project>();

// Seed default projects
function seedDefaults() {
  const defaultGarment = createDefaultBasicTShirt();
  const sampleProject: Project = {
    id: 'proj-basic-tshirt-001',
    title: 'Basic T-Shirt — Size S to M v1.4',
    description: 'Standard 1-Object Parametric Nest with Front, Back and Sleeve components.',
    garment: defaultGarment,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const athleticGarment = createDefaultBasicTShirt();
  athleticGarment.id = 'garment-athletic-tee-002';
  athleticGarment.name = 'Athletic Crewneck Tee';
  const athleticProject: Project = {
    id: 'proj-athletic-tee-002',
    title: 'Athletic Crewneck Tee (Grade Ready)',
    description: 'Precision proportioned athletic fit block with standardized grade increments.',
    garment: athleticGarment,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  inMemoryProjects.set(sampleProject.id, sampleProject);
  inMemoryProjects.set(athleticProject.id, athleticProject);
}

seedDefaults();

export const projectStore = {
  async getAll(): Promise<Project[]> {
    if (isMongoConnected) {
      try {
        const count = await ProjectModel.countDocuments();
        if (count === 0) {
          // Seed Mongo with in-memory templates
          for (const p of inMemoryProjects.values()) {
            await ProjectModel.create(p);
          }
        }
        const docs = await ProjectModel.find().lean();
        return docs as unknown as Project[];
      } catch (err) {
        console.error('Mongo error in getAll, falling back to memory store:', err);
      }
    }
    return Array.from(inMemoryProjects.values());
  },

  async getById(id: string): Promise<Project | null> {
    if (isMongoConnected) {
      try {
        const doc = await ProjectModel.findOne({ id }).lean();
        if (doc) return doc as unknown as Project;
      } catch (err) {
        console.error('Mongo error in getById, falling back to memory store:', err);
      }
    }
    return inMemoryProjects.get(id) || null;
  },

  async create(project: Project): Promise<Project> {
    inMemoryProjects.set(project.id, project);
    if (isMongoConnected) {
      try {
        await ProjectModel.create(project);
      } catch (err) {
        console.error('Mongo error in create, persisted in-memory:', err);
      }
    }
    return project;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    const existing = inMemoryProjects.get(id);
    const updated = {
      ...(existing || {}),
      ...updates,
      updatedAt: new Date().toISOString(),
    } as Project;

    inMemoryProjects.set(id, updated);

    if (isMongoConnected) {
      try {
        await ProjectModel.findOneAndUpdate({ id }, { $set: updated }, { new: true });
      } catch (err) {
        console.error('Mongo error in update, persisted in-memory:', err);
      }
    }
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const existed = inMemoryProjects.delete(id);
    if (isMongoConnected) {
      try {
        const res = await ProjectModel.deleteOne({ id });
        return res.deletedCount > 0 || existed;
      } catch (err) {
        console.error('Mongo error in delete:', err);
      }
    }
    return existed;
  },
};
