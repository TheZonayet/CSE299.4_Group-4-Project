import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'asure';

let client;
let db;

export async function connectDB() {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  // Indexes
  await db.collection('users').createIndex({ 'auth.email': 1 }, { unique: true });
  console.log('✅ Connected to MongoDB database successfully');
  return db;
}

export function getDB() {
  if (!db) throw new Error('Database not initialized. Call connectDB() first.');
  return db;
}

export async function closeDB() {
  if (client) await client.close();
}