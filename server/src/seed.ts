import dotenv from "dotenv";
import { connectDB } from "./config/database";
import Course from "./models/Course";

dotenv.config({ path: ".env.local" });

const sampleCourses = [
  {
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    instructor: "John Doe",
    category: "Web Development",
    level: "beginner",
    totalDuration: 600,
    isPublished: true,
    modules: [
      {
        title: "Getting Started",
        description: "Introduction to web development basics",
        order: 1,
        lessons: [
          { title: "What is Web Development?", description: "Overview of web development", duration: 15, order: 1 },
          { title: "Setting Up Your Environment", description: "Install necessary tools", duration: 20, order: 2 },
        ],
      },
      {
        title: "HTML Fundamentals",
        description: "Learn HTML from scratch",
        order: 2,
        lessons: [
          { title: "HTML Basics", description: "Introduction to HTML tags", duration: 30, order: 1 },
          { title: "Forms and Input", description: "Working with forms", duration: 25, order: 2 },
        ],
      },
    ],
  },
  {
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript concepts and modern ES6+ features.",
    instructor: "Jane Smith",
    category: "Programming",
    level: "advanced",
    totalDuration: 900,
    isPublished: true,
    modules: [
      {
        title: "ES6+ Features",
        description: "Modern JavaScript features",
        order: 1,
        lessons: [
          { title: "Arrow Functions", description: "Understanding arrow functions", duration: 20, order: 1 },
          { title: "Promises and Async/Await", description: "Asynchronous JavaScript", duration: 35, order: 2 },
        ],
      },
    ],
  },
  {
    title: "React for Beginners",
    description: "Build modern web applications with React.",
    instructor: "Mike Johnson",
    category: "Web Development",
    level: "intermediate",
    totalDuration: 720,
    isPublished: true,
    modules: [
      {
        title: "React Basics",
        description: "Introduction to React",
        order: 1,
        lessons: [
          { title: "Components and Props", description: "Understanding React components", duration: 30, order: 1 },
          { title: "State and Lifecycle", description: "Managing component state", duration: 40, order: 2 },
        ],
      },
    ],
  },
];

async function seed() {
  try {
    await connectDB();
    await Course.deleteMany({});
    await Course.insertMany(sampleCourses);
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
