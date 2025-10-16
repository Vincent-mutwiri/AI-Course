import mongoose from "mongoose";
import dotenv from "dotenv";
import * as path from "path";
import Course from "../models/Course";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

const sampleCourse = {
  title: "AI in EdTech for Founders and Developers",
  description: "This comprehensive course is designed for founders and developers looking to integrate AI into educational technology. Learn how to leverage AI to create personalized learning experiences, automate content delivery, and build intelligent educational applications.",
  instructor: "Vincent Mutwiri",
  thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  category: "AI & Machine Learning",
  level: "intermediate",
  totalDuration: 8,
  enrolledCount: 0,
  isPublished: true,
  modules: [
    {
      title: "Introduction to AI in Education",
      description: "Understanding the role of AI in modern education",
      order: 1,
      lessons: [
        {
          title: "Welcome to the Course",
          description: "Course overview and what to expect",
          duration: 15,
          order: 1,
        },
        {
          title: "The State of AI in EdTech",
          description: "Current trends and future possibilities",
          duration: 25,
          order: 2,
        },
      ],
    },
    {
      title: "Building AI-Powered Learning Platforms",
      description: "Technical foundations for educational AI applications",
      order: 2,
      lessons: [
        {
          title: "Architecture of Learning Platforms",
          description: "Designing scalable educational systems",
          duration: 30,
          order: 1,
        },
        {
          title: "Integrating AI Components",
          description: "Adding intelligence to your EdTech solution",
          duration: 35,
          order: 2,
        },
      ],
    },
  ],
};

async function addSampleCourse() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    // Check if course already exists
    const existingCourse = await Course.findOne({ title: sampleCourse.title });
    if (existingCourse) {
      console.log("Course already exists");
      await mongoose.disconnect();
      return;
    }

    // Create new course
    const course = await Course.create(sampleCourse);
    console.log(`Successfully created course: ${course.title}`);
    console.log(`Course ID: ${course._id}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error adding sample course:", error);
    process.exit(1);
  }
}

addSampleCourse();
