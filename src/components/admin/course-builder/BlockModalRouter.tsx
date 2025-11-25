import React, { lazy, Suspense } from 'react';
import { BlockModalState } from '@/hooks/useBlockModal';

// Lazy load all block modals for better performance
const TextBlockModal = lazy(() => import('./modals/TextBlockModal').then(m => ({ default: m.TextBlockModal })));
const VideoBlockModal = lazy(() => import('./modals/VideoBlockModal').then(m => ({ default: m.VideoBlockModal })));
const ImageBlockModal = lazy(() => import('./modals/ImageBlockModal').then(m => ({ default: m.ImageBlockModal })));
const CodeBlockModal = lazy(() => import('./modals/CodeBlockModal').then(m => ({ default: m.CodeBlockModal })));
const ListBlockModal = lazy(() => import('./modals/ListBlockModal').then(m => ({ default: m.ListBlockModal })));
const DividerBlockModal = lazy(() => import('./modals/DividerBlockModal').then(m => ({ default: m.DividerBlockModal })));
const ReflectionBlockModal = lazy(() => import('./modals/ReflectionBlockModal').then(m => ({ default: m.ReflectionBlockModal })));
const PollBlockModal = lazy(() => import('./modals/PollBlockModal').then(m => ({ default: m.PollBlockModal })));
const WordCloudBlockModal = lazy(() => import('./modals/WordCloudBlockModal').then(m => ({ default: m.WordCloudBlockModal })));
const AIGeneratorBlockModal = lazy(() => import('./modals/AIGeneratorBlockModal').then(m => ({ default: m.AIGeneratorBlockModal })));
const ChoiceComparisonBlockModal = lazy(() => import('./modals/ChoiceComparisonBlockModal').then(m => ({ default: m.ChoiceComparisonBlockModal })));
const DesignFixerBlockModal = lazy(() => import('./modals/DesignFixerBlockModal').then(m => ({ default: m.DesignFixerBlockModal })));
const PlayerTypeSimulatorBlockModal = lazy(() => import('./modals/PlayerTypeSimulatorBlockModal').then(m => ({ default: m.PlayerTypeSimulatorBlockModal })));
const RewardScheduleDesignerBlockModal = lazy(() => import('./modals/RewardScheduleDesignerBlockModal').then(m => ({ default: m.RewardScheduleDesignerBlockModal })));
const FlowChannelEvaluatorBlockModal = lazy(() => import('./modals/FlowChannelEvaluatorBlockModal').then(m => ({ default: m.FlowChannelEvaluatorBlockModal })));
const CertificateGeneratorBlockModal = lazy(() => import('./modals/CertificateGeneratorBlockModal').then(m => ({ default: m.CertificateGeneratorBlockModal })));
const FinalAssessmentBlockModal = lazy(() => import('./modals/FinalAssessmentBlockModal').then(m => ({ default: m.FinalAssessmentBlockModal })));
const PitchAnalysisGeneratorBlockModal = lazy(() => import('./modals/PitchAnalysisGeneratorBlockModal').then(m => ({ default: m.PitchAnalysisGeneratorBlockModal })));
const NarrativeGeneratorBlockModal = lazy(() => import('./modals/NarrativeGeneratorBlockModal').then(m => ({ default: m.NarrativeGeneratorBlockModal })));
const DarkPatternRedesignerBlockModal = lazy(() => import('./modals/DarkPatternRedesignerBlockModal').then(m => ({ default: m.DarkPatternRedesignerBlockModal })));
const ROEDashboardBlockModal = lazy(() => import('./modals/ROEDashboardBlockModal').then(m => ({ default: m.ROEDashboardBlockModal })));
const JourneyTimelineBlockModal = lazy(() => import('./modals/JourneyTimelineBlockModal').then(m => ({ default: m.JourneyTimelineBlockModal })));

// Loading fallback component for modals
const ModalLoadingFallback = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
        </div>
    </div>
);

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

    // Convert null to undefined for modal props and cast to any to avoid type conflicts
    // between the generic Block type and specific block schemas
    const initialData = (blockData ?? undefined) as any;

    // Wrap modal in Suspense for lazy loading
    const renderModal = () => {
        switch (blockType) {
            // Basic blocks
            case 'text':
                return (
                    <TextBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'video':
                return (
                    <VideoBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'image':
                return (
                    <ImageBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'code':
                return (
                    <CodeBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'list':
                return (
                    <ListBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'divider':
                return (
                    <DividerBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            // Interactive blocks
            case 'reflection':
                return (
                    <ReflectionBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'poll':
                return (
                    <PollBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'wordCloud':
                return (
                    <WordCloudBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'aiGenerator':
                return (
                    <AIGeneratorBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'choiceComparison':
                return (
                    <ChoiceComparisonBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'designFixer':
                return (
                    <DesignFixerBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'playerTypeSimulator':
                return (
                    <PlayerTypeSimulatorBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'rewardScheduleDesigner':
                return (
                    <RewardScheduleDesignerBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'flowChannelEvaluator':
                return (
                    <FlowChannelEvaluatorBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'pitchAnalysisGenerator':
                return (
                    <PitchAnalysisGeneratorBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'narrativeGenerator':
                return (
                    <NarrativeGeneratorBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'darkPatternRedesigner':
                return (
                    <DarkPatternRedesignerBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'roeDashboard':
                return (
                    <ROEDashboardBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'journeyTimeline':
                return (
                    <JourneyTimelineBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'certificateGenerator':
                return (
                    <CertificateGeneratorBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            case 'finalAssessment':
                return (
                    <FinalAssessmentBlockModal
                        open={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        initialData={initialData}
                    />
                );

            default:
                console.warn(`Unknown block type: ${blockType}`);
                return null;
        }
    }

    return (
        <Suspense fallback={<ModalLoadingFallback />}>
            {renderModal()}
        </Suspense>
    );
}
