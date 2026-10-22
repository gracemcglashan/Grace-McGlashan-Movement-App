import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { generateMovementFlow } from "./server/flowService.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Add CORS and security headers for Safari / mobile browsers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

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

// Serve frontend: if dist exists serve static, otherwise mount Vite middlewares
const distPath = path.join(__dirname, "dist");
const hasDist = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, "index.html"));

async function setupFrontend() {
  if (hasDist) {
    console.log("Serving production build from dist directory");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.log("dist not found, mounting Vite middleware in dev mode");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== "true" },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mood to Movement server listening on port ${PORT}`);
  });
}

setupFrontend().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
