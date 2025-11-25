import mongoose from 'mongoose';
import Course from '../models/Course';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';

async function addDefaultModule() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find the gamification course by ID
        const courseId = '6925871af6b33d55d71cb4a6';
        const course = await Course.findById(courseId);

        if (!course) {
            console.log('Course not found');
            return;
        }

        console.log(`Found course: ${course.title}`);
        console.log(`Current modules: ${course.modules.length}`);

        // Check if course already has modules
        if (course.modules && course.modules.length > 0) {
            console.log('Course already has modules');
            return;
        }

        // Add a default module with a lesson
        course.modules = [
            {
                title: 'Introduction to Gamification',
                description: 'Learn the fundamentals of gamification and how to apply game design elements to non-game contexts.',
                order: 0,
                lessons: [
                    {
                        title: 'Welcome to Gamification',
                        duration: 15,
                        blocks: []
                    }
                ]
            } as any
        ];

        await course.save();
        console.log('✅ Successfully added default module and lesson');
        console.log(`Module ID: ${course.modules[0]._id}`);
        console.log(`Lesson ID: ${course.modules[0].lessons[0]._id}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

addDefaultModule();
