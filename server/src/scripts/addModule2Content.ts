import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

async function addModule2Content() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    const course = await Course.findOne({ title: "The Learning Science Playbook for Educators" });

    if (!course) {
      console.log("Course not found");
      await mongoose.disconnect();
      return;
    }

    // Update Module 2, Lesson 2.1: The Learner's "Fuel"
    if (course.modules[1] && course.modules[1].lessons[0]) {
      course.modules[1].lessons[0].content = [
        {
          type: "video",
          s3Key: "videos/module_2_1_amp.mp4", // Admin will upload this
          title: "The Learner's Fuel: Autonomy, Mastery, Purpose",
          duration: "3 min"
        },
        {
          type: "text",
          title: "What Really Motivates Learners?",
          content: "It's not just grades or gold stars. Learning Science shows us that deep, lasting motivation comes from three intrinsic drives that are hardwired into human psychology. When we tap into these drives, students don't just comply—they engage, persist, and thrive."
        },
        {
          type: "callout",
          style: "info",
          title: "The Three Pillars of Intrinsic Motivation",
          content: "Research by psychologist Edward Deci and Richard Ryan reveals that all humans are driven by three fundamental psychological needs: Autonomy, Mastery, and Purpose. When these needs are met, motivation flourishes naturally."
        },
        {
          type: "text",
          title: "Autonomy: The Need for Choice and Control",
          content: "**Autonomy** is the feeling that you have a say in what you're doing and how you're doing it. It's not about letting students do whatever they want—it's about giving them meaningful choices within a structured framework.\n\n**Examples:**\n- Choosing between project topics\n- Selecting how to demonstrate understanding (essay, presentation, video)\n- Setting personal learning goals\n- Deciding the order of tasks"
        },
        {
          type: "text",
          title: "Mastery: The Drive to Get Better",
          content: "**Mastery** is the desire to improve, to make progress, and to develop competence. Humans are naturally wired to want to get better at things that matter to them.\n\n**Examples:**\n- Seeing visible progress (skill trees, portfolios)\n- Receiving specific, actionable feedback\n- Tackling challenges that are just right (not too easy, not too hard)\n- Celebrating growth, not just achievement"
        },
        {
          type: "text",
          title: "Purpose: Connecting to Something Bigger",
          content: "**Purpose** is the feeling that what you're learning matters—that it connects to real problems, helps real people, or contributes to something meaningful beyond yourself.\n\n**Examples:**\n- Solving real-world problems\n- Creating something that helps others\n- Understanding how skills apply to future careers\n- Making an impact in the community"
        },
        {
          type: "callout",
          style: "success",
          title: "The Magic Formula",
          content: "Autonomy + Mastery + Purpose = Intrinsic Motivation. When all three are present, students become self-directed learners who are motivated from within, not by external rewards or punishments."
        }
      ];
    }

    // Update Module 2, Lesson 2.2: The "Engagement Recipe"
    if (course.modules[1] && course.modules[1].lessons[1]) {
      course.modules[1].lessons[1].content = [
        {
          type: "text",
          title: "Your Engagement Recipe",
          content: "Every great lesson has a 'secret ingredient' that makes it memorable and engaging. But here's the thing: that secret ingredient almost always connects back to Autonomy, Mastery, or Purpose. Let's discover yours!"
        },
        {
          type: "callout",
          style: "info",
          title: "Two-Part Activity",
          content: "First, you'll reflect on your most successful lesson. Then, you'll see what hundreds of other educators identified as their secret ingredients—and discover the common patterns."
        }
      ];

      course.modules[1].lessons[1].interactiveElements = [
        {
          type: "reflection",
          question: "Think of your most successful lesson. What was the 'secret ingredient' that made it so engaging?",
          prompt: "Be specific! What exactly did students do? What made it different from other lessons?",
          placeholder: "Example: Students could choose their own research topics based on their interests, and they presented their findings to younger students...",
          minLength: 50
        },
        {
          type: "wordCloud",
          title: "See what other educators said!",
          description: "These are the most common 'secret ingredients' mentioned by educators. Click on any word to see which motivation principle it connects to!",
          dataKey: "lesson2_2_Cloud"
        }
      ];
    }

    await course.save();
    console.log("Successfully updated Module 2 content");
    console.log("Lesson 2.1: Added AMP framework content");
    console.log("Lesson 2.2: Added reflection and word cloud interactive");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error updating Module 2 content:", error);
    process.exit(1);
  }
}

addModule2Content();
