import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", hasApiKey: !!process.env.GEMINI_API_KEY });
  });

  // AI Task Splitter (Anti-Overwhelm Engine)
  app.post("/api/gemini/split-task", async (req, res) => {
    try {
      const { task, energyLevel = "moderate", sensoryNotes = "" } = req.body;
      if (!task || typeof task !== "string") {
        return res.status(400).json({ error: "Task description is required" });
      }

      const ai = getAI();
      if (!ai) {
        // High quality fallback micro-steps if key is not configured
        return res.json({
          source: "fallback",
          steps: [
            {
              id: "step-1",
              title: `Prep space: Put on noise-canceling headphones & grab a drink`,
              duration: "2m",
              sensoryTip: "Zero sensory friction to start",
              status: "ongoing",
            },
            {
              id: "step-2",
              title: `Identify the first single item or surface for: "${task}"`,
              duration: "3m",
              sensoryTip: "Look at only one target spot",
              status: "pendant",
            },
            {
              id: "step-3",
              title: `Do just 5 minutes of gentle action on "${task}"`,
              duration: "5m",
              sensoryTip: "Permitted to stop without guilt at timer",
              status: "pendant",
            },
            {
              id: "step-4",
              title: `Sensory pause: Stretch or take 3 deep breaths`,
              duration: "2m",
              sensoryTip: "Honor your nervous system",
              status: "pendant",
            },
          ],
        });
      }

      const prompt = `You are Aunicorn, an executive dysfunction coach and sensory-safe companion for neurodivergent (autistic, ADHD) women, LGBTQ+, and non-binary individuals.
The user is facing executive paralysis or overwhelm regarding this task: "${task}".
Current energy/spoons: ${energyLevel} (1=depleted, 5=high).
Sensory notes: "${sensoryNotes || "Prefers low-friction, calm, sensory-safe steps"}".

Deconstruct this task into 3 to 5 TINY, manageable, sensory-friendly micro-steps.
Guidelines:
- First step must require almost zero cognitive load (e.g., getting a comfortable sensory item or opening a tab).
- Include brief sensory tips (e.g., dim lights, wear gloves, brown noise, low odor).
- Keep descriptions concise, non-judgmental, and practical.
- Return ONLY valid JSON formatted as:
[
  { "title": "Step text", "duration": "2m", "sensoryTip": "Sensory safety note" }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "[]";
      let parsedSteps;
      try {
        parsedSteps = JSON.parse(responseText.trim());
      } catch (e) {
        parsedSteps = [];
      }

      if (!Array.isArray(parsedSteps) || parsedSteps.length === 0) {
        throw new Error("Invalid output format from model");
      }

      const formattedSteps = parsedSteps.slice(0, 5).map((s: any, idx: number) => ({
        id: `gen-step-${Date.now()}-${idx}`,
        title: s.title || `Micro-step ${idx + 1}`,
        duration: s.duration || "3m",
        sensoryTip: s.sensoryTip || "Gentle pace",
        status: idx === 0 ? "ongoing" : "pendant",
      }));

      return res.json({
        source: "gemini",
        steps: formattedSteps,
      });
    } catch (err: any) {
      console.error("Task split error:", err);
      return res.json({
        source: "fallback",
        steps: [
          {
            id: `err-step-1`,
            title: `Take one conscious breath and ground your feet`,
            duration: "1m",
            sensoryTip: "Body check-in",
            status: "ongoing",
          },
          {
            id: `err-step-2`,
            title: `Do the first 2-minute slice of "${req.body.task || "your task"}"`,
            duration: "2m",
            sensoryTip: "Soft focus",
            status: "pendant",
          },
          {
            id: `err-step-3`,
            title: `Check your spoons baseline and celebrate progress`,
            duration: "2m",
            sensoryTip: "Zero guilt zone",
            status: "pendant",
          },
        ],
      });
    }
  });

  // AI Unstick / Neuro-Affirming Co-Regulation Support
  app.post("/api/gemini/unstick", async (req, res) => {
    try {
      const { feeling, context } = req.body;
      const ai = getAI();
      if (!ai) {
        return res.json({
          affirmation: "You are not lazy or broken. Your nervous system is protecting your energy right now. It is safe to rest, and it is safe to do things differently from neurotypical expectations.",
          actionTip: "Try the 2-minute rule: Drink one sip of water, shake out your hands, and decide if you want to pause or do just 60 seconds of gentle motion.",
        });
      }

      const prompt = `You are Aunicorn, an affirming, compassionate companion for autistic, ADHD, queer, and non-binary individuals.
The user is experiencing: "${feeling || "stuck / executive paralysis"}".
Context: "${context || "Trouble starting tasks or feeling sensory overload"}".

Provide a short, deeply validating, neurodivergent-affirming response in JSON:
{
  "affirmation": "2-3 validating sentences dismantling neurotypical guilt and shame",
  "actionTip": "1 small, sensory-friendly physical or cognitive micro-anchor"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const data = JSON.parse(response.text || "{}");
      return res.json(data);
    } catch (err) {
      return res.json({
        affirmation: "Your worth is never tied to your productivity. Pauses and low-energy days are completely valid.",
        actionTip: "Step away to a dimmer room or put on brown noise for 5 minutes.",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aunicorn server running on port ${PORT}`);
  });
}

startServer();
