import React, { useRef, useEffect } from 'react';
import { IBlock } from '@/types/page';
import './BlockEditors.css';

interface TextBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
}

const TextBlockEditor: React.FC<TextBlockEditorProps> = ({ block, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current && block.content.text) {
            editorRef.current.innerHTML = block.content.text;
        }
    }, [block.id]); // Only update when block changes

    const handleInput = () => {
        if (editorRef.current) {
            onChange({ text: editorRef.current.innerHTML });
        }
    };

    const handleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    };

    return (
        <div className="text-block-editor">
            <div className="editor-toolbar">
                <button
                    type="button"
                    className="format-btn"
                    onClick={() => handleFormat('bold')}
                    title="Bold"
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    className="format-btn"
                    onClick={() => handleFormat('italic')}
                    title="Italic"
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    className="format-btn"
                    onClick={() => handleFormat('underline')}
                    title="Underline"
                >
                    <u>U</u>
                </button>
                <div className="toolbar-divider"></div>
                <button
                    type="button"
                    className="format-btn"
                    onClick={() => handleFormat('formatBlock', 'h1')}
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    type="button"
                    className="format-btn"
                    onClick={() => handleFormat('formatBlock', 'h2')}
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    type="button"
                    className="format-btn"
                    onClick={() => handleFormat('formatBlock', 'h3')}
                    title="Heading 3"
                >
                    H3
                </button>
                <button
                    type="button"
                    className="format-btn"
                    onClick={() => handleFormat('formatBlock', 'p')}
                    title="Paragraph"
                >
                    P
                </button>
                <div className="toolbar-divider"></div>
                <button
                    type="button"
                    className="format-btn"
                    onClick={() => handleFormat('insertUnorderedList')}
                    title="Bullet List"
                >
                    • List
                </button>
                <button
                    type="button"
                    className="format-btn"
                    onClick={() => handleFormat('insertOrderedList')}
                    title="Numbered List"
                >
                    1. List
                </button>
                <div className="toolbar-divider"></div>
                <button
                    type="button"
                    className="format-btn"
                    onClick={() => {
                        const url = prompt('Enter URL:');
                        if (url) handleFormat('createLink', url);
                    }}
                    title="Insert Link"
                >
                    🔗 Link
                </button>
            </div>
            <div
                ref={editorRef}
                className="rich-text-editor"
                contentEditable
                onInput={handleInput}
                onBlur={handleInput}
                suppressContentEditableWarning
            />
        </div>
    );
};

export default TextBlockEditor;
