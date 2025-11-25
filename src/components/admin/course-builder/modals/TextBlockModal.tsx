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
import { textBlockSchema, type TextBlock } from '@/lib/validation/blockSchemas';

// Lazy load the rich text editor for better performance
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
            <DialogContent
                className="max-w-3xl max-h-[90vh] overflow-y-auto"
                aria-describedby="text-block-description"
            >
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Text Block' : 'Add Text Block'}
                    </DialogTitle>
                    <p id="text-block-description" className="text-sm text-muted-foreground">
                        Create rich text content with formatting, headings, lists, and more
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="text-editor" className="text-sm font-medium">
                            Content <span className="text-destructive" aria-label="required">*</span>
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Use the editor toolbar to format your text, add headings, lists, links, and more (max 50,000 characters)
                        </p>

                        {/* Lazy-loaded Rich Text Editor */}
                        <Suspense
                            fallback={
                                <div
                                    className="border rounded-md min-h-[300px] p-4 flex items-center justify-center"
                                    role="status"
                                    aria-live="polite"
                                >
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" aria-hidden="true"></div>
                                        <span className="text-sm">Loading editor...</span>
                                    </div>
                                </div>
                            }
                        >
                            <RichTextEditor
                                content={textContent || ''}
                                onChange={handleEditorChange}
                            />
                        </Suspense>

                        {errors.content?.text && (
                            <p
                                className="text-sm text-destructive flex items-center gap-1"
                                role="alert"
                                aria-live="assertive"
                            >
                                <span className="inline-block">⚠️</span>
                                {errors.content.text.message}
                            </p>
                        )}
                    </div>

                    <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                        <strong>💡 Tip:</strong> Break up long text blocks with headings, bullet points, and formatting
                        to improve readability. Consider adding images or videos between text sections for visual variety.
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            aria-label="Cancel and close dialog"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            aria-label={isSubmitting ? 'Saving text block' : 'Save text block'}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
