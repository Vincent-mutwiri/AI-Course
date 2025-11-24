import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

    const editor = useEditor({
        extensions: [StarterKit],
        content: initialData?.content?.text || '',
        onUpdate: ({ editor }) => {
            setValue('content.text', editor.getHTML(), { shouldValidate: true });
        },
    });

    useEffect(() => {
        if (editor && initialData?.content?.text) {
            editor.commands.setContent(initialData.content.text);
        }
    }, [editor, initialData]);

    const onSubmit = (data: TextBlock) => {
        onSave(data);
        onClose();
    };

    const toggleBold = () => editor?.chain().focus().toggleBold().run();
    const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
    const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
    const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
    const setHeading = (level: 1 | 2 | 3) =>
        editor?.chain().focus().toggleHeading({ level }).run();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Text Block' : 'Add Text Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="text-editor">Content</Label>

                        {/* Toolbar */}
                        <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setHeading(1)}
                                className={cn(
                                    editor?.isActive('heading', { level: 1 }) && 'bg-accent'
                                )}
                                title="Heading 1"
                            >
                                <Heading1 className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setHeading(2)}
                                className={cn(
                                    editor?.isActive('heading', { level: 2 }) && 'bg-accent'
                                )}
                                title="Heading 2"
                            >
                                <Heading2 className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setHeading(3)}
                                className={cn(
                                    editor?.isActive('heading', { level: 3 }) && 'bg-accent'
                                )}
                                title="Heading 3"
                            >
                                <Heading3 className="h-4 w-4" />
                            </Button>
                            <div className="w-px h-6 bg-border mx-1" />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={toggleBold}
                                className={cn(editor?.isActive('bold') && 'bg-accent')}
                                title="Bold"
                            >
                                <Bold className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={toggleItalic}
                                className={cn(editor?.isActive('italic') && 'bg-accent')}
                                title="Italic"
                            >
                                <Italic className="h-4 w-4" />
                            </Button>
                            <div className="w-px h-6 bg-border mx-1" />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={toggleBulletList}
                                className={cn(editor?.isActive('bulletList') && 'bg-accent')}
                                title="Bullet List"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={toggleOrderedList}
                                className={cn(editor?.isActive('orderedList') && 'bg-accent')}
                                title="Numbered List"
                            >
                                <ListOrdered className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Editor */}
                        <div className="border rounded-md min-h-[300px] p-4 prose prose-sm max-w-none focus-within:ring-2 focus-within:ring-ring">
                            <EditorContent editor={editor} />
                        </div>

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
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
