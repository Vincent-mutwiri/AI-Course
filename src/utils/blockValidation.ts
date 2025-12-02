import { IBlock, BlockType } from '@/types/page';

export interface BlockValidationError {
    field: string;
    message: string;
}

export interface BlockValidationResult {
    isValid: boolean;
    errors: BlockValidationError[];
}

/**
 * Validates a block's content based on its type
 */
export function validateBlock(block: IBlock): BlockValidationResult {
    const errors: BlockValidationError[] = [];

    switch (block.type) {
        case 'text':
            if (!block.content.text || block.content.text.trim() === '') {
                errors.push({ field: 'text', message: 'Text content is required' });
            }
            break;

        case 'video':
            if (!block.content.videoUrl || block.content.videoUrl.trim() === '') {
                errors.push({ field: 'videoUrl', message: 'Video URL is required' });
            }
            if (!block.content.videoProvider) {
                errors.push({ field: 'videoProvider', message: 'Video provider is required' });
            }
            break;

        case 'image':
            if (!block.content.imageUrl || block.content.imageUrl.trim() === '') {
                errors.push({ field: 'imageUrl', message: 'Image URL is required' });
            }
            if (!block.content.altText || block.content.altText.trim() === '') {
                errors.push({ field: 'altText', message: 'Alt text is required for accessibility' });
            }
            break;

        case 'code':
            if (!block.content.code || block.content.code.trim() === '') {
                errors.push({ field: 'code', message: 'Code content is required' });
            }
            if (!block.content.language) {
                errors.push({ field: 'language', message: 'Programming language is required' });
            }
            break;

        case 'list':
            if (!block.content.items || block.content.items.length === 0) {
                errors.push({ field: 'items', message: 'At least one list item is required' });
            } else {
                const emptyItems = block.content.items.filter((item: any) => !item.text || item.text.trim() === '');
                if (emptyItems.length > 0) {
                    errors.push({ field: 'items', message: 'All list items must have text' });
                }
            }
            if (!block.content.listType) {
                errors.push({ field: 'listType', message: 'List type is required' });
            }
            break;

        case 'reflection':
            if (!block.content.question || block.content.question.trim() === '') {
                errors.push({ field: 'question', message: 'Question is required' });
            }
            if (!block.content.prompt || block.content.prompt.trim() === '') {
                errors.push({ field: 'prompt', message: 'Prompt is required' });
            }
            break;

        case 'poll':
            if (!block.content.question || block.content.question.trim() === '') {
                errors.push({ field: 'question', message: 'Question is required' });
            }
            if (!block.content.options || block.content.options.length < 2) {
                errors.push({ field: 'options', message: 'At least two options are required' });
            }
            break;

        case 'wordCloud':
            if (!block.content.question || block.content.question.trim() === '') {
                errors.push({ field: 'question', message: 'Question is required' });
            }
            break;

        case 'aiGenerator':
            if (!block.content.prompt || block.content.prompt.trim() === '') {
                errors.push({ field: 'prompt', message: 'Prompt is required' });
            }
            if (!block.content.generatorType) {
                errors.push({ field: 'generatorType', message: 'Generator type is required' });
            }
            break;

        case 'choiceComparison':
        case 'playerTypeAnalyzer':
        case 'ethicalDilemmaSolver':
            if (!block.content.question || block.content.question.trim() === '') {
                errors.push({ field: 'question', message: 'Question is required' });
            }
            if (!block.content.options || block.content.options.length === 0) {
                errors.push({ field: 'options', message: 'Options are required' });
            }
            break;

        case 'certificateGenerator':
        case 'finalAssessment':
        case 'playerTypeSimulator':
        case 'rewardScheduleDesigner':
        case 'flowChannelEvaluator':
        case 'pitchAnalysisGenerator':
        case 'narrativeGenerator':
        case 'roeDashboard':
        case 'designFixer':
        case 'journeyTimeline':
        case 'simulation':
        case 'aiJourney':
        case 'buildABot':
        case 'conceptMap':
        case 'dataDashboard':
        case 'gamificationConceptMap':
        case 'identifyPersonalization':
        case 'presentationCoach':
        case 'sentenceBuilder':
        case 'visualTokens':
            // These blocks typically have config objects
            if (!block.content.config) {
                errors.push({ field: 'config', message: 'Configuration is required' });
            }
            break;

        case 'darkPatternRedesigner':
            if (!block.content.badSlideUrl || block.content.badSlideUrl.trim() === '') {
                errors.push({ field: 'badSlideUrl', message: 'Bad slide URL is required' });
            }
            if (!block.content.goodSlideUrl || block.content.goodSlideUrl.trim() === '') {
                errors.push({ field: 'goodSlideUrl', message: 'Good slide URL is required' });
            }
            if (!block.content.explanation || block.content.explanation.trim() === '') {
                errors.push({ field: 'explanation', message: 'Explanation is required' });
            }
            break;

        case 'divider':
            // Divider has no required fields
            break;

        default:
            // For unknown block types, no validation
            break;
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validates all blocks in an array
 */
export function validateBlocks(blocks: IBlock[]): Map<string, BlockValidationResult> {
    const validationResults = new Map<string, BlockValidationResult>();

    blocks.forEach(block => {
        const result = validateBlock(block);
        if (!result.isValid) {
            validationResults.set(block.id, result);
        }
    });

    return validationResults;
}

/**
 * Checks if all blocks are valid
 */
export function areAllBlocksValid(blocks: IBlock[]): boolean {
    return blocks.every(block => validateBlock(block).isValid);
}
