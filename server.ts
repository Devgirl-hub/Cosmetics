import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Initialize GoogleGenAI server-side with key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // API router / endpoints
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: new Date() });
  });

  // Skincare and Beauty AI Consultant Endpoint
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { skinType, skinConcerns, budget, preferences, currentRoutine } = req.body;
      
      const prompt = `You are a professional skincare expert, dermatologist, and makeup artist.
Analyze the following profile and construct a high-end customized skincare and cosmetics routine.

Profile:
- Skin Type: ${skinType}
- Concerns: ${skinConcerns.join(", ")}
- Budget Preference: ${budget}
- Style/Preferences: ${preferences}
- Current Routine: ${currentRoutine || "None"}

Please return a structured recommendation in elegant markdown format.
Structure the response with:
1. **Skin Assessment**: A concise explanation of their skin profile and what it needs.
2. **Morning Skincare Routine**: Step-by-step suggestions (Cleanser, Toner, Serum, Moisturizer, SPF).
3. **Evening Skincare Routine**: Step-by-step suggestions (Oil cleanser, Water cleanser, Treatment/Exfoliant, Night Cream/Moisturizer).
4. **Key Ingredients to Look For**: 3-4 specific highly-effective ingredients (e.g., Niacinamide, Hyaluronic Acid, Retinol, Centella) with short explanations.
5. **Aura Cosmetics Product Recommendations**: Recommend specific types of products (e.g., "Aura Botanical Cream Cleanser", "Aura Dewy Glow SPF 50", "Aura Silk Blur Primer", "Aura Matte Skin-Luxe Tint"). Ensure they feel luxurious.

Keep your tone warm, highly professional, encouraging, and luxurious. Limit the text to around 400 words to be concise.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error("Gemini analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze skincare profile" });
    }
  });

  // Chat/Q&A helper for beauty tips
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const systemInstruction = `You are "AURA Beauty Expert", a luxurious and extremely knowledgeable AI beauty & skincare consultant at AURA Cosmetics.
You help people find the perfect products, understand makeup techniques, build skincare routines, and explain cosmetic ingredients.
Your tone is sophisticated, welcoming, warm, and highly expert. Always recommend AURA brand products where fitting.
Keep replies compact (under 150 words) and nicely formatted in markdown.`;

      const formattedContents: any[] = [];
      // Push history
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          formattedContents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text }]
          });
        }
      }
      // Push current message
      formattedContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini chat error:", error);
      res.status(500).json({ error: error.message || "Failed to process chat response" });
    }
  });

  // Serve static files / Vite middleware
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
    console.log(`Server starting on port ${PORT} with environment ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
