import React, { useRef, useEffect, useState } from 'react';
import { IBlock } from '@/types/page';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContext, CourseContextBuilder } from '@/services/courseContextBuilder';
import './BlockEditors.css';

interface TextBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
    courseContext?: CourseContext;
    existingBlocks?: IBlock[];
}

const TextBlockEditor: React.FC<TextBlockEditorProps> = ({
    block,
    onChange,
    courseContext,
    existingBlocks
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showAIAssistant, setShowAIAssistant] = useState(true);

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

    /**
     * Build course context for AI generation
     * Uses provided context or creates a minimal context
     */
    const buildCourseContext = (): CourseContext => {
        if (courseContext) {
            // Use provided context and add existing blocks
            return {
                ...courseContext,
                existingBlocks: existingBlocks || courseContext.existingBlocks
            };
        }

        // Create minimal context if none provided
        return CourseContextBuilder.buildContext({
            existingBlocks: existingBlocks
        });
    };

    /**
     * Handle AI-generated content
     * Inserts the generated text into the editor with proper formatting
     */
    const handleContentGenerated = (content: any) => {
        if (!editorRef.current) return;

        // Handle different content formats
        let htmlContent = '';

        if (typeof content === 'string') {
            // If content is plain text, convert newlines to paragraphs
            htmlContent = content
                .split('\n\n')
                .filter(para => para.trim())
                .map(para => `<p>${para.trim()}</p>`)
                .join('');
        } else if (content.text) {
            // If content has a text property, use it
            htmlContent = content.text;
        } else if (content.html) {
            // If content has HTML property, use it directly
            htmlContent = content.html;
        } else {
            // Fallback: stringify the content
            htmlContent = `<p>${JSON.stringify(content)}</p>`;
        }

        // Insert content into editor
        editorRef.current.innerHTML = htmlContent;

        // Trigger onChange to save the content
        onChange({ text: htmlContent });

        // Focus the editor
        editorRef.current.focus();
    };

    console.log('[TextBlockEditor] Rendering, showAIAssistant:', showAIAssistant);
    console.log('[TextBlockEditor] courseContext:', courseContext);
    console.log('[TextBlockEditor] Built context:', buildCourseContext());

    return (
        <div className="text-block-editor">
            {/* AI Content Assistant Panel */}
            <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px' }}>
                <strong>Debug:</strong> showAIAssistant = {showAIAssistant ? 'TRUE' : 'FALSE'}
            </div>
            {showAIAssistant && (
                <div className="ai-assistant-wrapper" style={{ marginBottom: '1rem', border: '2px solid red', padding: '10px' }}>
                    <div style={{ background: 'yellow', padding: '5px', marginBottom: '5px' }}>
                        AI Assistant Panel Should Be Here
                    </div>
                    <AIAssistantPanel
                        blockType="text"
                        courseContext={buildCourseContext()}
                        onContentGenerated={handleContentGenerated}
                        currentContent={block.content.text}
                        placeholder="Describe the text content you want to generate (e.g., 'Explain the concept of machine learning in simple terms' or 'Write an introduction to this lesson')"
                    />
                </div>
            )}

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
