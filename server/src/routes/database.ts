import { Router, Request, Response } from 'express';
import { connectDB, isMongoConnected, dbConnectionInfo, maskUri } from '../db/connection.js';
import { ProjectModel } from '../models/ProjectModel.js';
import { createDefaultBasicTShirt } from '../../../shared/constants.js';

export const databaseRouter = Router();

// GET /api/db/status
databaseRouter.get('/status', async (_req: Request, res: Response) => {
  try {
    let projectsCount = 0;
    if (isMongoConnected) {
      projectsCount = await ProjectModel.countDocuments();
    }

    res.json({
      success: true,
      data: {
        isConnected: isMongoConnected,
        ...dbConnectionInfo,
        projectsCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// POST /api/db/connect
// Allows testing or connecting to MongoDB Atlas directly
databaseRouter.post('/connect', async (req: Request, res: Response) => {
  const { uri } = req.body;

  if (!uri || typeof uri !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'MongoDB Connection URI is required (e.g. mongodb+srv://username:password@cluster0.xxxx.mongodb.net/easypattern)',
    });
  }

  try {
    const result = await connectDB(uri.trim());

    if (result.success) {
      // Auto-seed Atlas database if empty
      const count = await ProjectModel.countDocuments();
      if (count === 0) {
        const defaultGarment = createDefaultBasicTShirt();
        await ProjectModel.create({
          id: 'proj-basic-tshirt-001',
          title: 'Basic T-Shirt — Size S to M v1.4',
          description: 'Standard 1-Object Parametric Nest with Front, Back and Sleeve components.',
          garment: defaultGarment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        console.log('[Database] Seeded initial project in MongoDB Atlas cluster');
      }

      return res.json({
        success: true,
        message: result.message,
        data: dbConnectionInfo,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
        data: dbConnectionInfo,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: (err as Error).message,
    });
  }
});
