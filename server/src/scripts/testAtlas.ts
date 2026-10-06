import mongoose, { Schema } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { ATLAS_CONNECTION_OPTIONS, getAtlasUri, pingAtlas } from '../db/atlasConfig.js';
import { maskUri } from '../db/connection.js';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const TestSchema = new Schema({
  message: String,
  testedAt: { type: Date, default: Date.now },
});
const TestModel = mongoose.model('ConnectionTest', TestSchema, '_atlas_diagnostics');

async function testAtlasConnection() {
  const uri = getAtlasUri();
  console.log(`\n======================================================`);
  console.log(`🔍 Easy Pattern: MongoDB Atlas Diagnostic Tool`);
  console.log(`Target URI: ${maskUri(uri)}`);
  console.log(`======================================================\n`);

  const startTime = Date.now();

  try {
    console.log(`[1/4] Connecting to cluster...`);
    await mongoose.connect(uri, ATLAS_CONNECTION_OPTIONS);
    const connectTimeMs = Date.now() - startTime;
    console.log(`  ✓ Connected in ${connectTimeMs}ms`);
    console.log(`  ✓ Cluster Host: ${mongoose.connection.host}`);
    console.log(`  ✓ Target Database: ${mongoose.connection.name}`);

    console.log(`\n[2/4] Testing ping command...`);
    const pingResult = await pingAtlas();
    if (pingResult.ok) {
      console.log(`  ✓ Ping successful (latency: ${pingResult.latencyMs}ms)`);
    } else {
      console.log(`  ⚠️ Ping command failed`);
    }

    console.log(`\n[3/4] Testing document WRITE & READ...`);
    const testDoc = await TestModel.create({ message: 'Atlas test ping from Easy Pattern CAD' });
    console.log(`  ✓ Document written (ID: ${testDoc._id})`);

    const readDoc = await TestModel.findById(testDoc._id);
    if (readDoc) {
      console.log(`  ✓ Document read back verified`);
    }

    await TestModel.findByIdAndDelete(testDoc._id);
    console.log(`  ✓ Test document cleaned up`);

    console.log(`\n[4/4] Inspecting existing collections...`);
    const collections = await mongoose.connection.db?.listCollections().toArray();
    const names = collections?.map((c) => c.name).filter((n) => n !== '_atlas_diagnostics') || [];
    console.log(`  ✓ Active Collections (${names.length}): ${names.join(', ') || '(empty database - ready for seed)'}`);

    console.log(`\n======================================================`);
    console.log(`🎉 SUCCESS: Your MongoDB Atlas Cluster is 100% OPERATIONAL!`);
    console.log(`Easy Pattern CAD is fully connected to the cloud database.`);
    console.log(`======================================================\n`);
  } catch (error) {
    const err = error as Error;
    console.error(`\n❌ Atlas Diagnostic Failed:`);
    console.error(`   ${err.message}\n`);

    if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
      console.log(`💡 FIX REQUIRED: Authentication Error`);
      console.log(`   - The username or password in your MONGODB_URI is incorrect.`);
      console.log(`   - In MongoDB Atlas, go to: Security -> Database Access`);
      console.log(`   - Click 'Edit' on the user, set a new password, and click 'Update User'.`);
    } else if (err.message.includes('timed out') || err.message.includes('ETIMEDOUT') || err.message.includes('ENOTFOUND')) {
      console.log(`💡 FIX REQUIRED: Network Access / IP Whitelist Error`);
      console.log(`   - Your IP is not permitted to connect to this cluster.`);
      console.log(`   - In MongoDB Atlas, go to: Security -> Network Access`);
      console.log(`   - Click 'Add IP Address' -> Select 'Allow Access from Anywhere' (0.0.0.0/0).`);
    }
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

testAtlasConnection();
