# Module 1 Restructure Guide: How AI Thinks

## Overview
This guide documents the restructuring of Module 1 from "Foundations of Responsible AI in EdTech" to "How AI Thinks" with interactive, hands-on components.

---

## What Changed

### Old Module 1
- **Title**: Foundations of Responsible AI in EdTech
- **Focus**: Ethics, safety, data privacy, responsible AI practices
- **Lessons**: 3 lessons on AI introduction, personalization, and safety
- **Approach**: Text-heavy, case studies, ethical dilemmas

### New Module 1
- **Title**: How AI Thinks
- **Focus**: Fundamental AI concepts through interactive exploration
- **Lessons**: 3 lessons on tokens, predictions, and AI personalities
- **Approach**: Interactive, hands-on, visual learning

---

## New Module Structure

### Lesson 1.1: Understanding Tokens (15 min)
**Objective**: Learn how AI breaks down and processes text

**Content**:
- What are tokens?
- Why tokens matter for AI interaction
- Token limits and optimization

**Interactive Element**:
```json
{
  "type": "visualTokens",
  "title": "Visual Tokens: See How AI Reads Text",
  "description": "Type a sentence to see how AI breaks it into tokens"
}
```

**Component**: `<VisualTokens />` - Client-side tokenization visualization

---

### Lesson 1.2: Predictive Text and AI (15 min)
**Objective**: Understand how AI predicts and generates text

**Content**:
- How AI prediction works
- The prediction process step-by-step
- Probability and text generation

**Interactive Element**:
```json
{
  "type": "sentenceBuilder",
  "title": "Sentence Builder: AI Predictions",
  "description": "Click words to build a sentence and see AI predictions"
}
```

**Component**: `<SentenceBuilder />` - Simulated prediction model

---

### Lesson 1.3: AI Personalities (15 min)
**Objective**: Explore how AI behavior can be customized

**Content**:
- Customizing AI behavior through prompts
- Common personality traits (formal, creative, socratic, etc.)
- Why personality matters in education

**Interactive Element**:
```json
{
  "type": "aiGenerator",
  "generatorType": "buildABot",
  "title": "Build-a-Bot: Create Your AI Assistant",
  "description": "Select personality traits and chat with your custom AI"
}
```

**Component**: `<BuildABot />` - AI-powered personality customization

---

## Implementation Steps

### Step 1: Update MongoDB Course Document

Replace the existing Module 1 with the new structure:

```bash
# Connect to MongoDB
mongosh "your-connection-string"

# Use your database
use ai-course

# Find your course
db.courses.findOne({ title: "AI in Education Course" })

# Update Module 1
db.courses.updateOne(
  { title: "AI in Education Course" },
  {
    $set: {
      "modules.0": {
        title: "Module 1: How AI Thinks",
        description: "Explore the fundamentals of how AI processes information",
        order: 1,
        lessons: [
          {
            title: "Lesson 1.1: Understanding Tokens",
            description: "Learn how AI breaks down text",
            duration: 15,
            order: 1,
            objective: "Learn how AI breaks down and processes text into tokens",
            content: {
              sections: [
                {
                  type: "text",
                  title: "What Are Tokens?",
                  content: "When you type a sentence, AI doesn't see words the way you do..."
                }
              ]
            },
            interactiveElements: [
              {
                type: "visualTokens",
                title: "Visual Tokens: See How AI Reads Text"
              }
            ]
          },
          {
            title: "Lesson 1.2: Predictive Text and AI",
            description: "Understand AI text generation",
            duration: 15,
            order: 2,
            objective: "Understand how AI predicts and generates text",
            content: {
              sections: [
                {
                  type: "text",
                  title: "How AI Predicts",
                  content: "AI language models work by predicting..."
                }
              ]
            },
            interactiveElements: [
              {
                type: "sentenceBuilder",
                title: "Sentence Builder: AI Predictions"
              }
            ]
          },
          {
            title: "Lesson 1.3: AI Personalities",
            description: "Explore AI behavior customization",
            duration: 15,
            order: 3,
            objective: "Explore how AI behavior can be customized",
            content: {
              sections: [
                {
                  type: "text",
                  title: "Customizing AI Behavior",
                  content: "AI assistants can be programmed with different personalities..."
                }
              ]
            },
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
    }
  }
)
```

### Step 2: Verify Components Are Available

Ensure all components are created:
- ✅ `src/components/interactive/VisualTokens.tsx`
- ✅ `src/components/interactive/SentenceBuilder.tsx`
- ✅ `src/components/interactive/BuildABot.tsx`
- ✅ `src/components/interactive/InteractiveElementRouter.tsx`

### Step 3: Update ModuleContent Page

Ensure your `ModuleContent.tsx` renders interactive elements:

```tsx
import { InteractiveElementRouter } from '@/components/interactive/InteractiveElementRouter';

// In your lesson rendering:
{lesson.interactiveElements?.map((element, idx) => (
  <InteractiveElementRouter key={idx} element={element} />
))}
```

### Step 4: Test Each Component

1. **Visual Tokens**:
   - Navigate to Lesson 1.1
   - Type text in the input
   - Verify tokens appear as colored badges

2. **Sentence Builder**:
   - Navigate to Lesson 1.2
   - Click word predictions
   - Verify sentence builds and new predictions appear

3. **Build-a-Bot**:
   - Navigate to Lesson 1.3
   - Select personality traits
   - Enter a question
   - Verify AI responds with selected personality

---

## Migration Script

Use this script to migrate from old to new Module 1:

```javascript
// migration-module1.js
const { MongoClient } = require('mongodb');

async function migrateModule1() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('ai-course');
  
  const newModule1 = require('./module1-restructured.json').module;
  
  await db.collection('courses').updateOne(
    { title: "AI in Education Course" },
    { $set: { "modules.0": newModule1 } }
  );
  
  console.log('Module 1 migrated successfully');
  await client.close();
}

migrateModule1();
```

Run with:
```bash
node migration-module1.js
```

---

## Component Details

### VisualTokens Component
- **Type**: Client-side simulation
- **Backend**: None required
- **Features**:
  - Real-time tokenization
  - Visual token display
  - Token count

### SentenceBuilder Component
- **Type**: Client-side simulation
- **Backend**: None required
- **Data**: Uses `sentenceBuilder.json` prediction model
- **Features**:
  - Word prediction
  - Sentence building
  - Interactive word selection

### BuildABot Component
- **Type**: AI-powered
- **Backend**: Uses `/api/ai/generate` endpoint
- **Features**:
  - Personality trait selection
  - Custom AI chat
  - Real-time AI responses

---

## Testing Checklist

- [ ] Module 1 appears in course list
- [ ] All 3 lessons are accessible
- [ ] Visual Tokens component renders
- [ ] Tokenization works correctly
- [ ] Sentence Builder shows predictions
- [ ] Word selection updates predictions
- [ ] Build-a-Bot personality selection works
- [ ] AI responds with selected personality
- [ ] All quizzes are functional
- [ ] Progress tracking works

---

## Rollback Plan

If you need to revert to the old Module 1:

```bash
# Restore from backup
db.courses.updateOne(
  { title: "AI in Education Course" },
  { $set: { "modules.0": <old_module_1_backup> } }
)
```

Keep a backup of the old module in `module1-data.json.backup`

---

## Next Steps

1. Test all interactive components
2. Gather user feedback
3. Adjust content based on engagement
4. Consider adding more interactive elements
5. Move old Module 1 content to Module 3 (Teacher Tools) if needed

---

## Benefits of New Structure

✅ **More Engaging**: Interactive components vs. text-heavy content
✅ **Hands-On Learning**: Students learn by doing
✅ **Immediate Feedback**: Real-time interaction with concepts
✅ **Progressive Complexity**: Builds from simple (tokens) to complex (personalities)
✅ **Memorable**: Visual and interactive elements improve retention

---

## Support

For issues or questions:
1. Check component console logs
2. Verify MongoDB schema matches expected structure
3. Test API endpoints with Postman
4. Review `IMPLEMENTATION_GUIDE.md` for detailed steps
