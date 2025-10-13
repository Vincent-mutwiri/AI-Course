import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

const INFLECTION_API_URL = process.env.INFLECTION_API_URL || 'https://api.inflection.ai/external/api/inference';
const INFLECTION_API_KEY = process.env.INFLECTION_API_KEY;

if (!INFLECTION_API_KEY) {
  console.error('ERROR: INFLECTION_API_KEY environment variable is not set');
  process.exit(1);
}

const chatHistory: { [userId: string]: { role: string; content: string }[] } = {};

router.post('/chat', async (req, res) => {
  const { message, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  if (!chatHistory[userId]) {
    chatHistory[userId] = [];
  }

  chatHistory[userId].push({ role: 'user', content: message });

  // Truncate history to the last 10 messages to manage token usage
  if (chatHistory[userId].length > 10) {
    chatHistory[userId] = chatHistory[userId].slice(chatHistory[userId].length - 10);
  }

  try {
    const response = await fetch(INFLECTION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INFLECTION_API_KEY}`
      },
      body: JSON.stringify({
        model: 'inflection-2.5',
        messages: [
          { role: 'system', content: 'You are a helpful AI tutor.' },
          ...chatHistory[userId],
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Inflection API error: ${error}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No response from AI';
    
    chatHistory[userId].push({ role: 'assistant', content: aiResponse });

    res.json({ response: aiResponse });
  } catch (error: unknown) {
    console.error('Error calling Inflection AI API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      error: 'An error occurred with the Inflection AI API.',
      details: errorMessage
    });
  }
});

export default router;
