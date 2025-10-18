import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

const addInteractiveElements = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const courses = db?.collection('courses');

    if (!courses) {
      throw new Error('Courses collection not found');
    }

    // Find the AI in Education course
    const course = await courses.findOne({ title: /AI.*Education/i });

    if (!course) {
      console.log('AI in Education course not found');
      process.exit(0);
    }

    console.log('Found course:', course.title);

    // Add interactive elements to Module 1, Lesson 1 (Tokens)
    await courses.updateOne(
      { _id: course._id },
      {
        $set: {
          'modules.0.lessons.0.interactiveElements': [
            { type: 'visualTokens' }
          ]
        }
      }
    );
    console.log('✓ Added Visual Tokens to Module 1, Lesson 1');

    // Add interactive elements to Module 1, Lesson 2 (Predictions)
    await courses.updateOne(
      { _id: course._id },
      {
        $set: {
          'modules.0.lessons.1.interactiveElements': [
            { type: 'sentenceBuilder' }
          ]
        }
      }
    );
    console.log('✓ Added Sentence Builder to Module 1, Lesson 2');

    // Add interactive elements to Module 1, Lesson 3 (Personalities)
    await courses.updateOne(
      { _id: course._id },
      {
        $set: {
          'modules.0.lessons.2.interactiveElements': [
            {
              type: 'aiGenerator',
              generatorType: 'buildABot',
              title: 'Build Your Own AI Assistant'
            }
          ]
        }
      }
    );
    console.log('✓ Added Build-a-Bot to Module 1, Lesson 3');

    console.log('\n✅ Interactive elements added successfully!');
    console.log('Refresh your app to see the changes.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

addInteractiveElements();
