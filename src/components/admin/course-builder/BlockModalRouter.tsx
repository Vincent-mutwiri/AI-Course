import React from 'react';
import { BlockModalState } from '@/hooks/useBlockModal';

// Import all block modals
import { TextBlockModal } from './modals/TextBlockModal';
import { VideoBlockModal } from './modals/VideoBlockModal';
import { ImageBlockModal } from './modals/ImageBlockModal';
import { CodeBlockModal } from './modals/CodeBlockModal';
import { ListBlockModal } from './modals/ListBlockModal';
import { DividerBlockModal } from './modals/DividerBlockModal';
import { ReflectionBlockModal } from './modals/ReflectionBlockModal';
import { PollBlockModal } from './modals/PollBlockModal';
import { WordCloudBlockModal } from './modals/WordCloudBlockModal';
import { AIGeneratorBlockModal } from './modals/AIGeneratorBlockModal';
import { ChoiceComparisonBlockModal } from './modals/ChoiceComparisonBlockModal';
import { DesignFixerBlockModal } from './modals/DesignFixerBlockModal';
import { PlayerTypeSimulatorBlockModal } from './modals/PlayerTypeSimulatorBlockModal';
import { RewardScheduleDesignerBlockModal } from './modals/RewardScheduleDesignerBlockModal';
import { FlowChannelEvaluatorBlockModal } from './modals/FlowChannelEvaluatorBlockModal';
import { CertificateGeneratorBlockModal } from './modals/CertificateGeneratorBlockModal';
import { FinalAssessmentBlockModal } from './modals/FinalAssessmentBlockModal';
import { PitchAnalysisGeneratorBlockModal } from './modals/PitchAnalysisGeneratorBlockModal';
import { NarrativeGeneratorBlockModal } from './modals/NarrativeGeneratorBlockModal';
import { DarkPatternRedesignerBlockModal } from './modals/DarkPatternRedesignerBlockModal';
import { ROEDashboardBlockModal } from './modals/ROEDashboardBlockModal';
import { JourneyTimelineBlockModal } from './modals/JourneyTimelineBlockModal';

interface BlockModalRouterProps {
    modalState: BlockModalState;
    onClose: () => void;
    onSave: (data: any) => void;
}

/**
 * BlockModalRouter Component
 * 
 * Routes to the appropriate modal component based on the block type.
 * This component acts as a central dispatcher for all block configuration modals.
 * 
 * @param modalState - Current modal state including block type and data
 * @param onClose - Callback to close the modal
 * @param onSave - Callback to save block data
 */
export function BlockModalRouter({ modalState, onClose, onSave }: BlockModalRouterProps) {
    const { isOpen, blockType, blockData } = modalState;

    if (!isOpen || !blockType) {
        return null;
    }

    // Route to appropriate modal based on block type
    switch (blockType) {
        // Basic blocks
        case 'text':
            return (
                <TextBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'video':
            return (
                <VideoBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'image':
            return (
                <ImageBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'code':
            return (
                <CodeBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'list':
            return (
                <ListBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'divider':
            return (
                <DividerBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        // Interactive blocks
        case 'reflection':
            return (
                <ReflectionBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'poll':
            return (
                <PollBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'wordCloud':
            return (
                <WordCloudBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'aiGenerator':
            return (
                <AIGeneratorBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'choiceComparison':
            return (
                <ChoiceComparisonBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'designFixer':
            return (
                <DesignFixerBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'playerTypeSimulator':
            return (
                <PlayerTypeSimulatorBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'rewardScheduleDesigner':
            return (
                <RewardScheduleDesignerBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'flowChannelEvaluator':
            return (
                <FlowChannelEvaluatorBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'pitchAnalysisGenerator':
            return (
                <PitchAnalysisGeneratorBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'narrativeGenerator':
            return (
                <NarrativeGeneratorBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'darkPatternRedesigner':
            return (
                <DarkPatternRedesignerBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'roeDashboard':
            return (
                <ROEDashboardBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'journeyTimeline':
            return (
                <JourneyTimelineBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'certificateGenerator':
            return (
                <CertificateGeneratorBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        case 'finalAssessment':
            return (
                <FinalAssessmentBlockModal
                    open={isOpen}
                    onClose={onClose}
                    onSave={onSave}
                    initialData={blockData}
                />
            );

        default:
            console.warn(`Unknown block type: ${blockType}`);
            return null;
    }
}
