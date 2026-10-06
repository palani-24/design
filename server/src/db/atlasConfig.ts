import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Recommended MongoDB Atlas Connection Options
 * Calibrated for Cloud M0/M2/M5 tiers and replica sets
 */
export const ATLAS_CONNECTION_OPTIONS: ConnectOptions = {
  serverSelectionTimeoutMS: 10000, // 10 seconds timeout for DNS/SSL handshake
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,                 // Optimal pool size for Atlas free & shared clusters
  minPoolSize: 2,
  retryWrites: true,
  w: 'majority',
};

/**
 * Validates and normalizes a MongoDB URI
 */
export function getAtlasUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    return 'mongodb://127.0.0.1:27017/easypattern';
  }
  return uri.trim();
}

/**
 * Pings the connected MongoDB cluster to measure roundtrip latency
 */
export async function pingAtlas(): Promise<{ ok: boolean; latencyMs: number; host?: string; dbName?: string }> {
  const start = Date.now();
  try {
    const adminDb = mongoose.connection.db?.admin();
    if (!adminDb) {
      throw new Error('Database connection is not active');
    }
    await adminDb.ping();
    const latencyMs = Date.now() - start;
    return {
      ok: true,
      latencyMs,
      host: mongoose.connection.host,
      dbName: mongoose.connection.name,
    };
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
    };
  }
}
