import { z } from 'zod';

// File size and type validation constants
export const FILE_SIZE_LIMITS = {
    VIDEO_MAX_SIZE: 100 * 1024 * 1024, // 100MB in bytes
    IMAGE_MAX_SIZE: 5 * 1024 * 1024,   // 5MB in bytes
} as const;

export const ALLOWED_FILE_TYPES = {
    VIDEO: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
} as const;

export const VIDEO_PROVIDERS = ['youtube', 'vimeo', 's3'] as const;
export const VIDEO_SOURCES = ['upload', 'embed'] as const;
export const LIST_TYPES = ['bullet', 'numbered', 'checkbox'] as const;

// URL validation helper
const urlSchema = z.string().url({ message: 'Must be a valid URL' });

// Basic Block Schemas

/**
 * Text Block Schema
 * Validates rich text content with HTML
 */
export const textBlockSchema = z.object({
    type: z.literal('text'),
    content: z.object({
        text: z.string()
            .min(1, 'Text content is required')
            .max(50000, 'Text content must not exceed 50,000 characters'),
    }),
});

/**
 * Video Block Schema
 * Validates video URL or file upload with provider information
 */
export const videoBlockSchema = z.object({
    type: z.literal('video'),
    content: z.object({
        videoUrl: z.string().min(1, 'Video URL is required'),
        videoSource: z.enum(VIDEO_SOURCES, {
            message: 'Video source must be either "upload" or "embed"',
        }),
        videoProvider: z.enum(VIDEO_PROVIDERS, {
            message: 'Video provider must be "youtube", "vimeo", or "s3"',
        }).optional(),
        title: z.string().optional(),
        description: z.string().optional(),
    }).refine(
        (data) => {
            // If embed, validate URL format
            if (data.videoSource === 'embed') {
                try {
                    new URL(data.videoUrl);
                    return true;
                } catch {
                    return false;
                }
            }
            return true;
        },
        { message: 'Invalid video URL format', path: ['videoUrl'] }
    ),
});

/**
 * Image Block Schema
 * Validates image URL with required alt text and optional caption
 */
export const imageBlockSchema = z.object({
    type: z.literal('image'),
    content: z.object({
        imageUrl: z.string().min(1, 'Image URL is required'),
        altText: z.string()
            .min(1, 'Alt text is required for accessibility')
            .max(250, 'Alt text must not exceed 250 characters'),
        caption: z.string()
            .max(500, 'Caption must not exceed 500 characters')
            .optional(),
    }).refine(
        (data) => {
            // Validate URL format
            try {
                new URL(data.imageUrl);
                return true;
            } catch {
                return false;
            }
        },
        { message: 'Invalid image URL format', path: ['imageUrl'] }
    ),
});

/**
 * Code Block Schema
 * Validates code content with language specification
 */
export const codeBlockSchema = z.object({
    type: z.literal('code'),
    content: z.object({
        code: z.string()
            .min(1, 'Code content is required')
            .max(10000, 'Code must not exceed 10,000 characters'),
        language: z.string()
            .min(1, 'Programming language is required')
            .max(50, 'Language name must not exceed 50 characters')
            .default('javascript'),
        title: z.string()
            .max(200, 'Title must not exceed 200 characters')
            .optional(),
    }),
});

/**
 * List Block Schema
 * Validates list items with type specification
 */
export const listBlockSchema = z.object({
    type: z.literal('list'),
    content: z.object({
        listType: z.enum(LIST_TYPES, {
            message: 'List type must be "bullet", "numbered", or "checkbox"',
        }).default('bullet'),
        items: z.array(
            z.object({
                text: z.string()
                    .min(1, 'List item text is required')
                    .max(1000, 'List item must not exceed 1,000 characters'),
                checked: z.boolean().optional(),
            })
        ).min(1, 'At least one list item is required')
            .max(100, 'List must not exceed 100 items'),
    }),
});

/**
 * Divider Block Schema
 * Validates divider with optional styling
 */
export const dividerBlockSchema = z.object({
    type: z.literal('divider'),
    content: z.object({
        style: z.enum(['solid', 'dashed', 'dotted']).default('solid').optional(),
        spacing: z.enum(['small', 'medium', 'large']).default('medium').optional(),
    }).default({}),
});

// Interactive Block Schemas

/**
 * Reflection Block Schema
 * Validates reflection prompt with minimum length requirement
 */
export const reflectionBlockSchema = z.object({
    type: z.literal('reflection'),
    content: z.object({
        question: z.string()
            .min(10, 'Question must be at least 10 characters')
            .max(1000, 'Question must not exceed 1,000 characters'),
        prompt: z.string()
            .max(2000, 'Prompt must not exceed 2,000 characters')
            .optional(),
        minLength: z.number()
            .int('Minimum length must be a whole number')
            .min(0, 'Minimum length cannot be negative')
            .max(5000, 'Minimum length cannot exceed 5,000 characters')
            .default(50)
            .optional(),
        placeholder: z.string()
            .max(200, 'Placeholder must not exceed 200 characters')
            .optional(),
        title: z.string()
            .max(200, 'Title must not exceed 200 characters')
            .optional(),
    }),
});

/**
 * Poll Block Schema
 * Validates poll question with multiple choice options
 */
export const pollBlockSchema = z.object({
    type: z.literal('poll'),
    content: z.object({
        question: z.string()
            .min(5, 'Question must be at least 5 characters')
            .max(500, 'Question must not exceed 500 characters'),
        options: z.array(
            z.object({
                id: z.string().optional(),
                text: z.string()
                    .min(1, 'Option text is required')
                    .max(200, 'Option text must not exceed 200 characters'),
                votes: z.number().int().min(0).default(0).optional(),
            })
        ).min(2, 'Poll must have at least 2 options')
            .max(10, 'Poll cannot have more than 10 options'),
        allowMultiple: z.boolean().default(false).optional(),
        showResults: z.boolean().default(true).optional(),
        title: z.string()
            .max(200, 'Title must not exceed 200 characters')
            .optional(),
    }),
});

/**
 * Word Cloud Block Schema
 * Validates word cloud with configurable words and mappings
 */
export const wordCloudBlockSchema = z.object({
    type: z.literal('wordCloud'),
    content: z.object({
        title: z.string()
            .max(200, 'Title must not exceed 200 characters')
            .optional(),
        description: z.string()
            .max(500, 'Description must not exceed 500 characters')
            .optional(),
        words: z.array(
            z.object({
                text: z.string()
                    .min(1, 'Word text is required')
                    .max(100, 'Word text must not exceed 100 characters'),
                value: z.number()
                    .int('Value must be a whole number')
                    .min(1, 'Value must be at least 1')
                    .max(100, 'Value cannot exceed 100'),
            })
        ).min(1, 'At least one word is required')
            .max(50, 'Cannot have more than 50 words')
            .optional(),
        mappings: z.record(z.string(), z.string()).optional(),
        instructionText: z.string()
            .max(500, 'Instruction text must not exceed 500 characters')
            .optional(),
        summaryText: z.string()
            .max(1000, 'Summary text must not exceed 1,000 characters')
            .optional(),
    }),
});

/**
 * AI Generator Block Schema
 * Validates AI generator configuration with type and prompts
 */
export const aiGeneratorBlockSchema = z.object({
    type: z.literal('aiGenerator'),
    content: z.object({
        generatorType: z.string()
            .min(1, 'Generator type is required')
            .max(100, 'Generator type must not exceed 100 characters'),
        title: z.string()
            .min(1, 'Title is required')
            .max(200, 'Title must not exceed 200 characters'),
        description: z.string()
            .max(1000, 'Description must not exceed 1,000 characters')
            .optional(),
        prompt: z.string()
            .max(2000, 'Prompt must not exceed 2,000 characters')
            .optional(),
        placeholder: z.string()
            .max(200, 'Placeholder must not exceed 200 characters')
            .optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

/**
 * Choice Comparison Block Schema
 * Validates choice comparison with multiple options
 */
export const choiceComparisonBlockSchema = z.object({
    type: z.literal('choiceComparison'),
    content: z.object({
        question: z.string()
            .min(5, 'Question must be at least 5 characters')
            .max(500, 'Question must not exceed 500 characters'),
        choices: z.array(
            z.object({
                id: z.string().optional(),
                label: z.string()
                    .min(1, 'Choice label is required')
                    .max(100, 'Choice label must not exceed 100 characters'),
                description: z.string()
                    .max(500, 'Choice description must not exceed 500 characters')
                    .optional(),
            })
        ).min(2, 'Must have at least 2 choices')
            .max(6, 'Cannot have more than 6 choices'),
        title: z.string()
            .max(200, 'Title must not exceed 200 characters')
            .optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

/**
 * Design Fixer Block Schema
 * Validates design fixer scenario configuration
 */
export const designFixerBlockSchema = z.object({
    type: z.literal('designFixer'),
    content: z.object({
        scenario: z.string()
            .min(10, 'Scenario must be at least 10 characters')
            .max(2000, 'Scenario must not exceed 2,000 characters'),
        title: z.string()
            .max(200, 'Title must not exceed 200 characters')
            .optional(),
        issues: z.array(
            z.object({
                id: z.string().optional(),
                description: z.string()
                    .min(1, 'Issue description is required')
                    .max(500, 'Issue description must not exceed 500 characters'),
                category: z.string().optional(),
            })
        ).optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

/**
 * Player Type Simulator Block Schema
 * Validates player type simulator configuration
 */
export const playerTypeSimulatorBlockSchema = z.object({
    type: z.literal('playerTypeSimulator'),
    content: z.object({
        title: z.string()
            .min(1, 'Title is required')
            .max(200, 'Title must not exceed 200 characters'),
        description: z.string()
            .max(1000, 'Description must not exceed 1,000 characters')
            .optional(),
        playerTypes: z.array(
            z.object({
                id: z.string().optional(),
                name: z.string()
                    .min(1, 'Player type name is required')
                    .max(100, 'Player type name must not exceed 100 characters'),
                description: z.string()
                    .max(500, 'Player type description must not exceed 500 characters')
                    .optional(),
                traits: z.array(z.string()).optional(),
            })
        ).optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

/**
 * Reward Schedule Designer Block Schema
 * Validates reward schedule designer configuration
 */
export const rewardScheduleDesignerBlockSchema = z.object({
    type: z.literal('rewardScheduleDesigner'),
    content: z.object({
        title: z.string()
            .min(1, 'Title is required')
            .max(200, 'Title must not exceed 200 characters'),
        description: z.string()
            .max(1000, 'Description must not exceed 1,000 characters')
            .optional(),
        scheduleTypes: z.array(
            z.object({
                id: z.string().optional(),
                name: z.string()
                    .min(1, 'Schedule type name is required')
                    .max(100, 'Schedule type name must not exceed 100 characters'),
                description: z.string()
                    .max(500, 'Schedule type description must not exceed 500 characters')
                    .optional(),
            })
        ).optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

/**
 * Flow Channel Evaluator Block Schema
 * Validates flow channel evaluator configuration
 */
export const flowChannelEvaluatorBlockSchema = z.object({
    type: z.literal('flowChannelEvaluator'),
    content: z.object({
        title: z.string()
            .min(1, 'Title is required')
            .max(200, 'Title must not exceed 200 characters'),
        description: z.string()
            .max(1000, 'Description must not exceed 1,000 characters')
            .optional(),
        scenario: z.string()
            .max(2000, 'Scenario must not exceed 2,000 characters')
            .optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

/**
 * Certificate Generator Block Schema
 * Validates certificate generator configuration
 */
export const certificateGeneratorBlockSchema = z.object({
    type: z.literal('certificateGenerator'),
    content: z.object({
        title: z.string()
            .min(1, 'Title is required')
            .max(200, 'Title must not exceed 200 characters'),
        description: z.string()
            .max(1000, 'Description must not exceed 1,000 characters')
            .optional(),
        certificateTitle: z.string()
            .max(200, 'Certificate title must not exceed 200 characters')
            .optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

/**
 * Final Assessment Block Schema
 * Validates final assessment configuration
 */
export const finalAssessmentBlockSchema = z.object({
    type: z.literal('finalAssessment'),
    content: z.object({
        title: z.string()
            .min(1, 'Title is required')
            .max(200, 'Title must not exceed 200 characters'),
        description: z.string()
            .max(1000, 'Description must not exceed 1,000 characters')
            .optional(),
        questions: z.array(
            z.object({
                id: z.string().optional(),
                question: z.string()
                    .min(1, 'Question is required')
                    .max(500, 'Question must not exceed 500 characters'),
                type: z.enum(['multiple-choice', 'short-answer', 'essay']).optional(),
                options: z.array(z.string()).optional(),
                correctAnswer: z.string().optional(),
            })
        ).optional(),
        passingScore: z.number()
            .min(0, 'Passing score cannot be negative')
            .max(100, 'Passing score cannot exceed 100')
            .optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

/**
 * Pitch Analysis Generator Block Schema
 * Validates pitch analysis generator configuration
 */
export const pitchAnalysisGeneratorBlockSchema = z.object({
    type: z.literal('pitchAnalysisGenerator'),
    content: z.object({
        title: z.string()
            .min(1, 'Title is required')
            .max(200, 'Title must not exceed 200 characters'),
        description: z.string()
            .max(1000, 'Description must not exceed 1,000 characters')
            .optional(),
        prompt: z.string()
            .max(2000, 'Prompt must not exceed 2,000 characters')
            .optional(),
        placeholder: z.string()
            .max(200, 'Placeholder must not exceed 200 characters')
            .optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

/**
 * Narrative Generator Block Schema
 * Validates narrative generator configuration
 */
export const narrativeGeneratorBlockSchema = z.object({
    type: z.literal('narrativeGenerator'),
    content: z.object({
        title: z.string()
            .min(1, 'Title is required')
            .max(200, 'Title must not exceed 200 characters'),
        description: z.string()
            .max(1000, 'Description must not exceed 1,000 characters')
            .optional(),
        prompt: z.string()
            .max(2000, 'Prompt must not exceed 2,000 characters')
            .optional(),
        placeholder: z.string()
            .max(200, 'Placeholder must not exceed 200 characters')
            .optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

/**
 * Dark Pattern Redesigner Block Schema
 * Validates dark pattern redesigner configuration
 */
export const darkPatternRedesignerBlockSchema = z.object({
    type: z.literal('darkPatternRedesigner'),
    content: z.object({
        title: z.string()
            .min(1, 'Title is required')
            .max(200, 'Title must not exceed 200 characters'),
        description: z.string()
            .max(1000, 'Description must not exceed 1,000 characters')
            .optional(),
        pattern: z.string()
            .max(2000, 'Pattern description must not exceed 2,000 characters')
            .optional(),
        prompt: z.string()
            .max(2000, 'Prompt must not exceed 2,000 characters')
            .optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

/**
 * ROE Dashboard Block Schema
 * Validates ROE dashboard configuration
 */
export const roeDashboardBlockSchema = z.object({
    type: z.literal('roeDashboard'),
    content: z.object({
        title: z.string()
            .min(1, 'Title is required')
            .max(200, 'Title must not exceed 200 characters'),
        description: z.string()
            .max(1000, 'Description must not exceed 1,000 characters')
            .optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

/**
 * Journey Timeline Block Schema
 * Validates journey timeline configuration
 */
export const journeyTimelineBlockSchema = z.object({
    type: z.literal('journeyTimeline'),
    content: z.object({
        title: z.string()
            .min(1, 'Title is required')
            .max(200, 'Title must not exceed 200 characters'),
        description: z.string()
            .max(1000, 'Description must not exceed 1,000 characters')
            .optional(),
        milestones: z.array(
            z.object({
                id: z.string().optional(),
                title: z.string()
                    .min(1, 'Milestone title is required')
                    .max(200, 'Milestone title must not exceed 200 characters'),
                description: z.string()
                    .max(500, 'Milestone description must not exceed 500 characters')
                    .optional(),
                date: z.string().optional(),
            })
        ).optional(),
        config: z.record(z.string(), z.any()).optional(),
    }),
});

// Union type for all block schemas
export const blockSchema = z.discriminatedUnion('type', [
    textBlockSchema,
    videoBlockSchema,
    imageBlockSchema,
    codeBlockSchema,
    listBlockSchema,
    dividerBlockSchema,
    reflectionBlockSchema,
    pollBlockSchema,
    wordCloudBlockSchema,
    aiGeneratorBlockSchema,
    choiceComparisonBlockSchema,
    designFixerBlockSchema,
    playerTypeSimulatorBlockSchema,
    rewardScheduleDesignerBlockSchema,
    flowChannelEvaluatorBlockSchema,
    certificateGeneratorBlockSchema,
    finalAssessmentBlockSchema,
    pitchAnalysisGeneratorBlockSchema,
    narrativeGeneratorBlockSchema,
    darkPatternRedesignerBlockSchema,
    roeDashboardBlockSchema,
    journeyTimelineBlockSchema,
]);

// Type exports for TypeScript
export type TextBlock = z.infer<typeof textBlockSchema>;
export type VideoBlock = z.infer<typeof videoBlockSchema>;
export type ImageBlock = z.infer<typeof imageBlockSchema>;
export type CodeBlock = z.infer<typeof codeBlockSchema>;
export type ListBlock = z.infer<typeof listBlockSchema>;
export type DividerBlock = z.infer<typeof dividerBlockSchema>;
export type ReflectionBlock = z.infer<typeof reflectionBlockSchema>;
export type PollBlock = z.infer<typeof pollBlockSchema>;
export type WordCloudBlock = z.infer<typeof wordCloudBlockSchema>;
export type AIGeneratorBlock = z.infer<typeof aiGeneratorBlockSchema>;
export type ChoiceComparisonBlock = z.infer<typeof choiceComparisonBlockSchema>;
export type DesignFixerBlock = z.infer<typeof designFixerBlockSchema>;
export type PlayerTypeSimulatorBlock = z.infer<typeof playerTypeSimulatorBlockSchema>;
export type RewardScheduleDesignerBlock = z.infer<typeof rewardScheduleDesignerBlockSchema>;
export type FlowChannelEvaluatorBlock = z.infer<typeof flowChannelEvaluatorBlockSchema>;
export type CertificateGeneratorBlock = z.infer<typeof certificateGeneratorBlockSchema>;
export type FinalAssessmentBlock = z.infer<typeof finalAssessmentBlockSchema>;
export type PitchAnalysisGeneratorBlock = z.infer<typeof pitchAnalysisGeneratorBlockSchema>;
export type NarrativeGeneratorBlock = z.infer<typeof narrativeGeneratorBlockSchema>;
export type DarkPatternRedesignerBlock = z.infer<typeof darkPatternRedesignerBlockSchema>;
export type ROEDashboardBlock = z.infer<typeof roeDashboardBlockSchema>;
export type JourneyTimelineBlock = z.infer<typeof journeyTimelineBlockSchema>;

export type Block = z.infer<typeof blockSchema>;

// Helper function to validate file size
export const validateFileSize = (file: File, maxSize: number): boolean => {
    return file.size <= maxSize;
};

// Helper function to validate file type
export const validateFileType = (file: File, allowedTypes: readonly string[]): boolean => {
    return allowedTypes.includes(file.type);
};

// Helper function to get validation error messages
export const getValidationErrors = (error: z.ZodError<any>): Record<string, string> => {
    const errors: Record<string, string> = {};
    error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
    });
    return errors;
};
