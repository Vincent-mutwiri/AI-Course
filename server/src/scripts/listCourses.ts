import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

const listCourses = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const courses = db?.collection('courses');

    if (!courses) {
      throw new Error('Courses collection not found');
    }

    const allCourses = await courses.find({}).toArray();
    
    console.log('Found courses:');
    allCourses.forEach((course: any) => {
      console.log(`\nID: ${course._id}`);
      console.log(`Title: ${course.title}`);
      console.log(`Modules: ${course.modules?.length || 0}`);
      if (course.modules?.[0]) {
        console.log(`  - Module 1: ${course.modules[0].title} (${course.modules[0].lessons?.length || 0} lessons)`);
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

listCourses();
