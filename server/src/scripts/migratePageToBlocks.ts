import mongoose from 'mongoose';
import Page from '../models/Page';
import { connectDB } from '../config/database';

/**
 * Migration script to convert existing pages with unstructured content
 * to the new block-based format.
 * 
 * This script:
 * 1. Finds all pages with old content structure (non-object or missing blocks/version)
 * 2. Converts the content to a text block
 * 3. Wraps it in the new structured format with blocks array and version field
 */

async function migratePageToBlocks() {
    try {
        await connectDB();
        console.log('Connected to database');

        // Find all pages
        const pages = await Page.find({});
        console.log(`Found ${pages.length} pages to check`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const page of pages) {
            // Check if page already has the new structure
            const content = page.content as any;

            // If content already has blocks and version, skip it
            if (content && typeof content === 'object' && content.blocks && content.version) {
                console.log(`Skipping page "${page.title}" - already migrated`);
                skippedCount++;
                continue;
            }

            // Convert old content to new block-based structure
            const newContent = {
                blocks: [
                    {
                        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        type: 'text' as const,
                        order: 0,
                        content: {
                            text: typeof content === 'string' ? content : JSON.stringify(content)
                        },
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ],
                version: '1.0'
            };

            // Update the page
            await Page.updateOne(
                { _id: page._id },
                { $set: { content: newContent } }
            );

            console.log(`Migrated page "${page.title}" to block-based structure`);
            migratedCount++;
        }

        console.log('\n=== Migration Summary ===');
        console.log(`Total pages: ${pages.length}`);
        console.log(`Migrated: ${migratedCount}`);
        console.log(`Skipped (already migrated): ${skippedCount}`);
        console.log('Migration completed successfully');

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the migration
migratePageToBlocks();
