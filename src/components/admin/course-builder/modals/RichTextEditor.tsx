import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
}

/**
 * RichTextEditor Component
 * Lazy-loaded TipTap editor for better performance
 */
export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [editor, content]);

    const toggleBold = () => editor?.chain().focus().toggleBold().run();
    const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
    const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
    const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
    const setHeading = (level: 1 | 2 | 3) =>
        editor?.chain().focus().toggleHeading({ level }).run();

    return (
        <div className="border rounded-md">
            {/* Toolbar */}
            <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
                <button
                    type="button"
                    onClick={() => setHeading(1)}
                    className={cn(
                        'p-2 rounded hover:bg-accent transition-colors',
                        editor?.isActive('heading', { level: 1 }) && 'bg-accent'
                    )}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => setHeading(2)}
                    className={cn(
                        'p-2 rounded hover:bg-accent transition-colors',
                        editor?.isActive('heading', { level: 2 }) && 'bg-accent'
                    )}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => setHeading(3)}
                    className={cn(
                        'p-2 rounded hover:bg-accent transition-colors',
                        editor?.isActive('heading', { level: 3 }) && 'bg-accent'
                    )}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </button>
                <div className="w-px bg-border mx-1" />
                <button
                    type="button"
                    onClick={toggleBold}
                    className={cn(
                        'p-2 rounded hover:bg-accent transition-colors',
                        editor?.isActive('bold') && 'bg-accent'
                    )}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={toggleItalic}
                    className={cn(
                        'p-2 rounded hover:bg-accent transition-colors',
                        editor?.isActive('italic') && 'bg-accent'
                    )}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </button>
                <div className="w-px bg-border mx-1" />
                <button
                    type="button"
                    onClick={toggleBulletList}
                    className={cn(
                        'p-2 rounded hover:bg-accent transition-colors',
                        editor?.isActive('bulletList') && 'bg-accent'
                    )}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={toggleOrderedList}
                    className={cn(
                        'p-2 rounded hover:bg-accent transition-colors',
                        editor?.isActive('orderedList') && 'bg-accent'
                    )}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </button>
            </div>

            {/* Editor Content */}
            <div className="prose prose-sm max-w-none p-4 min-h-[200px] focus-within:outline-none">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
