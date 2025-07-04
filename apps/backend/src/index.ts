import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai";
import filesRoutes from "./routes/files";
import projectsRoutes from "./routes/projects";
import { connectDatabases } from "./db/connection";
import { initializeDatabase } from "./db/init";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "Backend running with full infrastructure!", 
    timestamp: new Date().toISOString(),
    features: ["AI Chat", "File Management", "Project Management", "Database", "Redis Cache"]
  });
});

// API Routes
app.use("/api/ai", aiRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/projects", projectsRoutes);

// Initialize database and start server
async function startServer() {
  try {
    await connectDatabases();
    await initializeDatabase();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`?? Backend running on port ${PORT}`);
      console.log(`?? Database: Connected`);
      console.log(`?? AI Chat: Ready`);
      console.log(`?? File Management: Ready`);
      console.log(`??? Project Management: Ready`);
      console.log(`? Redis Cache: Ready`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
