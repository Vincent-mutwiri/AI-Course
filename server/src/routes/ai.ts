import { Router, Request, Response } from "express";
import axios from "axios";
import { authenticate, AuthRequest } from "../middleware/auth";
import ChatHistory from "../models/ChatHistory";

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

    const aiResponse = response.data.text || response.data;
    chatHistory.messages.push({ role: "assistant", content: aiResponse, timestamp: new Date() });
    await chatHistory.save();

    res.json({ response: aiResponse, history: chatHistory.messages });
  } catch (error: any) {
    console.error("AI Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ 
      message: "AI service error", 
      error: error.response?.data?.error || error.message 
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

router.post("/ai-sketch-feedback", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { sketch } = req.body;

    if (!sketch) {
      return res.status(400).json({ message: "Sketch is required" });
    }

    const prompt = `As an AI expert in EdTech, please provide feedback on the following AI feature idea for an educational product. Evaluate it based on Responsible AI principles (personalization, safety, ethics) and adult learning theories.\n\nAI Feature Idea: "${sketch}"`;

    const response = await axios.post(
      INFLECTION_API_URL,
      { context: [{ text: prompt, type: "Human" }], config: "pi-3-mini" },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const feedback = response.data.text || response.data;
    res.json({ feedback });
  } catch (error: any) {
    console.error("AI Sketch Error:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Failed to get AI feedback",
      error: error.response?.data?.message || error.message
    });
  }
});

router.post("/quiz/generate", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const prompt = `Create a 3-question multiple-choice quiz on the topic of "${topic}". Provide the output in valid JSON format with this structure: {"title":"Quiz Title","questions":[{"id":"1","text":"Question text?","options":["A","B","C","D"],"correctAnswer":"A"}]}`;

    const response = await axios.post(
      INFLECTION_API_URL,
      { context: [{ text: prompt, type: "Human" }], config: "pi-3-mini" },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const aiResponse = response.data.text || response.data;
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    const quizData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
    res.json(quizData);
  } catch (error: any) {
    console.error("Quiz Generation Error:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Failed to generate quiz",
      error: error.response?.data?.message || error.message
    });
  }
});

router.post("/quiz/feedback", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { question, userAnswer, correctAnswer } = req.body;

    if (!question || !userAnswer || !correctAnswer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `The user was asked: "${question}". They answered "${userAnswer}". The correct answer is "${correctAnswer}". Provide brief, encouraging feedback.`;

    const response = await axios.post(
      INFLECTION_API_URL,
      { context: [{ text: prompt, type: "Human" }], config: "pi-3-mini" },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const feedback = response.data.text || response.data;
    res.json({ feedback });
  } catch (error: any) {
    console.error("Quiz Feedback Error:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Failed to get feedback",
      error: error.response?.data?.message || error.message
    });
  }
});

export default router;
