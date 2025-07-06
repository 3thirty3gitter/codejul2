const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
const WORKSPACE_DIR = path.resolve(__dirname, '..', '..', 'generated-projects');

fs.mkdir(WORKSPACE_DIR, { recursive: true });

// --- AGENT TOOLS AND HANDLERS ---
const getSafePath = (filePath) => {
  if (!filePath || typeof filePath !== 'string') throw new Error("Invalid path provided.");
  const resolvedPath = path.resolve(WORKSPACE_DIR, filePath);
  if (!resolvedPath.startsWith(WORKSPACE_DIR)) throw new Error("Access denied.");
  return resolvedPath;
};
const tools = [
  { type: "function", function: { name: "listFiles", description: "List all files in the workspace.", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "readFile", description: "Read a file's content.", parameters: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } } },
  { type: "function", function: { name: "writeFile", description: "Write content to a file.", parameters: { type: "object", properties: { path: { type: "string" }, content: { type: "string" } }, required: ["path", "content"] } } }
];
const toolHandlers = {
  listFiles: async () => (await fs.readdir(WORKSPACE_DIR, { withFileTypes: true, recursive: true })).map(file => path.join(file.path.replace(WORKSPACE_DIR, ''), file.name)).join('\n') || 'Workspace is empty.',
  readFile: async ({ path: filePath }) => fs.readFile(getSafePath(filePath), "utf-8"),
  writeFile: async ({ path: filePath, content }) => {
    const safePath = getSafePath(filePath);
    await fs.mkdir(path.dirname(safePath), { recursive: true });
    await fs.writeFile(safePath, content, "utf-8");
    return `Successfully wrote to ${filePath}`;
  },
};

// --- DYNAMIC SYSTEM PROMPTS FOR AGENT STATE MACHINE ---
const prompts = {
  PLANNING: `You are DevOpsAgent, an autonomous full-stack engineer.
**Current Task: Plan the Project.**
Your ONLY job right now is to understand the user's request and create a plan.
1.  Start with a 2-3 bullet point summary of the user's goal.
2.  Present a high-level, phased development plan as a numbered list.
3.  Your response MUST end with the exact question: "Does this plan look good? Would you like a visual example (wireframe, Mermaid chart, or HTML mock-up) before we start coding?"
DO NOT use any tools. DO NOT write any code. AWAIT USER APPROVAL.`,

  IMPLEMENTING: `You are DevOpsAgent, an autonomous full-stack engineer.
**Current Task: Implement the Approved Plan.**
The user has approved your plan. Your ONLY job now is to execute that plan step-by-step using your tools.
1.  For each step, first state the action you are taking (e.g., "Now creating the main HTML file...").
2.  Then, call the appropriate tool ('listFiles', 'readFile', or 'writeFile').
3.  **MANDATORY:** After every 'writeFile' operation, your immediate next action MUST be to call 'readFile' on the same file to verify the content.
4.  After each step is complete and verified, STOP and await user confirmation to proceed.`
};

// --- MAIN CHAT ENDPOINT WITH STATE MACHINE AND TOOL LOOP ---
app.post("/api/chat", async (req, res) => {
  const history = req.body.messages || [];
  if (history.length === 0) return res.status(400).json({ error: "Messages are required" });

  try {
    let currentPhase = 'PLANNING';
    const lastAssistantMessage = history.filter(m => m.role === 'assistant').pop();
    if (lastAssistantMessage && lastAssistantMessage.content.includes("Does this plan look good?")) {
      const lastUserMessage = history.filter(m => m.role === 'user').pop();
      if (/^(yes|ok|looks good|approve|continue|proceed)/i.test(lastUserMessage.content)) {
        currentPhase = 'IMPLEMENTING';
      }
    } else if (history.length > 2) {
      currentPhase = 'IMPLEMENTING';
    }

    const systemPrompt = prompts[currentPhase];
    let localHistory = [...history];

    let continueConversation = true;
    while (continueConversation) {
        const response = await fetch(PERPLEXITY_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}` },
            body: JSON.stringify({
                model: "llama-3-sonar-large-32k-chat",
                system: systemPrompt,
                messages: localHistory,
                tools: (currentPhase === 'IMPLEMENTING') ? tools : undefined, // Only provide tools in the IMPLEMENTING phase
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const choice = data.choices[0];
        localHistory.push(choice.message);

        if (choice.finish_reason === 'tool_calls') {
            for (const toolCall of choice.message.tool_calls) {
                const handler = toolHandlers[toolCall.function.name];
                const args = JSON.parse(toolCall.function.arguments);
                const result = await handler(args);
                localHistory.push({ role: "tool", tool_call_id: toolCall.id, content: result });
            }
        } else {
            continueConversation = false;
            res.json(choice.message); // Send the final conversational message to the frontend
        }
    }
  } catch (error) {
    console.error("Chat processing error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`DevOpsAgent with State Machine is online on http://localhost:${PORT}`));
