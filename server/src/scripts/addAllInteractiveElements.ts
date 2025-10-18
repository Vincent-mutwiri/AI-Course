import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

const addAllInteractiveElements = async () => {
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

    console.log('Found course:', course.title, '\n');

    // Module 1: How AI Thinks
    await courses.updateOne(
      { _id: course._id },
      { $set: { 'modules.0.lessons.0.interactiveElements': [{ type: 'visualTokens' }] } }
    );
    console.log('✓ Module 1, Lesson 1: Visual Tokens');

    await courses.updateOne(
      { _id: course._id },
      { $set: { 'modules.0.lessons.1.interactiveElements': [{ type: 'sentenceBuilder' }] } }
    );
    console.log('✓ Module 1, Lesson 2: Sentence Builder');

    await courses.updateOne(
      { _id: course._id },
      { $set: { 'modules.0.lessons.2.interactiveElements': [{ type: 'aiGenerator', generatorType: 'buildABot', title: 'Build Your Own AI Assistant' }] } }
    );
    console.log('✓ Module 1, Lesson 3: Build-a-Bot');

    // Module 2: AI Tools for Students
    const module2Updates = [
      { lesson: 0, elements: [{ type: 'aiGenerator', generatorType: 'studyBuddy', title: 'AI Study Buddy', placeholder: 'Paste text to summarize...' }] },
      { lesson: 1, elements: [{ type: 'aiGenerator', generatorType: 'writingPartner', title: 'Creative Writing Partner', placeholder: 'Start your story...' }] },
      { lesson: 2, elements: [{ type: 'aiGenerator', generatorType: 'codeDebugger', title: 'Code Debugger', placeholder: 'Paste your code...' }] },
      { lesson: 3, elements: [{ type: 'simulation', simulationType: 'presentationCoach' }] },
      { lesson: 4, elements: [{ type: 'simulation', simulationType: 'ethicalSimulator' }] },
    ];

    for (const update of module2Updates) {
      await courses.updateOne(
        { _id: course._id },
        { $set: { [`modules.1.lessons.${update.lesson}.interactiveElements`]: update.elements } }
      );
      const elem: any = update.elements[0];
      console.log(`✓ Module 2, Lesson ${update.lesson + 1}: ${elem.generatorType || elem.simulationType}`);
    }

    // Module 3: AI Tools for Teachers
    const module3Updates = [
      { lesson: 0, elements: [{ type: 'aiGenerator', generatorType: 'lessonPlanner', title: 'AI Lesson Plan Generator', placeholder: 'Enter topic and grade level...' }] },
      { lesson: 1, elements: [{ type: 'aiGenerator', generatorType: 'rubricBuilder', title: 'Rubric Builder', placeholder: 'Describe your assignment...' }] },
      { lesson: 2, elements: [{ type: 'simulation', simulationType: 'dataDashboard' }] },
    ];

    for (const update of module3Updates) {
      await courses.updateOne(
        { _id: course._id },
        { $set: { [`modules.2.lessons.${update.lesson}.interactiveElements`]: update.elements } }
      );
      const elem: any = update.elements[0];
      console.log(`✓ Module 3, Lesson ${update.lesson + 1}: ${elem.generatorType || elem.simulationType}`);
    }

    // Module 4: AI for School Leaders
    const module4Updates = [
      { lesson: 0, elements: [{ type: 'aiGenerator', generatorType: 'policyDrafter', title: 'AI Policy Drafter', placeholder: 'Describe your school context...' }] },
      { lesson: 1, elements: [{ type: 'simulation', simulationType: 'dataDashboard' }] },
    ];

    for (const update of module4Updates) {
      await courses.updateOne(
        { _id: course._id },
        { $set: { [`modules.3.lessons.${update.lesson}.interactiveElements`]: update.elements } }
      );
      const elem: any = update.elements[0];
      console.log(`✓ Module 4, Lesson ${update.lesson + 1}: ${elem.generatorType || elem.simulationType}`);
    }

    // Module 5: Bringing It All Together
    const module5Updates = [
      { lesson: 0, elements: [{ type: 'simulation', simulationType: 'aiJourney' }] },
      { lesson: 1, elements: [{ type: 'simulation', simulationType: 'conceptMap' }] },
    ];

    for (const update of module5Updates) {
      await courses.updateOne(
        { _id: course._id },
        { $set: { [`modules.4.lessons.${update.lesson}.interactiveElements`]: update.elements } }
      );
      console.log(`✓ Module 5, Lesson ${update.lesson + 1}: ${update.elements[0].simulationType}`);
    }

    console.log('\n✅ All interactive elements added successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

addAllInteractiveElements();
