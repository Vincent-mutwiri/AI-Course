# Fix: Interactive Elements Not Showing in Production

## Root Cause
The lessons in your MongoDB database don't have the `interactiveElements` field populated.

## Solution

### Option 1: Run the Seed Script (Recommended)

```bash
cd server
npx tsx src/scripts/addInteractiveElements.ts
```

This will add interactive elements to your existing Module 1 lessons.

### Option 2: Manually Add via MongoDB

Run this in MongoDB Compass or shell:

```javascript
// Replace YOUR_COURSE_ID with your actual course ID
db.courses.updateOne(
  { "_id": ObjectId("YOUR_COURSE_ID") },
  { 
    $set: { 
      "modules.0.lessons.0.interactiveElements": [
        { "type": "visualTokens" }
      ],
      "modules.0.lessons.1.interactiveElements": [
        { "type": "sentenceBuilder" }
      ],
      "modules.0.lessons.2.interactiveElements": [
        {
          "type": "aiGenerator",
          "generatorType": "buildABot",
          "title": "Build Your Own AI Assistant"
        }
      ]
    }
  }
)
```

### Option 3: Add via Admin Panel

If you have an admin interface, add the `interactiveElements` array to lessons when creating/editing them.

## Verify It Works

1. **Check Database:**
   ```javascript
   db.courses.findOne(
     { "modules.lessons.interactiveElements": { $exists: true } },
     { "modules.lessons.interactiveElements": 1 }
   )
   ```

2. **Test in Browser:**
   - Navigate to Module 1, Lesson 1
   - You should see "See How AI Reads Text" component
   - Type text and see it tokenize

3. **Check API Response:**
   - Open DevTools → Network tab
   - Refresh the lesson page
   - Check `/api/courses/:id` response
   - Verify `interactiveElements` array is present

## Deploy Changes

After adding data to MongoDB:

```bash
# Commit the code fixes
git add .
git commit -m "fix: inline JSON data and add interactive elements support"
git push origin main
```

The frontend will automatically rebuild on your hosting platform.

## All Available Interactive Types

```javascript
// Client-side (instant)
{ type: "visualTokens" }
{ type: "sentenceBuilder" }
{ type: "simulation", simulationType: "presentationCoach" }

// AI-powered (requires backend)
{ 
  type: "aiGenerator",
  generatorType: "studyBuddy",
  title: "AI Study Buddy",
  placeholder: "Paste text to summarize..."
}

// Other generator types:
// - writingPartner
// - codeDebugger
// - buildABot
// - lessonPlanner
// - rubricBuilder
// - policyDrafter
```

## Quick Test

Add this to ANY lesson to test:

```javascript
db.courses.updateOne(
  { "_id": ObjectId("YOUR_COURSE_ID") },
  { 
    $set: { 
      "modules.0.lessons.0.interactiveElements": [
        { type: "visualTokens" }
      ]
    }
  }
)
```

Then refresh the lesson page - you should see the Visual Tokens component immediately.
