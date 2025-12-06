import { describe, it, expect, beforeEach, vi } from 'vitest';
import { aiContentCache, BlockType, CourseContext, GenerationOptions } from '../aiContentCache';

describe('aiContentCache', () => {
    const mockContext: CourseContext = {
        courseId: 'course-123',
        courseTitle: 'Test Course',
        moduleId: 'module-1',
        moduleName: 'Module 1',
        lessonId: 'lesson-1',
        lessonName: 'Lesson 1',
    };

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        aiContentCache.resetStats();
    });

    describe('cache key generation', () => {
        it('should generate unique keys for different block types', () => {
            const content1 = { text: 'Content 1' };
            const content2 = { text: 'Content 2' };

            aiContentCache.set('text', 'test prompt', mockContext, content1);
            aiContentCache.set('video', 'test prompt', mockContext, content2);

            const cached1 = aiContentCache.get('text', 'test prompt', mockContext);
            const cached2 = aiContentCache.get('video', 'test prompt', mockContext);

            expect(cached1).toEqual(content1);
            expect(cached2).toEqual(content2);
        });

        it('should generate unique keys for different prompts', () => {
            const content1 = { text: 'Content 1' };
            const content2 = { text: 'Content 2' };

            aiContentCache.set('text', 'prompt 1', mockContext, content1);
            aiContentCache.set('text', 'prompt 2', mockContext, content2);

            const cached1 = aiContentCache.get('text', 'prompt 1', mockContext);
            const cached2 = aiContentCache.get('text', 'prompt 2', mockContext);

            expect(cached1).toEqual(content1);
            expect(cached2).toEqual(content2);
        });

        it('should generate unique keys for different contexts', () => {
            const content1 = { text: 'Content 1' };
            const content2 = { text: 'Content 2' };
            const context2 = { ...mockContext, courseId: 'course-456' };

            aiContentCache.set('text', 'test prompt', mockContext, content1);
            aiContentCache.set('text', 'test prompt', context2, content2);

            const cached1 = aiContentCache.get('text', 'test prompt', mockContext);
            const cached2 = aiContentCache.get('text', 'test prompt', context2);

            expect(cached1).toEqual(content1);
            expect(cached2).toEqual(content2);
        });

        it('should generate unique keys for different options', () => {
            const content1 = { text: 'Content 1' };
            const content2 = { text: 'Content 2' };
            const options1: GenerationOptions = { tone: 'formal' };
            const options2: GenerationOptions = { tone: 'conversational' };

            aiContentCache.set('text', 'test prompt', mockContext, content1, options1);
            aiContentCache.set('text', 'test prompt', mockContext, content2, options2);

            const cached1 = aiContentCache.get('text', 'test prompt', mockContext, options1);
            const cached2 = aiContentCache.get('text', 'test prompt', mockContext, options2);

            expect(cached1).toEqual(content1);
            expect(cached2).toEqual(content2);
        });
    });

    describe('localStorage-based caching', () => {
        it('should store and retrieve content from localStorage', () => {
            const content = { text: 'Test content' };

            aiContentCache.set('text', 'test prompt', mockContext, content);
            const cached = aiContentCache.get('text', 'test prompt', mockContext);

            expect(cached).toEqual(content);
        });

        it('should return null for non-existent cache entries', () => {
            const cached = aiContentCache.get('text', 'non-existent', mockContext);
            expect(cached).toBeNull();
        });

        it('should check if content is cached', () => {
            const content = { text: 'Test content' };

            expect(aiContentCache.has('text', 'test prompt', mockContext)).toBe(false);

            aiContentCache.set('text', 'test prompt', mockContext, content);

            expect(aiContentCache.has('text', 'test prompt', mockContext)).toBe(true);
        });
    });

    describe('7-day expiration', () => {
        it('should expire content after 7 days', () => {
            const content = { text: 'Test content' };

            // Mock Date.now to set initial time
            const now = Date.now();
            vi.spyOn(Date, 'now').mockReturnValue(now);

            aiContentCache.set('text', 'test prompt', mockContext, content);

            // Fast forward 6 days - should still be cached
            vi.spyOn(Date, 'now').mockReturnValue(now + 6 * 24 * 60 * 60 * 1000);
            expect(aiContentCache.get('text', 'test prompt', mockContext)).toEqual(content);

            // Fast forward 8 days - should be expired
            vi.spyOn(Date, 'now').mockReturnValue(now + 8 * 24 * 60 * 60 * 1000);
            expect(aiContentCache.get('text', 'test prompt', mockContext)).toBeNull();

            vi.restoreAllMocks();
        });

        it('should clear expired entries', () => {
            const content = { text: 'Test content' };

            const now = Date.now();
            vi.spyOn(Date, 'now').mockReturnValue(now);

            aiContentCache.set('text', 'old prompt', mockContext, content);

            // Fast forward 8 days
            vi.spyOn(Date, 'now').mockReturnValue(now + 8 * 24 * 60 * 60 * 1000);

            aiContentCache.set('text', 'new prompt', mockContext, content);

            aiContentCache.clearExpired();

            expect(aiContentCache.has('text', 'old prompt', mockContext)).toBe(false);
            expect(aiContentCache.has('text', 'new prompt', mockContext)).toBe(true);

            vi.restoreAllMocks();
        });
    });

    describe('LRU eviction with max 50 entries per course', () => {
        it('should evict least recently used entries when exceeding 50 entries', () => {
            const content = { text: 'Test content' };

            // Add 51 entries
            for (let i = 0; i < 51; i++) {
                aiContentCache.set('text', `prompt ${i}`, mockContext, { ...content, index: i });
            }

            // Should have max 50 entries
            expect(aiContentCache.getCourseEntryCount(mockContext.courseId)).toBeLessThanOrEqual(50);

            // First entry should be evicted
            expect(aiContentCache.get('text', 'prompt 0', mockContext)).toBeNull();

            // Last entry should still exist
            expect(aiContentCache.get('text', 'prompt 50', mockContext)).toEqual({ ...content, index: 50 });
        });

        it('should update last accessed time on cache hit', () => {
            const content = { text: 'Test content' };

            const now = Date.now();
            vi.spyOn(Date, 'now').mockReturnValue(now);

            // Add 50 entries
            for (let i = 0; i < 50; i++) {
                aiContentCache.set('text', `prompt ${i}`, mockContext, { ...content, index: i });
            }

            // Fast forward 1 hour
            vi.spyOn(Date, 'now').mockReturnValue(now + 60 * 60 * 1000);

            // Access the first entry to update its lastAccessed time
            const firstEntry = aiContentCache.get('text', 'prompt 0', mockContext);
            expect(firstEntry).toEqual({ ...content, index: 0 });

            // Add one more entry (should trigger eviction)
            aiContentCache.set('text', 'new prompt', mockContext, content);

            // First entry should still exist because it was accessed recently
            // The second entry (prompt 1) should be evicted instead
            expect(aiContentCache.get('text', 'prompt 0', mockContext)).toEqual({ ...content, index: 0 });
            expect(aiContentCache.get('text', 'prompt 1', mockContext)).toBeNull();

            vi.restoreAllMocks();
        });

        it('should isolate cache by course', () => {
            const content = { text: 'Test content' };
            const context2 = { ...mockContext, courseId: 'course-456' };

            // Add 51 entries to course 1
            for (let i = 0; i < 51; i++) {
                aiContentCache.set('text', `prompt ${i}`, mockContext, { ...content, index: i });
            }

            // Add 1 entry to course 2
            aiContentCache.set('text', 'course 2 prompt', context2, content);

            // Course 1 should have max 50 entries
            expect(aiContentCache.getCourseEntryCount(mockContext.courseId)).toBeLessThanOrEqual(50);

            // Course 2 should have 1 entry
            expect(aiContentCache.getCourseEntryCount(context2.courseId)).toBe(1);
        });
    });

    describe('cache statistics tracking', () => {
        it('should track cache hits and misses', () => {
            const content = { text: 'Test content' };

            // Initial stats
            let stats = aiContentCache.getStats();
            expect(stats.hits).toBe(0);
            expect(stats.misses).toBe(0);
            expect(stats.totalRequests).toBe(0);
            expect(stats.hitRate).toBe(0);

            // Cache miss
            aiContentCache.get('text', 'test prompt', mockContext);
            stats = aiContentCache.getStats();
            expect(stats.misses).toBe(1);
            expect(stats.totalRequests).toBe(1);

            // Set content
            aiContentCache.set('text', 'test prompt', mockContext, content);

            // Cache hit
            aiContentCache.get('text', 'test prompt', mockContext);
            stats = aiContentCache.getStats();
            expect(stats.hits).toBe(1);
            expect(stats.misses).toBe(1);
            expect(stats.totalRequests).toBe(2);
            expect(stats.hitRate).toBe(50);
        });

        it('should calculate hit rate correctly', () => {
            const content = { text: 'Test content' };

            aiContentCache.set('text', 'test prompt', mockContext, content);

            // 3 hits
            aiContentCache.get('text', 'test prompt', mockContext);
            aiContentCache.get('text', 'test prompt', mockContext);
            aiContentCache.get('text', 'test prompt', mockContext);

            // 1 miss
            aiContentCache.get('text', 'non-existent', mockContext);

            const stats = aiContentCache.getStats();
            expect(stats.hits).toBe(3);
            expect(stats.misses).toBe(1);
            expect(stats.totalRequests).toBe(4);
            expect(stats.hitRate).toBe(75);
        });

        it('should reset statistics', () => {
            const content = { text: 'Test content' };

            aiContentCache.set('text', 'test prompt', mockContext, content);
            aiContentCache.get('text', 'test prompt', mockContext);
            aiContentCache.get('text', 'non-existent', mockContext);

            aiContentCache.resetStats();

            const stats = aiContentCache.getStats();
            expect(stats.hits).toBe(0);
            expect(stats.misses).toBe(0);
            expect(stats.totalRequests).toBe(0);
            expect(stats.hitRate).toBe(0);
        });
    });

    describe('cache management', () => {
        it('should clear all cache entries for a course', () => {
            const content = { text: 'Test content' };
            const context2 = { ...mockContext, courseId: 'course-456' };

            aiContentCache.set('text', 'prompt 1', mockContext, content);
            aiContentCache.set('text', 'prompt 2', mockContext, content);
            aiContentCache.set('text', 'prompt 3', context2, content);

            aiContentCache.clearCourse(mockContext.courseId);

            expect(aiContentCache.getCourseEntryCount(mockContext.courseId)).toBe(0);
            expect(aiContentCache.getCourseEntryCount(context2.courseId)).toBe(1);
        });
    });
});
