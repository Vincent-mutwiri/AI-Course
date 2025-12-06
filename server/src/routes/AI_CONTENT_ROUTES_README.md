# AI Content Generation API Routes

This document describes the AI content generation endpoints implemented for the AI Content Assistant feature.

## Overview

The AI Content Assistant provides four main endpoints for generating, refining, and tracking AI-generated educational content. All endpoints require admin authentication.

## Endpoints

### 1. POST /api/ai/generate-content

Generate content for a specific block type using AI.

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "blockType": "text",
  "prompt": "Explain machine learning",
  "context": {
    "courseId": "course-123",
    "courseTitle": "AI Fundamentals",
    "moduleId": "module-1",
    "moduleName": "Introduction",
    "lessonId": "lesson-1",
    "lessonName": "What is AI?",
    "learningObjectives": ["Understand ML basics"],
    "existingBlocks": []
  },
  "options": {
    "tone": "conversational",
    "readingLevel": "college",
    "length": "moderate",
    "includeExamples": true
  }
}
```

**Response:**
```json
{
  "content": {
    "text": "Generated content..."
  },
  "metadata": {
    "blockType": "text",
    "generatedAt": "2024-01-01T00:00:00.000Z",
    "promptUsed": "Explain machine learning",
    "tokensUsed": 100
  },
  "cached": false
}
```

**Features:**
- Validates all required fields
- Checks cache before generating (7-day TTL)
- Tracks usage in database
- Returns cached content when available

### 2. POST /api/ai/refine-content

Refine existing content based on refinement type.

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "content": "Original content to refine",
  "refinementType": "make-shorter",
  "context": {
    "courseId": "course-123",
    "courseTitle": "AI Fundamentals"
  }
}
```

**Valid Refinement Types:**
- `make-shorter` - Reduce content length by 30-40%
- `make-longer` - Increase content length by 40-50%
- `simplify` - Use simpler language
- `add-examples` - Add 2-3 concrete examples
- `change-tone` - Change tone (formal/conversational/encouraging)

**Response:**
```json
{
  "content": "Refined content...",
  "metadata": {
    "refinementType": "make-shorter",
    "originalLength": 200,
    "refinedLength": 120,
    "refinedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. POST /api/ai/generate-outline

Generate a complete lesson outline with multiple blocks.

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "topic": "Introduction to Machine Learning",
  "objectives": [
    "Understand what machine learning is",
    "Learn about different types of ML"
  ],
  "context": {
    "courseId": "course-123",
    "courseTitle": "AI Fundamentals",
    "moduleId": "module-1",
    "moduleName": "Introduction"
  },
  "blockCount": 10
}
```

**Response:**
```json
{
  "outline": [
    {
      "type": "text",
      "title": "Introduction to ML",
      "description": "Overview of machine learning concepts",
      "estimatedTime": 5,
      "placeholderContent": {
        "text": "[Placeholder for: Introduction to ML]"
      }
    }
  ],
  "metadata": {
    "topic": "Introduction to Machine Learning",
    "objectivesCount": 2,
    "blocksGenerated": 10,
    "generatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. GET /api/ai/usage-stats

Get AI usage statistics with optional filters.

**Authentication:** Required (Admin only)

**Query Parameters:**
- `courseId` (optional) - Filter by course ID
- `startDate` (optional) - Filter by start date (ISO format)
- `endDate` (optional) - Filter by end date (ISO format)

**Example Request:**
```
GET /api/ai/usage-stats?courseId=course-123&startDate=2024-01-01
```

**Response:**
```json
{
  "totalGenerations": 150,
  "cachedGenerations": 45,
  "cacheHitRate": 30,
  "byBlockType": {
    "text": 80,
    "video": 30,
    "quiz": 20,
    "reflection": 20
  },
  "byGenerationType": {
    "generate": 120,
    "refine": 25,
    "outline": 5
  },
  "totalTokens": 15000,
  "byDate": {
    "2024-01-01": 50,
    "2024-01-02": 100
  },
  "filter": {
    "courseId": "course-123",
    "startDate": "2024-01-01",
    "endDate": "all"
  }
}
```

## Caching Strategy

The API implements an in-memory cache with the following characteristics:

- **TTL:** 7 days
- **Max Size:** 1000 entries
- **Eviction:** LRU (Least Recently Used)
- **Cache Key:** MD5 hash of blockType, prompt, context, and options

When cached content is returned, the `cached: true` flag is included in the response.

## Usage Tracking

All AI operations are tracked in the `AIUsage` collection with the following information:

- User ID
- Course ID
- Block type
- Generation type (generate/refine/outline)
- Prompt length
- Response length
- Tokens used
- Cached flag
- Timestamp

This data is used for:
- Cost management
- Usage analytics
- Cache hit rate calculation
- Performance monitoring

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad request (validation errors)
- `403` - Forbidden (non-admin users)
- `500` - Server error (AI service failures)

Error responses include a descriptive message:
```json
{
  "message": "Error description"
}
```

## Testing

Comprehensive tests are available in `server/src/__tests__/ai-content-routes.test.ts` covering:

- Successful generation for all endpoints
- Admin authentication enforcement
- Input validation
- Usage tracking
- Cache behavior
- Error handling

Run tests with:
```bash
npm test -- ai-content-routes.test.ts
```

## Integration

The routes are registered in `server/src/index.ts`:

```typescript
import aiContentRoutes from "./routes/aiContent";
app.use("/api/ai", aiContentRoutes);
```

## Dependencies

- `server/src/services/aiService.ts` - AI generation service methods
- `server/src/models/AIUsage.ts` - Usage tracking model
- `server/src/middleware/auth.ts` - Authentication middleware
- `server/src/middleware/admin.ts` - Admin authorization middleware
- `server/src/config/aiContentPrompts.ts` - Prompt templates and types
