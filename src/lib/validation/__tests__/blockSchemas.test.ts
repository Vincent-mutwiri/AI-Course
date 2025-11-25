import { describe, it, expect } from 'vitest';
import {
    textBlockSchema,
    videoBlockSchema,
    imageBlockSchema,
    codeBlockSchema,
    listBlockSchema,
    dividerBlockSchema,
    reflectionBlockSchema,
    pollBlockSchema,
    wordCloudBlockSchema,
} from '../blockSchemas';

describe('Block Validation Schemas', () => {
    describe('textBlockSchema', () => {
        it('validates valid text block', () => {
            const validBlock = {
                type: 'text' as const,
                content: { text: 'Hello World' },
            };
            const result = textBlockSchema.safeParse(validBlock);
            expect(result.success).toBe(true);
        });

        it('rejects empty text', () => {
            const invalidBlock = {
                type: 'text' as const,
                content: { text: '' },
            };
            const result = textBlockSchema.safeParse(invalidBlock);
            expect(result.success).toBe(false);
        });

        it('rejects text exceeding max length', () => {
            const invalidBlock = {
                type: 'text' as const,
                content: { text: 'a'.repeat(50001) },
            };
            const result = textBlockSchema.safeParse(invalidBlock);
            expect(result.success).toBe(false);
        });
    });

    describe('videoBlockSchema', () => {
        it('validates valid video block with embed', () => {
            const validBlock = {
                type: 'video' as const,
                content: {
                    videoUrl: 'https://www.youtube.com/watch?v=test',
                    videoSource: 'embed' as const,
                    videoProvider: 'youtube' as const,
                },
            };
            const result = videoBlockSchema.safeParse(validBlock);
            expect(result.success).toBe(true);
        });

        it('validates valid video block with upload', () => {
            const validBlock = {
                type: 'video' as const,
                content: {
                    videoUrl: 'https://s3.amazonaws.com/bucket/video.mp4',
                    videoSource: 'upload' as const,
                },
            };
            const result = videoBlockSchema.safeParse(validBlock);
            expect(result.success).toBe(true);
        });

        it('rejects invalid video source', () => {
            const invalidBlock = {
                type: 'video' as const,
                content: {
                    videoUrl: 'https://example.com/video.mp4',
                    videoSource: 'invalid' as any,
                },
            };
            const result = videoBlockSchema.safeParse(invalidBlock);
            expect(result.success).toBe(false);
        });
    });

    describe('imageBlockSchema', () => {
        it('validates valid image block', () => {
            const validBlock = {
                type: 'image' as const,
                content: {
                    imageUrl: 'https://example.com/image.jpg',
                    altText: 'Test image',
                    caption: 'A test caption',
                },
            };
            const result = imageBlockSchema.safeParse(validBlock);
            expect(result.success).toBe(true);
        });

        it('rejects missing alt text', () => {
            const invalidBlock = {
                type: 'image' as const,
                content: {
                    imageUrl: 'https://example.com/image.jpg',
                    altText: '',
                },
            };
            const result = imageBlockSchema.safeParse(invalidBlock);
            expect(result.success).toBe(false);
        });

        it('rejects invalid URL format', () => {
            const invalidBlock = {
                type: 'image' as const,
                content: {
                    imageUrl: 'not-a-url',
                    altText: 'Test',
                },
            };
            const result = imageBlockSchema.safeParse(invalidBlock);
            expect(result.success).toBe(false);
        });
    });

    describe('codeBlockSchema', () => {
        it('validates valid code block', () => {
            const validBlock = {
                type: 'code' as const,
                content: {
                    code: 'console.log("hello");',
                    language: 'javascript',
                },
            };
            const result = codeBlockSchema.safeParse(validBlock);
            expect(result.success).toBe(true);
        });

        it('rejects empty code', () => {
            const invalidBlock = {
                type: 'code' as const,
                content: {
                    code: '',
                    language: 'javascript',
                },
            };
            const result = codeBlockSchema.safeParse(invalidBlock);
            expect(result.success).toBe(false);
        });
    });

    describe('listBlockSchema', () => {
        it('validates valid list block', () => {
            const validBlock = {
                type: 'list' as const,
                content: {
                    listType: 'bullet' as const,
                    items: [{ text: 'Item 1' }, { text: 'Item 2' }],
                },
            };
            const result = listBlockSchema.safeParse(validBlock);
            expect(result.success).toBe(true);
        });

        it('rejects empty items array', () => {
            const invalidBlock = {
                type: 'list' as const,
                content: {
                    listType: 'bullet' as const,
                    items: [],
                },
            };
            const result = listBlockSchema.safeParse(invalidBlock);
            expect(result.success).toBe(false);
        });

        it('validates checkbox list with checked items', () => {
            const validBlock = {
                type: 'list' as const,
                content: {
                    listType: 'checkbox' as const,
                    items: [
                        { text: 'Item 1', checked: true },
                        { text: 'Item 2', checked: false },
                    ],
                },
            };
            const result = listBlockSchema.safeParse(validBlock);
            expect(result.success).toBe(true);
        });
    });

    describe('dividerBlockSchema', () => {
        it('validates valid divider block', () => {
            const validBlock = {
                type: 'divider' as const,
                content: {
                    style: 'solid' as const,
                    spacing: 'medium' as const,
                },
            };
            const result = dividerBlockSchema.safeParse(validBlock);
            expect(result.success).toBe(true);
        });

        it('validates divider with minimal content', () => {
            const validBlock = {
                type: 'divider' as const,
                content: {},
            };
            const result = dividerBlockSchema.safeParse(validBlock);
            expect(result.success).toBe(true);
        });
    });

    describe('reflectionBlockSchema', () => {
        it('validates valid reflection block', () => {
            const validBlock = {
                type: 'reflection' as const,
                content: {
                    question: 'What did you learn today?',
                    minLength: 100,
                },
            };
            const result = reflectionBlockSchema.safeParse(validBlock);
            expect(result.success).toBe(true);
        });

        it('rejects question shorter than 10 characters', () => {
            const invalidBlock = {
                type: 'reflection' as const,
                content: {
                    question: 'Short',
                },
            };
            const result = reflectionBlockSchema.safeParse(invalidBlock);
            expect(result.success).toBe(false);
        });
    });

    describe('pollBlockSchema', () => {
        it('validates valid poll block', () => {
            const validBlock = {
                type: 'poll' as const,
                content: {
                    question: 'What is your favorite color?',
                    options: [
                        { text: 'Red' },
                        { text: 'Blue' },
                    ],
                },
            };
            const result = pollBlockSchema.safeParse(validBlock);
            expect(result.success).toBe(true);
        });

        it('rejects poll with less than 2 options', () => {
            const invalidBlock = {
                type: 'poll' as const,
                content: {
                    question: 'What is your favorite color?',
                    options: [{ text: 'Red' }],
                },
            };
            const result = pollBlockSchema.safeParse(invalidBlock);
            expect(result.success).toBe(false);
        });
    });

    describe('wordCloudBlockSchema', () => {
        it('validates valid word cloud block', () => {
            const validBlock = {
                type: 'wordCloud' as const,
                content: {
                    prompt: 'Enter words that describe learning',
                    maxWords: 5,
                },
            };
            const result = wordCloudBlockSchema.safeParse(validBlock);
            expect(result.success).toBe(true);
        });

        it('rejects prompt shorter than 5 characters', () => {
            const invalidBlock = {
                type: 'wordCloud' as const,
                content: {
                    prompt: 'Hi',
                },
            };
            const result = wordCloudBlockSchema.safeParse(invalidBlock);
            expect(result.success).toBe(false);
        });
    });
});
