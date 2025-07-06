import { pgPool } from "./connection";
import fs from "fs";
import path from "path";

export async function initializeDatabase() {
  // Only initialize database if PostgreSQL is explicitly enabled
  if (process.env.ENABLE_POSTGRES === "true") {
    try {
      const schemaSQL = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
      await pgPool.query(schemaSQL);
      console.log("? Database schema initialized");
    } catch (error) {
      console.error("? Database initialization failed:", error);
      throw error;
    }
  } else {
    console.log("?? Database initialization skipped - PostgreSQL disabled for development");
  }
}
