import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

const checkInteractiveElements = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const courses = db?.collection('courses');

    if (!courses) {
      throw new Error('Courses collection not found');
    }

    const courseId = '68ee38bb69010a67868df245';
    const course = await courses.findOne({ _id: new mongoose.Types.ObjectId(courseId) });

    if (!course) {
      console.log('Course not found');
      process.exit(0);
    }

    console.log('Course:', course.title);
    console.log('Modules:', course.modules?.length || 0);

    if (course.modules?.[0]?.lessons?.[0]) {
      const lesson1 = course.modules[0].lessons[0];
      console.log('\nModule 1, Lesson 1:');
      console.log('Title:', lesson1.title);
      console.log('Has interactiveElements:', !!lesson1.interactiveElements);
      console.log('Interactive elements:', lesson1.interactiveElements || 'None');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkInteractiveElements();