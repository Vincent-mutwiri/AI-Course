# AIAssistantPanel Component

## Overview

The `AIAssistantPanel` is a reusable React component that provides AI-powered content generation assistance within block editors. It integrates with the Inflection AI API to generate context-aware educational content.

## Features Implemented

### ✅ Task 9.1: Base Component Structure
- Collapsible panel UI with expand/collapse state
- Props interface (blockType, courseContext, onContentGenerated, currentContent, placeholder)
- Loading state with spinner
- Error state display with dismissible alerts
- Accessible ARIA attributes

### ✅ Task 9.2: Template Selector
- Dropdown for template selection
- Templates loaded dynamically based on blockType
- Template descriptions displayed on selection
- Pre-fills prompt input with selected template
- Supports custom prompt override
- Custom template storage in localStorage

### ✅ Task 9.3: Generation Controls
- Prompt input textarea with character counter (max 2000 chars)
- Generation options:
  - Tone (formal, conversational, encouraging)
  - Reading Level (high school, college, professional)
  - Length (brief, moderate, detailed)
- "Generate" button with loading state
- API call to `/api/ai/generate-content`
- Cache checking before API call using `aiContentCache`
- Generated content preview area

### ✅ Task 9.4: Refinement Controls
- Five refinement option buttons:
  - Make Shorter
  - Make Longer
  - Simplify
  - Add Examples
  - Change Tone
- API call to `/api/ai/refine-content`
- Updates preview with refined content
- Supports multiple sequential refinements
- Refinement history tracking with undo functionality

### ✅ Task 9.5: Content Actions
- **Accept** button: Inserts content into block editor via `onContentGenerated` callback
- **Regenerate** button: Generates new content with same prompt
- **Edit** button: Loads generated content back into prompt for manual modification
- **Discard** button: Clears generated content and resets state

## Usage Example

```tsx
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContextBuilder } from '@/services/courseContextBuilder';

function TextBlockEditor({ block, onChange }) {
  const courseContext = CourseContextBuilder.buildContext({
    courseId: '123',
    courseTitle: 'Introduction to AI',
    lessonTitle: 'Machine Learning Basics'
  });

  const handleContentGenerated = (content) => {
    onChange({ text: content });
  };

  return (
    <div>
      <AIAssistantPanel
        blockType="text"
        courseContext={courseContext}
        onContentGenerated={handleContentGenerated}
        currentContent={block.content.text}
      />
      {/* Rest of block editor */}
    </div>
  );
}
```

## Dependencies

- `@/types/page` - BlockType definitions
- `@/services/courseContextBuilder` - CourseContext interface
- `@/components/ui/*` - shadcn/ui components (Button, Select, Textarea, Spinner)
- `@/config/contentTemplates` - Template definitions and utilities
- `@/utils/aiContentCache` - Caching utilities
- `@/services/api` - API client
- `lucide-react` - Icons

## Content Templates

The component uses pre-configured templates from `src/config/contentTemplates.ts`:

- **Text Blocks**: Lesson intro, concept explanation, summary, instructions
- **Video Blocks**: Tutorial scripts, demonstration scripts
- **Code Blocks**: Basic examples, advanced examples
- **Reflection Blocks**: Self-assessment, application, critical thinking
- **Poll Blocks**: Knowledge checks, opinion polls
- **Quiz Blocks**: Formative and summative assessments
- **List Blocks**: Step-by-step processes, tips, checklists

Custom templates can be saved and are stored in localStorage.

## API Integration

The component expects these API endpoints to be available:

- `POST /api/ai/generate-content` - Generate new content
- `POST /api/ai/refine-content` - Refine existing content

Both endpoints should accept:
- `blockType`: The type of block being edited
- `prompt`: The generation prompt
- `context`: Course context information
- `options`: Generation options (tone, readingLevel, length)

## Caching

The component uses `aiContentCache` to:
- Cache generated content for 7 days
- Limit to 50 entries per course with LRU eviction
- Track cache hit rate statistics
- Reduce redundant API calls

## Accessibility

- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader friendly error messages

## State Management

The component manages:
- Panel expansion state
- Loading and error states
- Template selection
- Custom prompt input
- Generation options
- Generated content
- Refinement history (for undo functionality)

## Next Steps

To integrate this component into block editors:
- Import the component
- Build course context using `CourseContextBuilder`
- Implement `onContentGenerated` callback to update block content
- Add the panel above or beside the block editor UI

See tasks 10-16 in the implementation plan for block-specific integrations.
