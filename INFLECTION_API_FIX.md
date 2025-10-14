# Inflection AI API Integration Fix

## Problem
The AI chat feature was failing with validation errors when communicating with the Inflection AI API.

## Root Causes

### 1. Incorrect API Endpoint
**Error**: `Field required` - API expected `messages` field
**Issue**: Using wrong endpoint URL that expected OpenAI-compatible format
**Solution**: Changed endpoint from `/v1/chat/completions` to `/external/api/inference`

### 2. Wrong Request Format
**Error**: API validation errors for missing/incorrect fields
**Issue**: Mixing OpenAI format (`messages`, `model`) with Inflection format (`context`, `config`)
**Solution**: Use Inflection's native format:
```javascript
{
  context: [
    { text: "message content", type: "Human" },
    { text: "response content", type: "AI" }
  ],
  config: "Pi-3.1"
}
```

### 3. Invalid Type Value
**Error**: `Input should be 'AI', 'Human', 'Retrieval'...` (enum validation)
**Issue**: Using `type: "Pi"` for assistant messages
**Solution**: Changed to `type: "AI"`

## Changes Made

### File: `.env.local`
```diff
- INFLECTION_API_URL=https://api.inflection.ai/v1/chat/completions
+ INFLECTION_API_URL=https://api.inflection.ai/external/api/inference
```

### File: `server/src/routes/ai.ts`
```javascript
// Map chat history to Inflection's context format
const context = chatHistory.messages.slice(-10).map(m => ({
  text: m.content,
  type: m.role === "user" ? "Human" : "AI"  // Use "AI" not "Pi"
}));

// Send request with correct format
const response = await axios.post(
  INFLECTION_API_URL,
  { context, config: "Pi-3.1" },
  {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  }
);
```

## Key Takeaways

1. **Use correct endpoint**: `/external/api/inference` for context-based format
2. **Request format**: `{ context: [...], config: "Pi-3.1" }`
3. **Context structure**: `{ text: string, type: "Human" | "AI" }`
4. **Valid types**: "AI", "Human", "Retrieval", "Instruction", "Metadata", "LinkedWebpages", "System", "Question", "Options", "Role", "Answer", "AI (internally)", "Tool"
5. **Response parsing**: Extract text from `response.data.text`

## Testing
After changes, the AI chat successfully:
- Sends messages to Inflection API
- Receives responses
- Maintains conversation history
- Stores chat in MongoDB
