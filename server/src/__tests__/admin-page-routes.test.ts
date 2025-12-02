import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import adminRouter from '../routes/admin';
import Page from '../models/Page';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const app: Express = express();
app.use(express.json());
app.use('/api/admin', adminRouter);

describe('Admin Page Block Management Routes', () => {
    let adminToken: string;
    let adminUserId: string;
    let testPageId: string;

    beforeEach(async () => {
        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'hashedpassword',
            role: 'admin'
        });
        adminUserId = adminUser._id.toString();

        // Generate admin token (must match the format expected by auth middleware)
        adminToken = jwt.sign(
            { id: adminUserId, email: 'admin@test.com', role: 'admin' },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        // Create test page
        const testPage = await Page.create({
            title: 'Test Page',
            slug: 'test-page',
            content: {
                blocks: [
                    {
                        id: 'block-1',
                        type: 'text',
                        order: 0,
                        content: { text: 'Hello World' }
                    },
                    {
                        id: 'block-2',
                        type: 'image',
                        order: 1,
                        content: { imageUrl: 'https://example.com/image.jpg', altText: 'Test' }
                    }
                ],
                version: '1.0'
            },
            isPublished: false,
            type: 'page'
        });
        testPageId = testPage._id.toString();
    });

    describe('GET /api/admin/pages/:id/edit', () => {
        it('should fetch page with blocks for editing', async () => {
            const response = await request(app)
                .get(`/api/admin/pages/${testPageId}/edit`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.page).toBeDefined();
            expect(response.body.page.title).toBe('Test Page');
            expect(response.body.page.content.blocks).toHaveLength(2);
        });

        it('should return 404 for non-existent page', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/api/admin/pages/${fakeId}/edit`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Page not found');
        });
    });

    describe('GET /api/admin/pages/validate-slug', () => {
        it('should return isUnique false for existing slug', async () => {
            const response = await request(app)
                .get('/api/admin/pages/validate-slug')
                .query({ slug: 'test-page' })
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.isUnique).toBe(false);
        });

        it('should return isUnique true for new slug', async () => {
            const response = await request(app)
                .get('/api/admin/pages/validate-slug')
                .query({ slug: 'new-unique-slug' })
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.isUnique).toBe(true);
        });

        it('should exclude current page when checking uniqueness', async () => {
            const response = await request(app)
                .get('/api/admin/pages/validate-slug')
                .query({ slug: 'test-page', excludeId: testPageId })
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.isUnique).toBe(true);
        });

        it('should return 400 if slug is missing', async () => {
            const response = await request(app)
                .get('/api/admin/pages/validate-slug')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Slug is required');
        });
    });

    describe('PUT /api/admin/pages/:id/blocks', () => {
        it('should save page blocks successfully', async () => {
            const newBlocks = [
                {
                    id: 'block-1',
                    type: 'text',
                    order: 0,
                    content: { text: 'Updated text' }
                },
                {
                    id: 'block-3',
                    type: 'video',
                    order: 1,
                    content: { videoUrl: 'https://youtube.com/watch?v=123' }
                }
            ];

            const response = await request(app)
                .put(`/api/admin/pages/${testPageId}/blocks`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ blocks: newBlocks });

            expect(response.status).toBe(200);
            expect(response.body.page.content.blocks).toHaveLength(2);
            expect(response.body.page.content.blocks[0].content.text).toBe('Updated text');
        });

        it('should return 400 if blocks is not an array', async () => {
            const response = await request(app)
                .put(`/api/admin/pages/${testPageId}/blocks`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ blocks: 'not-an-array' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Blocks must be an array');
        });

        it('should return 400 if block missing required fields', async () => {
            const invalidBlocks = [
                {
                    id: 'block-1',
                    // missing type and order
                    content: { text: 'Test' }
                }
            ];

            const response = await request(app)
                .put(`/api/admin/pages/${testPageId}/blocks`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ blocks: invalidBlocks });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('must have id, type, and order');
        });

        it('should return 404 for non-existent page', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/api/admin/pages/${fakeId}/blocks`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ blocks: [] });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Page not found');
        });
    });

    describe('PATCH /api/admin/pages/:id/blocks/reorder', () => {
        it('should reorder blocks successfully', async () => {
            const response = await request(app)
                .patch(`/api/admin/pages/${testPageId}/blocks/reorder`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ blockIds: ['block-2', 'block-1'] });

            expect(response.status).toBe(200);
            expect(response.body.blocks).toHaveLength(2);
            expect(response.body.blocks[0].id).toBe('block-2');
            expect(response.body.blocks[0].order).toBe(0);
            expect(response.body.blocks[1].id).toBe('block-1');
            expect(response.body.blocks[1].order).toBe(1);
        });

        it('should return 400 if blockIds is not an array', async () => {
            const response = await request(app)
                .patch(`/api/admin/pages/${testPageId}/blocks/reorder`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ blockIds: 'not-an-array' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('blockIds must be an array');
        });

        it('should return 400 if blockIds are invalid', async () => {
            const response = await request(app)
                .patch(`/api/admin/pages/${testPageId}/blocks/reorder`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ blockIds: ['block-1', 'invalid-block'] });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid blockIds provided');
        });

        it('should return 404 for non-existent page', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .patch(`/api/admin/pages/${fakeId}/blocks/reorder`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ blockIds: ['block-1', 'block-2'] });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Page not found');
        });
    });

    describe('POST /api/admin/pages/:id/blocks/:blockId/duplicate', () => {
        it('should duplicate block successfully', async () => {
            const response = await request(app)
                .post(`/api/admin/pages/${testPageId}/blocks/block-1/duplicate`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.block).toBeDefined();
            expect(response.body.block.id).not.toBe('block-1');
            expect(response.body.block.content.text).toBe('Hello World');

            // Verify page has 3 blocks now
            const page = await Page.findById(testPageId);
            expect(page?.content.blocks).toHaveLength(3);
            expect(page?.content.blocks[1].id).toBe(response.body.block.id);
        });

        it('should return 404 for non-existent block', async () => {
            const response = await request(app)
                .post(`/api/admin/pages/${testPageId}/blocks/invalid-block/duplicate`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Block not found');
        });

        it('should return 404 for non-existent page', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .post(`/api/admin/pages/${fakeId}/blocks/block-1/duplicate`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Page not found');
        });
    });

    describe('DELETE /api/admin/pages/:id/blocks/:blockId', () => {
        it('should delete block successfully', async () => {
            const response = await request(app)
                .delete(`/api/admin/pages/${testPageId}/blocks/block-1`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Block deleted successfully');

            // Verify page has 1 block now
            const page = await Page.findById(testPageId);
            expect(page?.content.blocks).toHaveLength(1);
            expect(page?.content.blocks[0].id).toBe('block-2');
            expect(page?.content.blocks[0].order).toBe(0);
        });

        it('should allow deleting last block', async () => {
            // Delete first block
            await request(app)
                .delete(`/api/admin/pages/${testPageId}/blocks/block-1`)
                .set('Authorization', `Bearer ${adminToken}`);

            // Delete second block
            const response = await request(app)
                .delete(`/api/admin/pages/${testPageId}/blocks/block-2`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);

            // Verify page has 0 blocks
            const page = await Page.findById(testPageId);
            expect(page?.content.blocks).toHaveLength(0);
        });

        it('should return 404 for non-existent block', async () => {
            const response = await request(app)
                .delete(`/api/admin/pages/${testPageId}/blocks/invalid-block`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Block not found');
        });

        it('should return 404 for non-existent page', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/api/admin/pages/${fakeId}/blocks/block-1`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Page not found');
        });
    });
});
