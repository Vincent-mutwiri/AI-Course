import React, { useState } from 'react';
import { IBlock, BlockType } from '@/types/page';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContext, CourseContextBuilder } from '@/services/courseContextBuilder';

interface InteractiveBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
    courseContext?: CourseContext;
    existingBlocks?: IBlock[];
}

// Define field configurations for each interactive block type
const blockFieldConfigs: Record<string, Array<{
    name: keyof IBlock['content'];
    label: string;
    type: 'text' | 'textarea' | 'number' | 'url';
    placeholder?: string;
    required?: boolean;
}>> = {
    choiceComparison: [
        { name: 'title', label: 'Title', type: 'text', placeholder: 'Enter comparison title' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the comparison' },
        { name: 'question', label: 'Question', type: 'text', placeholder: 'What should users compare?' }
    ],
    certificateGenerator: [
        { name: 'title', label: 'Certificate Title', type: 'text', placeholder: 'Enter certificate title', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Certificate description' }
    ],
    finalAssessment: [
        { name: 'title', label: 'Assessment Title', type: 'text', placeholder: 'Enter assessment title', required: true },
        { name: 'description', label: 'Instructions', type: 'textarea', placeholder: 'Assessment instructions' }
    ],
    playerTypeSimulator: [
        { name: 'title', label: 'Simulator Title', type: 'text', placeholder: 'Enter simulator title' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the simulation' },
        { name: 'prompt', label: 'Prompt', type: 'textarea', placeholder: 'Instructions for users' }
    ],
    rewardScheduleDesigner: [
        { name: 'title', label: 'Designer Title', type: 'text', placeholder: 'Enter designer title' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the reward schedule designer' },
        { name: 'prompt', label: 'Instructions', type: 'textarea', placeholder: 'Instructions for users' }
    ],
    flowChannelEvaluator: [
        { name: 'title', label: 'Evaluator Title', type: 'text', placeholder: 'Enter evaluator title' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the flow channel evaluator' },
        { name: 'question', label: 'Question', type: 'text', placeholder: 'What should users evaluate?' }
    ],
    pitchAnalysisGenerator: [
        { name: 'title', label: 'Analysis Title', type: 'text', placeholder: 'Enter analysis title' },
        { name: 'prompt', label: 'Prompt', type: 'textarea', placeholder: 'Instructions for pitch analysis', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Additional context' }
    ],
    narrativeGenerator: [
        { name: 'title', label: 'Generator Title', type: 'text', placeholder: 'Enter generator title' },
        { name: 'prompt', label: 'Prompt', type: 'textarea', placeholder: 'Narrative generation prompt', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Additional context' }
    ],
    darkPatternRedesigner: [
        { name: 'title', label: 'Redesigner Title', type: 'text', placeholder: 'Enter redesigner title' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the dark pattern redesign exercise' }
    ],
    roeDashboard: [
        { name: 'title', label: 'Dashboard Title', type: 'text', placeholder: 'Enter dashboard title', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Dashboard description' }
    ],
    designFixer: [
        { name: 'title', label: 'Design Fixer Title', type: 'text', placeholder: 'Enter title' },
        { name: 'prompt', label: 'Prompt', type: 'textarea', placeholder: 'Instructions for design fixing', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Additional context' }
    ],
    journeyTimeline: [
        { name: 'title', label: 'Timeline Title', type: 'text', placeholder: 'Enter timeline title', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Timeline description' }
    ],
    simulation: [
        { name: 'title', label: 'Simulation Title', type: 'text', placeholder: 'Enter simulation title', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Simulation description' },
        { name: 'prompt', label: 'Instructions', type: 'textarea', placeholder: 'User instructions' }
    ],
    aiJourney: [
        { name: 'title', label: 'Journey Title', type: 'text', placeholder: 'Enter journey title', required: true },
        { name: 'prompt', label: 'Prompt', type: 'textarea', placeholder: 'AI journey prompt', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Journey description' }
    ],
    buildABot: [
        { name: 'title', label: 'Bot Builder Title', type: 'text', placeholder: 'Enter bot builder title', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Bot builder description' },
        { name: 'prompt', label: 'Instructions', type: 'textarea', placeholder: 'Instructions for building the bot' }
    ],
    conceptMap: [
        { name: 'title', label: 'Concept Map Title', type: 'text', placeholder: 'Enter concept map title', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Concept map description' }
    ],
    dataDashboard: [
        { name: 'title', label: 'Dashboard Title', type: 'text', placeholder: 'Enter dashboard title', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Dashboard description' }
    ],
    ethicalDilemmaSolver: [
        { name: 'title', label: 'Dilemma Title', type: 'text', placeholder: 'Enter dilemma title' },
        { name: 'question', label: 'Dilemma Question', type: 'textarea', placeholder: 'Describe the ethical dilemma', required: true },
        { name: 'description', label: 'Context', type: 'textarea', placeholder: 'Additional context' }
    ],
    gamificationConceptMap: [
        { name: 'title', label: 'Concept Map Title', type: 'text', placeholder: 'Enter concept map title', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Concept map description' }
    ],
    identifyPersonalization: [
        { name: 'title', label: 'Exercise Title', type: 'text', placeholder: 'Enter exercise title' },
        { name: 'question', label: 'Question', type: 'text', placeholder: 'What should users identify?' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Exercise description' }
    ],
    playerTypeAnalyzer: [
        { name: 'title', label: 'Analyzer Title', type: 'text', placeholder: 'Enter analyzer title' },
        { name: 'question', label: 'Question', type: 'text', placeholder: 'Analysis question' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Analyzer description' }
    ],
    presentationCoach: [
        { name: 'title', label: 'Coach Title', type: 'text', placeholder: 'Enter coach title' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Coaching description' },
        { name: 'prompt', label: 'Instructions', type: 'textarea', placeholder: 'Coaching instructions' }
    ],
    sentenceBuilder: [
        { name: 'title', label: 'Builder Title', type: 'text', placeholder: 'Enter builder title' },
        { name: 'prompt', label: 'Prompt', type: 'textarea', placeholder: 'Sentence building prompt', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Additional context' }
    ],
    visualTokens: [
        { name: 'title', label: 'Visual Tokens Title', type: 'text', placeholder: 'Enter title' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Visual tokens description' },
        { name: 'prompt', label: 'Instructions', type: 'textarea', placeholder: 'User instructions' }
    ]
};

const InteractiveBlockEditor: React.FC<InteractiveBlockEditorProps> = ({
    block,
    onChange,
    courseContext,
    existingBlocks
}) => {
    const [showAIAssistant, setShowAIAssistant] = useState(true);
    const fields = blockFieldConfigs[block.type] || [];

    const handleFieldChange = (
        fieldName: keyof IBlock['content'],
        value: string
    ) => {
        onChange({ [fieldName]: value });
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
     * Handle AI-generated content for interactive blocks
     * Specifically handles quiz question generation for Final Assessment type
     */
    const handleContentGenerated = (content: any) => {
        // Only apply AI generation for finalAssessment type
        if (block.type !== 'finalAssessment') {
            console.warn('AI generation is currently only supported for finalAssessment interactive blocks');
            return;
        }

        // Handle different content formats from AI
        if (Array.isArray(content)) {
            // Array of questions - parse and populate
            parseAndPopulateQuestions(content);
        } else if (content.questions && Array.isArray(content.questions)) {
            // Structured content with questions array
            parseAndPopulateQuestions(content.questions);
        } else if (content.question || content.text) {
            // Single question - convert to array and parse
            parseAndPopulateQuestions([content]);
        } else if (typeof content === 'string') {
            // Plain text - try to parse as JSON or treat as single question
            try {
                const parsed = JSON.parse(content);
                if (Array.isArray(parsed)) {
                    parseAndPopulateQuestions(parsed);
                } else if (parsed.questions) {
                    parseAndPopulateQuestions(parsed.questions);
                } else {
                    parseAndPopulateQuestions([parsed]);
                }
            } catch {
                // Not JSON, treat as question text
                parseAndPopulateQuestions([{ question: content }]);
            }
        }
    };

    /**
     * Parse and populate quiz questions from AI-generated content
     * Handles multiple question types: multiple choice, true/false, short answer
     */
    const parseAndPopulateQuestions = (questions: any[]) => {
        if (!questions || questions.length === 0) return;

        // Transform questions into the format expected by the config
        const formattedQuestions = questions.map((q, index) => {
            // Extract question text
            const questionText = q.question || q.text || q.prompt || `Question ${index + 1}`;

            // Determine question type
            let questionType = q.type || 'multiple-choice';

            // Auto-detect true/false questions
            if (q.options && Array.isArray(q.options) && q.options.length === 2) {
                const optionTexts = q.options.map((opt: any) =>
                    typeof opt === 'string' ? opt.toLowerCase() : (opt.text || '').toLowerCase()
                );
                if (optionTexts.includes('true') && optionTexts.includes('false')) {
                    questionType = 'true-false';
                }
            }

            // Auto-detect short answer questions (no options provided)
            if (!q.options || (Array.isArray(q.options) && q.options.length === 0)) {
                questionType = 'short-answer';
            }

            // Parse options for multiple choice and true/false
            let options: string[] = [];
            let correctAnswer: string | number = '';

            if (questionType === 'multiple-choice' || questionType === 'true-false') {
                if (q.options && Array.isArray(q.options)) {
                    options = q.options.map((opt: any) =>
                        typeof opt === 'string' ? opt : (opt.text || opt.option || '')
                    );
                }

                // Determine correct answer
                if (typeof q.correctAnswer === 'number') {
                    correctAnswer = q.correctAnswer;
                } else if (typeof q.correctAnswer === 'string') {
                    // Find index of correct answer in options
                    const correctIndex = options.findIndex(opt =>
                        opt.toLowerCase() === q.correctAnswer.toLowerCase()
                    );
                    correctAnswer = correctIndex >= 0 ? correctIndex : q.correctAnswer;
                } else if (q.answer !== undefined) {
                    // Alternative field name
                    if (typeof q.answer === 'number') {
                        correctAnswer = q.answer;
                    } else {
                        const correctIndex = options.findIndex(opt =>
                            opt.toLowerCase() === String(q.answer).toLowerCase()
                        );
                        correctAnswer = correctIndex >= 0 ? correctIndex : q.answer;
                    }
                }
            } else if (questionType === 'short-answer') {
                // For short answer, store the expected answer
                correctAnswer = q.correctAnswer || q.answer || '';
            }

            // Extract explanation
            const explanation = q.explanation || q.rationale || q.feedback || '';

            // Extract difficulty level (for Bloom's taxonomy alignment)
            const difficulty = q.difficulty || q.bloomLevel || 'medium';

            return {
                question: questionText,
                type: questionType,
                options: options,
                correctAnswer: correctAnswer,
                explanation: explanation,
                difficulty: difficulty
            };
        });

        // Update the block's config with the formatted questions
        onChange({
            config: {
                ...block.content.config,
                questions: formattedQuestions
            }
        });

        // If there's a title in the generated content, update it
        if (questions[0]?.title) {
            onChange({ title: questions[0].title });
        }
    };

    const renderField = (field: typeof fields[0]) => {
        const value = (block.content[field.name] as string) || '';

        if (field.type === 'textarea') {
            return (
                <div key={field.name} className="form-group">
                    <label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="required">*</span>}
                    </label>
                    <textarea
                        id={field.name}
                        value={value}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="form-control"
                        rows={4}
                        required={field.required}
                    />
                </div>
            );
        }

        return (
            <div key={field.name} className="form-group">
                <label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="required">*</span>}
                </label>
                <input
                    type={field.type}
                    id={field.name}
                    value={value}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="form-control"
                    required={field.required}
                />
            </div>
        );
    };

    if (fields.length === 0) {
        return (
            <div className="interactive-block-editor">
                <p className="info-message">
                    This interactive block type ({block.type}) has no configurable fields.
                </p>
            </div>
        );
    }

    return (
        <div className="interactive-block-editor">
            {/* AI Content Assistant Panel - Only for Final Assessment */}
            {block.type === 'finalAssessment' && showAIAssistant && (
                <div className="ai-assistant-wrapper" style={{ marginBottom: '1rem' }}>
                    <AIAssistantPanel
                        blockType="finalAssessment"
                        courseContext={buildCourseContext()}
                        onContentGenerated={handleContentGenerated}
                        currentContent={block.content.config?.questions}
                        placeholder="Describe the quiz questions you want to generate (e.g., 'Generate 5 multiple choice questions about machine learning basics with varying difficulty levels' or 'Create 3 true/false questions and 2 short answer questions about data structures')"
                    />
                </div>
            )}

            {fields.map(renderField)}

            <div className="form-group">
                <label>Advanced Configuration (JSON)</label>
                <textarea
                    value={JSON.stringify(block.content.config || {}, null, 2)}
                    onChange={(e) => {
                        try {
                            const config = JSON.parse(e.target.value);
                            onChange({ config });
                        } catch (err) {
                            // Invalid JSON, don't update
                        }
                    }}
                    placeholder="{}"
                    className="form-control config-json"
                    rows={6}
                />
                <small className="help-text">
                    Advanced configuration options in JSON format
                </small>
            </div>
        </div>
    );
};

export default InteractiveBlockEditor;
