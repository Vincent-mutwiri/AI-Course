import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

async function viewCourseDetails() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const course = await Course.findOne({ title: 'The Learning Science Playbook for Educators' });

    if (!course) {
      console.log('Course not found');
      await mongoose.disconnect();
      return;
    }

    console.log('='.repeat(80));
    console.log(`Course: ${course.title}`);
    console.log('='.repeat(80));
    console.log(`ID: ${course._id}`);
    console.log(`Instructor: ${course.instructor}`);
    console.log(`Category: ${course.category}`);
    console.log(`Level: ${course.level}`);
    console.log(`Total Duration: ${course.totalDuration} hours`);
    console.log(`Published: ${course.isPublished}`);
    console.log(`\nModules: ${course.modules.length}`);
    console.log(`Total Lessons: ${course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}`);
    console.log('\n');

    course.modules.forEach((module, idx) => {
      console.log(`${module.title}`);
      module.lessons.forEach((lesson, lessonIdx) => {
        console.log(`  ${lesson.title}`);
        if (lesson.interactiveElements && lesson.interactiveElements.length > 0) {
          lesson.interactiveElements.forEach((elem: any) => {
            console.log(`    → Interactive: ${elem.type}`);
          });
        }
        if (lesson.quiz) {
          console.log(`    → Quiz included`);
        }
      });
      console.log('');
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

viewCourseDetails();
