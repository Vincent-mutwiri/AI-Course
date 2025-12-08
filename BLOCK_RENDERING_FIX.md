# Block Rendering Issue - Investigation & Fix

## Problem
Blocks do not appear on the canvas after being selected from the block palette.

## Investigation Added

I've added console logging to help diagnose the issue:

### In `PageEditorContainer.tsx` - `handleAddBlock` function:
```typescript
console.log('[PageEditor] Adding block:', blockType);
console.log('[PageEditor] Current blocks:', blocks);
console.log('[PageEditor] New blocks array:', newBlocks);
```

### In `BlockCanvas.tsx` - Component render:
```typescript
console.log('[BlockCanvas] Rendering with blocks:', blocks);
console.log('[BlockCanvas] Blocks length:', blocks.length);
```

## How to Debug

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open the page editor** in your browser

3. **Open Browser DevTools** (F12) and go to the Console tab

4. **Click a block** from the palette (e.g., "Text" block)

5. **Check the console output**:
   - You should see `[PageEditor] Adding block: text`
   - You should see the current blocks array
   - You should see the new blocks array with one more item
   - You should see `[BlockCanvas] Rendering with blocks:` twice (before and after update)
   - The blocks length should increase by 1

## Possible Scenarios

### Scenario 1: handleAddBlock Not Called
**Console shows**: Nothing when clicking a block

**Cause**: Click handler not attached or event not firing

**Fix**:
```tsx
// In BlockPalette.tsx, verify the onClick is attached:
<div
    className="block-item"
    onClick={() => {
        console.log('Block clicked:', block.type);
        handleBlockClick(block.type);
    }}
>
```

### Scenario 2: State Not Updating
**Console shows**: `[PageEditor] Adding block` but blocks array doesn't change

**Cause**: `setBlocks` not working or stale closure

**Fix**: Remove `useCallback` dependency:
```tsx
const handleAddBlock = useCallback((blockType: BlockType) => {
    setBlocks(prevBlocks => {
        const newBlock: IBlock = {
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: blockType,
            order: prevBlocks.length,
            content: {},
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return [...prevBlocks, newBlock];
    });
    setIsDirty(true);
}, []); // Empty dependencies
```

### Scenario 3: BlockCanvas Not Re-rendering
**Console shows**: Blocks array updates but BlockCanvas doesn't re-render

**Cause**: React not detecting prop change

**Fix**: Add key prop to force re-render:
```tsx
<BlockCanvas
    key={`canvas-${blocks.length}`}
    blocks={blocks}
    ...
/>
```

### Scenario 4: Blocks Rendered But Hidden
**Console shows**: Everything logs correctly, blocks length increases

**Cause**: CSS hiding the blocks

**Fix**: Check in DevTools Elements tab:
1. Find `.block-canvas` element
2. Look for `.blocks-list` inside it
3. Check if `.sortable-block-item` elements exist
4. Inspect their CSS (display, opacity, height, width)

## Recommended Fix

Based on common React state issues, here's the most likely fix:

### Update `handleAddBlock` to use functional setState:

```typescript
const handleAddBlock = useCallback((blockType: BlockType) => {
    console.log('[PageEditor] Adding block:', blockType);
    
    setBlocks(prevBlocks => {
        console.log('[PageEditor] Previous blocks:', prevBlocks);
        
        const newBlock: IBlock = {
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: blockType,
            order: prevBlocks.length,
            content: {},
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const newBlocks = [...prevBlocks, newBlock];
        console.log('[PageEditor] New blocks array:', newBlocks);
        
        return newBlocks;
    });
    
    setIsDirty(true);
    
    // Set selected block ID after state update
    const newBlockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setTimeout(() => {
        setSelectedBlockId(newBlockId);
    }, 0);
}, []); // Remove blocks dependency
```

## Alternative: Simplify Block Rendering

If the issue persists, temporarily bypass the DnD library to isolate the problem:

### In `BlockCanvas.tsx`:

```tsx
return (
    <div className="block-canvas">
        {blocks.length === 0 ? (
            <div className="empty-canvas">
                <div className="empty-canvas-content">
                    <span className="empty-icon">📄</span>
                    <h3>Add your first block</h3>
                    <p>Click a block type from the palette</p>
                </div>
            </div>
        ) : (
            <div className="blocks-list">
                {blocks.map((block) => (
                    <div 
                        key={block.id}
                        className="sortable-block-item"
                        onClick={() => onBlockSelect?.(block.id)}
                    >
                        <div className="block-type-label">{block.type}</div>
                        <div className="block-preview">
                            Block ID: {block.id}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);
```

If blocks appear with this simplified version, the issue is with the DnD library setup.

## Testing Steps

After applying the fix:

1. Clear browser cache and reload
2. Open page editor
3. Click a block from the palette
4. Verify block appears on canvas
5. Click another block
6. Verify second block appears below first
7. Try dragging blocks to reorder
8. Try selecting, duplicating, and deleting blocks

## Clean Up

Once the issue is resolved, remove the console.log statements:

```bash
# Search for debug logs
grep -r "console.log.*PageEditor" src/
grep -r "console.log.*BlockCanvas" src/

# Remove them manually or use sed
```

## If Issue Persists

1. Check React DevTools to see if state is updating
2. Verify no errors in browser console
3. Check Network tab for failed API calls
4. Test in incognito mode (rules out extension conflicts)
5. Test in different browser
6. Check if issue occurs with new page vs existing page
7. Verify @dnd-kit packages are installed correctly:
   ```bash
   npm list @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   ```

## Expected Console Output (Success)

```
[PageEditor] Adding block: text
[PageEditor] Current blocks: []
[PageEditor] New blocks array: [{id: "block-1234...", type: "text", ...}]
[BlockCanvas] Rendering with blocks: []
[BlockCanvas] Blocks length: 0
[BlockCanvas] Rendering with blocks: [{id: "block-1234...", type: "text", ...}]
[BlockCanvas] Blocks length: 1
```

## Contact

If you need further assistance, provide:
- Full console output
- Screenshot of the page editor
- Browser and OS version
- Steps to reproduce
