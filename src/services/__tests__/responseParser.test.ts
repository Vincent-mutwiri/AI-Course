import { describe, it, expect } from 'vitest';
import {
    parseTextBlock,
    parseCodeBlock,
    parseQuizQuestions,
    parseListItems,
    parseVideoScript,
    parseReflectionPrompts,
    parsePollData,
    parseBlockContent
} from '../responseParser';

describe('ResponseParser', () => {
    describe('parseTextBlock', () => {
        it('should clean and format text content', () => {
            const response = '  This is a test.  \n\n\n  Another paragraph.  ';
            const result = parseTextBlock(response);

            expect(result.text).toBe('This is a test.\n\nAnother paragraph.');
        });

        it('should remove markdown code blocks', () => {
            const response = 'Some text\n```javascript\ncode here\n```\nMore text';
            const result = parseTextBlock(response);

            expect(result.text).not.toContain('```');
            expect(result.text).toContain('Some text');
            expect(result.text).toContain('More text');
        });

        it('should handle empty response', () => {
            const result = parseTextBlock('');
            expect(result.text).toBe('');
        });
    });

    describe('parseCodeBlock', () => {
        it('should extract code from markdown code blocks', () => {
            const response = '```javascript\nconsole.log("Hello");\n```';
            const result = parseCodeBlock(response);

            expect(result.code).toBe('console.log("Hello");');
            expect(result.language).toBe('javascript');
        });

        it('should extract explanation text', () => {
            const response = 'This code prints hello.\n```javascript\nconsole.log("Hello");\n```\nIt uses console.log.';
            const result = parseCodeBlock(response);

            expect(result.code).toBe('console.log("Hello");');
            expect(result.explanation).toContain('This code prints hello');
        });

        it('should handle code without markdown blocks', () => {
            const response = 'function test() {\n  return true;\n}';
            const result = parseCodeBlock(response);

            expect(result.code).toContain('function test()');
            expect(result.language).toBe('javascript');
        });

        it('should provide fallback for empty response', () => {
            const result = parseCodeBlock('');
            expect(result.code).toBe('// No code generated');
        });
    });

    describe('parseQuizQuestions', () => {
        it('should parse JSON format questions', () => {
            const response = JSON.stringify([
                {
                    question: 'What is 2+2?',
                    options: ['3', '4', '5', '6'],
                    correctAnswer: 1,
                    explanation: 'Basic math'
                }
            ]);

            const result = parseQuizQuestions(response);

            expect(result).toHaveLength(1);
            expect(result[0].question).toBe('What is 2+2?');
            expect(result[0].options).toHaveLength(4);
            expect(result[0].correctAnswer).toBe(1);
        });

        it('should parse text format questions', () => {
            const response = `
Q: What is the capital of France?
A) London
B) Paris
C) Berlin
D) Madrid
Answer: B
Explanation: Paris is the capital.
      `;

            const result = parseQuizQuestions(response);

            expect(result).toHaveLength(1);
            expect(result[0].question).toContain('capital of France');
            expect(result[0].options).toHaveLength(4);
            expect(result[0].correctAnswer).toBe(1);
        });

        it('should provide fallback for malformed response', () => {
            const result = parseQuizQuestions('Invalid data');

            expect(result).toHaveLength(1);
            expect(result[0].options).toHaveLength(4);
        });
    });

    describe('parseListItems', () => {
        it('should parse numbered list', () => {
            const response = '1. First item\n2. Second item\n3. Third item';
            const result = parseListItems(response);

            expect(result.items).toHaveLength(3);
            expect(result.listType).toBe('numbered');
            expect(result.items[0].text).toBe('First item');
        });

        it('should parse bullet list', () => {
            const response = '- First item\n- Second item\n- Third item';
            const result = parseListItems(response);

            expect(result.items).toHaveLength(3);
            expect(result.listType).toBe('bullet');
        });

        it('should parse checkbox list', () => {
            const response = '- [ ] Unchecked item\n- [x] Checked item';
            const result = parseListItems(response);

            expect(result.items).toHaveLength(2);
            expect(result.listType).toBe('checkbox');
            expect(result.items[0].checked).toBe(false);
            expect(result.items[1].checked).toBe(true);
        });

        it('should handle plain text as list items', () => {
            const response = 'First item\nSecond item\nThird item';
            const result = parseListItems(response);

            expect(result.items.length).toBeGreaterThan(0);
        });
    });

    describe('parseVideoScript', () => {
        it('should parse structured video script', () => {
            const response = `
Title: Introduction to AI
Description: Learn the basics of AI
Script:
This is the main script content.
      `;

            const result = parseVideoScript(response);

            expect(result.title).toBe('Introduction to AI');
            expect(result.description).toContain('Learn the basics');
            expect(result.script).toContain('main script content');
        });

        it('should parse timestamps', () => {
            const response = `
0:00 - Introduction
This is the intro content.

1:30 - Main Content
This is the main content.
      `;

            const result = parseVideoScript(response);

            expect(result.sections).toBeDefined();
            expect(result.sections?.length).toBeGreaterThan(0);
        });

        it('should provide fallback structure', () => {
            const result = parseVideoScript('Some random text');

            expect(result.title).toBeDefined();
            expect(result.description).toBeDefined();
            expect(result.script).toBeDefined();
        });
    });

    describe('parseReflectionPrompts', () => {
        it('should parse multiple prompts', () => {
            const response = `
1. What did you learn today?
2. How will you apply this knowledge?
3. What questions do you still have?
      `;

            const result = parseReflectionPrompts(response);

            expect(result.prompts).toHaveLength(3);
            expect(result.selectedPrompt).toBe(result.prompts[0]);
        });

        it('should parse minimum length', () => {
            const response = `
What did you learn?
Minimum length: 150 words
      `;

            const result = parseReflectionPrompts(response);

            expect(result.minLength).toBe(150);
        });

        it('should provide default prompt', () => {
            const result = parseReflectionPrompts('');

            expect(result.prompts).toHaveLength(1);
            expect(result.minLength).toBe(100);
        });
    });

    describe('parsePollData', () => {
        it('should parse poll question and options', () => {
            const response = `
Question: What is your favorite programming language?
Options:
A) JavaScript
B) Python
C) Java
D) C++
      `;

            const result = parsePollData(response);

            expect(result.question).toContain('favorite programming language');
            expect(result.options).toHaveLength(4);
            expect(result.options[0]).toBe('JavaScript');
        });

        it('should parse discussion questions', () => {
            const response = `
Question: Do you agree?
Options:
- Yes
- No
Discussion:
- Why did you choose this answer?
- What factors influenced your decision?
      `;

            const result = parsePollData(response);

            expect(result.discussionQuestions).toBeDefined();
            expect(result.discussionQuestions?.length).toBeGreaterThan(0);
        });

        it('should provide default poll structure', () => {
            const result = parsePollData('');

            expect(result.question).toBeDefined();
            expect(result.options.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('parseBlockContent', () => {
        it('should route to correct parser for text blocks', () => {
            const result = parseBlockContent('Sample text', 'text');
            expect(result.text).toBe('Sample text');
        });

        it('should route to correct parser for code blocks', () => {
            const result = parseBlockContent('```js\ncode\n```', 'code');
            expect(result.code).toBeDefined();
        });

        it('should route to correct parser for quiz blocks', () => {
            const result = parseBlockContent('Q: Test?', 'finalAssessment');
            expect(result.questions).toBeDefined();
        });

        it('should handle unknown block types', () => {
            const result = parseBlockContent('Content', 'unknown');
            expect(result.text).toBe('Content');
        });
    });
});
