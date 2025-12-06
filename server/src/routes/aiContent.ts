import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import {
    generateBlockContent,
    refineContent,
    generateLessonOutline
} from "../services/aiService";
import AIUsage from "../models/AIUsage";
import crypto from "crypto";

const router = Router();

// In-memory cache for generated content (simple implementation)
// In production, consider using Redis or similar
const contentCache = new Map<string, { content: any; timestamp: number }>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const MAX_CACHE_SIZE = 1000;

/**
 * Generate cache key from request parameters
 */
function generateCacheKey(
    blockType: string,
    prompt: string,
    context: any,
    options: any
): string {
    const data = JSON.stringify({ blockType, prompt, context, options });
    return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * Get content from cache if available and not expired
 */
function getFromCache(cacheKey: string): any | null {
    const cached = contentCache.get(cacheKey);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > CACHE_TTL) {
        contentCache.delete(cacheKey);
        return null;
    }

    return cached.content;
}

/**
 * Store content in cache with LRU eviction
 */
function storeInCache(cacheKey: string, content: any): void {
    // Simple LRU: if cache is full, remove oldest entry
    if (contentCache.size >= MAX_CACHE_SIZE) {
        const firstKey = contentCache.keys().next().value;
        if (firstKey) {
            contentCache.delete(firstKey);
        }
    }

    contentCache.set(cacheKey, {
        content,
        timestamp: Date.now()
    });
}

/**
 * Track AI usage in database
 */
async function trackUsage(
    userId: string,
    courseId: string | undefined,
    blockType: string,
    generationType: 'generate' | 'refine' | 'outline',
    promptLength: number,
    responseLength: number,
    tokensUsed: number | undefined,
    cached: boolean
): Promise<void> {
    try {
        await AIUsage.create({
            userId,
            courseId,
            blockType,
            generationType,
            promptLength,
            responseLength,
            tokensUsed,
            cached,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Failed to track AI usage:', error);
        // Don't throw - tracking failure shouldn't break the request
    }
}

/**
 * POST /api/ai/generate-content
 * Generate content for a specific block type
 */
router.post(
    "/generate-content",
    authenticate,
    requireAdmin,
    async (req: AuthRequest, res: Response) => {
        try {
            const { blockType, prompt, context, options } = req.body;

            // Validate required fields
            if (!blockType || typeof blockType !== 'string') {
                return res.status(400).json({
                    message: 'blockType is required and must be a string'
                });
            }

            if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
                return res.status(400).json({
                    message: 'prompt is required and must be a non-empty string'
                });
            }

            if (!context || typeof context !== 'object') {
                return res.status(400).json({
                    message: 'context is required and must be an object'
                });
            }

            // Validate context has required fields
            const requiredContextFields = ['courseId', 'courseTitle', 'moduleId', 'moduleName', 'lessonId', 'lessonName'];
            for (const field of requiredContextFields) {
                if (!context[field]) {
                    return res.status(400).json({
                        message: `context.${field} is required`
                    });
                }
            }

            // Generate cache key
            const cacheKey = generateCacheKey(blockType, prompt, context, options || {});

            // Check cache first
            const cachedContent = getFromCache(cacheKey);
            if (cachedContent) {
                console.log('[AI Content] Cache hit for:', blockType);

                // Track usage (cached)
                await trackUsage(
                    req.userId!,
                    context.courseId,
                    blockType,
                    'generate',
                    prompt.length,
                    JSON.stringify(cachedContent.content).length,
                    cachedContent.metadata?.tokensUsed,
                    true
                );

                return res.json({
                    ...cachedContent,
                    cached: true
                });
            }

            console.log('[AI Content] Generating content for:', blockType);

            // Generate content using AI service
            const generatedContent = await generateBlockContent(
                blockType,
                prompt,
                context,
                options || {}
            );

            // Store in cache
            storeInCache(cacheKey, generatedContent);

            // Track usage (not cached)
            await trackUsage(
                req.userId!,
                context.courseId,
                blockType,
                'generate',
                prompt.length,
                JSON.stringify(generatedContent.content).length,
                generatedContent.metadata?.tokensUsed,
                false
            );

            res.json({
                ...generatedContent,
                cached: false
            });

        } catch (error: any) {
            console.error('[AI Content] Generation error:', error.message);

            // Return appropriate error status
            if (error.message.includes('No template found')) {
                return res.status(400).json({
                    message: error.message
                });
            }

            res.status(500).json({
                message: error.message || 'Failed to generate content'
            });
        }
    }
);

/**
 * POST /api/ai/refine-content
 * Refine existing content based on refinement type
 */
router.post(
    "/refine-content",
    authenticate,
    requireAdmin,
    async (req: AuthRequest, res: Response) => {
        try {
            const { content, refinementType, context } = req.body;

            // Validate required fields
            if (!content || typeof content !== 'string' || content.trim().length === 0) {
                return res.status(400).json({
                    message: 'content is required and must be a non-empty string'
                });
            }

            if (!refinementType || typeof refinementType !== 'string') {
                return res.status(400).json({
                    message: 'refinementType is required and must be a string'
                });
            }

            const validRefinementTypes = ['make-shorter', 'make-longer', 'simplify', 'add-examples', 'change-tone'];
            if (!validRefinementTypes.includes(refinementType)) {
                return res.status(400).json({
                    message: `refinementType must be one of: ${validRefinementTypes.join(', ')}`
                });
            }

            if (!context || typeof context !== 'object') {
                return res.status(400).json({
                    message: 'context is required and must be an object'
                });
            }

            console.log('[AI Content] Refining content with type:', refinementType);

            // Refine content using AI service
            const refinedContent = await refineContent(
                content,
                refinementType as any,
                context
            );

            // Track usage
            await trackUsage(
                req.userId!,
                context.courseId,
                'refinement',
                'refine',
                content.length,
                refinedContent.length,
                undefined,
                false
            );

            res.json({
                content: refinedContent,
                metadata: {
                    refinementType,
                    originalLength: content.length,
                    refinedLength: refinedContent.length,
                    refinedAt: new Date()
                }
            });

        } catch (error: any) {
            console.error('[AI Content] Refinement error:', error.message);

            res.status(500).json({
                message: error.message || 'Failed to refine content'
            });
        }
    }
);

/**
 * POST /api/ai/generate-outline
 * Generate a complete lesson outline with multiple blocks
 */
router.post(
    "/generate-outline",
    authenticate,
    requireAdmin,
    async (req: AuthRequest, res: Response) => {
        try {
            const { topic, objectives, context, blockCount } = req.body;

            // Validate required fields
            if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
                return res.status(400).json({
                    message: 'topic is required and must be a non-empty string'
                });
            }

            if (!objectives || !Array.isArray(objectives) || objectives.length === 0) {
                return res.status(400).json({
                    message: 'objectives is required and must be a non-empty array'
                });
            }

            if (!context || typeof context !== 'object') {
                return res.status(400).json({
                    message: 'context is required and must be an object'
                });
            }

            // Validate context has required fields
            const requiredContextFields = ['courseId', 'courseTitle', 'moduleId', 'moduleName'];
            for (const field of requiredContextFields) {
                if (!context[field]) {
                    return res.status(400).json({
                        message: `context.${field} is required`
                    });
                }
            }

            const requestedBlockCount = blockCount && typeof blockCount === 'number' ? blockCount : 10;

            console.log('[AI Content] Generating lesson outline for:', topic);

            // Generate outline using AI service
            const outline = await generateLessonOutline(
                topic,
                objectives,
                context,
                requestedBlockCount
            );

            // Track usage
            await trackUsage(
                req.userId!,
                context.courseId,
                'outline',
                'outline',
                topic.length + objectives.join(' ').length,
                JSON.stringify(outline).length,
                undefined,
                false
            );

            res.json({
                outline,
                metadata: {
                    topic,
                    objectivesCount: objectives.length,
                    blocksGenerated: outline.length,
                    generatedAt: new Date()
                }
            });

        } catch (error: any) {
            console.error('[AI Content] Outline generation error:', error.message);

            res.status(500).json({
                message: error.message || 'Failed to generate lesson outline'
            });
        }
    }
);

/**
 * GET /api/ai/usage-stats
 * Get AI usage statistics with optional filters
 */
router.get(
    "/usage-stats",
    authenticate,
    requireAdmin,
    async (req: AuthRequest, res: Response) => {
        try {
            const { courseId, startDate, endDate } = req.query;

            // Build query filter
            const filter: any = {};

            if (courseId && typeof courseId === 'string') {
                filter.courseId = courseId;
            }

            if (startDate || endDate) {
                filter.timestamp = {};
                if (startDate && typeof startDate === 'string') {
                    filter.timestamp.$gte = new Date(startDate);
                }
                if (endDate && typeof endDate === 'string') {
                    filter.timestamp.$lte = new Date(endDate);
                }
            }

            console.log('[AI Content] Fetching usage stats with filter:', filter);

            // Get all usage records matching filter
            const usageRecords = await AIUsage.find(filter).sort({ timestamp: -1 });

            // Calculate statistics
            const totalGenerations = usageRecords.length;
            const cachedGenerations = usageRecords.filter(r => r.cached).length;
            const cacheHitRate = totalGenerations > 0
                ? (cachedGenerations / totalGenerations) * 100
                : 0;

            // Group by block type
            const byBlockType: Record<string, number> = {};
            usageRecords.forEach(record => {
                byBlockType[record.blockType] = (byBlockType[record.blockType] || 0) + 1;
            });

            // Group by generation type
            const byGenerationType: Record<string, number> = {};
            usageRecords.forEach(record => {
                byGenerationType[record.generationType] = (byGenerationType[record.generationType] || 0) + 1;
            });

            // Calculate total tokens used
            const totalTokens = usageRecords.reduce((sum, record) => {
                return sum + (record.tokensUsed || 0);
            }, 0);

            // Group by date for timeline
            const byDate: Record<string, number> = {};
            usageRecords.forEach(record => {
                const dateKey = record.timestamp.toISOString().split('T')[0];
                byDate[dateKey] = (byDate[dateKey] || 0) + 1;
            });

            res.json({
                totalGenerations,
                cachedGenerations,
                cacheHitRate: Math.round(cacheHitRate * 100) / 100,
                byBlockType,
                byGenerationType,
                totalTokens,
                byDate,
                filter: {
                    courseId: courseId || 'all',
                    startDate: startDate || 'all',
                    endDate: endDate || 'all'
                }
            });

        } catch (error: any) {
            console.error('[AI Content] Usage stats error:', error.message);

            res.status(500).json({
                message: error.message || 'Failed to fetch usage statistics'
            });
        }
    }
);

export default router;
