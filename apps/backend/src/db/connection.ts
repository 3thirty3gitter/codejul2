import { Pool } from "pg";

// PostgreSQL connection
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://username:password@localhost:5432/codepilot_ai",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis client (only create if enabled)
export let redisClient: any = null;

export async function connectDatabases() {
  console.log("?? Starting database connections...");
  
  // Skip Redis for development unless explicitly enabled
  if (process.env.ENABLE_REDIS === "true") {
    try {
      const { createClient } = await import("redis");
      redisClient = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379"
      });
      await redisClient.connect();
      console.log("? Connected to Redis");
    } catch (redisError) {
      console.log("?? Redis connection failed - continuing without cache");
      redisClient = null;
    }
  } else {
    console.log("?? Redis disabled for development mode");
  }
  
  // Skip PostgreSQL for development unless explicitly enabled
  if (process.env.ENABLE_POSTGRES === "true") {
    try {
      const client = await pgPool.connect();
      console.log("? Connected to PostgreSQL");
      client.release();
    } catch (pgError) {
      console.log("?? PostgreSQL connection failed - continuing without database");
    }
  } else {
    console.log("?? PostgreSQL disabled for development mode");
  }
}
