import mongoose from "mongoose";
import Course from "../models/Course";
import { MONGODB_URI } from "../config/env";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const module1Data = JSON.parse(
  readFileSync(join(__dirname, "../../../module1-data.json"), "utf-8")
);

async function seedModule1() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    // Find or create the AI in EdTech course
    let course = await Course.findOne({ 
      title: "AI in EdTech: A Practical Guide for Founders and Developers",
      instructor: "Vincent Mutwiri"
    });

    if (!course) {
      course = new Course({
        title: "AI in EdTech: A Practical Guide for Founders and Developers",
        description: "Equip EdTech founders and developers with the knowledge and practical skills to responsibly leverage AI in educational products.",
        instructor: "Vincent Mutwiri",
        category: "AI & Technology",
        level: "intermediate",
        modules: [],
        isPublished: true,
      });
    }

    // Transform module1-data.json to match Course schema
    const moduleData = module1Data.module;
    
    const transformedModule = {
      title: moduleData.title,
      description: moduleData.description,
      order: moduleData.order,
      lessons: moduleData.lessons.map((lesson: any) => ({
        title: lesson.title,
        description: lesson.objective,
        objective: lesson.objective,
        duration: parseInt(lesson.duration) || 15,
        order: lesson.order,
        videoUrl: "",
        content: lesson.content,
        interactive: lesson.interactive,
        quiz: lesson.quiz,
        codeSnippet: lesson.code_snippet,
      })),
    };

    // Check if module already exists
    const existingModuleIndex = course.modules.findIndex(
      (m) => m.title === transformedModule.title
    );

    if (existingModuleIndex >= 0) {
      course.modules[existingModuleIndex] = transformedModule as any;
      console.log("Updated existing Module 1");
    } else {
      course.modules.push(transformedModule as any);
      console.log("Added new Module 1");
    }

    // Calculate total duration
    course.totalDuration = course.modules.reduce(
      (total, module) =>
        total + module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
      0
    );

    await course.save();
    console.log("\n✅ Module 1 seeded successfully!");
    console.log(`Course: ${course.title}`);
    console.log(`Total Modules: ${course.modules.length}`);
    console.log(`Total Duration: ${course.totalDuration} minutes`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Module 1:", error);
    process.exit(1);
  }
}

seedModule1();
