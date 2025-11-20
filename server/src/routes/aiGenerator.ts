import { Router, Request, Response } from "express";
import { getPrompt } from "../config/aiPrompts";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/generate", authenticate, async (req: Request, res: Response) => {
  try {
    const { generatorType, userInput, options = {} } = req.body;

    if (!generatorType || !userInput) {
      return res.status(400).json({ error: "generatorType and userInput are required" });
    }

    if (!process.env.INFLECTION_API_KEY) {
      return res.status(503).json({ error: "AI service not configured" });
    }

    const variables = { userInput, ...options };
    const prompt = getPrompt(generatorType, variables);

    const axios = (await import("axios")).default;

    const context = [
      { text: prompt, type: "Human" }
    ];

    const response = await axios.post(
      process.env.INFLECTION_API_URL!,
      {
        context,
        config: "Pi-3.1"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.INFLECTION_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.text || "No response generated";

    res.json({ success: true, result: aiResponse, response: aiResponse, generatorType });
  } catch (error: any) {
    console.error("AI Generator Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

export default router;
