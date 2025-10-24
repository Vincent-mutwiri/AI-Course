import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

async function addModule5Content() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    const course = await Course.findOne({ title: "The Learning Science Playbook for Educators" });

    if (!course) {
      console.log("Course not found");
      await mongoose.disconnect();
      return;
    }

    // Update Module 5, Lesson 5.1: My "One Small Change"
    if (course.modules[4] && course.modules[4].lessons[0]) {
      course.modules[4].lessons[0].content = [
        {
          type: "text",
          title: "Your Commitment to Change",
          content: "You've learned about cognitive load, motivation, active learning, effective feedback, and retrieval practice. Now it's time to put it into action. Research shows that making a specific, written commitment dramatically increases the likelihood you'll follow through."
        },
        {
          type: "callout",
          style: "info",
          title: "The Power of Commitment",
          content: "Studies show that people who write down their goals and commitments are 42% more likely to achieve them. This isn't just a reflection—it's your first step toward transforming your teaching practice."
        },
        {
          type: "text",
          title: "Make It Specific",
          content: "Don't just say 'I'll use active learning.' Instead, be specific:\n\n✓ 'Next Tuesday, I'll have students build a model of the water cycle instead of watching a video.'\n\n✓ 'This Friday, I'll give GPS feedback on essays using the 'specific + next step' formula.'\n\n✓ 'Every Monday, I'll start class with 3 retrieval questions from last week's lesson.'\n\nThe more specific you are, the more likely you are to actually do it."
        }
      ];

      course.modules[4].lessons[0].interactiveElements = [
        {
          type: "reflection",
          question: "What is one small, specific change you will make to your teaching next week, based on what you've learned?",
          prompt: "This commitment is just for you. We'll save it so you can review it later on your journey. Be specific about WHAT you'll do, WHEN you'll do it, and WHY it matters.",
          placeholder: "Example: Next Wednesday, I'll start my history class with 3 retrieval questions about last week's lesson on the American Revolution. This will strengthen their memory and activate prior knowledge before we move to the next topic...",
          minLength: 100
        }
      ];
    }

    // Update Module 5, Lesson 5.2: Your Learning Journey
    if (course.modules[4] && course.modules[4].lessons[1]) {
      course.modules[4].lessons[1].content = [
        {
          type: "text",
          title: "Look How Far You've Come!",
          content: "Take a moment to reflect on your journey through this course. You started by understanding why students forget, and now you have a complete toolkit of evidence-based strategies to transform your teaching."
        },
        {
          type: "callout",
          style: "success",
          title: "Your Learning Science Toolkit",
          content: "You now know how to: Reduce cognitive load • Tap into intrinsic motivation • Design active learning experiences • Give feedback that feeds forward • Use retrieval to strengthen memory"
        },
        {
          type: "text",
          title: "Your Personal Timeline",
          content: "Below, you'll see a visual timeline of your journey through this course. Each milestone represents a key concept you've mastered and a tool you can now use in your classroom."
        }
      ];

      course.modules[4].lessons[1].interactiveElements = [
        {
          type: "journeyTimeline",
          title: "Your Learning Science Journey"
        }
      ];
    }

    // Update Module 5, Lesson 5.3: Final Assessment & Certificate
    if (course.modules[4] && course.modules[4].lessons[2]) {
      course.modules[4].lessons[2].content = [
        {
          type: "text",
          title: "Final Knowledge Check",
          content: "You've completed all the lessons and engaged with the interactive tools. Now it's time to demonstrate your mastery of learning science principles. This assessment will test your understanding of the key concepts from all five modules."
        },
        {
          type: "callout",
          style: "info",
          title: "Assessment Details",
          content: "• 10 multiple-choice questions covering all modules\n• You need 8 correct answers (80%) to pass\n• You can retake the assessment if needed\n• Upon passing, you'll earn your official certificate"
        },
        {
          type: "text",
          title: "Earn Your Certificate",
          content: "Once you pass the assessment, you'll receive an official certificate recognizing you as a **Learning Science Practitioner**. This certificate validates your understanding of evidence-based teaching strategies and your commitment to applying them in your classroom."
        }
      ];

      course.modules[4].lessons[2].interactiveElements = [
        {
          type: "finalAssessment",
          title: "Final Knowledge Check",
          passingScore: 8,
          totalQuestions: 10,
          quizDataKey: "learningScienceQuiz"
        }
      ];
    }

    await course.save();
    console.log("Successfully updated Module 5 content");
    console.log("Lesson 5.1: Added commitment reflection");
    console.log("Lesson 5.2: Added journey timeline");
    console.log("Lesson 5.3: Added final assessment & certificate");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error updating Module 5 content:", error);
    process.exit(1);
  }
}

addModule5Content();
