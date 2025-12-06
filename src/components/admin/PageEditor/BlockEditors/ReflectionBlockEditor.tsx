import React, { useState } from 'react';
import { IBlock } from '@/types/page';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContext, CourseContextBuilder } from '@/services/courseContextBuilder';

interface ReflectionBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
    courseContext?: CourseContext;
    existingBlocks?: IBlock[];
}

const ReflectionBlockEditor: React.FC<ReflectionBlockEditorProps> = ({
    block,
    onChange,
    courseContext,
    existingBlocks
}) => {
    const [showAIAssistant, setShowAIAssistant] = useState(true);
    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ question: e.target.value });
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ prompt: e.target.value });
    };

    const handleMinLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        onChange({
            config: {
                ...block.content.config,
                minLength: isNaN(value) ? 0 : value
            }
        });
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
     * Handle AI-generated content for reflection prompts
     * The AI can generate multiple prompt options, a single prompt, or structured content
     */
    const handleContentGenerated = (content: any) => {
        // Handle different content formats from AI
        if (typeof content === 'string') {
            // Single prompt string - use as prompt
            onChange({ prompt: content });

            // Auto-populate suggested minimum length based on prompt complexity
            const suggestedLength = estimateMinLength(content);
            onChange({
                config: {
                    ...block.content.config,
                    minLength: suggestedLength
                }
            });
        } else if (Array.isArray(content)) {
            // Multiple prompt options - use the first one
            // In a future enhancement, we could show a selector for multiple options
            if (content.length > 0) {
                const firstPrompt = typeof content[0] === 'string' ? content[0] : content[0].prompt || content[0].text;
                onChange({ prompt: firstPrompt });

                const suggestedLength = estimateMinLength(firstPrompt);
                onChange({
                    config: {
                        ...block.content.config,
                        minLength: suggestedLength
                    }
                });
            }
        } else if (content.prompt || content.question) {
            // Structured content with prompt/question field
            const promptText = content.prompt || content.question;
            onChange({ prompt: promptText });

            // Use provided minLength if available, otherwise estimate
            const suggestedLength = content.minLength || estimateMinLength(promptText);
            onChange({
                config: {
                    ...block.content.config,
                    minLength: suggestedLength
                }
            });

            // If there's a question field separate from prompt, use it
            if (content.question && content.prompt) {
                onChange({ question: content.question });
            }
        } else if (content.text) {
            // Generic text content
            onChange({ prompt: content.text });

            const suggestedLength = estimateMinLength(content.text);
            onChange({
                config: {
                    ...block.content.config,
                    minLength: suggestedLength
                }
            });
        }
    };

    /**
     * Estimate appropriate minimum response length based on prompt complexity
     * Returns suggested character count
     */
    const estimateMinLength = (prompt: string): number => {
        if (!prompt) return 100;

        const promptLength = prompt.length;

        // Simple heuristic: longer/more complex prompts warrant longer responses
        if (promptLength < 50) {
            return 100; // Brief prompt = brief response
        } else if (promptLength < 150) {
            return 200; // Medium prompt = medium response
        } else {
            return 300; // Complex prompt = detailed response
        }
    };

    return (
        <div className="reflection-block-editor">
            {/* AI Content Assistant Panel */}
            {showAIAssistant && (
                <div className="ai-assistant-wrapper" style={{ marginBottom: '1rem' }}>
                    <AIAssistantPanel
                        blockType="reflection"
                        courseContext={buildCourseContext()}
                        onContentGenerated={handleContentGenerated}
                        currentContent={block.content.prompt}
                        placeholder="Describe the reflection prompt you want to generate (e.g., 'Create a prompt about applying this concept to real-world scenarios' or 'Generate a self-assessment question about learning progress')"
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
                    placeholder="Enter reflection question"
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="prompt">Prompt</label>
                <textarea
                    id="prompt"
                    value={block.content.prompt || ''}
                    onChange={handlePromptChange}
                    placeholder="Enter guidance or instructions for the reflection"
                    className="form-control"
                    rows={3}
                />
            </div>

            <div className="form-group">
                <label htmlFor="minLength">Minimum Length (characters)</label>
                <input
                    type="number"
                    id="minLength"
                    value={block.content.config?.minLength || 0}
                    onChange={handleMinLengthChange}
                    placeholder="0"
                    min="0"
                    className="form-control"
                />
            </div>
        </div>
    );
};

export default ReflectionBlockEditor;
