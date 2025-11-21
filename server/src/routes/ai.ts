import { Router, Request, Response } from "express";
import axios from "axios";
import { authenticate, AuthRequest } from "../middleware/auth";
import ChatHistory from "../models/ChatHistory";
import { generateAIGameMasterResponse } from "../services/aiService";
import { AIGeneratorType } from "../config/aiPrompts";

const router = Router();

import { INFLECTION_API_URL, INFLECTION_API_KEY as API_KEY } from "../config/env";

router.get("/test", authenticate, async (req: AuthRequest, res: Response) => {
  res.json({
    apiConfigured: !!API_KEY,
    apiKeyLength: API_KEY?.length || 0,
    apiUrl: INFLECTION_API_URL
  });
});

router.post("/chat", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.userId;
    console.log("Chat request - userId:", userId, "req.user:", req.user);

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    let chatHistory = await ChatHistory.findOne({ userId });
    if (!chatHistory) {
      chatHistory = new ChatHistory({ userId, messages: [] });
    }

    chatHistory.messages.push({ role: "user", content: message, timestamp: new Date() });

    const context = chatHistory.messages.slice(-10).map(m => ({
      text: m.content,
      type: m.role === "user" ? "Human" : "AI"
    }));

    const response = await axios.post(
      INFLECTION_API_URL,
      { context, config: "Pi-3.1" },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const aiResponse = response.data.text || 'No response generated';
    chatHistory.messages.push({ role: "assistant", content: aiResponse, timestamp: new Date() });
    await chatHistory.save();

    res.json({ response: aiResponse, history: chatHistory.messages });
  } catch (error: any) {
    console.error("AI Error:", error.response ? error.response.data : error.message);
    res.status(500).json({
      message: "AI service error",
      error: error.response?.data || error.message
    });
  }
});

router.get("/history", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const chatHistory = await ChatHistory.findOne({ userId: req.userId });
    res.json({ messages: chatHistory?.messages || [] });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to load history", error: error.message });
  }
});

router.delete("/history", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await ChatHistory.findOneAndDelete({ userId: req.userId });
    res.json({ message: "History cleared" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to clear history", error: error.message });
  }
});

// Game Master endpoint for gamification course
router.post("/game-master", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { generatorType, userInput, context } = req.body;

    // Validate required parameters
    if (!generatorType || !userInput) {
      return res.status(400).json({
        message: 'Missing required parameters: generatorType and userInput are required'
      });
    }

    // Validate userInput is a string and not empty
    if (typeof userInput !== 'string' || userInput.trim().length === 0) {
      return res.status(400).json({
        message: 'userInput must be a non-empty string'
      });
    }

    // Call AI service and return response
    const aiResponse = await generateAIGameMasterResponse(
      generatorType as AIGeneratorType,
      userInput,
      context
    );

    res.json({ result: aiResponse });

  } catch (error: any) {
    console.error('AI Game Master Error:', error.message);

    // Handle validation errors (400)
    if (error.message.includes('Unknown generator type')) {
      return res.status(400).json({
        message: error.message
      });
    }

    // Handle service errors (500)
    res.status(500).json({
      message: error.message || 'Failed to get AI response.'
    });
  }
});

export default router;
