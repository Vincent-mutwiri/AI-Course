import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Course from '../models/Course';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });

const newModule5 = {
  title: "Module 5: Course Summary",
  description: "Review your learning journey and key concepts",
  order: 5,
  lessons: [
    {
      title: "Lesson 5.1: My AI Journey",
      description: "Review your progress through the course",
      duration: 10,
      order: 1,
      objective: "Reflect on your learning journey",
      content: {
        sections: [
          {
            type: "text",
            title: "Your Learning Path",
            content: "Take a moment to review everything you've learned about AI in education. From understanding how AI thinks to using practical tools, you've covered a lot of ground."
          }
        ]
      },
      interactiveElements: [
        {
          type: "simulation",
          simulationType: "aiJourney",
          title: "My AI Learning Journey",
          description: "Track your progress through the course"
        }
      ]
    },
    {
      title: "Lesson 5.2: Concept Map",
      description: "Visualize how AI concepts connect",
      duration: 10,
      order: 2,
      objective: "Understand the relationships between AI concepts",
      content: {
        sections: [
          {
            type: "text",
            title: "Connecting the Dots",
            content: "AI concepts build upon each other. This interactive map shows how everything you've learned connects together."
          }
        ]
      },
      interactiveElements: [
        {
          type: "simulation",
          simulationType: "conceptMap",
          title: "Interactive Concept Map",
          description: "Explore how AI concepts relate to each other"
        }
      ]
    },
    {
      title: "Lesson 5.3: Certificate of Completion",
      description: "Download your course certificate",
      duration: 5,
      order: 3,
      objective: "Celebrate your achievement",
      content: {
        sections: [
          {
            type: "text",
            title: "Final Assessment",
            content: "Before receiving your certificate, complete this final assessment to demonstrate your understanding of the course material. You need to score at least 10 out of 12 questions correctly."
          },
          {
            type: "text",
            title: "After Passing",
            content: "Once you pass the assessment, you'll be able to download your personalized certificate of completion."
          }
        ]
      },
      interactiveElements: [
        {
          type: "simulation",
          simulationType: "certificate",
          title: "Certificate of Completion",
          description: "Download your course completion certificate"
        }
      ]
    }
  ]
};

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    const result = await Course.updateMany(
      {},
      { $set: { "modules.4": newModule5 } }
    );

    console.log(`Updated ${result.modifiedCount} course(s)`);
    console.log('Module 5 migration complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
