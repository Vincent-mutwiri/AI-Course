/**
 * PromptConstructor Service
 * 
 * Builds effective prompts for AI content generation by combining:
 * - Prompt templates
 * - User input
 * - Course context
 * - Generation options
 * 
 * Also handles refinement prompts and formatting instructions.
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface CourseContext {
    courseId: string;
    courseTitle: string;
    moduleId: string;
    moduleName: string;
    lessonId: string;
    lessonName: string;
    learningObjectives?: string[];
    existingBlocks?: Array<{
        type: string;
        content: any;
    }>;
}

export interface GenerationOptions {
    tone?: 'formal' | 'conversational' | 'encouraging';
    readingLevel?: 'high-school' | 'college' | 'professional';
    length?: 'brief' | 'moderate' | 'detailed';
    includeExamples?: boolean;
    language?: string;
    templateName?: string;
    customVariables?: Record<string, string>;
}

export type RefinementType =
    | 'make-shorter'
    | 'make-longer'
    | 'simplify'
    | 'add-examples'
    | 'change-tone';

export interface PromptTemplate {
    name: string;
    description: string;
    template: string;
    variables: string[];
}

// ============================================================================
// Prompt Templates (Frontend versions matching backend)
// ============================================================================

const textBlockTemplates: Record<string, PromptTemplate> = {
    introduction: {
        name: 'Lesson Introduction',
        description: 'Create an engaging introduction to a lesson topic',
        template: `You are an expert instructional designer creating content for an online course titled "{{courseTitle}}" in the module "{{moduleName}}".

Create an engaging introduction for the lesson "{{lessonName}}" that:
- Hooks the learner's attention with a relevant scenario or question
- Explains why this topic matters
- Previews what learners will accomplish
- Sets a {{tone}} tone appropriate for {{readingLevel}} level

Topic: {{topic}}
Learning Objectives: {{objectives}}

Generate a {{length}} introduction ({{lengthGuidance}}) formatted with appropriate paragraphs. Use clear, accessible language.`,
        variables: ['courseTitle', 'moduleName', 'lessonName', 'topic', 'objectives', 'tone', 'readingLevel', 'length', 'lengthGuidance']
    },

    explanation: {
        name: 'Concept Explanation',
        description: 'Explain a concept or topic in detail',
        template: `You are an expert instructional designer creating content for "{{courseTitle}}" - Module: "{{moduleName}}".

Create a clear explanation of the following concept for the lesson "{{lessonName}}":

Topic: {{topic}}

Requirements:
- Use a {{tone}} tone suitable for {{readingLevel}} learners
- Break down complex ideas into digestible parts
- {{examplesInstruction}}
- Use analogies or metaphors where helpful
- Format with headings, paragraphs, and bullet points as needed
- Length: {{length}} ({{lengthGuidance}})

Context from course: {{contextSummary}}`,
        variables: ['courseTitle', 'moduleName', 'lessonName', 'topic', 'tone', 'readingLevel', 'examplesInstruction', 'length', 'lengthGuidance', 'contextSummary']
    },

    summary: {
        name: 'Lesson Summary',
        description: 'Summarize key points from a lesson',
        template: `You are creating a summary for the lesson "{{lessonName}}" in the course "{{courseTitle}}".

Create a concise summary that:
- Recaps the main concepts covered
- Reinforces key takeaways
- Connects to the learning objectives
- Uses a {{tone}} tone for {{readingLevel}} learners
- Length: {{length}} ({{lengthGuidance}})

Learning Objectives: {{objectives}}
Key Topics Covered: {{topics}}

Format with bullet points or short paragraphs for easy scanning.`,
        variables: ['lessonName', 'courseTitle', 'objectives', 'topics', 'tone', 'readingLevel', 'length', 'lengthGuidance']
    }
};

const videoBlockTemplates: Record<string, PromptTemplate> = {
    script: {
        name: 'Video Script',
        description: 'Generate a structured video script with timestamps',
        template: `You are creating a video script for the course "{{courseTitle}}" - Lesson: "{{lessonName}}".

Create a {{duration}}-minute video script on:

Topic: {{topic}}
Key Points to Cover: {{keyPoints}}

Requirements:
- Structure with clear sections: Introduction, Main Content, Examples, Conclusion
- Include timestamp markers (e.g., [0:00], [1:30])
- Write in a {{tone}}, conversational style suitable for video
- Target {{readingLevel}} audience
- Include visual cues or suggestions in [brackets]
- Keep pacing appropriate for {{duration}} minutes`,
        variables: ['courseTitle', 'lessonName', 'topic', 'keyPoints', 'duration', 'tone', 'readingLevel']
    }
};

const codeBlockTemplates: Record<string, PromptTemplate> = {
    example: {
        name: 'Code Example',
        description: 'Generate a code example with explanation',
        template: `You are creating a code example for the lesson "{{lessonName}}" in "{{courseTitle}}".

Create a {{language}} code example that demonstrates:

Concept: {{concept}}
Skill Level: {{readingLevel}}

Requirements:
- Write clean, well-commented code following {{language}} best practices
- Include inline comments explaining key parts
- Keep it focused and not overly complex
- Ensure the code is functional and follows conventions
- Length: {{length}} ({{lengthGuidance}})

After the code, provide a brief explanation (2-3 paragraphs) that:
- Explains what the code does
- Highlights important concepts
- Suggests how learners might modify or extend it`,
        variables: ['lessonName', 'courseTitle', 'concept', 'language', 'readingLevel', 'length', 'lengthGuidance']
    }
};

const reflectionBlockTemplates: Record<string, PromptTemplate> = {
    prompts: {
        name: 'Reflection Prompts',
        description: 'Generate thought-provoking reflection questions',
        template: `You are creating reflection prompts for the lesson "{{lessonName}}" in "{{courseTitle}}".

Topic: {{topic}}
Learning Objectives: {{objectives}}

Generate 3-5 diverse reflection prompts that:
- Encourage critical thinking and self-assessment
- Connect to learners' personal experiences or contexts
- Vary in type (open-ended questions, scenario-based, comparative)
- Are appropriate for {{readingLevel}} learners
- Use a {{tone}} tone

For each prompt, also suggest:
- Appropriate minimum response length (words)
- The type of thinking it encourages (application, analysis, evaluation)`,
        variables: ['lessonName', 'courseTitle', 'topic', 'objectives', 'readingLevel', 'tone']
    }
};

const pollBlockTemplates: Record<string, PromptTemplate> = {
    question: {
        name: 'Poll Question',
        description: 'Generate poll question with options',
        template: `You are creating a poll for the lesson "{{lessonName}}" in "{{courseTitle}}".

Topic: {{topic}}
Poll Purpose: {{purpose}}

Generate:
1. A clear, focused poll question
2. 3-5 answer options that are:
   - Mutually exclusive (no overlap)
   - Collectively exhaustive (cover main possibilities)
   - Balanced and unbiased
   - Appropriate for {{readingLevel}} learners

3. 2-3 follow-up discussion questions to explore poll results

Poll Type: {{pollType}} (opinion/knowledge-check/preference)
Tone: {{tone}}`,
        variables: ['lessonName', 'courseTitle', 'topic', 'purpose', 'readingLevel', 'pollType', 'tone']
    }
};

const quizBlockTemplates: Record<string, PromptTemplate> = {
    questions: {
        name: 'Quiz Questions',
        description: 'Generate assessment questions with answers',
        template: `You are creating assessment questions for "{{lessonName}}" in "{{courseTitle}}".

Topic: {{topic}}
Learning Objectives: {{objectives}}
Number of Questions: {{questionCount}}
Difficulty Level: {{difficulty}}

Generate {{questionCount}} questions with a mix of:
- Multiple choice (with 4 options)
- True/False
- Short answer

Requirements for each question:
- Align with Bloom's Taxonomy level: {{bloomsLevel}}
- Target {{readingLevel}} learners
- Include correct answer
- Include explanation for why the answer is correct
- For multiple choice: create distractors that reflect common misconceptions
- Ensure questions test understanding, not just memorization`,
        variables: ['lessonName', 'courseTitle', 'topic', 'objectives', 'questionCount', 'difficulty', 'bloomsLevel', 'readingLevel']
    }
};

const listBlockTemplates: Record<string, PromptTemplate> = {
    structured: {
        name: 'Structured List',
        description: 'Generate organized lists (steps, tips, requirements)',
        template: `You are creating a {{listType}} list for "{{lessonName}}" in "{{courseTitle}}".

Topic: {{topic}}
List Type: {{listType}} (steps/requirements/tips/checklist/key-points)

Generate a well-organized list that:
- Contains {{itemCount}} items
- Is appropriate for {{readingLevel}} learners
- Uses a {{tone}} tone
- Has clear, actionable items (if applicable)
- Follows logical order or priority

{{specificInstructions}}

Make each item concise but informative.`,
        variables: ['listType', 'lessonName', 'courseTitle', 'topic', 'itemCount', 'readingLevel', 'tone', 'specificInstructions']
    }
};

// ============================================================================
// Refinement Prompt Templates
// ============================================================================

const refinementTemplates: Record<RefinementType, string> = {
    'make-shorter': `Take the following content and make it more concise while preserving all key information and main ideas. Remove redundancy and wordiness. Target: reduce length by 30-40%.

Original Content:
{{content}}

Refined Content:`,

    'make-longer': `Expand the following content with additional details, examples, and explanations. Add depth without introducing new main topics. Target: increase length by 40-50%.

Original Content:
{{content}}

Expanded Content:`,

    'simplify': `Rewrite the following content using simpler language and shorter sentences. Make it more accessible to learners while keeping all key concepts. Replace jargon with plain language where possible.

Original Content:
{{content}}

Simplified Content:`,

    'add-examples': `Enhance the following content by adding 2-3 concrete, practical examples that illustrate the concepts. Make examples relatable and specific.

Original Content:
{{content}}

Content with Examples:`,

    'change-tone': `Rewrite the following content with a {{targetTone}} tone. Adjust language style and word choice while preserving all information.

Original Content:
{{content}}

Rewritten Content:`
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get length guidance text based on length option
 */
function getLengthGuidance(length: string): string {
    const guidance: Record<string, string> = {
        brief: '2-3 short paragraphs, approximately 150-200 words',
        moderate: '4-6 paragraphs, approximately 300-400 words',
        detailed: '6-10 paragraphs, approximately 500-700 words'
    };
    return guidance[length] || guidance.moderate;
}

/**
 * Get examples instruction based on options
 */
function getExamplesInstruction(includeExamples: boolean): string {
    return includeExamples
        ? 'Include 2-3 concrete examples to illustrate key points'
        : 'Focus on clear explanations without extensive examples';
}

/**
 * Build context summary from existing blocks
 */
function buildContextSummary(existingBlocks?: Array<{ type: string; content: any }>): string {
    if (!existingBlocks || existingBlocks.length === 0) {
        return 'This is the first block in the lesson.';
    }

    const blockTypes = existingBlocks.map(b => b.type).join(', ');
    return `Previous blocks in this lesson: ${blockTypes}. Build on these concepts without repeating content.`;
}

/**
 * Replace variables in a template string
 */
function replaceTemplateVariables(
    template: string,
    variables: Record<string, string>
): string {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value || '');
    }

    return result;
}

/**
 * Get prompt template by block type and template name
 */
function getPromptTemplate(
    blockType: string,
    templateName: string = 'default'
): PromptTemplate | null {
    const templates: Record<string, Record<string, PromptTemplate>> = {
        text: textBlockTemplates,
        video: videoBlockTemplates,
        code: codeBlockTemplates,
        reflection: reflectionBlockTemplates,
        poll: pollBlockTemplates,
        quiz: quizBlockTemplates,
        list: listBlockTemplates
    };

    const blockTemplates = templates[blockType];
    if (!blockTemplates) return null;

    // Try to find the specific template, or return the first one
    return blockTemplates[templateName] || Object.values(blockTemplates)[0] || null;
}

/**
 * Get formatting instructions based on block type
 */
function getFormattingInstructions(blockType: string): string {
    const instructions: Record<string, string> = {
        text: 'Format with clear paragraphs, headings where appropriate, and bullet points for lists. Use proper markdown formatting.',
        video: 'Include timestamp markers in [MM:SS] format. Add visual cues in [brackets]. Structure with clear sections.',
        code: 'Wrap code in triple backticks with language identifier. Include inline comments. Provide explanation after code block.',
        reflection: 'Format each prompt as a numbered list. Include suggested word count and thinking type for each.',
        poll: 'Format as: Question: [text], then Options: with bullet points. Include discussion questions at the end.',
        quiz: 'Format each question with: Question X:, Type:, Options: (A-D), Correct Answer:, Explanation:',
        list: 'Use numbered list for sequential items, bullet points for non-sequential. Keep items concise and parallel in structure.'
    };

    return instructions[blockType] || 'Format content clearly and appropriately for the content type.';
}

// ============================================================================
// Main Service Functions
// ============================================================================

/**
 * Build a complete prompt for content generation
 * 
 * Combines template, user input, course context, and generation options
 * into a comprehensive prompt for the AI service.
 * 
 * @param blockType - Type of block (text, video, code, etc.)
 * @param userPrompt - User's input/topic
 * @param context - Course context information
 * @param options - Generation options (tone, reading level, etc.)
 * @returns Complete prompt string ready for AI service
 */
export function buildPrompt(
    blockType: string,
    userPrompt: string,
    context: CourseContext,
    options: GenerationOptions = {}
): string {
    // Set default options
    const tone = options.tone || 'conversational';
    const readingLevel = options.readingLevel || 'college';
    const length = options.length || 'moderate';
    const includeExamples = options.includeExamples !== false;
    const templateName = options.templateName || 'default';

    // Get the appropriate template
    const template = getPromptTemplate(blockType, templateName);

    if (!template) {
        // Fallback: create a simple prompt without template
        return `Create ${blockType} content for the lesson "${context.lessonName}" in the course "${context.courseTitle}".

Topic: ${userPrompt}

Use a ${tone} tone appropriate for ${readingLevel} level learners.
Length: ${length}

${getFormattingInstructions(blockType)}`;
    }

    // Build variables object with all required values
    const variables: Record<string, string> = {
        courseTitle: context.courseTitle,
        courseId: context.courseId,
        moduleName: context.moduleName,
        moduleId: context.moduleId,
        lessonName: context.lessonName,
        lessonId: context.lessonId,
        topic: userPrompt,
        objectives: context.learningObjectives?.join(', ') || 'Not specified',
        tone,
        readingLevel,
        length,
        lengthGuidance: getLengthGuidance(length),
        examplesInstruction: getExamplesInstruction(includeExamples),
        contextSummary: buildContextSummary(context.existingBlocks),

        // Additional common variables with defaults
        concept: userPrompt,
        task: userPrompt,
        topics: userPrompt,
        keyPoints: userPrompt,
        duration: '5',
        language: options.language || 'javascript',
        purpose: 'engagement and knowledge check',
        pollType: 'opinion',
        questionCount: '5',
        difficulty: 'moderate',
        bloomsLevel: 'application',
        listType: 'key-points',
        itemCount: '5',
        specificInstructions: '',

        // Merge any custom variables provided
        ...options.customVariables
    };

    // Replace variables in template
    let constructedPrompt = replaceTemplateVariables(template.template, variables);

    // Add formatting instructions at the end
    constructedPrompt += `\n\n${getFormattingInstructions(blockType)}`;

    return constructedPrompt;
}

/**
 * Build a refinement prompt for existing content
 * 
 * Creates a prompt to refine/modify existing AI-generated content
 * based on the specified refinement type.
 * 
 * @param content - Original content to refine
 * @param refinementType - Type of refinement to apply
 * @param context - Course context (optional, for context-aware refinement)
 * @param targetTone - Target tone for 'change-tone' refinement
 * @returns Refinement prompt string
 */
export function buildRefinementPrompt(
    content: string,
    refinementType: RefinementType,
    context?: CourseContext,
    targetTone: string = 'conversational'
): string {
    // Get the refinement template
    const template = refinementTemplates[refinementType];

    if (!template) {
        throw new Error(`Unknown refinement type: ${refinementType}`);
    }

    // Build variables for refinement
    const variables: Record<string, string> = {
        content,
        targetTone
    };

    // Add context information if available
    if (context) {
        variables.courseTitle = context.courseTitle;
        variables.lessonName = context.lessonName;
    }

    // Replace variables in template
    const refinementPrompt = replaceTemplateVariables(template, variables);

    return refinementPrompt;
}

/**
 * Get all available templates for a block type
 * 
 * @param blockType - Type of block
 * @returns Array of available templates
 */
export function getAvailableTemplates(blockType: string): PromptTemplate[] {
    const templates: Record<string, Record<string, PromptTemplate>> = {
        text: textBlockTemplates,
        video: videoBlockTemplates,
        code: codeBlockTemplates,
        reflection: reflectionBlockTemplates,
        poll: pollBlockTemplates,
        quiz: quizBlockTemplates,
        list: listBlockTemplates
    };

    const blockTemplates = templates[blockType];
    return blockTemplates ? Object.values(blockTemplates) : [];
}

/**
 * Validate that all required variables are present in context
 * 
 * @param template - Prompt template
 * @param variables - Variables object
 * @returns Object with isValid flag and missing variables array
 */
export function validateTemplateVariables(
    template: PromptTemplate,
    variables: Record<string, string>
): { isValid: boolean; missing: string[] } {
    const missing: string[] = [];

    for (const varName of template.variables) {
        if (!variables[varName] || variables[varName].trim() === '') {
            missing.push(varName);
        }
    }

    return {
        isValid: missing.length === 0,
        missing
    };
}

// ============================================================================
// Export Types and Functions
// ============================================================================

export type { PromptTemplate };
