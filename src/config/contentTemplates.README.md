# Content Templates System

## Overview

The Content Templates System provides pre-configured prompts for common content generation scenarios in the AI Content Assistant. It includes both built-in templates and support for custom user-created templates.

## Features

### Built-in Templates

The system includes 20+ pre-configured templates organized by:

- **Block Type**: text, video, code, reflection, poll, quiz, list
- **Category**: introduction, explanation, practice, assessment, reflection, general

### Template Categories

1. **Introduction Templates**
   - Lesson Introduction
   - Learning Objectives

2. **Explanation Templates**
   - Concept Explanation
   - Concrete Example
   - Tutorial Video Script
   - Basic Code Example

3. **Practice Templates**
   - Activity Instructions
   - Demonstration Script
   - Advanced Code Example
   - Step-by-Step Process
   - Checklist

4. **Assessment Templates**
   - Knowledge Check Poll
   - Formative Assessment
   - Summative Assessment

5. **Reflection Templates**
   - Self-Assessment Prompt
   - Application Reflection
   - Critical Thinking Prompt

6. **General Templates**
   - Lesson Summary
   - Opinion Poll
   - Tips and Best Practices

### Custom Templates

Users can save their own prompts as reusable templates:

- **Save**: Click "Save as Template" button when editing a prompt
- **Manage**: Custom templates appear in the template selector with "(Custom)" label
- **Delete**: Click the trash icon next to custom templates
- **Storage**: Stored in browser localStorage per user

## Usage

### In AIAssistantPanel Component

```typescript
import { getAllTemplatesForBlockType } from '@/config/contentTemplates';

// Get templates for a specific block type
const templates = getAllTemplatesForBlockType('text');

// Templates are automatically loaded based on current block type
```

### Template Selection Flow

1. User opens AI Assistant Panel in a block editor
2. Templates are filtered by block type
3. User selects a template from dropdown
4. Prompt is pre-filled with template text
5. User can customize the prompt before generating
6. User can save customized prompt as new template

### Saving Custom Templates

```typescript
import { saveCustomTemplate } from '@/config/contentTemplates';

const newTemplate = saveCustomTemplate({
  name: 'My Custom Template',
  description: 'Description of when to use this',
  blockTypes: ['text'],
  prompt: 'Your custom prompt text...',
  category: 'general'
});
```

### Deleting Custom Templates

```typescript
import { deleteCustomTemplate } from '@/config/contentTemplates';

deleteCustomTemplate('custom-1234567890');
```

## Template Structure

```typescript
interface ContentTemplate {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Brief description
  blockTypes: BlockType[];       // Compatible block types
  prompt: string;                // Template prompt text
  category?: string;             // Optional category
}
```

## API Functions

### `getTemplatesForBlockType(blockType: BlockType)`
Returns built-in templates for a specific block type.

### `getAllTemplatesForBlockType(blockType: BlockType)`
Returns both built-in and custom templates for a specific block type.

### `getTemplateById(id: string)`
Returns a specific template by ID.

### `getTemplatesByCategory(category: string)`
Returns all templates in a specific category.

### `saveCustomTemplate(template: Omit<ContentTemplate, 'id'>)`
Saves a new custom template to localStorage.

### `getCustomTemplates()`
Returns all custom templates from localStorage.

### `deleteCustomTemplate(id: string)`
Deletes a custom template from localStorage.

## Storage

Custom templates are stored in localStorage under the key `ai_custom_templates`.

**Storage Format:**
```json
[
  {
    "id": "custom-1234567890",
    "name": "My Template",
    "description": "Custom template description",
    "blockTypes": ["text"],
    "prompt": "Custom prompt text...",
    "category": "general"
  }
]
```

## Best Practices

### Creating Templates

1. **Be Specific**: Include clear instructions in the prompt
2. **Use Structure**: Break down complex prompts into bullet points
3. **Add Context**: Explain what the generated content should achieve
4. **Test First**: Generate content with the prompt before saving as template
5. **Name Clearly**: Use descriptive names that indicate purpose

### Template Prompts

Good template prompts should:
- State the objective clearly
- Provide structure (bullet points, sections)
- Include quality criteria
- Specify tone and style
- Give examples when helpful

### Example Template Prompt

```
Create an engaging lesson introduction that:
- Hooks the learner with a relevant scenario or question
- Explains why this topic matters
- Previews what will be covered
- Sets clear expectations
```

## Integration

The Content Templates System integrates with:

1. **AIAssistantPanel**: Template selection and management UI
2. **AI Content Generation**: Prompts used for content generation
3. **Generation History**: Templates can be reused from history
4. **AI Settings**: Default settings apply to template-based generation

## Future Enhancements

Potential improvements:
- Template sharing between users
- Template categories customization
- Template versioning
- Template usage analytics
- Import/export templates
- Template recommendations based on context

## Requirements Satisfied

This implementation satisfies requirements:
- **7.1**: Pre-configured templates for common content types
- **7.2**: Template selection with pre-filled prompts
- **7.3**: Customizable template prompts before generation
- **7.4**: Save custom templates for reuse
- **7.5**: Templates organized by block type and purpose
