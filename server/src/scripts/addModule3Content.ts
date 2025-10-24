import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

async function addModule3Content() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    const course = await Course.findOne({ title: "The Learning Science Playbook for Educators" });

    if (!course) {
      console.log("Course not found");
      await mongoose.disconnect();
      return;
    }

    // Update Module 3, Lesson 3.1: Active vs. Passive Learning
    if (course.modules[2] && course.modules[2].lessons[0]) {
      course.modules[2].lessons[0].content = [
        {
          type: "text",
          title: "Strategy 1: Learning by Doing",
          content: "Why do we remember what we *do* far better than what we just *see*? The science is clear: active learning builds robust, long-term memory pathways. Passive learning, like just watching a video, is like tracing a picture. Active learning, like building a project in PictoBlox, is like drawing it from scratch. Let's compare the two."
        },
        {
          type: "callout",
          style: "info",
          title: "The Active Learning Principle",
          content: "Research shows that students retain only 10% of what they read, 20% of what they hear, but up to 90% of what they do and teach to others. Active learning isn't just better—it's transformative."
        },
        {
          type: "comparison",
          title: "Active vs. Passive Learning",
          subtitle: "See the difference in how students engage with content",
          benefits: [
            "Student builds a dance loop in PictoBlox",
            "Learner struggles, debugs, and *solves* a problem",
            "Knowledge is constructed and 'owned' by the student",
            "Creates strong memory pathways through doing",
            "Develops problem-solving and critical thinking skills"
          ],
          risks: [
            "Student watches a video about 'for loops'",
            "Learner passively receives information",
            "Knowledge is shallow and quickly forgotten",
            "No struggle = no deep learning",
            "Skills remain theoretical, not practical"
          ]
        },
        {
          type: "text",
          title: "Why Active Learning Works",
          content: "When students actively engage with material—building, creating, solving, discussing—they're not just memorizing facts. They're constructing understanding. The struggle is the learning. When a student debugs their code, they're building neural pathways that connect the concept to the solution. That's learning that sticks."
        },
        {
          type: "text",
          title: "Examples of Active Learning",
          content: "**Instead of lecturing about ecosystems:** Have students build a terrarium and observe changes over time.\n\n**Instead of explaining fractions:** Have students divide a pizza (real or virtual) among friends with different appetites.\n\n**Instead of teaching about coding loops:** Have students program a robot to dance or navigate a maze.\n\n**Instead of describing historical events:** Have students role-play a debate from that time period.\n\nNotice the pattern? Every active approach puts the student in the driver's seat."
        },
        {
          type: "callout",
          style: "success",
          title: "Your Turn",
          content: "In the next lesson, you'll use our AI-powered tool to transform any passive lesson topic into three active learning activities. Get ready to revolutionize your teaching!"
        }
      ];
    }

    // Update Module 3, Lesson 3.2: AI-Powered Activity Builder
    if (course.modules[2] && course.modules[2].lessons[1]) {
      course.modules[2].lessons[1].content = [
        {
          type: "text",
          title: "Transform Any Lesson with AI",
          content: "You know active learning is powerful. But sometimes it's hard to come up with creative, hands-on activities—especially when you're teaching multiple subjects or working with limited resources. That's where AI can help."
        },
        {
          type: "callout",
          style: "info",
          title: "How This Works",
          content: "Our AI assistant has been trained on learning science principles and thousands of active learning examples. Just enter any lesson topic (even a 'boring' one!), and it will generate three creative, hands-on activities you can use immediately in your classroom."
        },
        {
          type: "text",
          title: "Try It Yourself",
          content: "Think of a lesson topic that typically feels passive or lecture-heavy. Maybe it's:\n\n- The Water Cycle\n- Pythagorean Theorem\n- Photosynthesis\n- The French Revolution\n- Parts of Speech\n\nEnter it below and watch the AI transform it into engaging, active learning experiences!"
        }
      ];

      course.modules[2].lessons[1].interactiveElements = [
        {
          type: "aiGenerator",
          generatorType: "activityBuilder",
          title: "AI-Powered Activity Builder",
          description: "Stuck with a passive lesson? Enter a topic below and our AI assistant, trained on learning science principles, will suggest 3 active learning ideas you can use in your classroom.",
          placeholder: "Enter a lesson topic (e.g., 'The Water Cycle', 'Pythagorean Theorem', 'Photosynthesis')...",
          buttonText: "Generate Active Ideas",
          inputLabel: "Lesson Topic"
        }
      ];
    }

    await course.save();
    console.log("Successfully updated Module 3 content");
    console.log("Lesson 3.1: Added active vs passive learning content");
    console.log("Lesson 3.2: Added AI Activity Builder interactive");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error updating Module 3 content:", error);
    process.exit(1);
  }
}

addModule3Content();
