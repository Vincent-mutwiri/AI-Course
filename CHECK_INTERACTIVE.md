# Debugging Interactive Elements Not Showing in Production

## Quick Checks

### 1. Verify Data in MongoDB

Run this in MongoDB shell or Compass:

```javascript
// Check if any lessons have interactiveElements
db.courses.find(
  { "modules.lessons.interactiveElements": { $exists: true, $ne: [] } },
  { "title": 1, "modules.title": 1, "modules.lessons.title": 1, "modules.lessons.interactiveElements": 1 }
).pretty()
```

If this returns empty, your lessons don't have `interactiveElements` in the database.

### 2. Add Test Interactive Element

Add this to a lesson in your database:

```javascript
db.courses.updateOne(
  { "_id": ObjectId("YOUR_COURSE_ID") },
  { 
    $set: { 
      "modules.0.lessons.0.interactiveElements": [
        {
          "type": "visualTokens"
        }
      ]
    }
  }
)
```

### 3. Check Browser Console

After rebuilding and deploying:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to a lesson
4. Look for these logs:
   - "Rendering interactive elements: [...]"
   - "InteractiveElementRouter received: {...}"

### 4. Verify Build Includes Components

Check if components are in the production build:

```bash
npm run build
ls -la dist/assets/*.js
```

The bundle should include the interactive components.

## Most Likely Issues

### Issue 1: No Data in Database ⭐ MOST COMMON
**Symptom:** Logs show lesson data but no `interactiveElements` array
**Solution:** Add interactive elements to lessons in MongoDB

### Issue 2: Frontend Not Rebuilt
**Symptom:** Old code still running in production
**Solution:** 
```bash
# Force rebuild
rm -rf dist node_modules/.vite
npm install
npm run build
```

### Issue 3: Caching
**Symptom:** Old version cached in browser or CDN
**Solution:** 
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Clear browser cache
- Add cache busting to deployment

### Issue 4: Import Errors (Already Fixed)
**Symptom:** Components fail to load silently
**Solution:** Already fixed by inlining JSON data

## Testing Locally First

Before deploying, test locally with production build:

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Open http://localhost:4173
# Navigate to a lesson with interactive elements
# Check if they appear
```

## Sample Lesson Data

Here's a complete lesson with interactive elements:

```json
{
  "title": "Understanding AI Tokens",
  "description": "Learn how AI breaks down text",
  "duration": 15,
  "order": 0,
  "objective": "Understand tokenization in AI",
  "content": {
    "sections": [
      {
        "type": "text",
        "content": "AI systems break text into tokens..."
      }
    ]
  },
  "interactiveElements": [
    {
      "type": "visualTokens"
    },
    {
      "type": "sentenceBuilder"
    }
  ]
}
```

## Deployment Checklist

- [ ] Interactive elements added to lessons in MongoDB
- [ ] Frontend rebuilt with latest code
- [ ] Production build tested locally
- [ ] Browser cache cleared
- [ ] Console logs checked for errors
- [ ] Network tab shows correct API responses

## Quick Fix Commands

```bash
# 1. Rebuild everything
git pull
npm install
npm run build

# 2. Test locally
npm run preview

# 3. If working locally, deploy
git add .
git commit -m "fix: ensure interactive elements render in production"
git push origin main
```

## Still Not Working?

Check these:

1. **API Response:** Open Network tab, check if `/api/courses/:id` returns lessons with `interactiveElements`
2. **React DevTools:** Install React DevTools, check if `InteractiveElementRouter` component is in the tree
3. **Error Boundary:** Check if ErrorBoundary is catching and hiding errors
4. **Console Errors:** Look for any JavaScript errors in console

## Contact Points

If none of the above works, provide:
1. Screenshot of browser console
2. Screenshot of Network tab showing API response
3. MongoDB query result showing lesson data
4. Deployment platform logs
