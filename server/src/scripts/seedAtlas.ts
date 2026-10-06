import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { ATLAS_CONNECTION_OPTIONS, getAtlasUri } from '../db/atlasConfig.js';
import { maskUri } from '../db/connection.js';
import { ProjectModel } from '../models/ProjectModel.js';
import { GarmentModel } from '../models/GarmentModel.js';
import { SizeTableModel } from '../models/SizeTableModel.js';
import { createDefaultBasicTShirt, DEFAULT_SIZE_TABLE } from '../../../shared/constants.js';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function seedAtlasDatabase() {
  const uri = getAtlasUri();
  console.log(`\n======================================================`);
  console.log(`🌱 Easy Pattern: MongoDB Atlas Database Seeder`);
  console.log(`Connecting to: ${maskUri(uri)}`);
  console.log(`======================================================\n`);

  try {
    await mongoose.connect(uri, ATLAS_CONNECTION_OPTIONS);
    console.log(`✅ Connected to cluster: ${mongoose.connection.host}`);
    console.log(`📁 Database name: ${mongoose.connection.name}\n`);

    // 1. Seed Size Tables Collection
    console.log(`[1/3] Seeding Size Tables collection...`);
    const existingTable = await SizeTableModel.findOne({ id: 'size-table-standard-metric' });
    if (!existingTable) {
      await SizeTableModel.create({
        id: 'size-table-standard-metric',
        name: 'Standard Apparel Metric Grading Table (cm)',
        isDefault: true,
        unit: 'cm',
        table: DEFAULT_SIZE_TABLE,
      });
      console.log(`  ✓ Created default size table (XS, S, M, L, XL, XXL)`);
    } else {
      console.log(`  ℹ Default size table already exists in Atlas.`);
    }

    // 2. Seed Garments Collection
    console.log(`\n[2/3] Seeding Garment Patterns collection...`);
    const defaultGarment = createDefaultBasicTShirt();
    const existingGarment = await GarmentModel.findOne({ id: defaultGarment.id });
    if (!existingGarment) {
      await GarmentModel.create(defaultGarment);
      console.log(`  ✓ Seeded garment: ${defaultGarment.name} (${defaultGarment.components.length} components)`);
    } else {
      console.log(`  ℹ Garment '${defaultGarment.name}' already exists in Atlas.`);
    }

    // 3. Seed Projects Collection
    console.log(`\n[3/3] Seeding Projects collection...`);
    const existingProj1 = await ProjectModel.findOne({ id: 'proj-basic-tshirt-001' });
    if (!existingProj1) {
      await ProjectModel.create({
        id: 'proj-basic-tshirt-001',
        title: 'Basic T-Shirt — Size S to M v1.4',
        description: 'Standard 1-Object Parametric Nest with Front, Back and Sleeve components.',
        garment: defaultGarment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`  ✓ Seeded project: Basic T-Shirt — Size S to M v1.4`);
    }

    const athleticGarment = createDefaultBasicTShirt();
    athleticGarment.id = 'garment-athletic-tee-002';
    athleticGarment.name = 'Athletic Crewneck Tee';
    const existingProj2 = await ProjectModel.findOne({ id: 'proj-athletic-tee-002' });
    if (!existingProj2) {
      await ProjectModel.create({
        id: 'proj-athletic-tee-002',
        title: 'Athletic Crewneck Tee (Grade Ready)',
        description: 'Precision proportioned athletic fit block with standardized grade increments.',
        garment: athleticGarment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`  ✓ Seeded project: Athletic Crewneck Tee (Grade Ready)`);
    }

    // Summary
    const projectsCount = await ProjectModel.countDocuments();
    const garmentsCount = await GarmentModel.countDocuments();
    const tablesCount = await SizeTableModel.countDocuments();

    console.log(`\n------------------------------------------------------`);
    console.log(`🎉 MongoDB Atlas Seeding Complete!`);
    console.log(`- Projects in Atlas:    ${projectsCount}`);
    console.log(`- Garments in Atlas:    ${garmentsCount}`);
    console.log(`- Size Tables in Atlas: ${tablesCount}`);
    console.log(`------------------------------------------------------\n`);
  } catch (error) {
    console.error(`\n❌ Seeding failed:`, (error as Error).message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log(`Disconnected from MongoDB Atlas.`);
  }
}

seedAtlasDatabase();
