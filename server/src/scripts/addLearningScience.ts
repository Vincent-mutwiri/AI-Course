import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

const learningScience = {
  title: "The Learning Science Playbook for Educators",
  description: "A comprehensive guide for educators to understand and apply learning science principles in their teaching practice. Discover evidence-based strategies to enhance student learning, improve retention, and create more effective educational experiences.",
  instructor: "Vincent Mutwiri",
  thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1422&q=80",
  category: "Education",
  level: "beginner",
  totalDuration: 10,
  enrolledCount: 0,
  isPublished: true,
  modules: [
    {
      title: "Module 1: The \"Why\" & \"How\" of Learning",
      description: "Understanding the fundamentals of how learning works and why it matters",
      order: 1,
      lessons: [
        {
          title: "Lesson 1.1: The \"Spark\"",
          description: "Video Hook & Interactive Poll to ignite your learning journey",
          duration: 20,
          order: 1,
          interactiveElements: [
            {
              type: 'reflection',
              prompt: 'What sparked your interest in learning science?',
            }
          ],
        },
        {
          title: "Lesson 1.2: The Brain's Bottleneck",
          description: "Cognitive Load Concept & \"Design Fixer\" Interactive",
          duration: 30,
          order: 2,
          interactiveElements: [
            {
              type: 'simulation',
              title: 'Design Fixer',
              description: 'Fix learning materials by reducing cognitive load',
            }
          ],
        },
      ],
    },
    {
      title: "Module 2: Fueling the Learner",
      description: "Discover what motivates learners and drives engagement",
      order: 2,
      lessons: [
        {
          title: "Lesson 2.1: The Learner's \"Fuel\"",
          description: "Defining Autonomy, Mastery, & Purpose",
          duration: 25,
          order: 1,
        },
        {
          title: "Lesson 2.2: The \"Engagement Recipe\"",
          description: "Reflection Prompt & Community \"Ingredient\" Wall",
          duration: 25,
          order: 2,
          interactiveElements: [
            {
              type: 'reflection',
              prompt: 'What ingredients make up your ideal engagement recipe?',
            }
          ],
        },
      ],
    },
    {
      title: "Module 3: Strategy 1 - Learning by Doing",
      description: "Transform passive learning into active engagement",
      order: 3,
      lessons: [
        {
          title: "Lesson 3.1: Active vs. Passive Learning",
          description: "Core Concept - Understanding the difference and impact",
          duration: 20,
          order: 1,
        },
        {
          title: "Lesson 3.2: AI-Powered Activity Builder",
          description: "AI Generator Interactive to create engaging learning activities",
          duration: 30,
          order: 2,
          interactiveElements: [
            {
              type: 'aiGenerator',
              title: 'Activity Builder',
              description: 'Generate custom learning activities using AI',
            }
          ],
        },
      ],
    },
    {
      title: "Module 4: Strategy 2 - Making Learning Stick",
      description: "Techniques to ensure long-term retention and mastery",
      order: 4,
      lessons: [
        {
          title: "Lesson 4.1: Feedback that \"Feeds Forward\"",
          description: "\"Feedback Face-off\" Interactive - Learn effective feedback strategies",
          duration: 25,
          order: 1,
          interactiveElements: [
            {
              type: 'simulation',
              title: 'Feedback Face-off',
              description: 'Compare different feedback approaches and their impact',
            }
          ],
        },
        {
          title: "Lesson 4.2: The Power of Retrieval",
          description: "Concept & AI Quiz Generator for spaced repetition",
          duration: 30,
          order: 2,
          interactiveElements: [
            {
              type: 'aiGenerator',
              title: 'Quiz Generator',
              description: 'Create custom quizzes to reinforce learning',
            }
          ],
        },
      ],
    },
    {
      title: "Module 5: Your Learning Science Launchpad",
      description: "Apply your knowledge and celebrate your progress",
      order: 5,
      lessons: [
        {
          title: "Lesson 5.1: My \"One Small Change\"",
          description: "Final Reflection Prompt - Commit to implementing what you've learned",
          duration: 20,
          order: 1,
          interactiveElements: [
            {
              type: 'reflection',
              prompt: 'What is the one small change you will make in your teaching practice?',
            }
          ],
        },
        {
          title: "Lesson 5.2: Your Learning Journey",
          description: "Visual Progress Timeline - See how far you've come",
          duration: 15,
          order: 2,
        },
        {
          title: "Lesson 5.3: Final Assessment & Certificate",
          description: "Quiz & Certificate Generation - Demonstrate your mastery",
          duration: 25,
          order: 3,
          quiz: {
            title: 'Learning Science Mastery Assessment',
            description: 'Final assessment to earn your certificate',
          }
        },
      ],
    },
  ],
};

async function addLearningScience() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    // Check if course already exists
    const existingCourse = await Course.findOne({ title: learningScience.title });
    if (existingCourse) {
      console.log("Course already exists - updating...");
      const updatedCourse = await Course.findByIdAndUpdate(
        existingCourse._id,
        learningScience,
        { new: true }
      );
      console.log(`Successfully updated course: ${updatedCourse?.title}`);
      console.log(`Course ID: ${updatedCourse?._id}`);
      console.log(`Modules: ${updatedCourse?.modules.length}`);
      console.log(`Total Lessons: ${updatedCourse?.modules.reduce((acc, m) => acc + m.lessons.length, 0)}`);
      await mongoose.disconnect();
      return;
    }

    // Create new course
    const course = await Course.create(learningScience);
    console.log(`Successfully created course: ${course.title}`);
    console.log(`Course ID: ${course._id}`);
    console.log(`Modules: ${course.modules.length}`);
    console.log(`Total Lessons: ${course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error adding Learning Science course:", error);
    process.exit(1);
  }
}

addLearningScience();
