# Block Palette and Canvas Components

This document describes the implementation of Task 4: Block Palette and Canvas components for the Admin Page Builder.

## Overview

Task 4 implements the core visual editing interface for the page builder, including:
- **BlockPalette**: A sidebar displaying all available block types with search and filtering
- **BlockCanvas**: The main editing area with drag-and-drop reordering
- **BlockToolbar**: Action buttons for duplicating and deleting blocks
- **SortableBlockItem**: Individual block items with drag-and-drop support

## Components Implemented

### 1. BlockPalette (`BlockPalette.tsx`)

A sidebar component that displays all available block types organized by category.

**Features:**
- Displays 33 block types with icons and names
- Categorizes blocks into: Content, Interactive, and Advanced
- Search/filter functionality to find blocks quickly
- Click to add block at the end of the canvas
- Drag-and-drop support to add blocks at specific positions

**Props:**
- `onAddBlock(blockType: BlockType)`: Callback when a block is clicked
- `onDragStart(blockType: BlockType)`: Optional callback when dragging starts

**Block Categories:**
- **Content**: text, video, image, code, list, divider
- **Interactive**: reflection, poll, wordCloud, aiGenerator, choiceComparison, finalAssessment
- **Advanced**: All other interactive and specialized blocks (27 types)

### 2. BlockCanvas (`BlockCanvas.tsx`)

The main editing area where blocks are displayed and can be reordered via drag-and-drop.

**Features:**
- Renders blocks array in order
- Drag-and-drop reordering using @dnd-kit library
- Empty state when no blocks exist
- Visual feedback during drag operations (drag handles, drop zones)
- Calls reorder API when blocks are rearranged
- Supports dropping blocks from the palette

**Props:**
- `blocks`: Array of IBlock objects
- `onBlocksChange(blocks: IBlock[])`: Callback when blocks change
- `onReorderBlocks(blockIds: string[])`: Async callback to persist reorder
- `onDuplicateBlock(blockId: string)`: Async callback to duplicate a block
- `onDeleteBlock(blockId: string)`: Async callback to delete a block
- `onBlockSelect(blockId: string | null)`: Optional callback when block is selected
- `selectedBlockId`: Currently selected block ID

**Drag-and-Drop:**
- Uses @dnd-kit/core for drag-and-drop functionality
- Uses @dnd-kit/sortable for sortable list behavior
- Supports keyboard navigation for accessibility
- Shows drag overlay during drag operations

### 3. SortableBlockItem (`SortableBlockItem.tsx`)

A wrapper component for individual blocks that provides sortable functionality.

**Features:**
- Integrates with @dnd-kit/sortable
- Displays block toolbar on hover
- Shows block type label and content preview
- Highlights selected blocks
- Visual feedback during drag operations

**Props:**
- `block`: The IBlock object to render
- `isSelected`: Whether this block is currently selected
- `onSelect()`: Callback when block is clicked
- `onDuplicate()`: Callback to duplicate this block
- `onDelete()`: Callback to delete this block

**Block Previews:**
- Text blocks: Show first 100 characters of HTML content
- Video blocks: Show video provider and URL status
- Image blocks: Show thumbnail preview
- Code blocks: Show language and character count
- List blocks: Show list type and item count
- Interactive blocks: Show question or prompt

### 4. BlockToolbar (`BlockToolbar.tsx`)

A toolbar component that appears on each block with action buttons.

**Features:**
- Drag handle for reordering (left side)
- Duplicate button (right side)
- Delete button with confirmation (right side)
- Prevents accidental deletions with confirmation dialog

**Props:**
- `blockId`: The ID of the block
- `onDuplicate()`: Callback to duplicate the block
- `onDelete()`: Callback to delete the block
- `dragHandleProps`: Props to spread on the drag handle element

**Actions:**
- **Drag Handle (⋮⋮)**: Click and drag to reorder blocks
- **Duplicate (📋)**: Creates a copy of the block immediately after the original
- **Delete (🗑️)**: Shows confirmation, then deletes the block

## Integration with PageEditorContainer

The PageEditorContainer has been updated to integrate these components:

### New State
- `selectedBlockId`: Tracks which block is currently selected

### New Handlers

**handleAddBlock(blockType: BlockType)**
- Creates a new block with the specified type
- Assigns a unique ID using timestamp and random string
- Adds block at the end of the blocks array
- Marks page as dirty and selects the new block

**handleReorderBlocks(blockIds: string[])**
- Calls the reorder API endpoint
- Updates blocks state with the new order
- Throws error if API call fails (triggers revert in BlockCanvas)

**handleDuplicateBlock(blockId: string)**
- For new pages: Duplicates locally without API call
- For existing pages: Calls duplicate API endpoint
- Inserts duplicate immediately after the original
- Updates order values for subsequent blocks
- Selects the duplicated block

**handleDeleteBlock(blockId: string)**
- For new pages: Deletes locally without API call
- For existing pages: Calls delete API endpoint
- Updates order values for remaining blocks
- Clears selection if deleted block was selected

## Styling

All styles are in `BlockEditor.css` with the following sections:

### Block Palette Styles
- Fixed width sidebar (280px)
- Search input with focus states
- Category filter buttons
- Block items with hover effects
- Drag cursor feedback

### Block Canvas Styles
- Flexible main area
- Empty state with icon and instructions
- Drag-from-palette visual feedback
- Responsive padding

### Sortable Block Item Styles
- Block container with hover effects
- Selected state highlighting
- Drag opacity feedback
- Block type label badge
- Content preview area
- Preview styles for each block type

### Block Toolbar Styles
- Toolbar container with left/right sections
- Button hover states
- Drag handle cursor
- Delete confirmation inline dialog
- Action button colors (duplicate: cyan, delete: red)

### Drag Overlay Styles
- Semi-transparent overlay during drag
- Block type badge
- Drop shadow for depth

### Responsive Design
- Mobile: Palette becomes horizontal at top
- Tablet: Reduced padding
- Desktop: Full sidebar layout

## Required Dependencies

This implementation requires the following npm packages:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Or with yarn:
```bash
yarn add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### @dnd-kit Library

We chose @dnd-kit over react-beautiful-dnd because:
- Modern, actively maintained
- Better TypeScript support
- More flexible and performant
- Supports both mouse and keyboard interactions
- Better accessibility out of the box
- Smaller bundle size

**Package Versions:**
- `@dnd-kit/core`: ^6.0.0 or later
- `@dnd-kit/sortable`: ^7.0.0 or later
- `@dnd-kit/utilities`: ^3.0.0 or later

## API Endpoints Used

The components integrate with these backend endpoints:

### Reorder Blocks
```
PATCH /api/admin/pages/:id/blocks/reorder
Body: { blockIds: string[] }
Response: { blocks: IBlock[] }
```

### Duplicate Block
```
POST /api/admin/pages/:id/blocks/:blockId/duplicate
Response: { block: IBlock }
```

### Delete Block
```
DELETE /api/admin/pages/:id/blocks/:blockId
Response: { message: string }
```

### Fetch Page for Editing
```
GET /api/admin/pages/:id/edit
Response: { page: IPage }
```

## Block Type Definitions

All 33 block types are supported:

**Content Blocks (6):**
- text, video, image, code, list, divider

**Interactive Blocks (27):**
- reflection, poll, wordCloud, aiGenerator
- choiceComparison, certificateGenerator, finalAssessment
- playerTypeSimulator, rewardScheduleDesigner, flowChannelEvaluator
- pitchAnalysisGenerator, narrativeGenerator, darkPatternRedesigner
- roeDashboard, designFixer, journeyTimeline, simulation
- aiJourney, buildABot, conceptMap, dataDashboard
- ethicalDilemmaSolver, gamificationConceptMap, identifyPersonalization
- playerTypeAnalyzer, presentationCoach, sentenceBuilder, visualTokens

## Usage Example

```tsx
import { PageEditorContainer } from './components/admin/PageEditor';

// The PageEditorContainer now includes BlockPalette and BlockCanvas
function AdminPageEditor() {
  return <PageEditorContainer isNewPage={false} />;
}
```

The components are automatically integrated - no additional setup needed beyond installing the @dnd-kit dependencies.

## Accessibility

The implementation includes accessibility features:

- **Keyboard Navigation**: Full keyboard support for drag-and-drop
- **Focus Indicators**: Clear focus states on all interactive elements
- **ARIA Labels**: Descriptive labels on buttons (via title attributes)
- **Screen Reader Support**: Semantic HTML structure
- **Keyboard Shortcuts**: 
  - Arrow keys: Navigate between blocks
  - Space/Enter: Pick up/drop blocks
  - Escape: Cancel drag operation

## Performance Considerations

- **Debounced Search**: Search input is debounced to avoid excessive re-renders
- **Memoized Filtering**: Block filtering uses useMemo for performance
- **Optimized Drag**: @dnd-kit uses transform instead of position for smooth dragging
- **Lazy Loading**: Block editor components will be lazy-loaded in future tasks

## Testing

To test the implementation:

1. **Install dependencies:**
   ```bash
   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   ```

2. **Start the application:**
   ```bash
   npm run dev
   ```

3. **Test Block Palette:**
   - Search for blocks
   - Filter by category
   - Click blocks to add them
   - Drag blocks to canvas

4. **Test Block Canvas:**
   - Drag blocks to reorder
   - Select blocks by clicking
   - Use keyboard to navigate

5. **Test Block Toolbar:**
   - Hover over blocks to see toolbar
   - Duplicate blocks
   - Delete blocks (with confirmation)

## Requirements Satisfied

This implementation satisfies the following requirements:

**Requirement 1.1**: Create new pages using a block-based editor
- ✅ Block palette displays all available block types
- ✅ Click or drag to add blocks

**Requirement 1.2**: Reuse all existing Course Builder block types
- ✅ All 33 block types are supported
- ✅ Block type definitions match Course Builder

**Requirement 2.1**: Support all content block types
- ✅ text, video, image, code, list, divider

**Requirement 2.2**: Support all interactive block types
- ✅ All 27 interactive block types

**Requirement 4.1**: Reorder blocks using drag-and-drop
- ✅ Drag-and-drop reordering implemented
- ✅ Updates order property of all affected blocks

**Requirement 4.2**: Save updated block order
- ✅ Calls reorder API when blocks are rearranged

**Requirement 4.3**: Display visual feedback during drag
- ✅ Drag handles, drop zones, drag overlay

**Requirement 4.4**: Maintain sequential order values
- ✅ Order values start from 0 with no gaps

**Requirement 4.5**: Prevent invalid drag operations
- ✅ Drag constrained to canvas area

**Requirement 5.1**: Duplicate blocks
- ✅ Duplicate button creates copy with unique ID
- ✅ Inserted immediately after original

**Requirement 5.2**: Delete blocks
- ✅ Delete button with confirmation
- ✅ Updates order values of remaining blocks

## Known Limitations

1. **Block Editing**: Individual block editors not yet implemented (Task 5 & 6)
2. **Media Upload**: Upload functionality not yet integrated (Task 7)
3. **Preview Mode**: Preview functionality not yet implemented (Task 9)
4. **Undo/Redo**: Not yet implemented (Task 14.2)

These will be addressed in subsequent tasks.

## Next Steps

The following tasks will build upon this implementation:

- **Task 5**: Implement block editor components for content blocks
- **Task 6**: Implement block editor components for interactive blocks
- **Task 7**: Implement media upload functionality
- **Task 8**: Create auto-save functionality (already partially implemented)
- **Task 9**: Build page preview functionality

## Troubleshooting

### Drag-and-drop not working
- Ensure @dnd-kit packages are installed
- Check browser console for errors
- Verify drag handle has correct props

### Blocks not reordering
- Check API endpoint is accessible
- Verify authentication token is valid
- Check network tab for failed requests

### Styling issues
- Ensure BlockEditor.css is imported
- Check for CSS conflicts with global styles
- Verify responsive breakpoints

## Support

For issues or questions about this implementation, refer to:
- Design document: `.kiro/specs/admin-page-builder/design.md`
- Requirements document: `.kiro/specs/admin-page-builder/requirements.md`
- Tasks document: `.kiro/specs/admin-page-builder/tasks.md`
