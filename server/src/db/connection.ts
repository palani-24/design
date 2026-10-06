import mongoose from 'mongoose';

export let isMongoConnected = false;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/easypattern';
  
  try {
    mongoose.set('strictQuery', false);
    // Connect with a 3-second timeout so app starts up fast regardless of local Mongo daemon status
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log(`[Database] Successfully connected to MongoDB at ${uri}`);
    return true;
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB connection failed or not running locally (${(err as Error).message}). Operating with in-memory persistence fallback.`);
    return false;
  }
}
