# Task 21 Implementation: Image Alt Text Generation

## Overview
Implemented AI-powered alt text and caption generation for image blocks in the Admin Course Builder, ensuring WCAG 2.1 AA accessibility compliance.

## Changes Made

### Frontend Changes

#### 1. ImageBlockEditor Component (`src/components/admin/PageEditor/BlockEditors/ImageBlockEditor.tsx`)
- **Added AI Assistant Integration**: Integrated AIAssistantPanel component for generating alt text and captions
- **New Props**: Added `courseContext` and `existingBlocks` props to receive context information
- **Generate Alt Text Button**: Added a toggle button that shows/hides the AI assistant panel (only visible when an image is uploaded)
- **Context Building**: Implemented `buildCourseContext()` to construct course context for AI generation
- **Surrounding Text Extraction**: Implemented `getSurroundingText()` to extract text from nearby blocks for better context
- **Content Handler**: Implemented `handleContentGenerated()` to populate alt text (max 125 chars) and caption fields
- **Enhanced UI**: Added character counter for alt text field and helpful descriptions for both fields

#### 2. BlockEditorPanel Component (`src/components/admin/PageEditor/BlockEditorPanel.tsx`)
- **Updated Props**: Modified ImageBlockEditor instantiation to pass `courseContext` and `existingBlocks` props

### Backend Changes

#### 1. AI Service (`server/src/services/aiService.ts`)
- **Image-Specific Variables**: Enhanced `generateBlockContent()` to handle image block type with special variables:
  - `surroundingText`: Extracted from existing text blocks in the lesson
  - `purpose`: Derived from the user's prompt describing the image
- **New Helper Function**: Added `extractSurroundingText()` to extract and clean text from existing blocks (max 500 chars)

#### 2. AI Content Prompts (`server/src/config/aiContentPrompts.ts`)
- **Existing Template**: Verified the `imageAltTextPrompts.generate` template is properly configured with:
  - Alt text generation (under 125 characters, WCAG 2.1 AA compliant)
  - Caption generation (1-2 sentences with additional context)
  - Proper formatting instructions

## Features Implemented

### 1. Generate Alt Text Button
- Appears only when an image URL is present
- Toggles the AI Assistant panel
- Uses Sparkles icon for visual consistency with other AI features

### 2. AI Assistant Panel for Images
- Configured with `blockType="image"`
- Receives course context including lesson topic and surrounding content
- Custom placeholder text guides users on what to describe
- Passes current image data (URL, existing alt text, caption, surrounding text)

### 3. Context-Aware Generation
- Analyzes surrounding text blocks to understand lesson context
- Uses lesson topic and learning objectives
- Considers existing content to generate relevant descriptions

### 4. Alt Text Validation
- Enforces 125-character limit (WCAG guideline)
- Shows character counter in real-time
- Automatically truncates AI-generated text if needed

### 5. Accessibility Compliance
- Follows WCAG 2.1 AA guidelines
- Omits redundant phrases like "image of" or "picture of"
- Provides meaningful descriptions in lesson context
- Separates alt text (essential info) from caption (additional context)

## User Workflow

1. Admin uploads or enters an image URL
2. "Generate Alt Text" button appears
3. Admin clicks button to show AI Assistant panel
4. Admin describes the image purpose in the prompt field
5. AI generates both alt text (concise) and caption (detailed)
6. Admin reviews and can refine the generated content
7. Admin accepts the content, which populates both fields
8. Admin can manually edit if needed

## Technical Details

### API Integration
- Uses existing `/api/ai/generate-content` endpoint
- Block type: `image`
- Prompt: User's description of image purpose
- Context: Course/module/lesson info + surrounding text
- Response: Structured object with `altText` and `caption` properties

### Content Parsing
- Backend `parseImageContent()` function extracts:
  - Alt Text from "Alt Text: ..." pattern
  - Caption from "Caption: ..." pattern
- Frontend `handleContentGenerated()` handles multiple response formats:
  - Structured object with altText/caption properties
  - Plain string (used as alt text)
  - Fallback for unexpected formats

### Caching
- Generated alt text is cached using existing aiContentCache
- Cache key includes block type, prompt, context, and options
- 7-day retention with LRU eviction

## Requirements Satisfied

✅ **12.1**: Generate Alt Text button added to ImageBlockEditor
✅ **12.2**: Analyzes surrounding text and lesson topic for context
✅ **12.3**: Generates descriptive alt text under 125 characters
✅ **12.4**: Generates caption text with additional context
✅ **12.5**: Implements onContentGenerated to populate fields

## Testing Recommendations

1. **Manual Testing**:
   - Upload an image in a lesson with existing text blocks
   - Click "Generate Alt Text" button
   - Enter a description of the image
   - Verify alt text is under 125 characters
   - Verify caption provides additional context
   - Test refinement options (make shorter, longer, etc.)

2. **Edge Cases**:
   - Image in lesson with no surrounding text
   - Very long AI-generated alt text (should truncate)
   - Empty or minimal prompt
   - Network errors during generation

3. **Accessibility Testing**:
   - Verify alt text follows WCAG 2.1 AA guidelines
   - Test with screen reader
   - Verify no redundant phrases like "image of"

## Future Enhancements

1. **Image Analysis**: Integrate actual image analysis (OCR, object detection) to auto-suggest descriptions
2. **Alt Text Templates**: Pre-configured templates for common image types (diagrams, charts, screenshots)
3. **Bulk Generation**: Generate alt text for multiple images at once
4. **Quality Scoring**: Provide feedback on alt text quality and accessibility compliance
5. **Multi-language Support**: Generate alt text in different languages

## Files Modified

- `src/components/admin/PageEditor/BlockEditors/ImageBlockEditor.tsx`
- `src/components/admin/PageEditor/BlockEditorPanel.tsx`
- `server/src/services/aiService.ts`

## Files Verified (No Changes Needed)

- `server/src/config/aiContentPrompts.ts` (template already exists)
- `src/components/admin/AIAssistantPanel.tsx` (works with image block type)
- `server/src/routes/aiContent.ts` (handles all block types)
