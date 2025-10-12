import { Router, Request, Response } from "express";
import axios from "axios";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

const INFLECTION_API_URL = process.env.INFLECTION_API_URL || "https://api.inflection.ai/external/api/inference";
const API_KEY = process.env.INFLECTION_API_KEY;

if (!API_KEY) {
  console.error('ERROR: INFLECTION_API_KEY environment variable is not set');
  process.exit(1);
}

router.get("/test", authenticate, async (req: AuthRequest, res: Response) => {
  res.json({
    apiConfigured: !!API_KEY,
    apiKeyLength: API_KEY?.length || 0,
    apiUrl: INFLECTION_API_URL
  });
});

router.post("/chat", authenticate, async (req: AuthRequest, res: Response) => {
  console.log("=== AI Chat Route Hit ===");
  try {
    const { message, context = [] } = req.body;
    console.log("Message:", message, "Context length:", context.length);

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (!API_KEY) {
      console.error("INFLECTION_API_KEY not configured");
      return res.status(500).json({ message: "AI service not configured" });
    }

    const conversationContext = [
      ...context,
      { text: message, type: "Human" }
    ];

    const requestBody = {
      context: conversationContext,
      config: "Pi-3.1"
    };

    console.log("Request details:", {
      url: INFLECTION_API_URL,
      body: requestBody,
      apiKeyPrefix: API_KEY?.substring(0, 10) + '...',
      apiKeyLength: API_KEY?.length
    });

    const response = await axios.post(
      INFLECTION_API_URL,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log("Inflection AI response received:", response.status, response.data);
    res.json(response.data);
  } catch (error: any) {
    console.error("AI API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: INFLECTION_API_URL
    });
    
    // Log detailed error for debugging
    console.error("Full error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    res.status(500).json({ 
      message: "AI service error",
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
});

export default router;
