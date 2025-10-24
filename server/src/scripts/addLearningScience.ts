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
  totalDuration: 6,
  enrolledCount: 0,
  isPublished: true,
  modules: [
    {
      title: "Foundations of Learning Science",
      description: "Understanding how people learn and the science behind effective teaching",
      order: 1,
      lessons: [
        {
          title: "Introduction to Learning Science",
          description: "What is learning science and why it matters for educators",
          duration: 20,
          order: 1,
        },
        {
          title: "How Memory Works",
          description: "Understanding memory systems and their implications for teaching",
          duration: 25,
          order: 2,
        },
        {
          title: "Cognitive Load Theory",
          description: "Managing cognitive load to optimize learning",
          duration: 30,
          order: 3,
        },
      ],
    },
    {
      title: "Evidence-Based Teaching Strategies",
      description: "Practical strategies backed by learning science research",
      order: 2,
      lessons: [
        {
          title: "Spaced Repetition and Retrieval Practice",
          description: "Using spacing and testing to improve long-term retention",
          duration: 25,
          order: 1,
        },
        {
          title: "Interleaving and Varied Practice",
          description: "Mixing topics and problems for better learning outcomes",
          duration: 20,
          order: 2,
        },
        {
          title: "Feedback and Metacognition",
          description: "Providing effective feedback and teaching students to think about their thinking",
          duration: 30,
          order: 3,
        },
      ],
    },
    {
      title: "Applying Learning Science in Your Classroom",
      description: "Practical implementation of learning science principles",
      order: 3,
      lessons: [
        {
          title: "Designing Learning Activities",
          description: "Creating activities that align with learning science principles",
          duration: 25,
          order: 1,
        },
        {
          title: "Assessment for Learning",
          description: "Using assessment to enhance rather than just measure learning",
          duration: 20,
          order: 2,
        },
        {
          title: "Creating a Learning-Centered Environment",
          description: "Building a classroom culture that supports effective learning",
          duration: 25,
          order: 3,
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
      console.log("Course already exists");
      console.log(`Course ID: ${existingCourse._id}`);
      await mongoose.disconnect();
      return;
    }

    // Create new course
    const course = await Course.create(learningScience);
    console.log(`Successfully created course: ${course.title}`);
    console.log(`Course ID: ${course._id}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error adding Learning Science course:", error);
    process.exit(1);
  }
}

addLearningScience();
