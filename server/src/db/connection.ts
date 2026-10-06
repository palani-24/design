import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

export let isMongoConnected = false;
export let currentDbUri = '';
export let dbConnectionInfo = {
  type: 'in-memory' as 'atlas' | 'local' | 'in-memory',
  host: 'local-fallback',
  name: 'easypattern',
  maskedUri: '',
  lastConnectedAt: null as string | null,
};

// Mask sensitive credentials in URI for safe logging
export function maskUri(uri: string): string {
  try {
    return uri.replace(/(mongodb(\+srv)?:\/\/)([^:@]+):([^@]+)@/, '$1$3:******@');
  } catch {
    return 'mongodb://******';
  }
}

/**
 * Connects to MongoDB (Local or MongoDB Atlas)
 * Fully compatible with mongodb+srv:// Atlas connection strings
 */
export async function connectDB(customUri?: string): Promise<{ success: boolean; message: string }> {
  const uri = customUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/easypattern';
  currentDbUri = uri;

  try {
    // If already connected to a different URI, disconnect cleanly first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoose.set('strictQuery', false);

    const isAtlas = uri.startsWith('mongodb+srv://') || uri.includes('mongodb.net');

    console.log(`[Database] Attempting connection to ${isAtlas ? 'MongoDB Atlas' : 'MongoDB'} at ${maskUri(uri)}...`);

    // Connect with options optimized for both local and cloud Atlas
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: isAtlas ? 10000 : 4000,
      connectTimeoutMS: 10000,
    });

    isMongoConnected = true;
    dbConnectionInfo = {
      type: isAtlas ? 'atlas' : 'local',
      host: mongoose.connection.host || (isAtlas ? 'MongoDB Atlas Cluster' : 'localhost'),
      name: mongoose.connection.name || 'easypattern',
      maskedUri: maskUri(uri),
      lastConnectedAt: new Date().toISOString(),
    };

    console.log(`[Database] ✅ Successfully connected to ${dbConnectionInfo.type.toUpperCase()}: ${dbConnectionInfo.host}/${dbConnectionInfo.name}`);

    // If customUri was passed and connected successfully, persist to server/.env and root .env
    if (customUri) {
      saveUriToEnv(customUri);
    }

    return {
      success: true,
      message: `Connected successfully to ${dbConnectionInfo.type === 'atlas' ? 'MongoDB Atlas' : 'MongoDB'} (${dbConnectionInfo.host})`,
    };
  } catch (err) {
    isMongoConnected = false;
    dbConnectionInfo = {
      type: 'in-memory',
      host: 'in-memory fallback store',
      name: 'easypattern-memory',
      maskedUri: 'memory://active',
      lastConnectedAt: null,
    };

    const errMsg = (err as Error).message;
    console.warn(`[Database] ⚠️ MongoDB connection failed (${errMsg}). Operating with in-memory persistence fallback.`);

    return {
      success: false,
      message: `Failed to connect to MongoDB: ${errMsg}. In-memory store active.`,
    };
  }
}

// Event Listeners for robust connection health
mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.warn('[Database] Mongoose disconnected.');
});

mongoose.connection.on('error', (err) => {
  isMongoConnected = false;
  console.error('[Database] Mongoose connection error:', err);
});

// Helper to save MONGODB_URI to .env file
function saveUriToEnv(uri: string) {
  try {
    const envPaths = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), 'server', '.env'),
    ];

    envPaths.forEach((envPath) => {
      let content = '';
      if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
      }

      if (content.includes('MONGODB_URI=')) {
        content = content.replace(/MONGODB_URI=.*/, `MONGODB_URI=${uri}`);
      } else {
        content += `\nMONGODB_URI=${uri}\n`;
      }

      fs.writeFileSync(envPath, content, 'utf8');
    });

    process.env.MONGODB_URI = uri;
    console.log(`[Database] Persisted new MONGODB_URI to .env`);
  } catch (err) {
    console.warn('[Database] Could not write .env file:', err);
  }
}
