import React, { useState } from 'react';
import { IBlock } from '@/types/page';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContext, CourseContextBuilder } from '@/services/courseContextBuilder';

interface PollBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
    courseContext?: CourseContext;
    existingBlocks?: IBlock[];
}

const PollBlockEditor: React.FC<PollBlockEditorProps> = ({
    block,
    onChange,
    courseContext,
    existingBlocks
}) => {
    const options = block.content.options || [];
    const [showAIAssistant, setShowAIAssistant] = useState(true);

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ question: e.target.value });
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        onChange({ options: newOptions });
    };

    const handleAddOption = () => {
        const newOptions = [...options, ''];
        onChange({ options: newOptions });
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = options.filter((_: any, i: number) => i !== index);
        onChange({ options: newOptions });
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
     * Populates the poll question and options from generated content
     */
    const handleContentGenerated = (content: any) => {
        // Handle different content formats
        let question = '';
        let generatedOptions: string[] = [];
        let discussionQuestions: string[] = [];

        if (typeof content === 'string') {
            // If content is a plain string, try to parse it
            try {
                const parsed = JSON.parse(content);
                question = parsed.question || '';
                generatedOptions = parsed.options || [];
                discussionQuestions = parsed.discussionQuestions || [];
            } catch {
                // If parsing fails, treat as question text
                question = content;
            }
        } else if (content.question) {
            // If content has structured poll data
            question = content.question;
            generatedOptions = content.options || [];
            discussionQuestions = content.discussionQuestions || [];
        }

        // Update the block content
        const updates: Partial<IBlock['content']> = {};

        if (question) {
            updates.question = question;
        }

        if (generatedOptions.length > 0) {
            updates.options = generatedOptions;
        }

        // Store discussion questions in metadata if available
        if (discussionQuestions.length > 0) {
            updates.meta = {
                ...block.content.meta,
                discussionQuestions
            };
        }

        onChange(updates);
    };

    return (
        <div className="poll-block-editor">
            {/* AI Content Assistant Panel */}
            {showAIAssistant && (
                <div className="ai-assistant-wrapper" style={{ marginBottom: '1rem' }}>
                    <AIAssistantPanel
                        blockType="poll"
                        courseContext={buildCourseContext()}
                        onContentGenerated={handleContentGenerated}
                        currentContent={{
                            question: block.content.question,
                            options: block.content.options
                        }}
                        placeholder="Describe the poll question you want to generate (e.g., 'Create a poll about preferred learning styles' or 'Ask students about their experience with gamification')"
                    />
                </div>
            )}

            <div className="form-group">
                <label htmlFor="question">Question</label>
                <input
                    type="text"
                    id="question"
                    value={block.content.question || ''}
                    onChange={handleQuestionChange}
                    placeholder="Enter poll question"
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label>Options</label>
                <div className="options-list">
                    {options.map((option: string, index: number) => (
                        <div key={index} className="option-item">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="form-control"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveOption(index)}
                                className="btn-remove"
                                title="Remove option"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={handleAddOption}
                    className="btn-add"
                >
                    + Add Option
                </button>
            </div>

            {/* Display generated discussion questions if available */}
            {block.content.meta?.discussionQuestions && Array.isArray(block.content.meta.discussionQuestions) && block.content.meta.discussionQuestions.length > 0 && (
                <div className="form-group">
                    <label>Generated Discussion Questions</label>
                    <div className="discussion-questions-list" style={{
                        padding: '0.75rem',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        border: '1px solid #dee2e6'
                    }}>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#6c757d',
                            marginBottom: '0.5rem'
                        }}>
                            Use these questions to facilitate discussion after the poll:
                        </p>
                        <ul style={{
                            marginBottom: 0,
                            paddingLeft: '1.5rem',
                            fontSize: '0.875rem'
                        }}>
                            {block.content.meta.discussionQuestions.map((question: string, index: number) => (
                                <li key={index} style={{ marginBottom: '0.25rem' }}>
                                    {question}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PollBlockEditor;
