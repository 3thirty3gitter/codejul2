import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import applicationBuilderRoutes from "./routes/applicationBuilder";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/builder", applicationBuilderRoutes());

app.get("/api/health", (req, res) => {
  res.json({
    status: "Backend running with health endpoint!",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
