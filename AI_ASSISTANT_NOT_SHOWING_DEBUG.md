# AI Assistant Not Showing in Block Editors - Debug Guide

## Issue
The AI Assistant panel is not appearing when editing text blocks (or other blocks) in the page editor.

## Debugging Added

I've added visual debugging to the TextBlockEditor:

### Visual Indicators:
1. **Gray debug box** showing `showAIAssistant` value
2. **Red border** around the AI assistant wrapper
3. **Yellow box** with text "AI Assistant Panel Should Be Here"
4. **Console logs** showing state and context

### Console Logs:
```typescript
console.log('[TextBlockEditor] Rendering, showAIAssistant:', showAIAssistant);
console.log('[TextBlockEditor] courseContext:', courseContext);
console.log('[TextBlockEditor] Built context:', buildCourseContext());
```

## How to Test

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the page editor**:
   - Go to Admin Portal
   - Click "Pages" or create a new page
   - Add a text block to the canvas
   - Click the text block to select it

3. **Check the Block Editor Panel** (right side):
   - Should see a gray box showing "Debug: showAIAssistant = TRUE"
   - Should see a yellow box saying "AI Assistant Panel Should Be Here"
   - Should see the AI Assistant panel with purple/blue gradient

4. **Check Browser Console** (F12 → Console):
   - Look for `[TextBlockEditor]` logs
   - Verify `showAIAssistant` is `true`
   - Check if `courseContext` has values
   - Check if `Built context` has a `courseId`

## Possible Scenarios

### Scenario 1: Debug Box Shows FALSE
**Symptoms**: Gray box shows "showAIAssistant = FALSE"

**Cause**: State is incorrectly set to false

**Fix**: Check line 21 in TextBlockEditor.tsx:
```typescript
const [showAIAssistant, setShowAIAssistant] = useState(true); // Should be true
```

### Scenario 2: No Debug Box Visible
**Symptoms**: Don't see any debug boxes

**Cause**: TextBlockEditor not rendering or wrong editor being used

**Check**:
1. Verify you're editing a TEXT block (not video, image, etc.)
2. Check if BlockEditorPanel is rendering
3. Check console for React errors

### Scenario 3: Yellow Box Visible But No AI Panel
**Symptoms**: See yellow box but no AI Assistant panel below it

**Cause**: AIAssistantPanel component failing to render

**Check**:
1. Browser console for errors
2. React DevTools for component tree
3. Network tab for failed imports

**Fix**: Verify AIAssistantPanel is imported:
```typescript
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
```

### Scenario 4: AI Panel Renders But Is Hidden
**Symptoms**: Element exists in DOM but not visible

**Check**: DevTools → Elements tab
1. Find `.ai-assistant-wrapper` element
2. Check computed styles
3. Look for `display: none`, `opacity: 0`, `height: 0`

**Fix**: Add inline styles to force visibility:
```typescript
<div style={{ display: 'block !important', opacity: 1, minHeight: '200px' }}>
    <AIAssistantPanel ... />
</div>
```

### Scenario 5: CourseContext Missing
**Symptoms**: Console shows `courseContext: undefined` or `courseId: undefined`

**Cause**: PageEditorContainer not passing proper context

**Fix**: Update PageEditorContainer.tsx around line 657:
```typescript
courseContext={{
    courseId: page.courseId || 'unknown',  // Add courseId
    lessonId: page._id,
    lessonName: page.title,
}}
```

## Quick Fixes to Try

### Fix 1: Force Show AI Assistant
```typescript
// In TextBlockEditor.tsx
const [showAIAssistant, setShowAIAssistant] = useState(true);

// Add this after the state declaration:
useEffect(() => {
    console.log('Forcing showAIAssistant to true');
    setShowAIAssistant(true);
}, []);
```

### Fix 2: Simplify Rendering
Remove the conditional and always show:
```typescript
<div className="ai-assistant-wrapper">
    <AIAssistantPanel
        blockType="text"
        courseContext={{ courseId: 'test' }}
        onContentGenerated={handleContentGenerated}
    />
</div>
```

### Fix 3: Check AIAssistantPanel Props
Ensure all required props are provided:
```typescript
<AIAssistantPanel
    blockType="text"  // Required
    courseContext={{ courseId: 'test' }}  // Required
    onContentGenerated={(content) => {  // Required
        console.log('Content generated:', content);
        handleContentGenerated(content);
    }}
    currentContent={block.content.text}  // Optional
    placeholder="Enter prompt..."  // Optional
/>
```

## Expected Behavior

When working correctly, you should see:

1. **Gray debug box** at top showing "TRUE"
2. **Red bordered box** containing:
   - Yellow box with text
   - Purple/blue gradient panel
   - "AI Content Assistant" header with sparkles icon
   - Template dropdown
   - Prompt textarea
   - Generation options (tone, reading level, length)
   - Generate button

## Testing Other Block Types

The AI Assistant should also appear in:
- **Video blocks** - for script generation
- **Code blocks** - for code examples
- **Reflection blocks** - for prompts
- **Poll blocks** - for questions
- **List blocks** - for list items
- **Image blocks** - for alt text (behind a button)

Test each by:
1. Adding that block type to canvas
2. Clicking to select it
3. Checking the block editor panel

## Clean Up

Once the issue is resolved, remove the debug code:
1. Remove the gray debug box
2. Remove the red border
3. Remove the yellow box
4. Remove console.log statements

## If Issue Persists

1. **Check React version**: `npm list react`
2. **Rebuild**: `npm run build`
3. **Clear cache**: Hard refresh (Ctrl+Shift+R)
4. **Check imports**: Verify all imports resolve correctly
5. **Test in incognito**: Rule out browser extensions
6. **Check for errors**: Look for any JavaScript errors in console

## Common Causes

1. **Import path wrong**: Check `@/components/admin/AIAssistantPanel`
2. **Component not exported**: Check AIAssistantPanel.tsx exports
3. **CSS hiding it**: Check for conflicting styles
4. **Conditional rendering**: Check `showAIAssistant` state
5. **Props missing**: Check required props are provided
6. **Context missing**: Check courseContext is passed
7. **Build issue**: Try rebuilding the project

## Contact

If AI Assistant still doesn't show, provide:
- Screenshot of the block editor panel
- Browser console output
- React DevTools component tree screenshot
- Network tab showing any failed requests
- Browser and OS version
