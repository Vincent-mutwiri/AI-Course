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
          content: "Research by psychologists Edward Deci and Richard Ryan reveals that all humans are driven by three fundamental psychological needs: Autonomy, Mastery, and Purpose. When these needs are met, motivation flourishes naturally."
        },
        {
          type: "text",
          title: "The Problem with Extrinsic Motivation",
          content: "For decades, education has relied heavily on extrinsic motivators: grades, stickers, pizza parties, honor rolls. While these can produce short-term compliance, research shows they often undermine long-term motivation.\n\nWhen students learn 'for the grade,' they:\n- Choose easier tasks to guarantee success\n- Lose interest once the reward is removed\n- Focus on performance, not learning\n- Develop a fixed mindset ('I'm only good if I get an A')\n\nIntrinsic motivation, on the other hand, creates learners who persist through challenges, seek out learning opportunities, and develop a genuine love of learning."
        },
        {
          type: "text",
          title: "Autonomy: The Need for Choice and Control",
          content: "**Autonomy** is the feeling that you have a say in what you're doing and how you're doing it. It's not about letting students do whatever they want—it's about giving them meaningful choices within a structured framework.\n\n**Why It Works:**\nWhen students have autonomy, they feel ownership over their learning. They're not just following orders—they're making decisions, which activates deeper engagement and commitment.\n\n**Practical Examples:**\n- **Choice Boards**: Offer 3-4 ways to demonstrate understanding (essay, video, presentation, infographic)\n- **Flexible Seating**: Let students choose where they work best\n- **Project Topics**: Within a theme (e.g., 'ecosystems'), let students choose which ecosystem to research\n- **Learning Pathways**: Allow students to choose the order of tasks or modules\n- **Goal Setting**: Have students set personal learning goals and track their progress\n\n**The Key**: Structure + Choice. Too much freedom overwhelms; too little stifles. Find the sweet spot."
        },
        {
          type: "text",
          title: "Mastery: The Drive to Get Better",
          content: "**Mastery** is the desire to improve, to make progress, and to develop competence. Humans are naturally wired to want to get better at things that matter to them. Think about how kids will practice a video game for hours, failing repeatedly, because they can see themselves improving.\n\n**Why It Works:**\nMastery taps into our intrinsic desire for growth. When students see visible progress, they develop a growth mindset and persist through challenges.\n\n**Practical Examples:**\n- **Progress Tracking**: Use skill trees, portfolios, or progress bars to visualize growth\n- **Mastery-Based Grading**: Allow retakes and revisions; focus on growth, not one-time performance\n- **Specific Feedback**: Give actionable feedback that shows students exactly how to improve\n- **Just-Right Challenges**: Use the 'Goldilocks Principle'—tasks that are challenging but achievable\n- **Celebrate Effort**: Praise the process ('You tried three different strategies!') not just the outcome\n\n**The Key**: Make progress visible and celebrate growth, not just achievement."
        },
        {
          type: "text",
          title: "Purpose: Connecting to Something Bigger",
          content: "**Purpose** is the feeling that what you're learning matters—that it connects to real problems, helps real people, or contributes to something meaningful beyond yourself. This is the 'why' behind the learning.\n\n**Why It Works:**\nWhen students understand why they're learning something and how it connects to the real world, they're far more likely to engage deeply and remember what they've learned.\n\n**Practical Examples:**\n- **Real-World Projects**: Have students solve actual problems in their community\n- **Authentic Audiences**: Students present to real stakeholders, not just the teacher\n- **Career Connections**: Show how skills apply to future careers and life\n- **Service Learning**: Connect learning to helping others\n- **Student Choice in Topics**: Let students explore issues they care about\n\n**The Key**: Answer the question 'Why does this matter?' explicitly and often."
        },
        {
          type: "callout",
          style: "success",
          title: "The Magic Formula",
          content: "Autonomy + Mastery + Purpose = Intrinsic Motivation. When all three are present, students become self-directed learners who are motivated from within, not by external rewards or punishments."
        },
        {
          type: "text",
          title: "The Research Behind AMP",
          content: "Self-Determination Theory (SDT), developed by Deci and Ryan over 40 years of research, has been validated in thousands of studies across cultures, ages, and contexts. The findings are consistent: when autonomy, mastery, and purpose are supported, people are more motivated, perform better, and experience greater well-being.\n\nIn education specifically, students in AMP-supportive classrooms show:\n- Higher engagement and persistence\n- Deeper conceptual understanding\n- Greater creativity and problem-solving\n- Improved well-being and reduced anxiety\n- Better long-term retention of knowledge"
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
