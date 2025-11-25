# Design Document: Admin Course Builder V2

## Overview

The Admin Course Builder V2 is a visual, block-based course creation system that transforms the existing JSON-based course editing workflow into an intuitive drag-and-drop interface. The system extends the current MERN stack architecture and integrates seamlessly with 16 existing interactive element types while introducing 6 new basic content blocks.

The builder provides a three-panel WYSIWYG interface with course structure navigation, canvas for block composition, and a block library.

## Architecture

### High-Level Architecture

The system follows a client-server architecture with React frontend and Express backend, connected via REST API. The frontend manages the visual builder interface with drag-and-drop functionality, while the backend handles data persistence, file uploads to S3, and business logic validation.

### Technology Stack

**Frontend:**
- React 19 with TypeScript
- @hello-pangea/dnd for drag-and-drop
- React Hook Form + Zod for form validation
- shadcn/ui components
- TipTap or Lexical for rich text editing
- Axios for API communication

**Backend:**
- Express.js with TypeScript
- MongoDB with Mongoose ODM
- Multer for file upload handling
- AWS SDK for S3 operations
- JWT authentication with admin middleware

## Data Models

### Extended Lesson Schema

```typescript
export type BlockType = 
  | 'text' | 'video' | 'image' | 'code' | 'list' | 'divider'
  | 'reflection' | 'poll' | 'wordCloud' | 'aiGenerator'
  | 'choiceComparison' | 'certificateGenerator' | 'finalAssessment'
  | 'aiJourney' | 'buildABot' | 'conceptMap' | 'dataDashboard'
  | 'ethicalDilemmaSolver' | 'gamificationConceptMap' | 'identifyPersonalization'
  | 'playerTypeAnalyzer' | 'presentationCoach' | 'sentenceBuilder' | 'visualTokens';

export interface IBlock {
  id: string;
  type: BlockType;
  order: number;
  content: {
    text?: string;
    videoUrl?: string;
    videoSource?: 'upload' | 'embed';
    videoProvider?: 'youtube' | 'vimeo' | 's3';
    imageUrl?: string;
    caption?: string;
    altText?: string;
    code?: string;
    language?: string;
    items?: Array<{ text: string; checked?: boolean; }>;
    listType?: 'bullet' | 'numbered' | 'checkbox';
    config?: any;
    question?: string;
    options?: any;
    prompt?: string;
    title?: string;
    description?: string;
    meta?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Mongoose Schema Updates

Add blockSchema to Course model and include blocks array in lessonSchema to support the new block-based content structure while maintaining backward compatibility with existing fields.

## Components and Interfaces

### 1. CourseBuilderPage Component

Main container managing global state including current course, module, lesson, blocks array, and auto-save logic with 2-second debounce.

### 2. CourseStructure Component

Displays course modules and lessons in accordion format, highlights currently selected lesson, and handles lesson navigation.

### 3. Canvas Component

Renders blocks in order using @hello-pangea/dnd for drag-and-drop reordering. Provides block action buttons for edit, duplicate, delete, and preview operations. Implements delete confirmation dialog with immediate canvas update and auto-save persistence. Supports keyboard shortcuts including Delete/Backspace for removing selected blocks.

### 4. BlockLibrary Component

Displays available block types in tabs (Basic and Interactive) with search/filter functionality. Handles block addition to canvas.

### 5. BlockRenderer Component

Renders block preview in canvas with action toolbar. Routes to appropriate block component based on type.

### 6. Block Components

Each block type has its own component:
- TextBlock, VideoBlock, ImageBlock, CodeBlock, ListBlock, DividerBlock
- Interactive blocks reuse existing components from src/components/interactive/
- Deprecated block types (Design Fixer, Player Type Simulator, Reward Schedule Designer, Flow Channel Evaluator, Pitch Analysis Generator, Narrative Generator, Dark Pattern Redesigner, ROE Dashboard, Journey Timeline) are excluded from the system

### 7. Configuration Modals

Each block type has a configuration modal using React Hook Form and Zod validation. Modals include type-specific fields with proper validation and error handling.

### 8. Validation Schemas

Zod schemas for each block type ensuring data integrity:
- textBlockSchema: validates rich text content
- videoBlockSchema: validates URL or file upload
- imageBlockSchema: validates URL, caption, and required alt text
- codeBlockSchema: validates code and language
- listBlockSchema: validates items and list type
- Interactive block schemas: validate type-specific configurations

## API Endpoints

### 1. Get Course for Editing
GET /api/admin/courses/:id/edit - Returns course with all modules, lessons, and blocks

### 2. Save Lesson Blocks
PUT /api/admin/courses/:courseId/modules/:moduleId/lessons/:lessonId/blocks - Saves blocks array

### 3. Upload Media
POST /api/admin/upload - Handles file upload to S3, returns URL

### 4. Reorder Blocks
PATCH /api/admin/courses/:courseId/lessons/:lessonId/blocks/reorder - Updates block order

### 5. Duplicate Block
POST /api/admin/courses/:courseId/lessons/:lessonId/blocks/:blockId/duplicate - Creates copy with new ID

## Error Handling

### Frontend Error Handling

- Validation errors displayed inline in forms
- Toast notifications for API failures
- Retry logic for auto-save failures
- File size and type validation before upload
- Preserve unsaved changes in local state

### Backend Error Handling

- Middleware for block structure validation
- Standardized error response format
- File size limits enforcement (100MB videos, 5MB images)
- URL format validation

## Testing Strategy

### Unit Tests
- Block component rendering
- Form validation logic
- Drag-and-drop utilities
- Auto-save debounce logic
- API route handlers

### Integration Tests
- Block addition workflow
- Block editing workflow
- Drag-and-drop reordering
- Auto-save functionality
- File upload flow

### E2E Tests
- Create new lesson with multiple blocks
- Edit existing block configuration
- Reorder blocks via drag-and-drop
- Upload video and image files
- Preview lesson in student view
- Auto-save recovery after network interruption

## Performance Considerations

### Frontend Optimization
- Lazy load block configuration modals
- Lazy load rich text editor and syntax highlighter
- Memoize BlockRenderer components
- Debounce auto-save operations (2 seconds)

### Backend Optimization
- Selective field loading for builder
- Batch operations for bulk updates
- Minimize database round trips

## Security Considerations

### Authentication & Authorization
- Admin-only access via authenticate and requireAdmin middleware
- CSRF protection for state-changing operations

### Input Validation
- Sanitize HTML content in text blocks using DOMPurify
- Whitelist file types for uploads
- Enforce file size limits
- Generate unique S3 keys

### Data Protection
- Auto-save with conflict resolution
- Optimistic UI updates with rollback capability

## Migration Strategy

### Backward Compatibility

Support both old and new formats in ModuleContent.tsx. Render blocks array if present, otherwise fall back to legacy content and interactiveElements rendering.

### Migration Script

Create script to convert existing interactiveElements to blocks format, preserving all configuration and maintaining order.

### Deprecated Block Cleanup

Remove deprecated interactive block types from the system:
1. Delete component files: DesignFixerComponent.tsx, PlayerTypeSimulator.tsx, RewardScheduleDesigner.tsx, FlowChannelEvaluator.tsx, ROEDashboard.tsx
2. Remove from BlockType enum and type definitions
3. Remove from BlockLibrary metadata
4. Remove configuration modals
5. Update InteractiveElementRouter to handle deprecated types gracefully
6. Display warning for existing courses with deprecated blocks
7. Allow deletion of deprecated blocks through standard delete operation

## Accessibility

### WCAG 2.1 AA Compliance

- Keyboard navigation for all interactive elements
- ARIA labels and live regions
- Semantic HTML structure
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators on all interactive elements
- Required alt text for all images
- Form fields with proper labels and descriptions

## Future Enhancements

1. Block Templates - Pre-configured combinations and custom templates
2. Version History - Track changes and restore previous versions
3. Collaboration - Real-time multi-user editing
4. Advanced Blocks - Embed, table, accordion, tab blocks
5. AI Assistance - Content suggestions and auto-generation
6. Analytics - Block engagement metrics and completion rates

## Conclusion

This design provides a comprehensive blueprint for implementing the Admin Course Builder V2. The architecture maintains backward compatibility while introducing a modern interface for course creation. The modular component structure allows for incremental development and easy extension with new block types.
