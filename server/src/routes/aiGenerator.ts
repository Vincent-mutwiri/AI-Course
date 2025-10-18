import { Router, Request, Response } from "express";
import axios from "axios";
import { getPrompt } from "../config/aiPrompts";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/generate", auth, async (req: Request, res: Response) => {
  try {
    const { generatorType, userInput, options = {} } = req.body;

    if (!generatorType || !userInput) {
      return res.status(400).json({ error: "generatorType and userInput are required" });
    }

    const variables = { userInput, ...options };
    const prompt = getPrompt(generatorType, variables);

    const response = await axios.post(
      process.env.INFLECTION_API_URL!,
      {
        model: "inflection_3_productivity",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.INFLECTION_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices?.[0]?.message?.content || "No response generated";

    res.json({ success: true, response: aiResponse, generatorType });
  } catch (error: any) {
    console.error("AI Generator Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

export default router;
