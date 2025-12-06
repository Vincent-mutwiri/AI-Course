# GenerationHistory Component - Visual Guide

## Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [History] (15)                                             │  ← Trigger Button
└─────────────────────────────────────────────────────────────┘

When clicked, opens dialog:

┌─────────────────────────────────────────────────────────────┐
│  Generation History                                    [X]  │  ← Dialog Header
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [All (15)] [Text (8)] [Video (4)] [Code (3)]  [Clear All] │  ← Filters
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  December 6, 2025                                           │  ← Date Group
│  ┌───────────────────────────────────────────────────────┐ │
│  │ [Text] 5 mins ago                    [📋] [↻] [🗑️]   │ │  ← Entry
│  │ Prompt: Generate an introduction to gamification       │ │
│  │ Content Preview: Gamification is the application...    │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ [Video] 15 mins ago                  [📋] [↻] [🗑️]   │ │
│  │ Prompt: Create a video script about game mechanics    │ │
│  │ Content Preview: Introduction: Welcome to this...     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  December 5, 2025                                           │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ [Code] 1 day ago                     [📋] [↻] [🗑️]   │ │
│  │ Prompt: Generate a Python example for loops           │ │
│  │ Content Preview: for i in range(10): print(i)...      │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Empty State

```
┌─────────────────────────────────────────────────────────────┐
│  Generation History                                    [X]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                          ⚠️                                 │
│                                                             │
│              No generation history yet                      │
│                                                             │
│      Generated content will appear here for easy reuse      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Block Type Colors

Visual representation of block type badges:

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│   Text   │  │  Video   │  │   Code   │  │Reflection│
│  (Blue)  │  │ (Purple) │  │ (Green)  │  │ (Yellow) │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│   Poll   │  │   Quiz   │  │   List   │  │  Image   │
│  (Pink)  │  │ (Indigo) │  │ (Orange) │  │  (Teal)  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

## Action Buttons

Each history entry has three action buttons:

1. **📋 Copy** - Copies content to clipboard
2. **↻ Reuse** - Loads content into current block (if onReuse provided)
3. **🗑️ Delete** - Removes entry from history

## Filter Behavior

### All Filter (Default)
Shows all entries across all block types

### Block Type Filters
- Dynamically generated based on history content
- Shows count of entries for each type
- Clicking filters the list to show only that type

### Clear All Button
- Positioned on the right side of filter bar
- Shows confirmation dialog before clearing
- Removes all history entries for the current course

## Date Grouping

Entries are grouped by date with smart labels:

- **Just now** - Less than 1 minute ago
- **X mins ago** - Less than 1 hour ago
- **X hours ago** - Less than 24 hours ago
- **X days ago** - Less than 7 days ago
- **MM/DD/YYYY** - 7 days or older

## Content Preview

Content is intelligently previewed:

### String Content
```
Content Preview:
┌─────────────────────────────────────────────────────────┐
│ Gamification is the application of game-design...      │
└─────────────────────────────────────────────────────────┘
```

### Object Content
Extracts meaningful text from common properties:
- `content.text`
- `content.content`
- `content.question`
- `content.prompt`

Falls back to JSON string if no text property found.

### Truncation
- Prompts truncated to 200 characters
- Content previews truncated to 300 characters
- Ellipsis (...) added when truncated

## Responsive Design

The dialog is responsive and adapts to different screen sizes:

- **Desktop**: Max width 4xl (896px)
- **Mobile**: Full width with padding
- **Height**: Max 80vh with scroll area for content

## Dark Mode Support

All colors and styles support dark mode:

```
Light Mode:
- Background: White
- Text: Gray-900
- Borders: Gray-200

Dark Mode:
- Background: Gray-900
- Text: Gray-100
- Borders: Gray-700
```

## Integration Example

### In Block Editor Header

```
┌─────────────────────────────────────────────────────────────┐
│  Edit Text Block                            [History] (15)  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ✨ AI Content Assistant                          [▼]   ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Content:                                                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                                                         ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### In Toolbar

```
┌─────────────────────────────────────────────────────────────┐
│  [Save] [Preview] [History] (15) [Settings]                │
└─────────────────────────────────────────────────────────────┘
```

## Keyboard Navigation

- **Tab** - Navigate between elements
- **Enter/Space** - Activate buttons
- **Escape** - Close dialog
- **Arrow Keys** - Navigate within scroll area

## Screen Reader Announcements

- "Generation History dialog"
- "History button, 15 items"
- "Copy to clipboard button"
- "Reuse content button"
- "Delete entry button"
- "Clear all history button"

## Performance Notes

- History loaded only when dialog opens (lazy loading)
- Scroll area virtualizes long lists
- Efficient filtering with memoization
- Debounced search (if implemented in future)

## Best Practices

### When to Use
- In block editors alongside AI Assistant
- In course builder toolbars
- In admin dashboards

### When Not to Use
- For non-AI generated content
- For system-wide history (use course-specific)
- For real-time collaboration (requires backend)

## Customization

### Custom Trigger Button

```tsx
<GenerationHistory
  courseId={courseId}
  onReuse={handleReuse}
  className="custom-class"
/>
```

### Custom Reuse Handler

```tsx
const handleReuse = (entry: GenerationHistoryEntry) => {
  // Custom logic for reusing content
  if (entry.blockType === 'text') {
    setTextContent(entry.content);
  } else if (entry.blockType === 'video') {
    setVideoScript(entry.content);
  }
};
```

## Troubleshooting

### History Not Showing
- Check courseId is correct
- Verify localStorage is enabled
- Check browser console for errors

### Content Not Reusing
- Ensure onReuse callback is provided
- Check callback implementation
- Verify content format matches expected type

### Storage Full
- Clear old history entries
- Check localStorage quota
- Implement cleanup for old courses
