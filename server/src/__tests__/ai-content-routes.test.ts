import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import aiContentRouter from '../routes/aiContent';
import AIUsage from '../models/AIUsage';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import * as aiService from '../services/aiService';

// Mock the AI service
jest.mock('../services/aiService');

const app: Express = express();
app.use(express.json());
app.use('/api/ai', aiContentRouter);

describe('AI Content Generation Routes', () => {
    let adminToken: string;
    let adminUserId: string;
    let userToken: string;
    let userId: string;

    beforeEach(async () => {
        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'hashedpassword',
            role: 'admin'
        });
        adminUserId = adminUser._id.toString();

        // Generate admin token
        adminToken = jwt.sign(
            { id: adminUserId, email: 'admin@test.com', role: 'admin' },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        // Create regular user
        const regularUser = await User.create({
            name: 'Regular User',
            email: 'user@test.com',
            password: 'hashedpassword',
            role: 'user'
        });
        userId = regularUser._id.toString();

        // Generate user token
        userToken = jwt.sign(
            { id: userId, email: 'user@test.com', role: 'user' },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        // Clear mocks
        jest.clearAllMocks();
    });

    describe('POST /api/ai/generate-content', () => {
        const validRequest = {
            blockType: 'text',
            prompt: 'Explain machine learning',
            context: {
                courseId: 'course-123',
                courseTitle: 'AI Fundamentals',
                moduleId: 'module-1',
                moduleName: 'Introduction',
                lessonId: 'lesson-1',
                lessonName: 'What is AI?'
            },
            options: {
                tone: 'conversational',
                readingLevel: 'college',
                length: 'moderate'
            }
        };

        it('should generate content successfully for admin', async () => {
            const mockContent = {
                content: { text: 'Machine learning is...' },
                metadata: {
                    blockType: 'text',
                    generatedAt: new Date(),
                    promptUsed: 'Explain machine learning',
                    tokensUsed: 100
                }
            };

            (aiService.generateBlockContent as jest.Mock).mockResolvedValue(mockContent);

            const response = await request(app)
                .post('/api/ai/generate-content')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(validRequest);

            expect(response.status).toBe(200);
            expect(response.body.content).toBeDefined();
            expect(response.body.cached).toBe(false);
            expect(aiService.generateBlockContent).toHaveBeenCalledWith(
                'text',
                'Explain machine learning',
                validRequest.context,
                validRequest.options
            );
        });

        it('should return 403 for non-admin users', async () => {
            const response = await request(app)
                .post('/api/ai/generate-content')
                .set('Authorization', `Bearer ${userToken}`)
                .send(validRequest);

            expect(response.status).toBe(403);
            expect(response.body.message).toContain('Admin access required');
        });

        it('should return 400 if blockType is missing', async () => {
            const invalidRequest = { ...validRequest };
            delete (invalidRequest as any).blockType;

            const response = await request(app)
                .post('/api/ai/generate-content')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidRequest);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('blockType is required');
        });

        it('should return 400 if prompt is empty', async () => {
            const invalidRequest = { ...validRequest, prompt: '' };

            const response = await request(app)
                .post('/api/ai/generate-content')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidRequest);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('prompt is required');
        });

        it('should return 400 if context is missing required fields', async () => {
            const invalidRequest = {
                ...validRequest,
                context: { courseId: 'course-123' }
            };

            const response = await request(app)
                .post('/api/ai/generate-content')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidRequest);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('context.');
        });

        it('should track usage in database', async () => {
            const mockContent = {
                content: { text: 'Machine learning is...' },
                metadata: {
                    blockType: 'text',
                    generatedAt: new Date(),
                    promptUsed: 'Explain machine learning',
                    tokensUsed: 100
                }
            };

            (aiService.generateBlockContent as jest.Mock).mockResolvedValue(mockContent);

            // Use a unique prompt to avoid cache hit
            const uniqueRequest = {
                ...validRequest,
                prompt: 'Explain deep learning algorithms'
            };

            await request(app)
                .post('/api/ai/generate-content')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(uniqueRequest);

            const usageRecord = await AIUsage.findOne({
                userId: adminUserId,
                blockType: 'text'
            }).sort({ timestamp: -1 });

            expect(usageRecord).toBeDefined();
            expect(usageRecord?.blockType).toBe('text');
            expect(usageRecord?.generationType).toBe('generate');
            expect(usageRecord?.cached).toBe(false);
        });
    });

    describe('POST /api/ai/refine-content', () => {
        const validRequest = {
            content: 'This is some content that needs refinement.',
            refinementType: 'make-shorter',
            context: {
                courseId: 'course-123',
                courseTitle: 'AI Fundamentals'
            }
        };

        it('should refine content successfully for admin', async () => {
            const mockRefinedContent = 'Refined content.';

            (aiService.refineContent as jest.Mock).mockResolvedValue(mockRefinedContent);

            const response = await request(app)
                .post('/api/ai/refine-content')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(validRequest);

            expect(response.status).toBe(200);
            expect(response.body.content).toBe(mockRefinedContent);
            expect(response.body.metadata.refinementType).toBe('make-shorter');
        });

        it('should return 403 for non-admin users', async () => {
            const response = await request(app)
                .post('/api/ai/refine-content')
                .set('Authorization', `Bearer ${userToken}`)
                .send(validRequest);

            expect(response.status).toBe(403);
        });

        it('should return 400 for invalid refinement type', async () => {
            const invalidRequest = { ...validRequest, refinementType: 'invalid-type' };

            const response = await request(app)
                .post('/api/ai/refine-content')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidRequest);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('refinementType must be one of');
        });
    });

    describe('POST /api/ai/generate-outline', () => {
        const validRequest = {
            topic: 'Introduction to Machine Learning',
            objectives: [
                'Understand what machine learning is',
                'Learn about different types of ML'
            ],
            context: {
                courseId: 'course-123',
                courseTitle: 'AI Fundamentals',
                moduleId: 'module-1',
                moduleName: 'Introduction'
            },
            blockCount: 8
        };

        it('should generate outline successfully for admin', async () => {
            const mockOutline = [
                {
                    type: 'text',
                    title: 'Introduction',
                    description: 'Overview of ML',
                    estimatedTime: 5,
                    placeholderContent: { text: '[Placeholder]' }
                }
            ];

            (aiService.generateLessonOutline as jest.Mock).mockResolvedValue(mockOutline);

            const response = await request(app)
                .post('/api/ai/generate-outline')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(validRequest);

            expect(response.status).toBe(200);
            expect(response.body.outline).toBeDefined();
            expect(response.body.metadata.blocksGenerated).toBe(1);
        });

        it('should return 403 for non-admin users', async () => {
            const response = await request(app)
                .post('/api/ai/generate-outline')
                .set('Authorization', `Bearer ${userToken}`)
                .send(validRequest);

            expect(response.status).toBe(403);
        });

        it('should return 400 if objectives is not an array', async () => {
            const invalidRequest = { ...validRequest, objectives: 'not-an-array' };

            const response = await request(app)
                .post('/api/ai/generate-outline')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidRequest);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('objectives');
        });
    });

    describe('GET /api/ai/usage-stats', () => {
        beforeEach(async () => {
            // Create some usage records
            await AIUsage.create([
                {
                    userId: adminUserId,
                    courseId: 'course-123',
                    blockType: 'text',
                    generationType: 'generate',
                    promptLength: 50,
                    responseLength: 200,
                    tokensUsed: 100,
                    cached: false,
                    timestamp: new Date()
                },
                {
                    userId: adminUserId,
                    courseId: 'course-123',
                    blockType: 'video',
                    generationType: 'generate',
                    promptLength: 30,
                    responseLength: 150,
                    tokensUsed: 80,
                    cached: true,
                    timestamp: new Date()
                }
            ]);
        });

        it('should return usage statistics for admin', async () => {
            const response = await request(app)
                .get('/api/ai/usage-stats')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.totalGenerations).toBe(2);
            expect(response.body.cachedGenerations).toBe(1);
            expect(response.body.cacheHitRate).toBe(50);
            expect(response.body.byBlockType).toBeDefined();
            expect(response.body.totalTokens).toBe(180);
        });

        it('should filter by courseId', async () => {
            const response = await request(app)
                .get('/api/ai/usage-stats')
                .query({ courseId: 'course-123' })
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.totalGenerations).toBe(2);
        });

        it('should return 403 for non-admin users', async () => {
            const response = await request(app)
                .get('/api/ai/usage-stats')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
        });
    });
});
