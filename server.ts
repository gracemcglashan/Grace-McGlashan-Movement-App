import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { generateMovementFlow } from "./server/flowService.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Support audio base64 uploads up to 25MB
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// API Endpoint for generating movement flow
app.post("/api/generate-flow", async (req, res) => {
  try {
    const { audioBase64, mimeType, textInput } = req.body;

    if (!audioBase64 && (!textInput || !textInput.trim())) {
      res.status(400).json({ error: "Missing audio or text input." });
      return;
    }

    const flow = await generateMovementFlow({
      audioBase64,
      mimeType,
      textInput,
    });

    res.json(flow);
  } catch (error: any) {
    console.error("Error generating flow:", error);
    res.status(500).json({
      error: error?.message || "Failed to generate movement flow.",
    });
  }
});

// Serve static assets from dist in production
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// For SPA client routing
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Mood to Movement server listening on port ${PORT}`);
});
