
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Flag to track connection status
let dbInitialized = false;
let dbPool: Pool | null = null;

export async function connectToDatabase() {
  if (dbInitialized) {
    return { db, pool };
  }
  
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not set - using in-memory storage');
    return null;
  }
  
  try {
    // Connect to PostgreSQL database
    dbPool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Test connection
    const testConnection = await dbPool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL database successfully');
    
    dbInitialized = true;
    return { db, pool };
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    console.log('Continuing with in-memory storage');
    return null;
  }
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

export const db = drizzle(pool, { schema });
