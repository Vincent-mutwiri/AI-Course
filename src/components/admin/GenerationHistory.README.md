# GenerationHistory Component

## Overview

The `GenerationHistory` component provides a dialog-based interface for viewing, managing, and reusing previously generated AI content. It stores generation history in localStorage on a per-course basis and provides actions for copying, reusing, and deleting entries.

## Features

- **Display History**: Shows all previous AI generations for the current course
- **Organize by Block Type**: Filter history by block type (text, video, code, etc.)
- **Organize by Date**: Groups entries by date for easy navigation
- **Copy to Clipboard**: Copy generated content to clipboard
- **Reuse Content**: Load previous generation into current block editor
- **Delete Entries**: Remove individual history entries
- **Clear All**: Clear entire history for the course
- **localStorage Persistence**: History is stored per course and persists across sessions

## Usage

### Basic Usage

```tsx
import { GenerationHistory } from '@/components/admin/GenerationHistory';

function MyComponent() {
  const courseId = 'course-123';

  return (
    <GenerationHistory
      courseId={courseId}
      onReuse={(entry) => {
        // Handle reusing the content
        console.log('Reusing:', entry);
      }}
    />
  );
}
```

### Integration with Block Editors

```tsx
import { GenerationHistory, GenerationHistoryEntry } from '@/components/admin/GenerationHistory';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';

function TextBlockEditor() {
  const [content, setContent] = useState('');
  const courseContext = {
    courseId: 'course-123',
    courseTitle: 'My Course',
    // ... other context
  };

  const handleReuse = (entry: GenerationHistoryEntry) => {
    // Load the content from history into the editor
    setContent(entry.content);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <GenerationHistory
          courseId={courseContext.courseId}
          onReuse={handleReuse}
        />
      </div>

      <AIAssistantPanel
        blockType="text"
        courseContext={courseContext}
        onContentGenerated={setContent}
      />

      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
    </div>
  );
}
```

## Props

### GenerationHistoryProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `courseId` | `string` | Yes | The ID of the current course |
| `onReuse` | `(entry: GenerationHistoryEntry) => void` | No | Callback when user clicks "Reuse" on an entry |
| `className` | `string` | No | Additional CSS classes for the trigger button |

### GenerationHistoryEntry

```typescript
interface GenerationHistoryEntry {
  id: string;              // Unique identifier
  blockType: BlockType;    // Type of block (text, video, code, etc.)
  prompt: string;          // The prompt used to generate content
  content: any;            // The generated content
  timestamp: number;       // When the content was generated
  courseId: string;        // The course this generation belongs to
}
```

## Programmatic API

### Adding to History

The component exports an `addToHistory` function for programmatically adding entries:

```typescript
import { addToHistory } from '@/components/admin/GenerationHistory';

// Add a generation to history
addToHistory(
  'course-123',           // courseId
  'text',                 // blockType
  'Generate an intro',    // prompt
  'Welcome to the course' // content
);
```

This function is automatically called by `AIAssistantPanel` when content is generated.

## Storage Details

### localStorage Structure

History is stored in localStorage with the following structure:

- **Key**: `ai_generation_history_{courseId}`
- **Value**: JSON array of `GenerationHistoryEntry` objects
- **Max Entries**: 100 per course (oldest entries are removed when limit is reached)

### Example localStorage Entry

```json
[
  {
    "id": "1234567890_abc123",
    "blockType": "text",
    "prompt": "Generate an introduction to gamification",
    "content": "Gamification is the application of game-design elements...",
    "timestamp": 1234567890000,
    "courseId": "course-123"
  }
]
```

## Features in Detail

### Filter by Block Type

The component automatically detects all block types present in the history and provides filter buttons:

- **All**: Shows all entries
- **Text**: Shows only text block generations
- **Video**: Shows only video block generations
- etc.

Each filter button shows the count of entries for that type.

### Date Grouping

Entries are automatically grouped by date:

- **Just now**: Less than 1 minute ago
- **X mins ago**: Less than 1 hour ago
- **X hours ago**: Less than 24 hours ago
- **X days ago**: Less than 7 days ago
- **MM/DD/YYYY**: 7 days or older

### Actions

Each history entry provides three actions:

1. **Copy to Clipboard**: Copies the generated content to clipboard
2. **Reuse**: Calls the `onReuse` callback with the entry (if provided)
3. **Delete**: Removes the entry from history

### Clear All

The "Clear All" button removes all history entries for the current course. A confirmation dialog is shown before clearing.

## Styling

The component uses Tailwind CSS and shadcn/ui components for styling. It supports both light and dark modes.

### Block Type Colors

Each block type has a distinct color badge:

- **Text**: Blue
- **Video**: Purple
- **Code**: Green
- **Reflection**: Yellow
- **Poll**: Pink
- **Quiz**: Indigo
- **List**: Orange
- **Image**: Teal
- **Divider**: Gray
- **Interactive**: Red

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- ARIA labels on action buttons
- Focus management in dialog

## Performance Considerations

- History is loaded only when the dialog is opened
- Maximum of 100 entries per course to prevent localStorage bloat
- Content previews are truncated to improve rendering performance
- Efficient filtering and grouping algorithms

## Future Enhancements

Potential improvements for future versions:

1. Search/filter by prompt text
2. Export history to JSON file
3. Import history from JSON file
4. Star/favorite important generations
5. Tags or categories for better organization
6. Sync history across devices (requires backend)
7. Analytics on most-used prompts and block types
