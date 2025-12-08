# Block Canvas Debugging Guide

## Issue
Blocks do not appear on the canvas after being selected from the block palette.

## Debugging Steps

### Step 1: Check Browser Console
1. Open the page editor
2. Open browser DevTools (F12)
3. Go to Console tab
4. Click a block from the palette
5. Look for these log messages:
   - `[PageEditor] Adding block: [blockType]`
   - `[PageEditor] Current blocks: [array]`
   - `[PageEditor] New blocks array: [array]`
   - `[BlockCanvas] Rendering with blocks: [array]`
   - `[BlockCanvas] Blocks length: [number]`

### Step 2: Verify State Updates
Check if the blocks array is being updated:
- After clicking a block, the "New blocks array" should have one more item
- The BlockCanvas should re-render with the new blocks length

### Step 3: Check for React Errors
Look for any React errors in the console:
- Component rendering errors
- Hook dependency warnings
- Key prop warnings

### Step 4: Inspect DOM
1. Open Elements tab in DevTools
2. Find the `.block-canvas` element
3. Check if `.blocks-list` exists inside it
4. Check if `.sortable-block-item` elements are present

### Step 5: Check CSS
1. Inspect the `.sortable-block-item` elements
2. Verify they have:
   - `display: block` or `display: flex`
   - Visible `height` and `width`
   - `opacity: 1` (not 0)
   - No `display: none` or `visibility: hidden`

## Common Issues

### Issue 1: Blocks Array Not Updating
**Symptoms**: Console shows same blocks length after clicking
**Possible Causes**:
- `handleAddBlock` not being called
- State not updating due to stale closure
- `setBlocks` not triggering re-render

**Solution**: Check if `handleAddBlock` has correct dependencies in `useCallback`

### Issue 2: BlockCanvas Not Re-rendering
**Symptoms**: Blocks array updates but canvas doesn't show new blocks
**Possible Causes**:
- React not detecting state change
- Memoization preventing re-render
- Props not being passed correctly

**Solution**: Verify `blocks` prop is being passed to `BlockCanvas`

### Issue 3: Blocks Rendered But Not Visible
**Symptoms**: DOM shows blocks but they're not visible
**Possible Causes**:
- CSS `display: none` or `opacity: 0`
- Height/width set to 0
- Positioned off-screen
- Z-index issues

**Solution**: Inspect CSS in DevTools

### Issue 4: DnD Context Issues
**Symptoms**: Blocks don't render inside DndContext
**Possible Causes**:
- @dnd-kit/core not properly initialized
- SortableContext items mismatch
- Sensor configuration issues

**Solution**: Check DnD library setup

## Quick Fixes to Try

### Fix 1: Force Re-render
Add a key to BlockCanvas:
```tsx
<BlockCanvas
    key={blocks.length}
    blocks={blocks}
    ...
/>
```

### Fix 2: Simplify handleAddBlock
Remove useCallback temporarily:
```tsx
const handleAddBlock = (blockType: BlockType) => {
    const newBlock: IBlock = {
        id: `block-${Date.now()}`,
        type: blockType,
        order: blocks.length,
        content: {},
    };
    setBlocks([...blocks, newBlock]);
};
```

### Fix 3: Check Empty State Logic
Verify the condition in BlockCanvas:
```tsx
{blocks.length === 0 ? (
    <div className="empty-canvas">...</div>
) : (
    // Blocks rendering logic
)}
```

### Fix 4: Bypass DnD Temporarily
Replace DndContext with simple div:
```tsx
<div className="blocks-list">
    {blocks.map((block) => (
        <div key={block.id}>{block.type}</div>
    ))}
</div>
```

## Testing Checklist

- [ ] Console logs show `handleAddBlock` being called
- [ ] Blocks array length increases after clicking
- [ ] BlockCanvas receives updated blocks prop
- [ ] BlockCanvas re-renders with new blocks
- [ ] DOM contains `.sortable-block-item` elements
- [ ] Block items are visible (not hidden by CSS)
- [ ] No React errors in console
- [ ] No network errors preventing save

## Expected Behavior

1. Click block type in palette
2. `handleAddBlock` is called with blockType
3. New block is created with unique ID
4. Blocks array is updated with new block
5. `setBlocks` triggers re-render
6. BlockCanvas receives new blocks prop
7. BlockCanvas renders blocks inside DndContext
8. SortableBlockItem components render for each block
9. Blocks are visible on canvas
10. New block is automatically selected

## Next Steps

If blocks still don't appear after debugging:

1. **Check the full component tree**: Verify PageEditorContainer → BlockCanvas → SortableBlockItem chain
2. **Test with minimal example**: Create a simple test page with just BlockCanvas
3. **Check library versions**: Ensure @dnd-kit packages are compatible
4. **Review recent changes**: Check git history for changes to block rendering
5. **Test in different browser**: Rule out browser-specific issues

## Contact Support

If issue persists, provide:
- Browser console logs
- Network tab showing API calls
- Screenshot of Elements tab showing DOM
- Steps to reproduce
- Browser and OS version
