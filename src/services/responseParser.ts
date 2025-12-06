/**
 * ResponseParser Service
 * 
 * Parses and formats AI-generated responses into block-specific content structures.
 * Handles malformed responses with fallback strategies to ensure robust content generation.
 */

import type { IBlockContent } from '../types/page';

// Types for parsed content
export interface ParsedTextBlock {
    text: string;
}

export interface ParsedCodeBlock {
    code: string;
    language: string;
    explanation?: string;
}

export interface ParsedQuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    type?: 'multiple-choice' | 'true-false' | 'short-answer';
}

export interface ParsedListBlock {
    items: Array<{ text: string; checked?: boolean }>;
    listType: 'bullet' | 'numbered' | 'checkbox';
}

export interface ParsedVideoScript {
    title: string;
    description: string;
    script: string;
    sections?: Array<{
        timestamp: string;
        title: string;
        content: string;
    }>;
}

export interface ParsedReflectionPrompts {
    prompts: string[];
    selectedPrompt?: string;
    minLength?: number;
}

export interface ParsedPollData {
    question: string;
    options: string[];
    discussionQuestions?: string[];
}

/**
 * Parse text block content from AI response
 * Cleans and formats text content with proper structure
 */
export function parseTextBlock(response: string): ParsedTextBlock {
    try {
        // Remove excessive whitespace and normalize line breaks
        let text = response.trim();

        // Remove markdown code blocks if accidentally included
        text = text.replace(/```[\s\S]*?```/g, '');

        // Normalize multiple line breaks to maximum of 2
        text = text.replace(/\n{3,}/g, '\n\n');

        // Remove leading/trailing whitespace from each line
        text = text.split('\n').map(line => line.trim()).join('\n');

        return { text };
    } catch (error) {
        console.error('Error parsing text block:', error);
        // Fallback: return raw response
        return { text: response.trim() || 'Failed to generate content. Please try again.' };
    }
}

/**
 * Parse code block content from AI response
 * Extracts code, language, and explanation
 */
export function parseCodeBlock(response: string): ParsedCodeBlock {
    try {
        let code = '';
        let language = 'javascript';
        let explanation = '';

        // Try to extract code from markdown code blocks
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/;
        const match = response.match(codeBlockRegex);

        if (match) {
            language = match[1] || 'javascript';
            code = match[2].trim();

            // Extract explanation (text before or after code block)
            const parts = response.split(codeBlockRegex);
            explanation = (parts[0] + (parts[3] || '')).trim();
        } else {
            // No code block found, try to split by common patterns
            const lines = response.split('\n');
            const codeLines: string[] = [];
            const explanationLines: string[] = [];
            let inCode = false;

            for (const line of lines) {
                // Detect code-like lines (indented, contains common code patterns)
                if (line.match(/^[\s]{2,}/) || line.match(/[{};()=]/) || inCode) {
                    codeLines.push(line);
                    inCode = true;
                } else if (line.trim() === '') {
                    if (inCode) {
                        codeLines.push(line);
                    } else {
                        explanationLines.push(line);
                    }
                } else {
                    explanationLines.push(line);
                    inCode = false;
                }
            }

            code = codeLines.join('\n').trim();
            explanation = explanationLines.join('\n').trim();

            // If no code detected, use entire response as code
            if (!code) {
                code = response.trim();
            }
        }

        return {
            code: code || '// No code generated',
            language,
            explanation: explanation || undefined
        };
    } catch (error) {
        console.error('Error parsing code block:', error);
        // Fallback: return response as code
        return {
            code: response.trim() || '// Failed to generate code',
            language: 'javascript'
        };
    }
}

/**
 * Parse quiz questions from AI response
 * Extracts structured quiz data with questions, options, and answers
 */
export function parseQuizQuestions(response: string): ParsedQuizQuestion[] {
    try {
        const questions: ParsedQuizQuestion[] = [];

        // Try to parse JSON format first
        try {
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (Array.isArray(parsed)) {
                    return parsed.map(q => ({
                        question: q.question || '',
                        options: Array.isArray(q.options) ? q.options : [],
                        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
                        explanation: q.explanation,
                        type: q.type || 'multiple-choice'
                    }));
                }
            }
        } catch (e) {
            // Not JSON, continue with text parsing
        }

        // Parse text format
        const questionBlocks = response.split(/\n\s*\n/).filter(block => block.trim());

        for (const block of questionBlocks) {
            const lines = block.split('\n').map(l => l.trim()).filter(l => l);

            if (lines.length === 0) continue;

            // Extract question (first line or line starting with Q:, Question:, or number)
            let questionText = lines[0].replace(/^(\d+[\.)]\s*|Q:\s*|Question:\s*)/i, '').trim();

            // Extract options (lines starting with A), B), a., etc.)
            const options: string[] = [];
            let correctAnswer = 0;
            let explanation = '';

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];

                // Check for option markers
                const optionMatch = line.match(/^([A-Da-d][\.)]\s*|\*\s*|[-•]\s*)(.*)/);
                if (optionMatch) {
                    const optionText = optionMatch[2].trim();
                    // Check if marked as correct (with *, (correct), etc.)
                    if (line.includes('*') || line.toLowerCase().includes('correct')) {
                        correctAnswer = options.length;
                    }
                    options.push(optionText.replace(/\s*\(correct\)/i, '').replace(/\*+/g, '').trim());
                } else if (line.toLowerCase().startsWith('answer:') || line.toLowerCase().startsWith('correct:')) {
                    // Extract correct answer
                    const answerText = line.split(':')[1].trim();
                    const answerMatch = answerText.match(/^([A-Da-d])/i);
                    if (answerMatch) {
                        correctAnswer = answerMatch[1].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
                    }
                } else if (line.toLowerCase().startsWith('explanation:')) {
                    explanation = line.split(':').slice(1).join(':').trim();
                }
            }

            // Only add if we have a question and at least 2 options
            if (questionText && options.length >= 2) {
                questions.push({
                    question: questionText,
                    options,
                    correctAnswer: Math.max(0, Math.min(correctAnswer, options.length - 1)),
                    explanation: explanation || undefined,
                    type: 'multiple-choice'
                });
            }
        }

        // Fallback: create a single question from the response
        if (questions.length === 0) {
            questions.push({
                question: response.trim() || 'Sample question',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 0,
                type: 'multiple-choice'
            });
        }

        return questions;
    } catch (error) {
        console.error('Error parsing quiz questions:', error);
        // Fallback: return a default question
        return [{
            question: 'Failed to parse quiz questions. Please regenerate.',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            type: 'multiple-choice'
        }];
    }
}

/**
 * Parse list items from AI response
 * Extracts list items and detects list type
 */
export function parseListItems(response: string): ParsedListBlock {
    try {
        const items: Array<{ text: string; checked?: boolean }> = [];
        let listType: 'bullet' | 'numbered' | 'checkbox' = 'bullet';

        const lines = response.split('\n').map(l => l.trim()).filter(l => l);

        let hasNumbered = false;
        let hasCheckbox = false;
        let hasBullet = false;

        for (const line of lines) {
            // Skip empty lines and headers
            if (!line || line.startsWith('#')) continue;

            // Check for numbered list (1. or 1) format)
            const numberedMatch = line.match(/^\d+[\.)]\s+(.+)/);
            if (numberedMatch) {
                items.push({ text: numberedMatch[1].trim() });
                hasNumbered = true;
                continue;
            }

            // Check for checkbox list ([ ] or [x] format)
            const checkboxMatch = line.match(/^[-*]?\s*\[([ xX])\]\s+(.+)/);
            if (checkboxMatch) {
                items.push({
                    text: checkboxMatch[2].trim(),
                    checked: checkboxMatch[1].toLowerCase() === 'x'
                });
                hasCheckbox = true;
                continue;
            }

            // Check for bullet list (-, *, • format)
            const bulletMatch = line.match(/^[-*•]\s+(.+)/);
            if (bulletMatch) {
                items.push({ text: bulletMatch[1].trim() });
                hasBullet = true;
                continue;
            }

            // If no marker found but we have items, treat as continuation
            // Otherwise, treat as a new bullet item
            if (items.length === 0 || line.match(/^[A-Z]/)) {
                items.push({ text: line });
            } else {
                // Append to last item
                items[items.length - 1].text += ' ' + line;
            }
        }

        // Determine list type based on what we found
        if (hasCheckbox) {
            listType = 'checkbox';
        } else if (hasNumbered) {
            listType = 'numbered';
        } else {
            listType = 'bullet';
        }

        // Fallback: if no items found, create from paragraphs
        if (items.length === 0) {
            const paragraphs = response.split(/\n\s*\n/).filter(p => p.trim());
            paragraphs.forEach(p => {
                items.push({ text: p.trim() });
            });
        }

        return { items, listType };
    } catch (error) {
        console.error('Error parsing list items:', error);
        // Fallback: return response as single item
        return {
            items: [{ text: response.trim() || 'Failed to generate list items' }],
            listType: 'bullet'
        };
    }
}

/**
 * Parse video script from AI response
 * Extracts title, description, script, and timestamps
 */
export function parseVideoScript(response: string): ParsedVideoScript {
    try {
        let title = '';
        let description = '';
        let script = '';
        const sections: Array<{ timestamp: string; title: string; content: string }> = [];

        const lines = response.split('\n');
        let currentSection: 'title' | 'description' | 'script' | 'sections' = 'title';
        let currentTimestamp = '';
        let currentSectionTitle = '';
        let currentSectionContent: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Skip empty lines
            if (!line) continue;

            // Detect sections
            if (line.toLowerCase().includes('title:')) {
                currentSection = 'title';
                title = line.split(':').slice(1).join(':').trim();
                continue;
            }

            if (line.toLowerCase().includes('description:')) {
                currentSection = 'description';
                description = line.split(':').slice(1).join(':').trim();
                continue;
            }

            if (line.toLowerCase().includes('script:')) {
                currentSection = 'script';
                continue;
            }

            // Detect timestamps (00:00, 0:00, [00:00], etc.)
            const timestampMatch = line.match(/^\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*[-:]?\s*(.+)?/);
            if (timestampMatch) {
                // Save previous section if exists
                if (currentTimestamp && currentSectionContent.length > 0) {
                    sections.push({
                        timestamp: currentTimestamp,
                        title: currentSectionTitle,
                        content: currentSectionContent.join('\n').trim()
                    });
                }

                currentTimestamp = timestampMatch[1];
                currentSectionTitle = timestampMatch[2] || '';
                currentSectionContent = [];
                currentSection = 'sections';
                continue;
            }

            // Add content to appropriate section
            switch (currentSection) {
                case 'title':
                    if (!title) title = line;
                    break;
                case 'description':
                    description += (description ? ' ' : '') + line;
                    break;
                case 'script':
                    script += (script ? '\n' : '') + line;
                    break;
                case 'sections':
                    if (line.startsWith('#')) {
                        currentSectionTitle = line.replace(/^#+\s*/, '');
                    } else {
                        currentSectionContent.push(line);
                    }
                    break;
            }
        }

        // Save last section
        if (currentTimestamp && currentSectionContent.length > 0) {
            sections.push({
                timestamp: currentTimestamp,
                title: currentSectionTitle,
                content: currentSectionContent.join('\n').trim()
            });
        }

        // If no structured format found, extract from plain text
        if (!title && !description && !script) {
            const paragraphs = response.split(/\n\s*\n/).filter(p => p.trim());
            if (paragraphs.length > 0) {
                title = paragraphs[0].split('\n')[0].replace(/^#+\s*/, '').trim();
                description = paragraphs.length > 1 ? paragraphs[1].trim() : '';
                script = paragraphs.slice(2).join('\n\n');
            }
        }

        // Ensure we have at least basic content
        if (!title) title = 'Video Title';
        if (!description) description = 'Video description';
        if (!script) script = response.trim();

        return {
            title,
            description,
            script,
            sections: sections.length > 0 ? sections : undefined
        };
    } catch (error) {
        console.error('Error parsing video script:', error);
        // Fallback: return basic structure
        return {
            title: 'Video Title',
            description: 'Video description',
            script: response.trim() || 'Failed to generate video script'
        };
    }
}

/**
 * Parse reflection prompts from AI response
 * Extracts multiple prompt options
 */
export function parseReflectionPrompts(response: string): ParsedReflectionPrompts {
    try {
        const prompts: string[] = [];
        let minLength: number | undefined;

        const lines = response.split('\n').map(l => l.trim()).filter(l => l);

        for (const line of lines) {
            // Skip headers and empty lines
            if (line.startsWith('#') || !line) continue;

            // Check for minimum length specification
            const lengthMatch = line.match(/minimum\s+(?:length|words?):\s*(\d+)/i);
            if (lengthMatch) {
                minLength = parseInt(lengthMatch[1]);
                continue;
            }

            // Extract prompts (numbered, bulleted, or plain)
            const promptMatch = line.match(/^(?:\d+[\.)]\s*|[-*•]\s*)?(.+)/);
            if (promptMatch) {
                const promptText = promptMatch[1].trim();
                // Only add substantial prompts (more than 10 characters)
                if (promptText.length > 10 && !promptText.toLowerCase().startsWith('prompt')) {
                    prompts.push(promptText);
                }
            }
        }

        // If no prompts found, split by double newlines
        if (prompts.length === 0) {
            const paragraphs = response.split(/\n\s*\n/).filter(p => p.trim());
            paragraphs.forEach(p => {
                const cleaned = p.trim().replace(/^(?:\d+[\.)]\s*|[-*•]\s*)/, '');
                if (cleaned.length > 10) {
                    prompts.push(cleaned);
                }
            });
        }

        // Fallback: use entire response as single prompt
        if (prompts.length === 0) {
            prompts.push(response.trim() || 'Reflect on what you learned in this lesson.');
        }

        return {
            prompts,
            selectedPrompt: prompts[0],
            minLength: minLength || 100
        };
    } catch (error) {
        console.error('Error parsing reflection prompts:', error);
        // Fallback: return default prompt
        return {
            prompts: ['Reflect on what you learned in this lesson.'],
            selectedPrompt: 'Reflect on what you learned in this lesson.',
            minLength: 100
        };
    }
}

/**
 * Parse poll data from AI response
 * Extracts question, options, and discussion questions
 */
export function parsePollData(response: string): ParsedPollData {
    try {
        let question = '';
        const options: string[] = [];
        const discussionQuestions: string[] = [];

        const lines = response.split('\n').map(l => l.trim()).filter(l => l);
        let currentSection: 'question' | 'options' | 'discussion' = 'question';

        for (const line of lines) {
            // Skip empty lines
            if (!line) continue;

            // Detect sections
            if (line.toLowerCase().includes('question:')) {
                currentSection = 'question';
                question = line.split(':').slice(1).join(':').trim();
                continue;
            }

            if (line.toLowerCase().includes('options:') || line.toLowerCase().includes('choices:')) {
                currentSection = 'options';
                continue;
            }

            if (line.toLowerCase().includes('discussion:') || line.toLowerCase().includes('follow-up:')) {
                currentSection = 'discussion';
                continue;
            }

            // Parse based on current section
            switch (currentSection) {
                case 'question':
                    if (!question) {
                        question = line.replace(/^#+\s*/, '').replace(/^\d+[\.)]\s*/, '');
                    }
                    break;

                case 'options':
                    // Extract option (with or without markers)
                    const optionMatch = line.match(/^(?:[A-Da-d][\.)]\s*|[-*•]\s*|\d+[\.)]\s*)?(.+)/);
                    if (optionMatch && optionMatch[1].trim().length > 0) {
                        options.push(optionMatch[1].trim());
                    }
                    break;

                case 'discussion':
                    // Extract discussion question
                    const discussionMatch = line.match(/^(?:[-*•]\s*|\d+[\.)]\s*)?(.+)/);
                    if (discussionMatch && discussionMatch[1].trim().length > 0) {
                        discussionQuestions.push(discussionMatch[1].trim());
                    }
                    break;
            }
        }

        // If no structured format, try to extract from plain text
        if (!question || options.length === 0) {
            const paragraphs = response.split(/\n\s*\n/).filter(p => p.trim());

            if (paragraphs.length > 0) {
                // First paragraph is question
                question = paragraphs[0].split('\n')[0].replace(/^#+\s*/, '').trim();

                // Look for options in subsequent paragraphs
                for (let i = 1; i < paragraphs.length; i++) {
                    const lines = paragraphs[i].split('\n').map(l => l.trim()).filter(l => l);
                    for (const line of lines) {
                        const optionMatch = line.match(/^(?:[A-Da-d][\.)]\s*|[-*•]\s*|\d+[\.)]\s*)?(.+)/);
                        if (optionMatch && options.length < 5) {
                            options.push(optionMatch[1].trim());
                        }
                    }
                }
            }
        }

        // Ensure we have minimum required data
        if (!question) {
            question = 'What is your opinion on this topic?';
        }

        if (options.length < 2) {
            options.length = 0;
            options.push('Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree');
        }

        return {
            question,
            options,
            discussionQuestions: discussionQuestions.length > 0 ? discussionQuestions : undefined
        };
    } catch (error) {
        console.error('Error parsing poll data:', error);
        // Fallback: return default poll
        return {
            question: 'What is your opinion on this topic?',
            options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
        };
    }
}

/**
 * Generic parser that routes to specific parsers based on block type
 */
export function parseBlockContent(response: string, blockType: string): any {
    switch (blockType) {
        case 'text':
            return parseTextBlock(response);
        case 'code':
            return parseCodeBlock(response);
        case 'finalAssessment':
            return { questions: parseQuizQuestions(response) };
        case 'list':
            return parseListItems(response);
        case 'video':
            return parseVideoScript(response);
        case 'reflection':
            return parseReflectionPrompts(response);
        case 'poll':
            return parsePollData(response);
        default:
            return { text: response.trim() };
    }
}
