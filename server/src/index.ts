import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isMongoConnected } from './db/connection.js';
import { projectsRouter } from './routes/projects.js';
import { garmentsRouter } from './routes/garments.js';
import { sizesRouter } from './routes/sizes.js';
import { gradeRouter } from './routes/grade.js';
import { exportRouter } from './routes/export.js';
import { databaseRouter } from './routes/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '15mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Easy Pattern CAD Backend',
    version: '1.4.0',
    database: isMongoConnected ? 'MongoDB (Connected)' : 'In-Memory Hybrid (Active)',
    timestamp: new Date().toISOString(),
  });
});

// Route Handlers
app.use('/api/projects', projectsRouter);
app.use('/api/garments', garmentsRouter);
app.use('/api/sizes', sizesRouter);
app.use('/api/grade', gradeRouter);
app.use('/api/export', exportRouter);
app.use('/api/db', databaseRouter);

// Global Error Handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error occurred',
  });
});

// Start server and initialize DB
async function bootstrap() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Easy Pattern CAD Server] listening on http://localhost:${PORT}`);
    console.log(`[CORS] Enabled for origin: ${CLIENT_URL}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
});
