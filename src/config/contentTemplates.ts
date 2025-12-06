import { BlockType } from '@/types/page';

/**
 * Content template definition
 */
export interface ContentTemplate {
    id: string;
    name: string;
    description: string;
    blockTypes: BlockType[];
    prompt: string;
    category?: 'introduction' | 'explanation' | 'practice' | 'assessment' | 'reflection' | 'general';
}

/**
 * Pre-configured content templates for common scenarios
 */
export const contentTemplates: ContentTemplate[] = [
    // Text Block Templates
    {
        id: 'text-lesson-intro',
        name: 'Lesson Introduction',
        description: 'Engaging introduction that sets context and learning goals',
        blockTypes: ['text'],
        prompt: 'Create an engaging lesson introduction that:\n- Hooks the learner with a relevant scenario or question\n- Explains why this topic matters\n- Previews what will be covered\n- Sets clear expectations',
        category: 'introduction'
    },
    {
        id: 'text-concept-explanation',
        name: 'Concept Explanation',
        description: 'Clear explanation of a concept with examples',
        blockTypes: ['text'],
        prompt: 'Explain this concept clearly:\n- Define the concept in simple terms\n- Provide 2-3 concrete examples\n- Address common misconceptions\n- Connect to real-world applications',
        category: 'explanation'
    },
    {
        id: 'text-summary',
        name: 'Lesson Summary',
        description: 'Concise summary of key takeaways',
        blockTypes: ['text'],
        prompt: 'Create a lesson summary that:\n- Recaps the main points covered\n- Reinforces key concepts\n- Connects ideas together\n- Provides next steps or further learning',
        category: 'general'
    },
    {
        id: 'text-instructions',
        name: 'Activity Instructions',
        description: 'Clear step-by-step instructions for an activity',
        blockTypes: ['text'],
        prompt: 'Write clear activity instructions that:\n- State the objective\n- List materials or prerequisites\n- Provide step-by-step guidance\n- Include success criteria',
        category: 'practice'
    },

    // Video Block Templates
    {
        id: 'video-tutorial-script',
        name: 'Tutorial Video Script',
        description: 'Structured script for an instructional video',
        blockTypes: ['video'],
        prompt: 'Create a video script with:\n- Opening hook (0:00-0:30)\n- Main content with timestamps\n- Visual cues and demonstrations\n- Closing summary and call-to-action',
        category: 'explanation'
    },
    {
        id: 'video-demo-script',
        name: 'Demonstration Script',
        description: 'Script for showing a process or technique',
        blockTypes: ['video'],
        prompt: 'Write a demonstration script that:\n- Introduces what will be shown\n- Breaks down each step clearly\n- Points out important details\n- Summarizes the complete process',
        category: 'practice'
    },

    // Code Block Templates
    {
        id: 'code-basic-example',
        name: 'Basic Code Example',
        description: 'Simple, well-commented code example',
        blockTypes: ['code'],
        prompt: 'Generate a basic code example that:\n- Demonstrates the core concept\n- Includes inline comments\n- Uses clear variable names\n- Follows best practices',
        category: 'explanation'
    },
    {
        id: 'code-advanced-example',
        name: 'Advanced Example',
        description: 'Complex example showing real-world usage',
        blockTypes: ['code'],
        prompt: 'Create an advanced code example that:\n- Shows practical application\n- Handles edge cases\n- Demonstrates best practices\n- Includes error handling',
        category: 'practice'
    },

    // Reflection Block Templates
    {
        id: 'reflection-self-assessment',
        name: 'Self-Assessment Prompt',
        description: 'Prompt for learners to assess their understanding',
        blockTypes: ['reflection'],
        prompt: 'Create a self-assessment reflection prompt that asks learners to:\n- Evaluate their understanding\n- Identify areas of strength\n- Recognize areas for improvement\n- Set learning goals',
        category: 'reflection'
    },
    {
        id: 'reflection-application',
        name: 'Application Reflection',
        description: 'Prompt to connect learning to real situations',
        blockTypes: ['reflection'],
        prompt: 'Write a reflection prompt that encourages learners to:\n- Think about real-world applications\n- Connect to their own experience\n- Consider how they will use this knowledge\n- Identify potential challenges',
        category: 'reflection'
    },
    {
        id: 'reflection-critical-thinking',
        name: 'Critical Thinking Prompt',
        description: 'Deep thinking prompt for analysis and evaluation',
        blockTypes: ['reflection'],
        prompt: 'Create a critical thinking prompt that asks learners to:\n- Analyze different perspectives\n- Evaluate pros and cons\n- Make reasoned judgments\n- Support their thinking with evidence',
        category: 'reflection'
    },

    // Poll Block Templates
    {
        id: 'poll-knowledge-check',
        name: 'Knowledge Check Poll',
        description: 'Quick poll to gauge understanding',
        blockTypes: ['poll'],
        prompt: 'Create a knowledge check poll that:\n- Tests a key concept\n- Has one clearly correct answer\n- Includes plausible distractors\n- Can spark discussion',
        category: 'assessment'
    },
    {
        id: 'poll-opinion',
        name: 'Opinion Poll',
        description: 'Poll to gather learner perspectives',
        blockTypes: ['poll'],
        prompt: 'Write an opinion poll that:\n- Asks about preferences or viewpoints\n- Has balanced options\n- Encourages diverse responses\n- Can lead to meaningful discussion',
        category: 'general'
    },

    // Quiz/Assessment Templates
    {
        id: 'quiz-formative',
        name: 'Formative Assessment',
        description: 'Low-stakes quiz to check understanding',
        blockTypes: ['finalAssessment', 'aiGenerator'],
        prompt: 'Generate formative assessment questions that:\n- Test key learning objectives\n- Vary in difficulty (easy to moderate)\n- Provide helpful feedback\n- Focus on understanding, not memorization',
        category: 'assessment'
    },
    {
        id: 'quiz-summative',
        name: 'Summative Assessment',
        description: 'Comprehensive quiz covering all content',
        blockTypes: ['finalAssessment', 'aiGenerator'],
        prompt: 'Create summative assessment questions that:\n- Cover all major topics\n- Include various question types\n- Test different cognitive levels\n- Provide detailed explanations',
        category: 'assessment'
    },

    // List Block Templates
    {
        id: 'list-steps',
        name: 'Step-by-Step Process',
        description: 'Ordered list of steps to complete a task',
        blockTypes: ['list'],
        prompt: 'Create a step-by-step process list that:\n- Breaks down the task into clear steps\n- Orders steps logically\n- Includes important details for each step\n- Ends with verification or next steps',
        category: 'practice'
    },
    {
        id: 'list-tips',
        name: 'Tips and Best Practices',
        description: 'Helpful tips for success',
        blockTypes: ['list'],
        prompt: 'Generate a list of tips that:\n- Provides actionable advice\n- Prioritizes most important tips\n- Explains why each tip matters\n- Is concise and memorable',
        category: 'general'
    },
    {
        id: 'list-checklist',
        name: 'Checklist',
        description: 'Checklist for completing a task or process',
        blockTypes: ['list'],
        prompt: 'Create a checklist that:\n- Lists all required items or steps\n- Is comprehensive but not overwhelming\n- Uses clear, actionable language\n- Can be easily verified',
        category: 'practice'
    },

    // General Templates
    {
        id: 'general-learning-objectives',
        name: 'Learning Objectives',
        description: 'Clear, measurable learning objectives',
        blockTypes: ['text', 'list'],
        prompt: 'Write learning objectives that:\n- Use action verbs (analyze, create, evaluate)\n- Are specific and measurable\n- Align with Bloom\'s taxonomy\n- Focus on learner outcomes',
        category: 'introduction'
    },
    {
        id: 'general-example',
        name: 'Concrete Example',
        description: 'Real-world example to illustrate a concept',
        blockTypes: ['text'],
        prompt: 'Provide a concrete example that:\n- Relates to learners\' experiences\n- Clearly illustrates the concept\n- Includes relevant details\n- Helps build understanding',
        category: 'explanation'
    }
];

/**
 * Get templates for a specific block type
 */
export function getTemplatesForBlockType(blockType: BlockType): ContentTemplate[] {
    return contentTemplates.filter(template =>
        template.blockTypes.includes(blockType)
    );
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ContentTemplate | undefined {
    return contentTemplates.find(template => template.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: ContentTemplate['category']): ContentTemplate[] {
    return contentTemplates.filter(template => template.category === category);
}

/**
 * Custom template storage key
 */
const CUSTOM_TEMPLATES_KEY = 'ai_custom_templates';

/**
 * Save a custom template
 */
export function saveCustomTemplate(template: Omit<ContentTemplate, 'id'>): ContentTemplate {
    const customTemplate: ContentTemplate = {
        ...template,
        id: `custom-${Date.now()}`
    };

    const customTemplates = getCustomTemplates();
    customTemplates.push(customTemplate);

    try {
        localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(customTemplates));
    } catch (error) {
        console.error('Failed to save custom template:', error);
    }

    return customTemplate;
}

/**
 * Get all custom templates
 */
export function getCustomTemplates(): ContentTemplate[] {
    try {
        const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to load custom templates:', error);
    }

    return [];
}

/**
 * Delete a custom template
 */
export function deleteCustomTemplate(id: string): void {
    const customTemplates = getCustomTemplates();
    const filtered = customTemplates.filter(template => template.id !== id);

    try {
        localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to delete custom template:', error);
    }
}

/**
 * Get all templates (built-in + custom) for a block type
 */
export function getAllTemplatesForBlockType(blockType: BlockType): ContentTemplate[] {
    const builtIn = getTemplatesForBlockType(blockType);
    const custom = getCustomTemplates().filter(template =>
        template.blockTypes.includes(blockType)
    );

    return [...builtIn, ...custom];
}
