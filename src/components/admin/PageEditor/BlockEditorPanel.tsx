import React, { useMemo } from 'react';
import { IBlock } from '@/types/page';
import { validateBlock, BlockValidationResult } from '@/utils/blockValidation';
import {
    TextBlockEditor,
    VideoBlockEditor,
    ImageBlockEditor,
    CodeBlockEditor,
    ListBlockEditor,
    DividerBlockEditor,
    ReflectionBlockEditor,
    PollBlockEditor,
    WordCloudBlockEditor,
    AIGeneratorBlockEditor,
    InteractiveBlockEditor,
} from './BlockEditors';

interface BlockEditorPanelProps {
    block: IBlock | null;
    onBlockChange: (blockId: string, content: Partial<IBlock['content']>) => void;
    onClose: () => void;
    courseContext?: {
        courseId?: string;
        courseTitle?: string;
        moduleId?: string;
        moduleName?: string;
        lessonId?: string;
        lessonName?: string;
        learningObjectives?: string[];
    };
    existingBlocks?: IBlock[];
}

const BlockEditorPanel: React.FC<BlockEditorPanelProps> = ({
    block,
    onBlockChange,
    onClose,
    courseContext,
    existingBlocks
}) => {
    // Validate block content
    const validationResult: BlockValidationResult | null = useMemo(() => {
        if (!block) return null;
        return validateBlock(block);
    }, [block]);

    if (!block) {
        return (
            <div className="block-editor-panel empty">
                <div className="empty-state">
                    <span className="empty-icon">✏️</span>
                    <h3>No block selected</h3>
                    <p>Select a block from the canvas to edit its content</p>
                </div>
            </div>
        );
    }

    const handleChange = (content: Partial<IBlock['content']>) => {
        onBlockChange(block.id, content);
    };

    const renderEditor = () => {
        switch (block.type) {
            case 'text':
                return (
                    <TextBlockEditor
                        block={block}
                        onChange={handleChange}
                        courseContext={courseContext}
                        existingBlocks={existingBlocks}
                    />
                );

            case 'video':
                return (
                    <VideoBlockEditor
                        block={block}
                        onChange={handleChange}
                        courseContext={courseContext}
                    />
                );

            case 'image':
                return (
                    <ImageBlockEditor
                        block={block}
                        onChange={handleChange}
                        courseContext={courseContext}
                        existingBlocks={existingBlocks}
                    />
                );

            case 'code':
                return (
                    <CodeBlockEditor
                        block={block}
                        onChange={handleChange}
                        courseContext={courseContext}
                        existingBlocks={existingBlocks}
                    />
                );

            case 'list':
                return <ListBlockEditor block={block} onChange={handleChange} />;

            case 'divider':
                return <DividerBlockEditor block={block} onChange={handleChange} />;

            case 'reflection':
                return (
                    <ReflectionBlockEditor
                        block={block}
                        onChange={handleChange}
                        courseContext={courseContext}
                        existingBlocks={existingBlocks}
                    />
                );

            case 'poll':
                return <PollBlockEditor block={block} onChange={handleChange} />;

            case 'wordCloud':
                return <WordCloudBlockEditor block={block} onChange={handleChange} />;

            case 'aiGenerator':
                return <AIGeneratorBlockEditor block={block} onChange={handleChange} />;

            // All other interactive blocks use the generic editor
            case 'choiceComparison':
            case 'certificateGenerator':
            case 'finalAssessment':
            case 'playerTypeSimulator':
            case 'rewardScheduleDesigner':
            case 'flowChannelEvaluator':
            case 'pitchAnalysisGenerator':
            case 'narrativeGenerator':
            case 'darkPatternRedesigner':
            case 'roeDashboard':
            case 'designFixer':
            case 'journeyTimeline':
            case 'simulation':
            case 'aiJourney':
            case 'buildABot':
            case 'conceptMap':
            case 'dataDashboard':
            case 'ethicalDilemmaSolver':
            case 'gamificationConceptMap':
            case 'identifyPersonalization':
            case 'playerTypeAnalyzer':
            case 'presentationCoach':
            case 'sentenceBuilder':
            case 'visualTokens':
                return <InteractiveBlockEditor block={block} onChange={handleChange} />;

            default:
                return (
                    <div className="unsupported-block">
                        <p>Editor not available for block type: {block.type}</p>
                    </div>
                );
        }
    };

    return (
        <div className="block-editor-panel">
            <div className="block-editor-header">
                <div className="block-info">
                    <span className="block-type-badge">{block.type}</span>
                    <span className="block-id">ID: {block.id.substring(0, 8)}...</span>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="btn-close"
                    title="Close editor"
                >
                    ✕
                </button>
            </div>
            {validationResult && !validationResult.isValid && (
                <div className="block-validation-errors">
                    <div className="validation-header">
                        <span className="validation-icon">⚠</span>
                        <strong>Validation Errors</strong>
                    </div>
                    <ul className="validation-error-list">
                        {validationResult.errors.map((error, index) => (
                            <li key={index}>
                                <strong>{error.field}:</strong> {error.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="block-editor-content">
                {renderEditor()}
            </div>
        </div>
    );
};

export default BlockEditorPanel;
