import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

async function addModule1Content() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    const course = await Course.findOne({ title: "The Learning Science Playbook for Educators" });

    if (!course) {
      console.log("Course not found");
      await mongoose.disconnect();
      return;
    }

    // Update Module 1, Lesson 1.1 with video and poll
    if (course.modules[0] && course.modules[0].lessons[0]) {
      course.modules[0].lessons[0].content = [
        {
          type: "video",
          s3Key: "videos/lesson_1_1_hook.mp4", // Admin will upload this
          title: "The 'Forgotten Lesson' Hook",
          duration: "2 min"
        }
      ];

      course.modules[0].lessons[0].interactiveElements = [
        {
          type: "poll",
          question: "How often do your students forget what you taught them?",
          options: [
            { id: "opt1", text: "Rarely - they remember most things" },
            { id: "opt2", text: "Sometimes - about half the time" },
            { id: "opt3", text: "Often - it's a constant struggle" }
          ],
          simulatedResult: {
            percentage: 82,
            feedback: "You're in good company: 82% of teachers experience this challenge regularly."
          }
        }
      ];
    }

    // Update Module 1, Lesson 1.2 with Design Fixer interactive
    if (course.modules[0] && course.modules[0].lessons[1]) {
      course.modules[0].lessons[1].content = [
        {
          type: "text",
          title: "Understanding Cognitive Load",
          content: "Our brains have limited working memory capacity. When we overload students with too much information at once, or present it in confusing ways, we create unnecessary cognitive load that prevents learning."
        }
      ];

      course.modules[0].lessons[1].interactiveElements = [
        {
          type: "designFixer",
          badSlideUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", // Placeholder - admin will upload actual slides
          goodSlideUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80", // Placeholder
          hotspots: [
            {
              id: "jargon",
              feedback: "Good catch! Complex jargon increases cognitive load. Using simple language helps students focus on the concept, not decoding vocabulary.",
              style: { top: "15%", left: "10%", width: "50%", height: "10%" }
            },
            {
              id: "font",
              feedback: "Exactly! This tiny font is hard to read. Larger, clear fonts reduce cognitive load and make content more accessible.",
              style: { top: "30%", left: "5%", width: "60%", height: "20%" }
            },
            {
              id: "image",
              feedback: "Yep! This distracting image is irrelevant to the content. Removing it helps students focus on what matters.",
              style: { top: "55%", left: "65%", width: "30%", height: "35%" }
            }
          ]
        }
      ];
    }

    await course.save();
    console.log("Successfully updated Module 1 content");
    console.log("Lesson 1.1: Added video and poll");
    console.log("Lesson 1.2: Added cognitive load content and Design Fixer interactive");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error updating Module 1 content:", error);
    process.exit(1);
  }
}

addModule1Content();
