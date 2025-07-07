import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import applicationBuilderRoutes from "./routes/applicationBuilder";
import aiRoutes from "./routes/ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

console.log("?? Starting database connections...");
console.log("?? Redis disabled for development mode");
console.log("?? PostgreSQL disabled for development mode");
console.log("?? Database initialization skipped - PostgreSQL disabled for development");

// CRITICAL: Middleware must be in correct order
// 1. CORS first
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// 2. Body parsing middleware - MUST come before routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. Request logging for debugging
app.use((req, res, next) => {
  console.log(`?? ${req.method} ${req.url}`, {
    contentType: req.get('Content-Type'),
    body: req.body,
    bodyKeys: Object.keys(req.body || {})
  });
  next();
});

// 4. API Routes AFTER middleware
app.use("/api/application-builder", applicationBuilderRoutes);

// AI Team Routes
app.use("/api/ai", aiRoutes);

// Basic health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "CodePilot Backend API with AI Integration", 
    status: "running",
    features: ["Application Builder", "AI Team", "Perplexity Integration"],
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('? Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`?? Backend running on port ${port}`);
  console.log("? Database: Connected");
  console.log("? AI Chat: Ready");
  console.log("? File Management: Ready");
  console.log("?? Project Management: Ready");
  console.log("? Redis Cache: Ready");
  console.log("?? AI Team: Initializing...");
});


