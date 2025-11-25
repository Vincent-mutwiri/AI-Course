# Inline Help Integration Guide

This guide shows how to integrate inline help tooltips into the Course Builder components.

## Overview

The `HelpTooltip` component provides contextual help throughout the Course Builder interface. It displays a help icon that shows detailed information when hovered or focused.

## Component Location

```
src/components/admin/course-builder/HelpTooltip.tsx
```

## Basic Usage

### Import the Component

```typescript
import { HelpTooltip, HELP_CONTENT } from '@/components/admin/course-builder/HelpTooltip';
```

### Add to Form Fields

```tsx
<div className="space-y-2">
    <div className="flex items-center gap-2">
        <Label htmlFor="field-name">
            Field Label <span className="text-destructive">*</span>
        </Label>
        <HelpTooltip content={HELP_CONTENT.requiredField} />
    </div>
    <Input id="field-name" {...register('fieldName')} />
    {errors.fieldName && (
        <p className="text-sm text-destructive">{errors.fieldName.message}</p>
    )}
</div>
```

### Add to Section Headers

```tsx
<div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold">Section Title</h3>
    <HelpTooltip 
        content="Explanation of what this section is for and how to use it"
        side="left"
    />
</div>
```

## Example: TextBlockModal with Help Tooltips

```tsx
import React, { lazy, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { HelpTooltip, HELP_CONTENT } from '@/components/admin/course-builder/HelpTooltip';
import { textBlockSchema, type TextBlock } from '@/lib/validation/blockSchemas';

const RichTextEditor = lazy(() => import('./RichTextEditor').then(m => ({ default: m.RichTextEditor })));

interface TextBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: TextBlock) => void;
    initialData?: Partial<TextBlock>;
}

export function TextBlockModal({ open, onClose, onSave, initialData }: TextBlockModalProps) {
    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TextBlock>({
        resolver: zodResolver(textBlockSchema),
        defaultValues: {
            type: 'text',
            content: {
                text: initialData?.content?.text || '',
            },
        },
    });

    const textContent = watch('content.text');

    const onSubmit = (data: TextBlock) => {
        onSave(data);
        onClose();
    };

    const handleEditorChange = (html: string) => {
        setValue('content.text', html, { shouldValidate: true });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Configure Text Block</DialogTitle>
                        <HelpTooltip content={HELP_CONTENT.textBlock} side="left" />
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="text-content">
                                Content <span className="text-destructive">*</span>
                            </Label>
                            <HelpTooltip 
                                content="Use the rich text editor to format your content. Add headings, lists, and links to create engaging text blocks."
                            />
                        </div>
                        
                        <Suspense fallback={
                            <div className="border rounded-md p-4 min-h-[200px] flex items-center justify-center">
                                <div className="text-muted-foreground">Loading editor...</div>
                            </div>
                        }>
                            <RichTextEditor
                                content={textContent}
                                onChange={handleEditorChange}
                                placeholder="Enter your text content here..."
                            />
                        </Suspense>
                        
                        {errors.content?.text && (
                            <p className="text-sm text-destructive">
                                {errors.content.text.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Block'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
```

## Example: ImageBlockModal with Help Tooltips

```tsx
<div className="space-y-2">
    <div className="flex items-center gap-2">
        <Label htmlFor="image-upload">
            Image File <span className="text-destructive">*</span>
        </Label>
        <HelpTooltip content={HELP_CONTENT.imageUpload} />
    </div>
    <FileUpload
        id="image-upload"
        accept="image/jpeg,image/png,image/gif,image/webp"
        maxSize={5 * 1024 * 1024} // 5MB
        onFileSelect={handleFileSelect}
    />
    <p className="text-xs text-muted-foreground">
        Supported formats: JPG, PNG, GIF, WebP (max 5MB)
    </p>
</div>

<div className="space-y-2">
    <div className="flex items-center gap-2">
        <Label htmlFor="alt-text">
            Alt Text <span className="text-destructive">*</span>
        </Label>
        <HelpTooltip content={HELP_CONTENT.altText} />
    </div>
    <Input
        id="alt-text"
        placeholder="Describe the image for screen readers"
        {...register('content.altText')}
    />
    {errors.content?.altText && (
        <p className="text-sm text-destructive">
            {errors.content.altText.message}
        </p>
    )}
</div>
```

## Available Help Content

The `HELP_CONTENT` object provides predefined help text for common scenarios:

### General
- `autoSave` - Auto-save functionality
- `dragAndDrop` - Drag-and-drop instructions

### Block Actions
- `editBlock` - Editing blocks
- `duplicateBlock` - Duplicating blocks
- `deleteBlock` - Deleting blocks
- `previewBlock` - Preview mode

### Basic Block Types
- `textBlock` - Text block usage
- `videoBlock` - Video block usage
- `imageBlock` - Image block usage
- `codeBlock` - Code block usage
- `listBlock` - List block usage
- `dividerBlock` - Divider block usage

### Interactive Block Types
- `reflectionBlock` - Reflection block usage
- `pollBlock` - Poll block usage
- `wordCloudBlock` - Word cloud usage
- `aiGeneratorBlock` - AI generator usage
- And more...

### File Uploads
- `fileUpload` - General file upload
- `imageUpload` - Image upload specifics
- `videoUpload` - Video upload specifics

### Validation
- `requiredField` - Required field explanation
- `minLength` - Minimum length requirements
- `maxLength` - Maximum length requirements
- `urlFormat` - URL format requirements

### Accessibility
- `altText` - Alt text best practices
- `headingStructure` - Heading hierarchy
- `colorContrast` - Color contrast requirements
- `keyboardNavigation` - Keyboard navigation

## Customizing Tooltip Position

The `side` prop controls where the tooltip appears:

```tsx
<HelpTooltip content="Help text" side="top" />    // Default
<HelpTooltip content="Help text" side="right" />
<HelpTooltip content="Help text" side="bottom" />
<HelpTooltip content="Help text" side="left" />
```

## Adding Custom Help Content

For component-specific help that isn't in `HELP_CONTENT`:

```tsx
<HelpTooltip 
    content="This specific field requires a value between 1 and 100. It controls the maximum number of responses allowed."
    side="right"
/>
```

## Best Practices

### When to Add Help Tooltips

✅ **DO add tooltips for:**
- Required fields with specific formats (URLs, emails)
- Fields with validation rules (min/max length)
- Complex or technical fields
- Accessibility-related fields (alt text)
- File upload fields with size/format limits
- Fields that affect student experience

❌ **DON'T add tooltips for:**
- Self-explanatory fields (e.g., "Title")
- Fields with clear inline instructions
- Every single field (avoid tooltip overload)

### Tooltip Content Guidelines

1. **Be Concise** - Keep tooltips under 2-3 sentences
2. **Be Specific** - Provide actionable information
3. **Be Helpful** - Answer "why" and "how"
4. **Use Examples** - Show what good input looks like
5. **Mention Limits** - Include size/length constraints

### Accessibility

The `HelpTooltip` component is fully accessible:
- Keyboard navigable (Tab to focus)
- Screen reader compatible
- ARIA labels included
- Focus indicators visible

### Visual Design

- Help icons appear next to labels
- Consistent muted color
- Hover and focus states
- Smooth transitions
- Readable tooltip text

## Integration Checklist

When adding help tooltips to a modal:

- [ ] Import `HelpTooltip` and `HELP_CONTENT`
- [ ] Add tooltip to modal header (overall help)
- [ ] Add tooltips to required fields
- [ ] Add tooltips to fields with validation rules
- [ ] Add tooltips to file upload fields
- [ ] Add tooltips to accessibility fields
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Verify tooltip positioning
- [ ] Check mobile responsiveness

## Testing

### Manual Testing

1. **Hover Test** - Hover over help icon, tooltip appears
2. **Focus Test** - Tab to help icon, tooltip appears
3. **Position Test** - Tooltip doesn't overflow viewport
4. **Content Test** - Tooltip text is readable and helpful
5. **Mobile Test** - Tooltip works on touch devices

### Accessibility Testing

1. **Screen Reader** - Help icon is announced
2. **Keyboard** - Can navigate to and activate tooltip
3. **Focus Indicator** - Visible focus ring on help icon
4. **ARIA** - Proper ARIA labels and roles

## Examples in Codebase

See these files for implementation examples:
- `src/components/admin/course-builder/HelpTooltip.tsx` - Component definition
- `src/components/admin/course-builder/modals/TextBlockModal.tsx` - Text block example
- `src/components/admin/course-builder/modals/ImageBlockModal.tsx` - Image block example
- `src/components/admin/course-builder/modals/VideoBlockModal.tsx` - Video block example

## Future Enhancements

Potential improvements for the help system:

1. **Contextual Help Panel** - Expandable side panel with detailed help
2. **Interactive Tutorials** - Step-by-step guided tours
3. **Video Tooltips** - Short video clips showing features
4. **Search Help** - Search across all help content
5. **Help Analytics** - Track which help content is most used
6. **Localization** - Multi-language support for help text

---

**Last Updated:** November 2025
**Version:** 1.0
