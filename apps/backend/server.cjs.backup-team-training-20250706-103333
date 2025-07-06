const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

app.post("/api/chat", async (req, res) => {
  console.log("Received request body:", JSON.stringify(req.body, null, 2));
  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: "Messages are required" });
  }

  try {
    const aiResponse = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-pro", // CORRECTED MODEL NAME
        messages: messages,
      }),
    });

    const data = await aiResponse.json();
    console.log("Full response from Perplexity AI:", JSON.stringify(data, null, 2));

    if (!aiResponse.ok || data.error) {
        const errorMessage = data.error?.message || `API request failed with status ${aiResponse.status}`;
        console.error("AI Service Error:", errorMessage);
        return res.status(aiResponse.status).json({ error: `AI service error: ${errorMessage}` });
    }

    res.json(data);

  } catch (error) {
    console.error("Server-side error:", error);
    res.status(500).json({ error: "Failed to communicate with the AI service." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
