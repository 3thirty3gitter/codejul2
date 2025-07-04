import { Pool } from "pg";
import Redis from "redis";

// PostgreSQL connection
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://username:password@localhost:5432/codepilot_ai",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis connection for caching and sessions
export const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export async function connectDatabases() {
  try {
    await redisClient.connect();
    console.log("? Connected to Redis");
    
    const client = await pgPool.connect();
    console.log("? Connected to PostgreSQL");
    client.release();
  } catch (error) {
    console.error("? Database connection failed:", error);
  }
}
