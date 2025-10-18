import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Course from '../models/Course';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });

const newModule4 = {
  title: "Module 4: Admin & Founder Tools",
  description: "Strategic AI tools for school administrators and founders",
  order: 4,
  lessons: [
    {
      title: "Lesson 4.1: AI Policy Drafter",
      description: "Create comprehensive AI usage policies",
      duration: 15,
      order: 1,
      objective: "Learn how to draft effective AI policies for your institution",
      content: {
        sections: [
          {
            type: "text",
            title: "Establishing AI Guidelines",
            content: "As AI becomes more prevalent in education, schools need clear policies on acceptable use, privacy, and ethical considerations."
          },
          {
            type: "text",
            title: "Policy Components",
            content: "• Acceptable use guidelines\n• Privacy and data protection\n• Academic integrity rules\n• Teacher and student responsibilities\n• Monitoring and enforcement\n• Review and update procedures"
          }
        ]
      },
      interactiveElements: [
        {
          type: "aiGenerator",
          generatorType: "policyDrafter",
          title: "AI Policy Drafter",
          description: "Describe your institution's needs",
          placeholder: "Example: Create an AI usage policy for a high school with 500 students..."
        }
      ]
    },
    {
      title: "Lesson 4.2: Strategic Planning Assistant",
      description: "Use AI for educational strategy",
      duration: 15,
      order: 2,
      objective: "Learn how AI can support strategic planning",
      content: {
        sections: [
          {
            type: "text",
            title: "AI in Strategic Planning",
            content: "AI can help analyze trends, identify opportunities, and develop strategic plans for implementing technology in education."
          },
          {
            type: "text",
            title: "Planning Areas",
            content: "• Technology integration roadmap\n• Budget allocation\n• Professional development\n• Risk assessment\n• Success metrics\n• Implementation timeline"
          }
        ]
      },
      interactiveElements: [
        {
          type: "aiGenerator",
          generatorType: "lessonPlanner",
          title: "Strategic Planning Assistant",
          description: "Describe your strategic goals",
          placeholder: "Example: Create a 3-year plan for integrating AI tools across our curriculum..."
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
      { $set: { "modules.3": newModule4 } }
    );

    console.log(`Updated ${result.modifiedCount} course(s)`);
    console.log('Module 4 migration complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
