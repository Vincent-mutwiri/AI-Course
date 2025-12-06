import axios from 'axios';
import { AIPrompts, AIGeneratorType } from '../config/aiPrompts';
import { INFLECTION_API_URL, INFLECTION_API_KEY } from '../config/env';
import {
    CourseContext,
    GenerationOptions,
    GeneratedContent,
    RefinementType,
    BlockOutline,
    getPromptTemplate,
    replaceTemplateVariables,
    getLengthGuidance,
    getExamplesInstruction,
    buildContextSummary,
    refinementPrompts,
    lessonOutlinePrompts
} from '../config/aiContentPrompts';

// Inflection API context structure
interface InflectionContext {
    text: string;
    type: 'System' | 'Human' | 'AI';
    event_type?: string;
}

// Inflection API request payload
interface InflectionAPIPayload {
    config: string;
    context: InflectionContext[];
}

// Inflection API response structure
interface InflectionAPIResponse {
    text: string;
    created: number;
    tool_calls: any[];
    reasoning_content: any;
}

/**
 * Generate AI Game Master response using Inflection AI API
 * @param generatorType - Type of AI generator to use
 * @param userInput - User's input text
 * @param context - Optional conversation context for continuity
 * @returns AI-generated response text
 */
export async function generateAIGameMasterResponse(
    generatorType: AIGeneratorType,
    userInput: string,
    context: InflectionContext[] = []
): Promise<string> {
    try {
        // Validate generator type exists
        const promptTemplate = AIPrompts[generatorType];
        if (!promptTemplate) {
            throw new Error(`Unknown generator type: ${generatorType}`);
        }

        // Replace {userInput} placeholder in prompt template
        const systemPrompt = promptTemplate.replace('{userInput}', userInput);

        // Build Inflection API payload with config 'Pi-3.1' and context array
        const payload: InflectionAPIPayload = {
            config: 'Pi-3.1',
            context: [
                { text: systemPrompt + '\n\n' + userInput, type: 'Human' }
            ]
        };

        // Make POST request to Inflection AI API with authorization header
        const response = await axios.post<InflectionAPIResponse>(
            INFLECTION_API_URL,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${INFLECTION_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 second timeout
            }
        );

        // Extract text from API response
        const completionText = response.data.text;

        if (!completionText) {
            throw new Error('No completion text in API response');
        }

        return completionText;

    } catch (error: any) {
        // Log detailed error information
        if (axios.isAxiosError(error)) {
            console.error('Inflection API Call Failed:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });

            // Provide user-friendly error messages based on error type
            if (error.code === 'ECONNABORTED') {
                throw new Error('AI service request timed out. Please try again.');
            }

            if (error.response?.status === 401) {
                throw new Error('AI service authentication failed. Please check API credentials.');
            }

            if (error.response?.status === 429) {
                throw new Error('AI service rate limit exceeded. Please try again later.');
            }

            if (error.response?.status >= 500) {
                throw new Error('AI service is temporarily unavailable. Please try again later.');
            }
        } else {
            console.error('AI Service Error:', error.message);
        }

        // Return generic user-friendly error message
        throw new Error('AI service is currently unavailable. Please try again later.');
    }
}

/**
 * Generate content for a specific block type using AI
 * @param blockType - Type of block (text, video, code, etc.)
 * @param prompt - User's generation prompt or topic
 * @param context - Course context information
 * @param options - Generation options (tone, reading level, length, etc.)
 * @returns Generated content with metadata
 */
export async function generateBlockContent(
    blockType: string,
    prompt: string,
    context: CourseContext,
    options: GenerationOptions = {}
): Promise<GeneratedContent> {
    try {
        // Set default options
        const tone = options.tone || 'conversational';
        const readingLevel = options.readingLevel || 'college';
        const length = options.length || 'moderate';
        const includeExamples = options.includeExamples !== false;

        // Get the appropriate prompt template for the block type
        const template = getPromptTemplate(blockType);
        if (!template) {
            throw new Error(`No template found for block type: ${blockType}`);
        }

        // Build context-aware prompt by replacing template variables
        const variables: Record<string, string> = {
            courseTitle: context.courseTitle,
            moduleName: context.moduleName,
            lessonName: context.lessonName,
            topic: prompt,
            objectives: context.learningObjectives?.join(', ') || '',
            tone,
            readingLevel,
            length,
            lengthGuidance: getLengthGuidance(length),
            examplesInstruction: getExamplesInstruction(includeExamples),
            contextSummary: buildContextSummary(context.existingBlocks)
        };

        const constructedPrompt = replaceTemplateVariables(template.template, variables);

        // Build Inflection API payload
        const payload: InflectionAPIPayload = {
            config: 'Pi-3.1',
            context: [
                { text: constructedPrompt, type: 'Human' }
            ]
        };

        // Call Inflection AI API
        const response = await axios.post<InflectionAPIResponse>(
            INFLECTION_API_URL,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${INFLECTION_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const generatedText = response.data.text;

        if (!generatedText) {
            throw new Error('No content generated from API response');
        }

        // Parse and format response based on block type
        const parsedContent = parseBlockContent(blockType, generatedText);

        // Return generated content with metadata
        return {
            content: parsedContent,
            metadata: {
                blockType,
                generatedAt: new Date(),
                promptUsed: prompt,
                tokensUsed: estimateTokens(constructedPrompt + generatedText)
            }
        };

    } catch (error: any) {
        // Handle errors similar to existing error handling
        if (axios.isAxiosError(error)) {
            console.error('Content Generation Failed:', {
                blockType,
                status: error.response?.status,
                message: error.message
            });

            if (error.code === 'ECONNABORTED') {
                throw new Error('Content generation timed out. Please try again.');
            }

            if (error.response?.status === 401) {
                throw new Error('AI service authentication failed.');
            }

            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }

            if (error.response?.status >= 500) {
                throw new Error('AI service temporarily unavailable.');
            }
        }

        console.error('Content Generation Error:', error.message);
        throw new Error('Failed to generate content. Please try again.');
    }
}

/**
 * Refine existing content based on refinement type
 * @param content - Original content to refine
 * @param refinementType - Type of refinement to apply
 * @param context - Course context information
 * @returns Refined content
 */
export async function refineContent(
    content: string,
    refinementType: RefinementType,
    context: CourseContext
): Promise<string> {
    try {
        // Get the refinement prompt template
        const refinementTemplate = refinementPrompts[refinementType];
        if (!refinementTemplate) {
            throw new Error(`Unknown refinement type: ${refinementType}`);
        }

        // Build refinement prompt
        const variables: Record<string, string> = {
            content,
            targetTone: 'conversational' // Default, can be made configurable
        };

        const constructedPrompt = replaceTemplateVariables(refinementTemplate, variables);

        // Build Inflection API payload
        const payload: InflectionAPIPayload = {
            config: 'Pi-3.1',
            context: [
                { text: constructedPrompt, type: 'Human' }
            ]
        };

        // Call Inflection AI API
        const response = await axios.post<InflectionAPIResponse>(
            INFLECTION_API_URL,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${INFLECTION_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const refinedText = response.data.text;

        if (!refinedText) {
            throw new Error('No refined content in API response');
        }

        return refinedText;

    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('Content Refinement Failed:', {
                refinementType,
                status: error.response?.status,
                message: error.message
            });

            if (error.code === 'ECONNABORTED') {
                throw new Error('Content refinement timed out. Please try again.');
            }

            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
        }

        console.error('Content Refinement Error:', error.message);
        throw new Error('Failed to refine content. Please try again.');
    }
}

/**
 * Generate a complete lesson outline with multiple blocks
 * @param topic - Lesson topic
 * @param objectives - Learning objectives
 * @param context - Course context information
 * @returns Array of block outlines with placeholder content
 */
export async function generateLessonOutline(
    topic: string,
    objectives: string[],
    context: CourseContext,
    blockCount: number = 10
): Promise<BlockOutline[]> {
    try {
        // Get the lesson outline template
        const template = lessonOutlinePrompts.complete;
        if (!template) {
            throw new Error('Lesson outline template not found');
        }

        // Build outline generation prompt
        const variables: Record<string, string> = {
            courseTitle: context.courseTitle,
            moduleName: context.moduleName,
            topic,
            objectives: objectives.join('\n'),
            readingLevel: 'college',
            blockCount: blockCount.toString(),
            estimatedMinutes: (blockCount * 5).toString() // Rough estimate: 5 min per block
        };

        const constructedPrompt = replaceTemplateVariables(template.template, variables);

        // Build Inflection API payload
        const payload: InflectionAPIPayload = {
            config: 'Pi-3.1',
            context: [
                { text: constructedPrompt, type: 'Human' }
            ]
        };

        // Call Inflection AI API
        const response = await axios.post<InflectionAPIResponse>(
            INFLECTION_API_URL,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${INFLECTION_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 45000 // Longer timeout for outline generation
            }
        );

        const outlineText = response.data.text;

        if (!outlineText) {
            throw new Error('No outline generated from API response');
        }

        // Parse response into BlockOutline array
        const blockOutlines = parseOutlineResponse(outlineText);

        // Generate placeholder content for each block
        const outlinesWithPlaceholders = blockOutlines.map(outline => ({
            ...outline,
            placeholderContent: generatePlaceholderContent(outline.type, outline.title)
        }));

        return outlinesWithPlaceholders;

    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('Lesson Outline Generation Failed:', {
                topic,
                status: error.response?.status,
                message: error.message
            });

            if (error.code === 'ECONNABORTED') {
                throw new Error('Outline generation timed out. Please try again.');
            }

            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
        }

        console.error('Lesson Outline Error:', error.message);
        throw new Error('Failed to generate lesson outline. Please try again.');
    }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse generated content based on block type
 */
function parseBlockContent(blockType: string, generatedText: string): any {
    switch (blockType) {
        case 'text':
            return { text: generatedText.trim() };

        case 'video':
            return parseVideoContent(generatedText);

        case 'code':
            return parseCodeContent(generatedText);

        case 'reflection':
            return parseReflectionContent(generatedText);

        case 'poll':
            return parsePollContent(generatedText);

        case 'quiz':
            return parseQuizContent(generatedText);

        case 'list':
            return parseListContent(generatedText);

        case 'image':
            return parseImageContent(generatedText);

        default:
            return { text: generatedText.trim() };
    }
}

/**
 * Parse video script content
 */
function parseVideoContent(text: string): any {
    const lines = text.split('\n');
    let title = '';
    let description = '';
    let script = text;

    // Try to extract title and description if formatted
    const titleMatch = text.match(/Title:\s*(.+)/i);
    const descMatch = text.match(/Description:\s*(.+)/i);

    if (titleMatch) title = titleMatch[1].trim();
    if (descMatch) description = descMatch[1].trim();

    return {
        title: title || 'Generated Video',
        description: description || text.substring(0, 200),
        script: script.trim()
    };
}

/**
 * Parse code example content
 */
function parseCodeContent(text: string): any {
    // Extract code block and explanation
    const codeBlockMatch = text.match(/```(\w+)?\n([\s\S]+?)```/);
    let code = '';
    let language = 'javascript';
    let explanation = text;

    if (codeBlockMatch) {
        language = codeBlockMatch[1] || 'javascript';
        code = codeBlockMatch[2].trim();
        explanation = text.replace(codeBlockMatch[0], '').trim();
    }

    return {
        code: code || text,
        language,
        explanation: explanation || 'Code example generated by AI'
    };
}

/**
 * Parse reflection prompts
 */
function parseReflectionContent(text: string): any {
    const prompts: Array<{ prompt: string; minLength: number }> = [];
    const lines = text.split('\n');

    let currentPrompt = '';
    let currentMinLength = 100;

    for (const line of lines) {
        const promptMatch = line.match(/^\d+\.\s*(.+)/);
        const lengthMatch = line.match(/(\d+)\s*words?/i);

        if (promptMatch) {
            if (currentPrompt) {
                prompts.push({ prompt: currentPrompt, minLength: currentMinLength });
            }
            currentPrompt = promptMatch[1].trim();
            currentMinLength = 100;
        } else if (lengthMatch) {
            currentMinLength = parseInt(lengthMatch[1]);
        }
    }

    if (currentPrompt) {
        prompts.push({ prompt: currentPrompt, minLength: currentMinLength });
    }

    return {
        prompts: prompts.length > 0 ? prompts : [{ prompt: text.trim(), minLength: 100 }]
    };
}

/**
 * Parse poll question and options
 */
function parsePollContent(text: string): any {
    const lines = text.split('\n').filter(l => l.trim());
    let question = '';
    const options: string[] = [];

    for (const line of lines) {
        const questionMatch = line.match(/Question:\s*(.+)/i);
        const optionMatch = line.match(/^[-•]\s*(.+)/);

        if (questionMatch) {
            question = questionMatch[1].trim();
        } else if (optionMatch) {
            options.push(optionMatch[1].trim());
        }
    }

    return {
        question: question || lines[0] || 'Generated poll question',
        options: options.length > 0 ? options : ['Option 1', 'Option 2', 'Option 3']
    };
}

/**
 * Parse quiz questions
 */
function parseQuizContent(text: string): any {
    const questions: any[] = [];
    const questionBlocks = text.split(/Question \d+:/i).filter(b => b.trim());

    for (const block of questionBlocks) {
        const lines = block.split('\n').filter(l => l.trim());
        const question: any = {
            question: lines[0]?.trim() || '',
            type: 'multiple-choice',
            options: [],
            correctAnswer: '',
            explanation: ''
        };

        for (const line of lines) {
            const optionMatch = line.match(/^[A-D]\)\s*(.+)/i);
            const answerMatch = line.match(/Correct Answer:\s*(.+)/i);
            const explanationMatch = line.match(/Explanation:\s*(.+)/i);

            if (optionMatch) {
                question.options.push(optionMatch[1].trim());
            } else if (answerMatch) {
                question.correctAnswer = answerMatch[1].trim();
            } else if (explanationMatch) {
                question.explanation = explanationMatch[1].trim();
            }
        }

        if (question.question) {
            questions.push(question);
        }
    }

    return { questions: questions.length > 0 ? questions : [] };
}

/**
 * Parse list content
 */
function parseListContent(text: string): any {
    const items: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
        const numberedMatch = line.match(/^\d+\.\s*(.+)/);
        const bulletMatch = line.match(/^[-•]\s*(.+)/);

        if (numberedMatch) {
            items.push(numberedMatch[1].trim());
        } else if (bulletMatch) {
            items.push(bulletMatch[1].trim());
        }
    }

    return {
        items: items.length > 0 ? items : [text.trim()],
        ordered: /^\d+\./.test(text)
    };
}

/**
 * Parse image alt text and caption
 */
function parseImageContent(text: string): any {
    const altMatch = text.match(/Alt Text:\s*(.+)/i);
    const captionMatch = text.match(/Caption:\s*(.+)/i);

    return {
        altText: altMatch ? altMatch[1].trim() : text.substring(0, 125),
        caption: captionMatch ? captionMatch[1].trim() : text
    };
}

/**
 * Parse lesson outline response into structured blocks
 */
function parseOutlineResponse(text: string): BlockOutline[] {
    const blocks: BlockOutline[] = [];
    const blockSections = text.split(/Block \d+:/i).filter(b => b.trim());

    for (const section of blockSections) {
        const lines = section.split('\n').filter(l => l.trim());
        const block: BlockOutline = {
            type: 'text',
            title: '',
            description: '',
            estimatedTime: 5,
            placeholderContent: {}
        };

        for (const line of lines) {
            const typeMatch = line.match(/Type:\s*(.+)/i);
            const titleMatch = line.match(/Title:\s*(.+)/i);
            const descMatch = line.match(/Description:\s*(.+)/i);
            const timeMatch = line.match(/Time:\s*(\d+)/i);

            if (typeMatch) {
                block.type = typeMatch[1].trim().toLowerCase();
            } else if (titleMatch) {
                block.title = titleMatch[1].trim();
            } else if (descMatch) {
                block.description = descMatch[1].trim();
            } else if (timeMatch) {
                block.estimatedTime = parseInt(timeMatch[1]);
            }
        }

        if (block.title) {
            blocks.push(block);
        }
    }

    return blocks;
}

/**
 * Generate placeholder content for a block
 */
function generatePlaceholderContent(blockType: string, title: string): any {
    switch (blockType) {
        case 'text':
            return { text: `[Placeholder for: ${title}]` };
        case 'video':
            return { title, description: '', url: '' };
        case 'code':
            return { code: '// Code example', language: 'javascript', explanation: '' };
        case 'reflection':
            return { prompt: title, minLength: 100 };
        case 'poll':
            return { question: title, options: [] };
        case 'quiz':
            return { questions: [] };
        case 'list':
            return { items: [], ordered: false };
        default:
            return { text: `[Placeholder for: ${title}]` };
    }
}

/**
 * Estimate token count (rough approximation)
 */
function estimateTokens(text: string): number {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
}
