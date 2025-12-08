# "Next: Select Blocks" Button Fix

## Issue
The "Next: Select Blocks →" button in the Generate Lesson Outline modal doesn't work when clicked.

## Debugging Added

I've added console logging to help diagnose the issue:

### In `handleNextToAcceptance` function:
```typescript
console.log('[GenerateLessonOutline] Next button clicked');
console.log('[GenerateLessonOutline] Generated outline:', generatedOutline);
console.log('[GenerateLessonOutline] Setting selected indices:', allIndices);
console.log('[GenerateLessonOutline] Setting showAcceptance to true');
```

### In the Button onClick:
```typescript
onClick={(e) => {
    console.log('[Button] Next button clicked', e);
    handleNextToAcceptance();
}}
```

## How to Test

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open the course builder** and navigate to a lesson

3. **Click "Generate Lesson Outline"** button

4. **Fill in the form**:
   - Topic: "Test Topic"
   - Learning Objectives: "Test objective 1\nTest objective 2"
   - Block Count: 10

5. **Click "Generate Outline"** and wait for the AI to generate blocks

6. **Click "Next: Select Blocks →"** button

7. **Check the browser console** (F12 → Console tab)

## Expected Console Output

If the button works:
```
[Button] Next button clicked MouseEvent {...}
[GenerateLessonOutline] Next button clicked
[GenerateLessonOutline] Generated outline: [{...}, {...}, ...]
[GenerateLessonOutline] Setting selected indices: Set(10) {0, 1, 2, ...}
[GenerateLessonOutline] Setting showAcceptance to true
```

## Possible Issues & Solutions

### Issue 1: Button Not Clickable (CSS/Z-index)
**Symptoms**: No console logs when clicking

**Check**:
1. Open DevTools → Elements tab
2. Find the button element
3. Check if it has `pointer-events: none` or is covered by another element
4. Check z-index values

**Fix**: Add inline style to button:
```tsx
<Button 
    onClick={handleNextToAcceptance}
    style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
>
```

### Issue 2: Dialog Intercepting Clicks
**Symptoms**: Console shows button click but function doesn't run

**Fix**: Add `e.stopPropagation()`:
```tsx
onClick={(e) => {
    e.stopPropagation();
    e.preventDefault();
    handleNextToAcceptance();
}}
```

### Issue 3: State Not Updating
**Symptoms**: Console shows function running but UI doesn't change

**Check**: React DevTools → Components → Find GenerateLessonOutlineModal → Check state

**Fix**: Force re-render with key:
```tsx
<Dialog open={isOpen} onOpenChange={handleClose} key={showAcceptance ? 'acceptance' : 'preview'}>
```

### Issue 4: Button Disabled
**Symptoms**: Button appears grayed out

**Check**: Look for `disabled` prop on the button

**Fix**: Ensure button is not disabled:
```tsx
<Button 
    onClick={handleNextToAcceptance}
    disabled={false}  // Explicitly set to false
>
```

## Quick Fix to Try

If the button still doesn't work, try this simplified version:

```tsx
<Button 
    onClick={() => {
        alert('Button clicked!');  // Visual confirmation
        setShowAcceptance(true);
        if (generatedOutline) {
            setSelectedBlockIndices(new Set(generatedOutline.map((_, i) => i)));
        }
    }}
    className="gap-2"
    type="button"
>
    Next: Select Blocks →
</Button>
```

If the alert shows, the button is clickable and the issue is with the state update logic.

## Alternative: Check Dialog Component

The issue might be with the Dialog component from shadcn/ui. Check if it's properly configured:

```tsx
// In Dialog component
<DialogContent 
    className="max-w-3xl max-h-[90vh] overflow-y-auto"
    onPointerDownOutside={(e) => e.preventDefault()}  // Prevent closing on outside click
>
```

## Testing Checklist

- [ ] Console shows `[Button] Next button clicked`
- [ ] Console shows `[GenerateLessonOutline] Next button clicked`
- [ ] Console shows generated outline array
- [ ] Console shows selected indices Set
- [ ] Console shows `Setting showAcceptance to true`
- [ ] UI transitions to the "Select Blocks to Add" screen
- [ ] All blocks are pre-selected (checkboxes checked)
- [ ] Can toggle individual blocks
- [ ] "Add X Blocks" button appears at bottom

## If Issue Persists

1. **Check React version**: Ensure React 18+ is installed
2. **Check shadcn/ui Dialog**: Verify Dialog component is up to date
3. **Check for conflicting event handlers**: Search for other onClick handlers
4. **Test in different browser**: Rule out browser-specific issues
5. **Check for JavaScript errors**: Look for errors before clicking button

## Clean Up

Once the issue is resolved, you can remove the console.log statements or keep them for debugging.

## Expected Behavior

1. User fills out the form and generates outline
2. Preview screen shows with generated blocks
3. User can drag to reorder blocks
4. User clicks "Next: Select Blocks →"
5. Screen transitions to acceptance view
6. All blocks are pre-selected with checkboxes
7. User can select/deselect blocks
8. User clicks "Add X Blocks" to add them to the lesson

## Contact

If the button still doesn't work after trying these fixes, provide:
- Full console output
- Screenshot of the button (with DevTools showing the element)
- Browser and OS version
- Any JavaScript errors in console
