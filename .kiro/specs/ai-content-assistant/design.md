# Design Document: AI Content Assistant

## Overview

The AI Content Assistant is an intelligent content generation system that integrates directly into the Admin Course Builder V2 block editors. It leverages the existing Inflection AI API infrastructure to provide context-aware content suggestions, reducing course creation time by 60-80%. The system uses a combination of inline generation UI, smart prompting with course context, and caching to deliver fast, relevant content across all block types.

The assistant operates as a non-blocking enhancement to the existing workflow—admins can choose to use AI assistance or create content manually. All generated content is editable and refinable, ensuring admins maintain full creative control.

## Architecture

### High-Level Architecture

The system follows a layered architecture:

1. **UI Layer**: AIAssistantPanel component integrated into block editors
2. **Frontend Service Layer**: Context building, prompt construction, caching
3. **API Layer**: REST endpoints for generation, refinement, and usage tracking
4. **AI Service Layer**: Enhanced aiService.ts with content generation methods
5. **External API**: Inflection AI API (Pi-3.1 model)

### Technology Stack

**Frontend:**
- React 19 with TypeScript
- Existing shadcn/ui components (Button, Dialog, Textarea, Select)
- Custom AIAssistantPanel component
- aiContentCache utility (extends existing aiCache)
- Axios for API calls

**Backend:**
- Express.js with TypeScript
- Enhanced aiService.ts with content generation methods
- New aiContentPrompts.ts configuration file
- MongoDB for usage tracking
- Existing Inflection AI integration

## Components and Interfaces

### 1. AIAssistantPanel Component

A reusable component that integrates into any block editor modal.

```typescript
interface AIAssistantPanelProps {
  blockType: BlockType;
  courseContext: CourseContext;
  onContentGenerated: (content: any) => void;
  currentContent?: any;
  placeholder?: string;
}

interface CourseContext {
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleName: string;
  lessonId: string;
  lessonName: string;
  learningObjectives?: string[];
  existingBlocks?: IBlock[];
}
```

**Features:**
- Collapsible panel within block editor
- Template selector dropdown
- Custom prompt input field
- Generate/Regenerate/Refine buttons
- Loading state with progress indicator
- Generated content preview
- Accept/Edit/Discard actions

### 2. Content Generation Templates

Pre-configured prompts for common scenarios organized by block type and purpose.

### 3. Enhanced AI Service Methods

Extend `server/src/services/aiService.ts`:

```typescript
export async function generateBlockContent(
  blockType: BlockType,
  prompt: string,
  context: CourseContext,
  options: GenerationOptions
): Promise<GeneratedContent>

export async function refineContent(
  content: string,
  refinementType: RefinementType,
  context: CourseContext
): Promise<string>

export async function generateLessonOutline(
  topic: string,
  objectives: string[],
  context: CourseContext
): Promise<BlockOutline[]>
```

### 4. Block-Specific Integration

Each block editor gets AI assistance tailored to its content type:

- **Text Block**: Generate formatted text, templates for intro/explanation/summary
- **Video Block**: Generate scripts with timestamps, titles, descriptions
- **Code Block**: Generate examples with comments and explanations
- **Reflection Block**: Generate thought-provoking prompts
- **Poll Block**: Generate questions and mutually exclusive options
- **Quiz Block**: Generate questions with distractors and explanations
- **List Block**: Generate structured lists (steps, requirements, tips)

### 5. Context Builder Service

Frontend service that gathers course context for AI generation.

### 6. Prompt Constructor

Builds effective prompts combining templates, user input, and course context.

### 7. Response Parser

Formats AI responses into block-specific content structures.

### 8. Usage Tracking

Track AI usage for cost management with MongoDB model.

## Data Models

### AI Content Prompts Configuration

New file: `server/src/config/aiContentPrompts.ts`

Contains prompt templates for:
- Text blocks (introduction, explanation, summary, example)
- Video blocks (script generation)
- Code blocks (example generation)
- Reflection blocks (prompt generation)
- Poll blocks (question and options)
- Quiz blocks (question generation)
- List blocks (structured lists)
- Lesson outlines (complete lesson structure)

Also includes refinement prompts for:
- Make shorter/longer
- Simplify language
- Add examples
- Change tone (formal/casual)

## API Endpoints

### 1. Generate Block Content
POST /api/ai/generate-content

### 2. Refine Content
POST /api/ai/refine-content

### 3. Generate Lesson Outline
POST /api/ai/generate-outline

### 4. Get Usage Stats
GET /api/ai/usage-stats

## Error Handling

### Frontend Error Handling
- Network errors with retry
- Validation errors with inline messages
- Generation failures with fallback options
- Timeout errors with extended retry

### Backend Error Handling
- API failures with retry logic
- Invalid prompts with validation
- Rate limiting with queue
- Content parsing errors with fallback

## Caching Strategy

### Frontend Cache (localStorage)
- Cache by prompt hash
- 7-day retention
- Max 50 entries per course

### Cache Key Generation
Combines block type, prompt, context, and options into unique hash.

## Testing Strategy

### Unit Tests
- PromptConstructor template handling
- ResponseParser for each block type
- CourseContextBuilder extraction

### Integration Tests
- End-to-end generation flow
- Refinement flow
- Outline generation

### E2E Tests
- Complete user workflows
- Error handling scenarios
- Template usage

## Performance Considerations

### Frontend Optimization
- Lazy loading of AI components
- Debouncing of inputs
- Optimistic UI updates

### Backend Optimization
- Request batching
- Prompt optimization
- Response streaming (future)

## Security Considerations

### Input Validation
- Prompt sanitization
- Length limits
- Content filtering

### Access Control
- Admin-only access
- Course permission verification
- Rate limiting per user

## Accessibility

### WCAG 2.1 AA Compliance
- Keyboard navigation
- Screen reader support
- Sufficient color contrast
- Clear loading indicators

## Future Enhancements

1. Multi-language support
2. Image generation
3. Voice input
4. Collaborative prompting
5. Learning from feedback
6. Advanced context with analytics

## Conclusion

The AI Content Assistant will dramatically accelerate course creation while maintaining quality and consistency. By integrating directly into block editors with context-aware prompting, it provides relevant suggestions that admins can quickly refine and customize.
