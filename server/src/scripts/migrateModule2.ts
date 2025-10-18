import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Course from '../models/Course';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });

const newModule2 = {
  title: "Module 2: How Students Can Leverage AI",
  description: "Discover practical ways students can use AI tools for learning and productivity",
  order: 2,
  lessons: [
    {
      title: "Lesson 2.1: AI Study Buddy",
      description: "Use AI to summarize and understand complex topics",
      duration: 15,
      order: 1,
      objective: "Learn how to use AI for effective studying and comprehension",
      content: {
        sections: [
          {
            type: "text",
            title: "Your Personal Study Assistant",
            content: "AI can help you understand difficult concepts by breaking them down into simpler explanations. It's like having a tutor available 24/7 who can explain things in different ways until you understand."
          },
          {
            type: "text",
            title: "How to Use AI for Studying",
            content: "• Paste complex text or lecture notes\n• Ask AI to summarize key points\n• Request explanations in simpler terms\n• Get examples to illustrate concepts\n• Ask follow-up questions for clarity"
          }
        ]
      },
      interactiveElements: [
        {
          type: "aiGenerator",
          generatorType: "studyBuddy",
          title: "AI Study Buddy",
          description: "Paste text you want to understand better",
          placeholder: "Paste your study material here..."
        }
      ]
    },
    {
      title: "Lesson 2.2: Creative Writing Partner",
      description: "Get AI feedback on your writing",
      duration: 15,
      order: 2,
      objective: "Learn how AI can help improve your writing skills",
      content: {
        sections: [
          {
            type: "text",
            title: "AI as Your Writing Coach",
            content: "AI can provide instant feedback on your writing, suggest improvements, and help you develop your unique voice. It's not about replacing your creativity—it's about enhancing it."
          },
          {
            type: "text",
            title: "What AI Can Help With",
            content: "• Grammar and spelling corrections\n• Style and tone suggestions\n• Structure and flow improvements\n• Creative ideas and alternatives\n• Clarity and readability"
          }
        ]
      },
      interactiveElements: [
        {
          type: "aiGenerator",
          generatorType: "writingPartner",
          title: "Creative Writing Partner",
          description: "Get feedback on your writing",
          placeholder: "Paste your writing here for feedback..."
        }
      ]
    },
    {
      title: "Lesson 2.3: Code Debugger",
      description: "Use AI to find and fix code errors",
      duration: 15,
      order: 3,
      objective: "Learn how AI can help debug and improve your code",
      content: {
        sections: [
          {
            type: "text",
            title: "AI-Powered Debugging",
            content: "Stuck on a coding error? AI can analyze your code, identify bugs, and suggest fixes. It's like having an experienced programmer looking over your shoulder."
          },
          {
            type: "text",
            title: "How AI Helps with Code",
            content: "• Identifies syntax errors\n• Explains error messages\n• Suggests bug fixes\n• Recommends best practices\n• Explains how code works"
          }
        ]
      },
      interactiveElements: [
        {
          type: "aiGenerator",
          generatorType: "codeDebugger",
          title: "Code Debugger",
          description: "Paste your code for debugging help",
          placeholder: "Paste your code here..."
        }
      ]
    },
    {
      title: "Lesson 2.4: Presentation Coach",
      description: "Analyze and improve your presentations",
      duration: 15,
      order: 4,
      objective: "Learn how to create effective presentations with AI feedback",
      content: {
        sections: [
          {
            type: "text",
            title: "Perfect Your Presentations",
            content: "Good presentations require practice and feedback. AI can analyze your presentation script and provide instant insights on pacing, clarity, and delivery."
          },
          {
            type: "text",
            title: "What Gets Analyzed",
            content: "• Word count and speaking time\n• Filler words (um, uh, like)\n• Sentence length and complexity\n• Pacing recommendations\n• Clarity suggestions"
          }
        ]
      },
      interactiveElements: [
        {
          type: "simulation",
          simulationType: "presentationCoach",
          title: "Presentation Coach",
          description: "Analyze your presentation script"
        }
      ]
    },
    {
      title: "Lesson 2.5: Ethical AI Scenarios",
      description: "Navigate ethical dilemmas in AI usage",
      duration: 15,
      order: 5,
      objective: "Understand ethical considerations when using AI",
      content: {
        sections: [
          {
            type: "text",
            title: "Using AI Responsibly",
            content: "With great power comes great responsibility. As you use AI tools, it's important to consider the ethical implications of your choices."
          },
          {
            type: "text",
            title: "Key Ethical Questions",
            content: "• When is it appropriate to use AI?\n• How do you give credit for AI assistance?\n• What are the privacy implications?\n• How do you avoid over-reliance on AI?\n• What are the academic integrity considerations?"
          }
        ]
      },
      interactiveElements: [
        {
          type: "simulation",
          simulationType: "ethicalSimulator",
          title: "Ethical AI Scenarios",
          description: "Explore ethical dilemmas in AI usage"
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
      { $set: { "modules.1": newModule2 } }
    );

    console.log(`Updated ${result.modifiedCount} course(s)`);
    console.log('Module 2 migration complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
