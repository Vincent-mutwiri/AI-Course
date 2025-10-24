import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

async function checkVideoContent() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const course = await Course.findOne({ title: 'The Learning Science Playbook for Educators' });

    if (!course) {
      console.log('Course not found');
      await mongoose.disconnect();
      return;
    }

    console.log('Checking Lesson 1.1 content:');
    const lesson11 = course.modules[0]?.lessons[0];
    if (lesson11) {
      console.log('Title:', lesson11.title);
      console.log('Content:', JSON.stringify(lesson11.content, null, 2));
      console.log('Interactive Elements:', JSON.stringify(lesson11.interactiveElements, null, 2));
    }

    console.log('\n\nChecking Lesson 1.2 content:');
    const lesson12 = course.modules[0]?.lessons[1];
    if (lesson12) {
      console.log('Title:', lesson12.title);
      console.log('Content:', JSON.stringify(lesson12.content, null, 2));
      console.log('Interactive Elements:', JSON.stringify(lesson12.interactiveElements, null, 2));
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkVideoContent();
