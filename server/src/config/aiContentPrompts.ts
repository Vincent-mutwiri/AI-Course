/**
 * AI Content Generation Prompts and Configuration
 * 
 * This file contains prompt templates for generating educational content
 * across different block types, along with refinement prompts and type definitions.
 */

// ============================================================================
// TypeScript Interfaces
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
}

export interface GeneratedContent {
    content: any;
    metadata: {
        blockType: string;
        generatedAt: Date;
        promptUsed: string;
        tokensUsed?: number;
    };
}

export type RefinementType =
    | 'make-shorter'
    | 'make-longer'
    | 'simplify'
    | 'add-examples'
    | 'change-tone';

export interface BlockOutline {
    type: string;
    title: string;
    description: string;
    estimatedTime?: number;
    placeholderContent: any;
}

// ============================================================================
// Prompt Template System
// ============================================================================

interface PromptTemplate {
    name: string;
    description: string;
    template: string;
    variables: string[];
}

// ============================================================================
// Text Block Prompts
// ============================================================================

export const textBlockPrompts: Record<string, PromptTemplate> = {
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
    },

    example: {
        name: 'Practical Example',
        description: 'Create a real-world example or case study',
        template: `You are creating educational content for "{{courseTitle}}" - Lesson: "{{lessonName}}".

Create a practical, real-world example that illustrates:

Concept: {{concept}}

Requirements:
- Make it relatable to {{readingLevel}} learners
- Show how the concept applies in practice
- Include specific details that make it concrete
- Use a {{tone}} tone
- Length: {{length}} ({{lengthGuidance}})
- {{examplesInstruction}}

Format as a narrative or scenario with clear connection to the concept.`,
        variables: ['courseTitle', 'lessonName', 'concept', 'readingLevel', 'tone', 'length', 'lengthGuidance', 'examplesInstruction']
    },

    instructions: {
        name: 'Step-by-Step Instructions',
        description: 'Create procedural instructions for a task',
        template: `Create clear, step-by-step instructions for the following task in the lesson "{{lessonName}}":

Task: {{task}}

Requirements:
- Write for {{readingLevel}} learners
- Use a {{tone}} tone
- Number each step clearly
- Include any prerequisites or materials needed
- Add tips or warnings where relevant
- Length: {{length}} ({{lengthGuidance}})

Format as a numbered list with clear, actionable steps.`,
        variables: ['lessonName', 'task', 'readingLevel', 'tone', 'length', 'lengthGuidance']
    }
};

// ============================================================================
// Video Block Prompts
// ============================================================================

export const videoBlockPrompts: Record<string, PromptTemplate> = {
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
- Keep pacing appropriate for {{duration}} minutes

Format:
[0:00] Introduction
- Hook and topic introduction

[X:XX] Main Content
- Key concepts with explanations

[X:XX] Examples
- Practical demonstrations

[X:XX] Conclusion
- Summary and next steps`,
        variables: ['courseTitle', 'lessonName', 'topic', 'keyPoints', 'duration', 'tone', 'readingLevel']
    },

    description: {
        name: 'Video Description',
        description: 'Generate video title and description',
        template: `Create a compelling title and description for a video in "{{courseTitle}}".

Video Topic: {{topic}}
Duration: {{duration}} minutes
Target Audience: {{readingLevel}}

Generate:
1. A clear, engaging title (under 60 characters)
2. A description (2-3 sentences) that:
   - Explains what viewers will learn
   - Highlights key takeaways
   - Uses a {{tone}} tone

Format as:
Title: [title]
Description: [description]`,
        variables: ['courseTitle', 'topic', 'duration', 'readingLevel', 'tone']
    }
};

// ============================================================================
// Code Block Prompts
// ============================================================================

export const codeBlockPrompts: Record<string, PromptTemplate> = {
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
- Suggests how learners might modify or extend it

Format:
\`\`\`{{language}}
// Code here with comments
\`\`\`

Explanation:
[explanation text]`,
        variables: ['lessonName', 'courseTitle', 'concept', 'language', 'readingLevel', 'length', 'lengthGuidance']
    }
};

// ============================================================================
// Reflection Block Prompts
// ============================================================================

export const reflectionBlockPrompts: Record<string, PromptTemplate> = {
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
- The type of thinking it encourages (application, analysis, evaluation)

Format each as:
1. [Prompt question]
   - Type: [type]
   - Suggested length: [X words]

Make prompts specific enough to guide thinking but open enough for personal reflection.`,
        variables: ['lessonName', 'courseTitle', 'topic', 'objectives', 'readingLevel', 'tone']
    }
};

// ============================================================================
// Poll Block Prompts
// ============================================================================

export const pollBlockPrompts: Record<string, PromptTemplate> = {
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
Tone: {{tone}}

Format:
Question: [question]

Options:
- [option 1]
- [option 2]
- [option 3]
- [option 4]

Discussion Questions:
1. [question 1]
2. [question 2]`,
        variables: ['lessonName', 'courseTitle', 'topic', 'purpose', 'readingLevel', 'pollType', 'tone']
    }
};

// ============================================================================
// Quiz/Assessment Block Prompts
// ============================================================================

export const quizBlockPrompts: Record<string, PromptTemplate> = {
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
- Ensure questions test understanding, not just memorization

Format each question as:
Question X: [question text]
Type: [multiple-choice/true-false/short-answer]
Options: (if applicable)
  A) [option]
  B) [option]
  C) [option]
  D) [option]
Correct Answer: [answer]
Explanation: [why this is correct and why others are wrong]
Bloom's Level: [level]`,
        variables: ['lessonName', 'courseTitle', 'topic', 'objectives', 'questionCount', 'difficulty', 'bloomsLevel', 'readingLevel']
    }
};

// ============================================================================
// Final Assessment Block Prompts
// ============================================================================

export const finalAssessmentBlockPrompts: Record<string, PromptTemplate> = {
    questions: {
        name: 'Final Assessment Questions',
        description: 'Generate comprehensive assessment with multiple question types',
        template: `You are creating a final assessment for "{{lessonName}}" in "{{courseTitle}}".

Topic: {{topic}}
Learning Objectives: {{objectives}}

Generate a comprehensive assessment with multiple question types. Return the response as a JSON object.

Requirements:
- Target {{readingLevel}} learners
- Mix of multiple-choice, short-answer, and essay questions
- Questions should test different levels of understanding
- Include clear, unambiguous questions
- For multiple choice: provide 4 options with one correct answer
- For short-answer/essay: include grading rubric and sample answer

Format as JSON:
{
  "title": "Assessment title",
  "description": "Instructions for students",
  "questions": [
    {
      "question": "Question text",
      "type": "multiple-choice",
      "options": [
        {"text": "Option A", "feedback": "Why this is/isn't correct"},
        {"text": "Option B", "feedback": "Why this is/isn't correct"},
        {"text": "Option C", "feedback": "Why this is/isn't correct"},
        {"text": "Option D", "feedback": "Why this is/isn't correct"}
      ],
      "correctAnswer": "Option text that is correct"
    },
    {
      "question": "Question text",
      "type": "short-answer",
      "maxScore": 10,
      "rubric": "Grading criteria",
      "correctAnswer": "Sample answer"
    }
  ]
}`,
        variables: ['lessonName', 'courseTitle', 'topic', 'objectives', 'readingLevel']
    }
};

// ============================================================================
// List Block Prompts
// ============================================================================

export const listBlockPrompts: Record<string, PromptTemplate> = {
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

Format:
{{#if ordered}}
1. [item with brief description if needed]
2. [item with brief description if needed]
{{else}}
- [item with brief description if needed]
- [item with brief description if needed]
{{/if}}

Make each item concise but informative.`,
        variables: ['listType', 'lessonName', 'courseTitle', 'topic', 'itemCount', 'readingLevel', 'tone', 'specificInstructions', 'ordered']
    }
};

// ============================================================================
// Certificate Generator Block Prompts
// ============================================================================

export const certificateGeneratorBlockPrompts: Record<string, PromptTemplate> = {
    setup: {
        name: 'Certificate Generator Setup',
        description: 'Generate certificate configuration and text',
        template: `You are creating a certificate generator for "{{courseTitle}}" - Lesson: "{{lessonName}}".

Course Topic: {{topic}}

Generate:
1. A block title for the certificate generator (e.g., "Claim Your Certificate")
2. Instructions for students (2-3 sentences explaining how to generate their certificate)
3. A certificate title that will appear on the certificate (e.g., "Certificate of Completion")

Requirements:
- Use a {{tone}} tone
- Target {{readingLevel}} learners
- Make it celebratory and motivating
- Keep text professional and clear

Format as JSON:
{
  "title": "Block title",
  "description": "Instructions for students",
  "certificateTitle": "Certificate title"
}

Make it encouraging and professional.`,
        variables: ['courseTitle', 'lessonName', 'topic', 'tone', 'readingLevel']
    }
};

// ============================================================================
// Choice Comparison Block Prompts
// ============================================================================

export const choiceComparisonBlockPrompts: Record<string, PromptTemplate> = {
    generate: {
        name: 'Choice Comparison',
        description: 'Generate comparison scenario with multiple choices',
        template: `You are creating a choice comparison activity for "{{lessonName}}" in "{{courseTitle}}".

Topic: {{topic}}

Generate:
1. A clear comparison question or scenario (1-2 sentences)
2. 3-5 distinct choices/options to compare
3. For each choice, provide:
   - A clear label (2-5 words)
   - A brief description explaining the approach (1-2 sentences)

Requirements:
- Choices should represent meaningfully different approaches
- Make it relevant for {{readingLevel}} learners
- Use a {{tone}} tone
- Ensure choices are balanced (no obviously "correct" answer)

Format as JSON:
{
  "question": "Comparison question or scenario",
  "title": "Optional activity title",
  "choices": [
    { "label": "Choice name", "description": "Brief explanation" },
    { "label": "Choice name", "description": "Brief explanation" }
  ]
}

Generate 3-5 choices that encourage critical thinking.`,
        variables: ['lessonName', 'courseTitle', 'topic', 'readingLevel', 'tone']
    }
};

// ============================================================================
// AI Generator Block Prompts
// ============================================================================

export const aiGeneratorBlockPrompts: Record<string, PromptTemplate> = {
    setup: {
        name: 'AI Generator Setup',
        description: 'Generate configuration for an AI generator tool',
        template: `You are creating an AI generator tool configuration for "{{lessonName}}" in "{{courseTitle}}".

Tool Purpose: {{topic}}
Generator Type: {{generatorType}}

Generate:
1. A clear, engaging title for the tool (under 50 characters)
2. Instructions for students explaining how to use this tool (2-3 sentences)
3. A helpful placeholder text for the input field
4. (Optional) A custom system prompt if needed for specific behavior

Target Audience: {{readingLevel}}
Tone: {{tone}}

Format as JSON:
{
  "title": "Tool name",
  "description": "Instructions for students",
  "placeholder": "Input field placeholder",
  "prompt": "Optional custom system prompt"
}

Make it clear and user-friendly for students.`,
        variables: ['lessonName', 'courseTitle', 'topic', 'generatorType', 'readingLevel', 'tone']
    }
};

// ============================================================================
// Word Cloud Block Prompts
// ============================================================================

export const wordCloudBlockPrompts: Record<string, PromptTemplate> = {
    generate: {
        name: 'Word Cloud',
        description: 'Generate words with mappings for an interactive word cloud',
        template: `You are creating an interactive word cloud for "{{lessonName}}" in "{{courseTitle}}".

Topic: {{topic}}

Generate 6-12 key words related to this topic, where each word:
- Represents an important concept, term, or idea
- Has a value (1-100) indicating its importance/size in the cloud
- Maps to a brief explanation or related concept

Requirements:
- Words should be single words or short phrases (1-3 words max)
- Values should vary to create visual interest (range from 30-100)
- Mappings should be concise explanations (1-2 sentences)
- Target {{readingLevel}} learners
- Use a {{tone}} tone in mappings

Format as JSON:
{
  "words": [
    { "text": "word1", "value": 85, "mapping": "Brief explanation of what this connects to" },
    { "text": "word2", "value": 70, "mapping": "Brief explanation of what this connects to" }
  ]
}

Generate at least 6 words with varied importance values.`,
        variables: ['lessonName', 'courseTitle', 'topic', 'readingLevel', 'tone']
    }
};

// ============================================================================
// Lesson Outline Prompts
// ============================================================================

export const lessonOutlinePrompts: Record<string, PromptTemplate> = {
    complete: {
        name: 'Complete Lesson Outline',
        description: 'Generate a full lesson structure with multiple blocks',
        template: `You are designing a complete lesson outline for "{{courseTitle}}" - Module: "{{moduleName}}".

Lesson Topic: {{topic}}
Learning Objectives:
{{objectives}}

Target Audience: {{readingLevel}}
Desired Lesson Length: {{blockCount}} blocks (approximately {{estimatedMinutes}} minutes)

Create a logical sequence of content blocks that:
- Starts with an engaging introduction
- Builds concepts progressively
- Includes varied content types (text, video, interactive elements)
- Incorporates formative assessments
- Ends with summary and reflection

For each suggested block, provide:
1. Block type (text/video/code/reflection/poll/quiz/list)
2. Title
3. Brief description of content
4. Estimated time (minutes)
5. Purpose in the learning sequence

Format:
Block 1: [Type]
Title: [title]
Description: [what this block covers]
Time: [X minutes]
Purpose: [why this comes first]

[Continue for all blocks...]

Ensure the sequence follows instructional design best practices and maintains learner engagement.`,
        variables: ['courseTitle', 'moduleName', 'topic', 'objectives', 'readingLevel', 'blockCount', 'estimatedMinutes']
    }
};

// ============================================================================
// Image Alt Text Prompts
// ============================================================================

export const imageAltTextPrompts: Record<string, PromptTemplate> = {
    generate: {
        name: 'Image Alt Text',
        description: 'Generate accessible alt text and captions',
        template: `You are creating accessible image descriptions for "{{lessonName}}" in "{{courseTitle}}".

Image Context:
- Lesson Topic: {{topic}}
- Surrounding Content: {{surroundingText}}
- Image Purpose: {{purpose}}

Generate:
1. Alt Text: A concise description (under 125 characters) that:
   - Describes the essential information conveyed by the image
   - Is meaningful in the context of the lesson
   - Follows WCAG 2.1 AA guidelines
   - Omits phrases like "image of" or "picture of"

2. Caption: A longer description (1-2 sentences) that:
   - Provides additional context
   - Explains why the image is relevant to the lesson
   - Can include interpretation or analysis

Format:
Alt Text: [concise description under 125 chars]
Caption: [longer contextual description]`,
        variables: ['lessonName', 'courseTitle', 'topic', 'surroundingText', 'purpose']
    }
};

// ============================================================================
// Refinement Prompts
// ============================================================================

export const refinementPrompts: Record<RefinementType, string> = {
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

    'change-tone': `Rewrite the following content with a {{targetTone}} tone (formal/conversational/encouraging). Adjust language style and word choice while preserving all information.

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
export function getLengthGuidance(length: string): string {
    const guidance = {
        brief: '2-3 short paragraphs, approximately 150-200 words',
        moderate: '4-6 paragraphs, approximately 300-400 words',
        detailed: '6-10 paragraphs, approximately 500-700 words'
    };
    return guidance[length as keyof typeof guidance] || guidance.moderate;
}

/**
 * Get examples instruction based on options
 */
export function getExamplesInstruction(includeExamples: boolean): string {
    return includeExamples
        ? 'Include 2-3 concrete examples to illustrate key points'
        : 'Focus on clear explanations without extensive examples';
}

/**
 * Build context summary from existing blocks
 */
export function buildContextSummary(existingBlocks?: Array<{ type: string; content: any }>): string {
    if (!existingBlocks || existingBlocks.length === 0) {
        return 'This is the first block in the lesson.';
    }

    const blockTypes = existingBlocks.map(b => b.type).join(', ');
    return `Previous blocks in this lesson: ${blockTypes}. Build on these concepts without repeating content.`;
}

/**
 * Replace variables in a template string
 */
export function replaceTemplateVariables(
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
export function getPromptTemplate(
    blockType: string,
    templateName: string = 'default'
): PromptTemplate | null {
    const templates: Record<string, Record<string, PromptTemplate>> = {
        text: textBlockPrompts,
        video: videoBlockPrompts,
        code: codeBlockPrompts,
        reflection: reflectionBlockPrompts,
        poll: pollBlockPrompts,
        quiz: quizBlockPrompts,
        finalAssessment: finalAssessmentBlockPrompts,
        list: listBlockPrompts,
        certificateGenerator: certificateGeneratorBlockPrompts,
        choiceComparison: choiceComparisonBlockPrompts,
        aiGenerator: aiGeneratorBlockPrompts,
        wordCloud: wordCloudBlockPrompts,
        outline: lessonOutlinePrompts,
        image: imageAltTextPrompts
    };

    const blockTemplates = templates[blockType];
    if (!blockTemplates) return null;

    return blockTemplates[templateName] || Object.values(blockTemplates)[0] || null;
}

/**
 * Get all available templates for a block type
 */
export function getAvailableTemplates(blockType: string): PromptTemplate[] {
    const templates: Record<string, Record<string, PromptTemplate>> = {
        text: textBlockPrompts,
        video: videoBlockPrompts,
        code: codeBlockPrompts,
        reflection: reflectionBlockPrompts,
        poll: pollBlockPrompts,
        quiz: quizBlockPrompts,
        finalAssessment: finalAssessmentBlockPrompts,
        list: listBlockPrompts,
        certificateGenerator: certificateGeneratorBlockPrompts,
        choiceComparison: choiceComparisonBlockPrompts,
        aiGenerator: aiGeneratorBlockPrompts,
        wordCloud: wordCloudBlockPrompts,
        outline: lessonOutlinePrompts,
        image: imageAltTextPrompts
    };

    const blockTemplates = templates[blockType];
    return blockTemplates ? Object.values(blockTemplates) : [];
}
