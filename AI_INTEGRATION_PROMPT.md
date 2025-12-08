# AI Integration Prompt for Course Builder Modals

Use this prompt to have an AI assistant add AI content generation to the remaining Course Builder modals.

---

## Prompt for AI Assistant

I need you to add AI content generation capabilities to the Course Builder modals in my React/TypeScript application. I've already successfully integrated the AIAssistantPanel into the TextBlockModal, and I need you to follow the same pattern for the remaining modals.

### Context

**What's Already Done:**
- `TextBlockModal.tsx` has been updated with AI integration
- `AIAssistantPanel` component exists at `src/components/admin/AIAssistantPanel.tsx`
- Backend validation has been relaxed to only require `courseId` in context
- The AI panel is expanded by default and works correctly

**Reference Implementation:**
Look at `src/components/admin/course-builder/modals/TextBlockModal.tsx` to see the working implementation.

### Your Task

Add the AIAssistantPanel to these modal files in priority order:

**High Priority:**
1. `src/components/admin/course-builder/modals/VideoBlockModal.tsx`
2. `src/components/admin/course-builder/modals/CodeBlockModal.tsx`
3. `src/components/admin/course-builder/modals/ReflectionBlockModal.tsx`
4. `src/components/admin/course-builder/modals/PollBlockModal.tsx`
5. `src/components/admin/course-builder/modals/ListBlockModal.tsx`

**Medium Priority:**
6. `src/components/admin/course-builder/modals/ImageBlockModal.tsx`

### Implementation Pattern

For each modal, follow these exact steps:

#### Step 1: Add Imports
At the top of the file, add:
```typescript
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
```

#### Step 2: Add AI Panel to Form
Inside the `<form>` element, add the AI panel BEFORE the existing form fields:

```typescript
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
    {/* AI Content Assistant */}
    <div className="mb-4">
        <AIAssistantPanel
            blockType="[BLOCK_TYPE]"
            courseContext={{
                courseId: 'course-builder',
                courseTitle: 'Course Content',
            }}
            onContentGenerated={(content) => {
                // Handle content - see specific instructions below
            }}
            currentContent={watch('[PRIMARY_FIELD]')}
            placeholder="[CUSTOM_PLACEHOLDER]"
        />
    </div>

    {/* Existing form fields below */}
    ...
</form>
```

#### Step 3: Configure Per Modal Type

**For VideoBlockModal:**
```typescript
blockType="video"
onContentGenerated={(content) => {
    // Video content can have title, description, and script
    if (content.title) {
        setValue('content.title', content.title);
    }
    if (content.description || content.text) {
        setValue('content.description', content.description || content.text);
    }
    // If there's a transcript/script field, populate it
    if (content.script && watch('content.transcript')) {
        setValue('content.transcript', content.script);
    }
}}
currentContent={watch('content.description')}
placeholder="Describe the video content you want to generate (e.g., 'Create a video script about React hooks' or 'Write a video description for a Python tutorial')"
```

**For CodeBlockModal:**
```typescript
blockType="code"
onContentGenerated={(content) => {
    // Code content has code, language, and optional title/explanation
    if (content.code) {
        setValue('content.code', content.code);
    }
    if (content.language) {
        setValue('content.language', content.language);
    }
    if (content.title || content.explanation) {
        setValue('content.title', content.title || content.explanation || '');
    }
}}
currentContent={watch('content.code')}
placeholder="Describe the code example you want to generate (e.g., 'Create a React component with useState' or 'Write a Python function to sort a list')"
```

**For ReflectionBlockModal:**
```typescript
blockType="reflection"
onContentGenerated={(content) => {
    // Reflection content is typically a question/prompt
    const prompt = typeof content === 'string' 
        ? content 
        : content.question || content.prompt || content.text || '';
    
    if (prompt) {
        setValue('content.question', prompt);
    }
    
    // If there's a minLength field, set a reasonable default
    if (!watch('content.minLength')) {
        setValue('content.minLength', 100);
    }
}}
currentContent={watch('content.question')}
placeholder="Describe the reflection prompt you want to generate (e.g., 'Create a reflection question about learning styles' or 'Write a prompt for students to reflect on their progress')"
```

**For PollBlockModal:**
```typescript
blockType="poll"
onContentGenerated={(content) => {
    // Poll content has a question and options
    if (content.question) {
        setValue('content.question', content.question);
    }
    
    // Handle options array
    if (content.options && Array.isArray(content.options)) {
        // Clear existing options and add new ones
        setValue('content.options', content.options.map((opt: any) => ({
            id: typeof opt === 'string' ? Math.random().toString(36).substr(2, 9) : opt.id,
            text: typeof opt === 'string' ? opt : opt.text || opt.label || '',
        })));
    }
}}
currentContent={watch('content.question')}
placeholder="Describe the poll you want to generate (e.g., 'Create a poll about favorite programming languages' or 'Generate a poll asking about learning preferences')"
```

**For ListBlockModal:**
```typescript
blockType="list"
onContentGenerated={(content) => {
    // List content has items and a type
    let items: string[] = [];
    
    if (Array.isArray(content)) {
        items = content.map(item => typeof item === 'string' ? item : item.text || item.label || '');
    } else if (content.items && Array.isArray(content.items)) {
        items = content.items.map((item: any) => typeof item === 'string' ? item : item.text || '');
    } else if (typeof content === 'string') {
        // Parse string content into list items
        items = content.split('\n').filter(line => line.trim());
    }
    
    if (items.length > 0) {
        setValue('content.items', items.map(text => ({
            text,
            checked: false,
        })));
    }
    
    // Try to detect list type from content
    if (content.listType) {
        setValue('content.listType', content.listType);
    }
}}
currentContent={watch('content.items')?.map((item: any) => item.text).join('\n')}
placeholder="Describe the list you want to generate (e.g., 'Create a checklist for project setup' or 'Generate 5 tips for effective studying')"
```

**For ImageBlockModal:**
```typescript
blockType="image"
onContentGenerated={(content) => {
    // Image content is typically alt text and caption
    if (content.altText || content.alt) {
        setValue('content.altText', content.altText || content.alt);
    }
    if (content.caption || content.description) {
        setValue('content.caption', content.caption || content.description);
    }
}}
currentContent={watch('content.altText')}
placeholder="Describe the image and what alt text you need (e.g., 'Generate alt text for a diagram showing the software development lifecycle')"
```

### Important Notes

1. **Preserve Existing Code**: Don't remove or modify any existing form fields, validation, or functionality. Only ADD the AI panel.

2. **Placement**: Always place the AI panel at the very beginning of the form, before any other form fields.

3. **Error Handling**: The AIAssistantPanel has built-in error handling, so you don't need to add try-catch blocks.

4. **TypeScript**: Ensure all code is properly typed. Use `any` type for the content parameter in `onContentGenerated` if needed.

5. **Form State**: Use `setValue()` from react-hook-form to update form fields, and `watch()` to read current values.

6. **Content Parsing**: The AI might return content in different formats (string, object with properties, arrays). Handle multiple formats gracefully.

7. **Validation**: After setting values with `setValue()`, the form's validation will run automatically.

### Testing Checklist

After implementing each modal, verify:
- [ ] AI panel appears at the top of the modal
- [ ] AI panel is expanded by default
- [ ] Can enter a prompt and click Generate
- [ ] Generated content appears in the preview
- [ ] Accept button populates the form fields correctly
- [ ] Form validation still works
- [ ] Save button works with AI-generated content
- [ ] No TypeScript errors
- [ ] No console errors

### Example Output Format

For each file you modify, provide:

1. **File path**: `src/components/admin/course-builder/modals/[ModalName].tsx`
2. **Changes made**: Brief description
3. **Code diff**: Show the exact changes (imports + AI panel addition)
4. **Testing notes**: Any specific things to test for this modal

### Constraints

- Do NOT modify the backend code
- Do NOT change the AIAssistantPanel component
- Do NOT alter existing form validation logic
- Do NOT remove any existing functionality
- Keep the same code style and formatting as the existing files

### Success Criteria

When you're done:
- All 6 modals should have AI integration
- Each modal should handle content generation appropriately for its block type
- All TypeScript types should be correct
- No breaking changes to existing functionality

### Questions to Consider

Before implementing each modal, ask yourself:
1. What are the main fields this block type needs?
2. What format will the AI return content in?
3. How should I parse and map the AI content to form fields?
4. Are there any special cases or edge cases to handle?

### Start Here

Begin with VideoBlockModal.tsx since it's high priority and similar to TextBlockModal. Then proceed to CodeBlockModal, ReflectionBlockModal, PollBlockModal, ListBlockModal, and finally ImageBlockModal.

For each modal:
1. Read the existing code to understand the form structure
2. Identify the key fields that need to be populated
3. Add the imports
4. Add the AI panel with appropriate configuration
5. Test thoroughly
6. Move to the next modal

Good luck! Follow the pattern from TextBlockModal.tsx exactly, and you'll have all modals AI-enabled in no time.

---

## Additional Context Files

If the AI needs more context, provide these files:
- `src/components/admin/AIAssistantPanel.tsx` - The AI panel component
- `src/components/admin/course-builder/modals/TextBlockModal.tsx` - Reference implementation
- `src/services/courseContextBuilder.ts` - Context builder (though we're using minimal context)
- `server/src/routes/aiContent.ts` - Backend API (for understanding what's expected)

## Expected Timeline

- VideoBlockModal: 10 minutes
- CodeBlockModal: 10 minutes
- ReflectionBlockModal: 10 minutes
- PollBlockModal: 15 minutes (more complex with options)
- ListBlockModal: 15 minutes (array handling)
- ImageBlockModal: 10 minutes

Total: ~70 minutes for all 6 modals

## Final Notes

This is a straightforward pattern-following task. The key is consistency - use the exact same approach for each modal, just adjusting the content handling logic for each block type's specific needs.
