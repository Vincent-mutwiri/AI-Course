import { IBlock, BlockType } from '@/types/page';

/**
 * Course context information used for AI content generation
 */
export interface CourseContext {
    courseId?: string;
    courseTitle?: string;
    moduleId?: string;
    moduleName?: string;
    lessonId?: string;
    lessonName?: string;
    learningObjectives?: string[];
    existingBlocks?: IBlock[];
}

/**
 * Input data for building course context
 */
export interface CourseContextInput {
    courseId?: string;
    courseTitle?: string;
    courseDescription?: string;
    moduleId?: string;
    moduleName?: string;
    moduleDescription?: string;
    lessonId?: string;
    lessonTitle?: string;
    lessonDescription?: string;
    lessonObjective?: string;
    learningObjectives?: string[];
    existingBlocks?: IBlock[];
}

/**
 * Content summary for a block
 */
interface BlockSummary {
    type: BlockType;
    summary: string;
}

/**
 * CourseContextBuilder service
 * Extracts and summarizes course context for AI content generation
 */
export class CourseContextBuilder {
    /**
     * Build a CourseContext object from available data
     * Handles missing or incomplete context data gracefully
     */
    static buildContext(input: CourseContextInput): CourseContext {
        const context: CourseContext = {};

        // Extract course information
        if (input.courseId) {
            context.courseId = input.courseId;
        }
        if (input.courseTitle) {
            context.courseTitle = input.courseTitle;
        }

        // Extract module information
        if (input.moduleId) {
            context.moduleId = input.moduleId;
        }
        if (input.moduleName) {
            context.moduleName = input.moduleName;
        }

        // Extract lesson information
        if (input.lessonId) {
            context.lessonId = input.lessonId;
        }
        if (input.lessonTitle) {
            context.lessonName = input.lessonTitle;
        }

        // Extract learning objectives
        const objectives: string[] = [];

        // Add explicit learning objectives
        if (input.learningObjectives && input.learningObjectives.length > 0) {
            objectives.push(...input.learningObjectives);
        }

        // Add lesson objective if available
        if (input.lessonObjective && !objectives.includes(input.lessonObjective)) {
            objectives.push(input.lessonObjective);
        }

        if (objectives.length > 0) {
            context.learningObjectives = objectives;
        }

        // Include existing blocks for context
        if (input.existingBlocks && input.existingBlocks.length > 0) {
            context.existingBlocks = input.existingBlocks;
        }

        return context;
    }

    /**
     * Create a concise summary of existing blocks
     * Used to provide context about what content already exists
     */
    static summarizeExistingContent(blocks?: IBlock[]): string {
        if (!blocks || blocks.length === 0) {
            return 'No existing content in this lesson.';
        }

        const summaries: BlockSummary[] = blocks.map(block => ({
            type: block.type,
            summary: this.summarizeBlock(block)
        }));

        // Group by block type for better organization
        const groupedSummaries = this.groupSummariesByType(summaries);

        // Build the summary text
        const summaryParts: string[] = [
            `This lesson currently has ${blocks.length} block(s):`
        ];

        for (const [type, blockSummaries] of Object.entries(groupedSummaries)) {
            const count = blockSummaries.length;
            const typeLabel = this.getBlockTypeLabel(type as BlockType);

            if (count === 1) {
                summaryParts.push(`- 1 ${typeLabel}: ${blockSummaries[0]}`);
            } else {
                summaryParts.push(`- ${count} ${typeLabel} blocks`);
                blockSummaries.forEach((summary, index) => {
                    summaryParts.push(`  ${index + 1}. ${summary}`);
                });
            }
        }

        return summaryParts.join('\n');
    }

    /**
     * Summarize a single block's content
     */
    private static summarizeBlock(block: IBlock): string {
        const { type, content } = block;

        switch (type) {
            case 'text':
                return this.summarizeText(content.text);

            case 'video':
                return content.title
                    ? `Video: "${content.title}"`
                    : 'Video content';

            case 'image':
                return content.caption
                    ? `Image: "${content.caption}"`
                    : content.altText
                        ? `Image: ${content.altText}`
                        : 'Image';

            case 'code':
                return content.language
                    ? `${content.language} code example`
                    : 'Code example';

            case 'list':
                const itemCount = content.items?.length || 0;
                const listTypeLabel = content.listType === 'numbered' ? 'numbered' :
                    content.listType === 'checkbox' ? 'checklist' : 'bulleted';
                return `${listTypeLabel} list with ${itemCount} item(s)`;

            case 'reflection':
                return content.prompt
                    ? `Reflection: "${this.truncate(content.prompt, 50)}"`
                    : 'Reflection prompt';

            case 'poll':
                return content.question
                    ? `Poll: "${this.truncate(content.question, 50)}"`
                    : 'Poll question';

            case 'wordCloud':
                return 'Word cloud activity';

            case 'aiGenerator':
                return content.generatorType
                    ? `AI Generator: ${content.generatorType}`
                    : 'AI Generator activity';

            case 'finalAssessment':
                return 'Final assessment/quiz';

            case 'divider':
                return 'Section divider';

            // Interactive elements
            case 'choiceComparison':
                return 'Choice comparison activity';

            case 'certificateGenerator':
                return 'Certificate generator';

            case 'playerTypeSimulator':
            case 'playerTypeAnalyzer':
                return 'Player type analysis activity';

            case 'conceptMap':
            case 'gamificationConceptMap':
                return 'Concept map';

            case 'dataDashboard':
                return 'Data dashboard';

            case 'ethicalDilemmaSolver':
                return 'Ethical dilemma activity';

            case 'presentationCoach':
                return 'Presentation coach activity';

            case 'sentenceBuilder':
                return 'Sentence builder activity';

            case 'buildABot':
                return 'Build-a-bot activity';

            case 'aiJourney':
                return 'AI journey activity';

            case 'visualTokens':
                return 'Visual tokens activity';

            case 'identifyPersonalization':
                return 'Personalization identification activity';

            case 'simulation':
                return content.title
                    ? `Simulation: "${content.title}"`
                    : 'Interactive simulation';

            default:
                return `${type} block`;
        }
    }

    /**
     * Summarize text content (first 100 characters)
     */
    private static summarizeText(text?: string): string {
        if (!text) {
            return 'Empty text block';
        }

        // Remove HTML tags for cleaner summary
        const cleanText = text.replace(/<[^>]*>/g, '').trim();

        if (cleanText.length === 0) {
            return 'Empty text block';
        }

        return this.truncate(cleanText, 100);
    }

    /**
     * Truncate text to specified length with ellipsis
     */
    private static truncate(text: string, maxLength: number): string {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength).trim() + '...';
    }

    /**
     * Group block summaries by type
     */
    private static groupSummariesByType(summaries: BlockSummary[]): Record<string, string[]> {
        const grouped: Record<string, string[]> = {};

        for (const { type, summary } of summaries) {
            if (!grouped[type]) {
                grouped[type] = [];
            }
            grouped[type].push(summary);
        }

        return grouped;
    }

    /**
     * Get human-readable label for block type
     */
    private static getBlockTypeLabel(type: BlockType): string {
        const labels: Record<BlockType, string> = {
            text: 'text',
            video: 'video',
            image: 'image',
            code: 'code',
            list: 'list',
            divider: 'divider',
            reflection: 'reflection',
            poll: 'poll',
            wordCloud: 'word cloud',
            aiGenerator: 'AI generator',
            choiceComparison: 'choice comparison',
            certificateGenerator: 'certificate generator',
            finalAssessment: 'final assessment',
            playerTypeSimulator: 'player type simulator',
            rewardScheduleDesigner: 'reward schedule designer',
            flowChannelEvaluator: 'flow channel evaluator',
            pitchAnalysisGenerator: 'pitch analysis generator',
            narrativeGenerator: 'narrative generator',
            darkPatternRedesigner: 'dark pattern redesigner',
            roeDashboard: 'ROE dashboard',
            designFixer: 'design fixer',
            journeyTimeline: 'journey timeline',
            simulation: 'simulation',
            aiJourney: 'AI journey',
            buildABot: 'build-a-bot',
            conceptMap: 'concept map',
            dataDashboard: 'data dashboard',
            ethicalDilemmaSolver: 'ethical dilemma solver',
            gamificationConceptMap: 'gamification concept map',
            identifyPersonalization: 'identify personalization',
            playerTypeAnalyzer: 'player type analyzer',
            presentationCoach: 'presentation coach',
            sentenceBuilder: 'sentence builder',
            visualTokens: 'visual tokens'
        };

        return labels[type] || type;
    }

    /**
     * Format context for display or logging
     */
    static formatContext(context: CourseContext): string {
        const parts: string[] = [];

        if (context.courseTitle) {
            parts.push(`Course: ${context.courseTitle}`);
        }
        if (context.moduleName) {
            parts.push(`Module: ${context.moduleName}`);
        }
        if (context.lessonName) {
            parts.push(`Lesson: ${context.lessonName}`);
        }
        if (context.learningObjectives && context.learningObjectives.length > 0) {
            parts.push(`Objectives: ${context.learningObjectives.join(', ')}`);
        }
        if (context.existingBlocks && context.existingBlocks.length > 0) {
            parts.push(`Existing blocks: ${context.existingBlocks.length}`);
        }

        return parts.length > 0 ? parts.join(' | ') : 'No context available';
    }

    /**
     * Check if context has minimum required information
     */
    static hasMinimumContext(context: CourseContext): boolean {
        // At minimum, we should have either a course title or lesson name
        return !!(context.courseTitle || context.lessonName);
    }

    /**
     * Get a context summary suitable for AI prompts
     */
    static getContextSummary(context: CourseContext): string {
        const parts: string[] = [];

        if (context.courseTitle) {
            parts.push(`This content is for the course "${context.courseTitle}".`);
        }

        if (context.moduleName && context.lessonName) {
            parts.push(`It belongs to the module "${context.moduleName}", lesson "${context.lessonName}".`);
        } else if (context.moduleName) {
            parts.push(`It belongs to the module "${context.moduleName}".`);
        } else if (context.lessonName) {
            parts.push(`It belongs to the lesson "${context.lessonName}".`);
        }

        if (context.learningObjectives && context.learningObjectives.length > 0) {
            parts.push(`Learning objectives: ${context.learningObjectives.join('; ')}.`);
        }

        if (context.existingBlocks && context.existingBlocks.length > 0) {
            parts.push(this.summarizeExistingContent(context.existingBlocks));
        }

        return parts.length > 0
            ? parts.join(' ')
            : 'No specific course context available.';
    }
}

export default CourseContextBuilder;
