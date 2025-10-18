# Module 1 Architecture

## Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Module 1: How AI Thinks                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │   ModuleContent.tsx (Page)            │
        │   - Renders lesson content            │
        │   - Maps interactiveElements          │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │   InteractiveElementRouter            │
        │   - Routes based on element.type      │
        └───────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Lesson 1.1   │   │ Lesson 1.2   │   │ Lesson 1.3   │
│ Tokens       │   │ Predictions  │   │ Personalities│
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│VisualTokens │   │SentenceBuilder│   │ BuildABot    │
│              │   │              │   │              │
│ Client-Side  │   │ Client-Side  │   │ AI-Powered   │
└──────────────┘   └──────────────┘   └──────────────┘
                                               │
                                               ▼
                                    ┌──────────────────┐
                                    │ /api/ai/generate │
                                    │                  │
                                    │ Backend Endpoint │
                                    └──────────────────┘
                                               │
                                               ▼
                                    ┌──────────────────┐
                                    │ Inflection AI    │
                                    │ API              │
                                    └──────────────────┘
```

---

## Data Flow

### Lesson 1.1: Visual Tokens (Client-Side)

```
User Input
    │
    ▼
┌─────────────────┐
│ VisualTokens    │
│ Component       │
└─────────────────┘
    │
    ├─ Split text with regex
    ├─ Create token array
    └─ Render as badges
    │
    ▼
Display Tokens
```

**No Backend Required** ✅

---

### Lesson 1.2: Sentence Builder (Client-Side)

```
User Clicks Word
    │
    ▼
┌─────────────────┐
│ SentenceBuilder │
│ Component       │
└─────────────────┘
    │
    ├─ Add word to sentence
    ├─ Lookup predictions in model
    └─ Update predictions state
    │
    ▼
Display New Predictions
```

**Data Source**: `sentenceBuilder.json` (hardcoded model)
**No Backend Required** ✅

---

### Lesson 1.3: Build-a-Bot (AI-Powered)

```
User Selects Traits + Enters Message
    │
    ▼
┌─────────────────┐
│ BuildABot       │
│ Component       │
└─────────────────┘
    │
    ├─ Collect personality traits
    ├─ Prepare request payload
    └─ Call API
    │
    ▼
POST /api/ai/generate
{
  generatorType: "buildABot",
  userInput: "user message",
  options: { personality: "formal, creative" }
}
    │
    ▼
┌─────────────────┐
│ aiGenerator.ts  │
│ Route Handler   │
└─────────────────┘
    │
    ├─ Get prompt template
    ├─ Inject variables
    └─ Call Inflection AI
    │
    ▼
Inflection AI API
    │
    ▼
AI Response
    │
    ▼
Display to User
```

**Backend Required** ✅

---

## File Structure

```
ai-course/
├── src/
│   ├── components/
│   │   └── interactive/
│   │       ├── VisualTokens.tsx          ✅ Client-side
│   │       ├── SentenceBuilder.tsx       ✅ Client-side
│   │       ├── BuildABot.tsx             ✅ AI-powered
│   │       └── InteractiveElementRouter.tsx
│   │
│   ├── data/
│   │   └── simulations/
│   │       └── sentenceBuilder.json      ✅ Prediction model
│   │
│   └── pages/
│       └── ModuleContent.tsx
│
├── server/
│   └── src/
│       ├── config/
│       │   └── aiPrompts.ts              ✅ Prompt templates
│       │
│       └── routes/
│           └── aiGenerator.ts            ✅ AI endpoint
│
└── module1-restructured.json             ✅ New module data
```

---

## MongoDB Schema

```javascript
{
  modules: [
    {
      title: "Module 1: How AI Thinks",
      order: 1,
      lessons: [
        {
          title: "Lesson 1.1: Understanding Tokens",
          order: 1,
          interactiveElements: [
            {
              type: "visualTokens",
              title: "Visual Tokens: See How AI Reads Text"
            }
          ]
        },
        {
          title: "Lesson 1.2: Predictive Text and AI",
          order: 2,
          interactiveElements: [
            {
              type: "sentenceBuilder",
              title: "Sentence Builder: AI Predictions"
            }
          ]
        },
        {
          title: "Lesson 1.3: AI Personalities",
          order: 3,
          interactiveElements: [
            {
              type: "aiGenerator",
              generatorType: "buildABot",
              title: "Build-a-Bot: Create Your AI Assistant"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Component Dependencies

### VisualTokens
```typescript
Dependencies:
- @/components/ui/card
- @/components/ui/textarea
- @/components/ui/label
- React hooks (useState)

External APIs: None
Data Files: None
```

### SentenceBuilder
```typescript
Dependencies:
- @/components/ui/card
- @/components/ui/button
- React hooks (useState)
- sentenceBuilder.json

External APIs: None
Data Files: sentenceBuilder.json
```

### BuildABot
```typescript
Dependencies:
- @/components/ui/card
- @/components/ui/button
- @/components/ui/textarea
- @/components/ui/checkbox
- @/components/ui/label
- React hooks (useState)
- @/services/api

External APIs: /api/ai/generate
Data Files: None
```

---

## API Endpoints

### POST /api/ai/generate

**Request**:
```json
{
  "generatorType": "buildABot",
  "userInput": "What is machine learning?",
  "options": {
    "personality": "formal, detailed"
  }
}
```

**Response**:
```json
{
  "success": true,
  "response": "Machine learning is a subset of artificial intelligence...",
  "generatorType": "buildABot"
}
```

**Authentication**: Required (Bearer token)

---

## State Management

### VisualTokens State
```typescript
const [text, setText] = useState<string>('');
const [tokens, setTokens] = useState<string[]>([]);
```

### SentenceBuilder State
```typescript
const [sentence, setSentence] = useState<string[]>([]);
const [predictions, setPredictions] = useState<string[]>([]);
```

### BuildABot State
```typescript
const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
const [userMessage, setUserMessage] = useState<string>('');
const [botResponse, setBotResponse] = useState<string>('');
const [loading, setLoading] = useState<boolean>(false);
```

---

## Performance Considerations

### Client-Side Components (Fast ⚡)
- **VisualTokens**: Instant tokenization
- **SentenceBuilder**: Instant predictions
- **No network latency**
- **No API costs**

### AI-Powered Components (Slower 🐌)
- **BuildABot**: 2-5 second response time
- **Network latency**
- **API rate limits**
- **Requires loading states**

---

## Error Handling

### Client-Side Components
```typescript
// Graceful degradation
if (!text.trim()) {
  setTokens([]);
  return;
}
```

### AI-Powered Components
```typescript
try {
  const { data } = await api.post('/ai/generate', payload);
  setBotResponse(data.response);
} catch (error) {
  setBotResponse('Failed to get response. Please try again.');
}
```

---

## Security Considerations

### Client-Side Components
- ✅ No sensitive data
- ✅ No API calls
- ✅ No authentication needed

### AI-Powered Components
- ✅ Authentication required
- ✅ Input validation
- ✅ Rate limiting
- ✅ Content moderation
- ✅ API key protection

---

## Scalability

### Client-Side Components
- ✅ Scales infinitely (no backend)
- ✅ No server costs
- ✅ Fast for all users

### AI-Powered Components
- ⚠️ Limited by API rate limits
- ⚠️ Costs per request
- ⚠️ May need caching
- ⚠️ Consider response caching for common queries

---

## Testing Strategy

### Unit Tests
```typescript
// VisualTokens
test('tokenizes text correctly', () => {
  const result = tokenize('Hello, world!');
  expect(result).toEqual(['Hello', ',', 'world', '!']);
});

// SentenceBuilder
test('predicts next words', () => {
  const predictions = getPredictions('Artificial');
  expect(predictions).toContain('intelligence');
});
```

### Integration Tests
```typescript
// BuildABot
test('sends correct payload to API', async () => {
  const response = await api.post('/ai/generate', {
    generatorType: 'buildABot',
    userInput: 'test',
    options: { personality: 'formal' }
  });
  expect(response.data.success).toBe(true);
});
```

---

## Monitoring

### Metrics to Track
- Component render times
- API response times
- Error rates
- User engagement (time spent)
- Completion rates
- Quiz scores

### Logging
```typescript
// Log AI interactions
console.log('BuildABot request:', {
  traits: selectedTraits,
  messageLength: userMessage.length,
  timestamp: new Date()
});
```

---

## Future Enhancements

### Potential Additions
1. **Save/Share**: Let users save their bot configurations
2. **More Traits**: Add more personality options
3. **Voice**: Add text-to-speech for bot responses
4. **History**: Show conversation history
5. **Export**: Export conversations as PDF
6. **Analytics**: Track which personalities are most popular

---

**Architecture Version**: 1.0
**Last Updated**: 2024
**Status**: Production Ready
