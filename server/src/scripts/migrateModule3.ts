import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Course from '../models/Course';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });

const newModule3 = {
  title: "Module 3: Teacher Tools",
  description: "AI-powered tools to enhance teaching and save time",
  order: 3,
  lessons: [
    {
      title: "Lesson 3.1: Lesson Plan Generator",
      description: "Create comprehensive lesson plans with AI",
      duration: 15,
      order: 1,
      objective: "Learn how to use AI to generate effective lesson plans",
      content: {
        sections: [
          {
            type: "text",
            title: "AI-Powered Lesson Planning",
            content: "Creating detailed lesson plans takes time. AI can help you generate comprehensive lesson plans quickly, giving you more time to focus on teaching."
          },
          {
            type: "text",
            title: "What to Include",
            content: "• Subject and grade level\n• Learning objectives\n• Time duration\n• Required materials\n• Teaching methods\n• Assessment strategies"
          }
        ]
      },
      interactiveElements: [
        {
          type: "aiGenerator",
          generatorType: "lessonPlanner",
          title: "Lesson Plan Generator",
          description: "Describe your lesson requirements",
          placeholder: "Example: Create a 45-minute lesson plan for 8th grade science on photosynthesis..."
        }
      ]
    },
    {
      title: "Lesson 3.2: Rubric Builder",
      description: "Generate assessment rubrics instantly",
      duration: 15,
      order: 2,
      objective: "Learn how to create clear assessment rubrics with AI",
      content: {
        sections: [
          {
            type: "text",
            title: "Clear Assessment Criteria",
            content: "Good rubrics make grading fair and transparent. AI can help you create detailed rubrics with clear criteria and performance levels."
          },
          {
            type: "text",
            title: "Rubric Components",
            content: "• Assessment criteria\n• Performance levels\n• Point values\n• Descriptors for each level\n• Clear expectations"
          }
        ]
      },
      interactiveElements: [
        {
          type: "aiGenerator",
          generatorType: "rubricBuilder",
          title: "Rubric Builder",
          description: "Describe your assignment",
          placeholder: "Example: Create a rubric for a 5-paragraph essay on climate change..."
        }
      ]
    },
    {
      title: "Lesson 3.3: Data Insights Dashboard",
      description: "Analyze student performance data",
      duration: 15,
      order: 3,
      objective: "Learn how AI can help analyze educational data",
      content: {
        sections: [
          {
            type: "text",
            title: "Data-Driven Decisions",
            content: "Understanding student performance data helps you identify trends, spot struggling students early, and make informed decisions about interventions."
          },
          {
            type: "text",
            title: "Key Metrics",
            content: "• Attendance patterns\n• Grade distributions\n• Performance trends\n• Intervention effectiveness\n• Student progress tracking"
          }
        ]
      },
      interactiveElements: [
        {
          type: "simulation",
          simulationType: "dataDashboard",
          title: "School Data Insights",
          description: "Explore sample school data with AI analysis"
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
      { $set: { "modules.2": newModule3 } }
    );

    console.log(`Updated ${result.modifiedCount} course(s)`);
    console.log('Module 3 migration complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
