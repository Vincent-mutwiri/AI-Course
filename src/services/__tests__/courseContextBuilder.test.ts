import { describe, it, expect } from 'vitest';
import { CourseContextBuilder, CourseContextInput } from '../courseContextBuilder';
import { IBlock } from '@/types/page';

describe('CourseContextBuilder', () => {
    describe('buildContext', () => {
        it('should build context with all available data', () => {
            const input: CourseContextInput = {
                courseId: 'course-123',
                courseTitle: 'Introduction to AI',
                moduleId: 'module-456',
                moduleName: 'Machine Learning Basics',
                lessonId: 'lesson-789',
                lessonTitle: 'Neural Networks',
                learningObjectives: ['Understand neural networks', 'Build a simple model'],
                existingBlocks: []
            };

            const context = CourseContextBuilder.buildContext(input);

            expect(context.courseId).toBe('course-123');
            expect(context.courseTitle).toBe('Introduction to AI');
            expect(context.moduleId).toBe('module-456');
            expect(context.moduleName).toBe('Machine Learning Basics');
            expect(context.lessonId).toBe('lesson-789');
            expect(context.lessonName).toBe('Neural Networks');
            expect(context.learningObjectives).toEqual(['Understand neural networks', 'Build a simple model']);
        });

        it('should handle missing data gracefully', () => {
            const input: CourseContextInput = {
                courseTitle: 'Test Course'
            };

            const context = CourseContextBuilder.buildContext(input);

            expect(context.courseTitle).toBe('Test Course');
            expect(context.courseId).toBeUndefined();
            expect(context.moduleId).toBeUndefined();
            expect(context.lessonId).toBeUndefined();
        });

        it('should combine lesson objective with learning objectives', () => {
            const input: CourseContextInput = {
                courseTitle: 'Test Course',
                learningObjectives: ['Objective 1', 'Objective 2'],
                lessonObjective: 'Lesson specific objective'
            };

            const context = CourseContextBuilder.buildContext(input);

            expect(context.learningObjectives).toHaveLength(3);
            expect(context.learningObjectives).toContain('Objective 1');
            expect(context.learningObjectives).toContain('Objective 2');
            expect(context.learningObjectives).toContain('Lesson specific objective');
        });

        it('should not duplicate lesson objective if already in learning objectives', () => {
            const input: CourseContextInput = {
                courseTitle: 'Test Course',
                learningObjectives: ['Objective 1', 'Shared objective'],
                lessonObjective: 'Shared objective'
            };

            const context = CourseContextBuilder.buildContext(input);

            expect(context.learningObjectives).toHaveLength(2);
            expect(context.learningObjectives?.filter(obj => obj === 'Shared objective')).toHaveLength(1);
        });
    });

    describe('summarizeExistingContent', () => {
        it('should return message for no blocks', () => {
            const summary = CourseContextBuilder.summarizeExistingContent([]);
            expect(summary).toBe('No existing content in this lesson.');
        });

        it('should summarize text blocks', () => {
            const blocks: IBlock[] = [
                {
                    id: '1',
                    type: 'text',
                    order: 0,
                    content: { text: 'This is a sample text block with some content.' }
                }
            ];

            const summary = CourseContextBuilder.summarizeExistingContent(blocks);
            expect(summary).toContain('1 block(s)');
            expect(summary).toContain('text');
            expect(summary).toContain('This is a sample text block with some content.');
        });

        it('should summarize video blocks', () => {
            const blocks: IBlock[] = [
                {
                    id: '1',
                    type: 'video',
                    order: 0,
                    content: {
                        videoUrl: 'https://example.com/video.mp4',
                        title: 'Introduction Video'
                    }
                }
            ];

            const summary = CourseContextBuilder.summarizeExistingContent(blocks);
            expect(summary).toContain('video');
            expect(summary).toContain('Introduction Video');
        });

        it('should summarize code blocks', () => {
            const blocks: IBlock[] = [
                {
                    id: '1',
                    type: 'code',
                    order: 0,
                    content: {
                        code: 'console.log("Hello");',
                        language: 'javascript'
                    }
                }
            ];

            const summary = CourseContextBuilder.summarizeExistingContent(blocks);
            expect(summary).toContain('code');
            expect(summary).toContain('javascript');
        });

        it('should summarize list blocks', () => {
            const blocks: IBlock[] = [
                {
                    id: '1',
                    type: 'list',
                    order: 0,
                    content: {
                        items: [
                            { text: 'Item 1' },
                            { text: 'Item 2' },
                            { text: 'Item 3' }
                        ],
                        listType: 'numbered'
                    }
                }
            ];

            const summary = CourseContextBuilder.summarizeExistingContent(blocks);
            expect(summary).toContain('list');
            expect(summary).toContain('3 item(s)');
            expect(summary).toContain('numbered');
        });

        it('should group multiple blocks by type', () => {
            const blocks: IBlock[] = [
                {
                    id: '1',
                    type: 'text',
                    order: 0,
                    content: { text: 'First text block' }
                },
                {
                    id: '2',
                    type: 'text',
                    order: 1,
                    content: { text: 'Second text block' }
                },
                {
                    id: '3',
                    type: 'video',
                    order: 2,
                    content: { videoUrl: 'https://example.com/video.mp4' }
                }
            ];

            const summary = CourseContextBuilder.summarizeExistingContent(blocks);
            expect(summary).toContain('3 block(s)');
            expect(summary).toContain('2 text blocks');
            expect(summary).toContain('1 video');
        });

        it('should truncate long text content', () => {
            const longText = 'A'.repeat(200);
            const blocks: IBlock[] = [
                {
                    id: '1',
                    type: 'text',
                    order: 0,
                    content: { text: longText }
                }
            ];

            const summary = CourseContextBuilder.summarizeExistingContent(blocks);
            expect(summary).toContain('...');
            expect(summary.length).toBeLessThan(longText.length + 100);
        });
    });

    describe('hasMinimumContext', () => {
        it('should return true when course title is present', () => {
            const context = CourseContextBuilder.buildContext({
                courseTitle: 'Test Course'
            });
            expect(CourseContextBuilder.hasMinimumContext(context)).toBe(true);
        });

        it('should return true when lesson name is present', () => {
            const context = CourseContextBuilder.buildContext({
                lessonTitle: 'Test Lesson'
            });
            expect(CourseContextBuilder.hasMinimumContext(context)).toBe(true);
        });

        it('should return false when neither course title nor lesson name is present', () => {
            const context = CourseContextBuilder.buildContext({
                moduleId: 'module-123'
            });
            expect(CourseContextBuilder.hasMinimumContext(context)).toBe(false);
        });
    });

    describe('getContextSummary', () => {
        it('should generate summary with all context information', () => {
            const context = CourseContextBuilder.buildContext({
                courseTitle: 'AI Course',
                moduleName: 'Module 1',
                lessonTitle: 'Lesson 1',
                learningObjectives: ['Learn AI', 'Build models']
            });

            const summary = CourseContextBuilder.getContextSummary(context);
            expect(summary).toContain('AI Course');
            expect(summary).toContain('Module 1');
            expect(summary).toContain('Lesson 1');
            expect(summary).toContain('Learn AI');
            expect(summary).toContain('Build models');
        });

        it('should handle minimal context', () => {
            const context = CourseContextBuilder.buildContext({
                courseTitle: 'Test Course'
            });

            const summary = CourseContextBuilder.getContextSummary(context);
            expect(summary).toContain('Test Course');
        });

        it('should return default message when no context', () => {
            const context = CourseContextBuilder.buildContext({});
            const summary = CourseContextBuilder.getContextSummary(context);
            expect(summary).toBe('No specific course context available.');
        });

        it('should include existing blocks summary', () => {
            const blocks: IBlock[] = [
                {
                    id: '1',
                    type: 'text',
                    order: 0,
                    content: { text: 'Sample text' }
                }
            ];

            const context = CourseContextBuilder.buildContext({
                courseTitle: 'Test Course',
                existingBlocks: blocks
            });

            const summary = CourseContextBuilder.getContextSummary(context);
            expect(summary).toContain('1 block(s)');
        });
    });

    describe('formatContext', () => {
        it('should format context for display', () => {
            const context = CourseContextBuilder.buildContext({
                courseTitle: 'AI Course',
                moduleName: 'Module 1',
                lessonTitle: 'Lesson 1',
                learningObjectives: ['Objective 1']
            });

            const formatted = CourseContextBuilder.formatContext(context);
            expect(formatted).toContain('Course: AI Course');
            expect(formatted).toContain('Module: Module 1');
            expect(formatted).toContain('Lesson: Lesson 1');
            expect(formatted).toContain('Objectives: Objective 1');
        });

        it('should return default message for empty context', () => {
            const context = CourseContextBuilder.buildContext({});
            const formatted = CourseContextBuilder.formatContext(context);
            expect(formatted).toBe('No context available');
        });
    });
});
