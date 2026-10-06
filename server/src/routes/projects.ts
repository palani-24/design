import { Router, Request, Response } from 'express';
import { projectStore } from '../models/store.js';
import { projectSchema, createProjectRequestSchema, updateProjectRequestSchema } from '../../../shared/validation.js';
import { createDefaultBasicTShirt } from '../../../shared/constants.js';
import { Project } from '../../../shared/types.js';

export const projectsRouter = Router();

// GET all projects
projectsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const list = await projectStore.getAll();
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET project by id
projectsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const project = await projectStore.getById(id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST create project
projectsRouter.post('/', async (req: Request, res: Response) => {
  try {
    // If full project payload provided (e.g. from JSON import)
    if (req.body.id && req.body.garment) {
      const parsed = projectSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.format() });
      }
      const created = await projectStore.create(parsed.data as Project);
      return res.status(201).json({ success: true, data: created });
    }

    // Otherwise validate title / metadata
    const parsed = createProjectRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.format() });
    }

    const garment = parsed.data.garment || createDefaultBasicTShirt();
    const newProject: Project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: parsed.data.title,
      description: parsed.data.description || 'Easy Pattern CAD Project',
      garment: garment as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = await projectStore.create(newProject);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PUT update project
projectsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const parsed = updateProjectRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.format() });
    }

    const existing = await projectStore.getById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const updated = await projectStore.update(id, parsed.data as any);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// DELETE project
projectsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const existing = await projectStore.getById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    await projectStore.delete(id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});
