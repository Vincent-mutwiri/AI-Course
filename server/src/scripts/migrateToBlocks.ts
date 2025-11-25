import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Course, { IBlock, IInteractiveElement, BlockType, InteractiveElementType } from '../models/Course';

dotenv.config();

/**
 * Migration script to convert legacy interactiveElements to the new blocks format.
 * 
 * This script:
 * 1. Finds all courses with lessons containing interactiveElements
 * 2. Converts each interactiveElement to a block with proper structure
 * 3. Generates UUIDs for each block
 * 4. Sets order based on original array index
 * 5. Preserves all existing configuration
 * 6. Maintains backward compatibility by keeping interactiveElements
 */

/**
 * Maps InteractiveElementType to BlockType
 */
function mapInteractiveTypeToBlockType(type: InteractiveElementType): BlockType {
    // All interactive element types are valid block types
    return type as BlockType;
}

/**
 * Converts an interactive element to a block
 */
function convertInteractiveElementToBlock(
    element: IInteractiveElement,
    order: number
): IBlock {
    const blockId = uuidv4();
    const blockType = mapInteractiveTypeToBlockType(element.type);

    // Build the content object, preserving all configuration
    const content: IBlock['content'] = {
        config: element.config,
    };

    // Map all possible fields from interactive element to block content
    if (element.question) content.question = element.question;
    if (element.options) content.options = element.options;
    if (element.prompt) content.prompt = element.prompt;
    if (element.promptTemplate) content.prompt = element.promptTemplate;
    if (element.title) content.title = element.title;
    if (element.description) content.description = element.description;

    // Store additional metadata that doesn't have direct content fields
    const meta: Record<string, any> = {};
    if (element.badSlideUrl) meta.badSlideUrl = element.badSlideUrl;
    if (element.goodSlideUrl) meta.goodSlideUrl = element.goodSlideUrl;
    if (element.generatorType) meta.generatorType = element.generatorType;
    if (element.simulatedResult) meta.simulatedResult = element.simulatedResult;
    if (element.placeholder) meta.placeholder = element.placeholder;
    if (element.explanation) meta.explanation = element.explanation;
    if (element.passingScore !== undefined) meta.passingScore = element.passingScore;
    if (element.hotspots) meta.hotspots = element.hotspots;
    if (element.minLength !== undefined) meta.minLength = element.minLength;
    if (element.dataKey) meta.dataKey = element.dataKey;
    if (element.buttonText) meta.buttonText = element.buttonText;
    if (element.totalQuestions !== undefined) meta.totalQuestions = element.totalQuestions;
    if (element.inputLabel) meta.inputLabel = element.inputLabel;
    if (element.quizDataKey) meta.quizDataKey = element.quizDataKey;

    if (Object.keys(meta).length > 0) {
        content.meta = meta;
    }

    const now = new Date();

    return {
        id: blockId,
        type: blockType,
        order,
        content,
        createdAt: now,
        updatedAt: now,
    };
}

/**
 * Main migration function
 */
async function migrateToBlocks() {
    try {
        console.log('🚀 Starting migration to blocks format...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB\n');

        // Find all courses
        const courses = await Course.find({});
        console.log(`📚 Found ${courses.length} course(s) to process\n`);

        let totalCoursesUpdated = 0;
        let totalLessonsUpdated = 0;
        let totalBlocksCreated = 0;

        // Process each course
        for (const course of courses) {
            let courseModified = false;
            console.log(`\n📖 Processing course: "${course.title}"`);

            // Process each module
            for (const module of course.modules) {
                console.log(`  📂 Module: "${module.title}"`);

                // Process each lesson
                for (const lesson of module.lessons) {
                    // Check if lesson has interactiveElements and doesn't already have blocks
                    if (lesson.interactiveElements && lesson.interactiveElements.length > 0) {
                        // Only migrate if blocks don't exist or are empty
                        if (!lesson.blocks || lesson.blocks.length === 0) {
                            console.log(`    📝 Lesson: "${lesson.title}" - Migrating ${lesson.interactiveElements.length} interactive element(s)`);

                            // Convert each interactive element to a block
                            const blocks: IBlock[] = lesson.interactiveElements.map((element, index) => {
                                return convertInteractiveElementToBlock(element, index);
                            });

                            // Assign blocks to lesson
                            lesson.blocks = blocks;
                            courseModified = true;
                            totalLessonsUpdated++;
                            totalBlocksCreated += blocks.length;

                            console.log(`    ✅ Created ${blocks.length} block(s)`);
                        } else {
                            console.log(`    ⏭️  Lesson: "${lesson.title}" - Already has blocks, skipping`);
                        }
                    } else {
                        console.log(`    ⏭️  Lesson: "${lesson.title}" - No interactive elements to migrate`);
                    }
                }
            }

            // Save course if modified
            if (courseModified) {
                await course.save();
                totalCoursesUpdated++;
                console.log(`  💾 Saved course: "${course.title}"`);
            } else {
                console.log(`  ⏭️  No changes needed for course: "${course.title}"`);
            }
        }

        // Print summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 Migration Summary:');
        console.log('='.repeat(60));
        console.log(`✅ Courses updated: ${totalCoursesUpdated}`);
        console.log(`✅ Lessons updated: ${totalLessonsUpdated}`);
        console.log(`✅ Blocks created: ${totalBlocksCreated}`);
        console.log('='.repeat(60));
        console.log('\n✨ Migration complete!\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration if this script is executed directly
if (require.main === module) {
    migrateToBlocks();
}

export { migrateToBlocks, convertInteractiveElementToBlock };
