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
          title: "Start Small: The Power of Tiny Changes",
          content: "You might be tempted to overhaul your entire teaching practice at once. Resist that urge. Research on behavior change shows that small, consistent changes are far more sustainable than dramatic overhauls.\n\nJames Clear, author of 'Atomic Habits,' calls this the '1% improvement rule.' If you improve by just 1% each day, you'll be 37 times better by the end of the year. The same principle applies to teaching.\n\n**Instead of:** 'I'll redesign all my lessons to be active learning.'\n**Try:** 'I'll add one 5-minute active learning activity to my lesson next Tuesday.'\n\n**Instead of:** 'I'll completely change how I give feedback.'\n**Try:** 'I'll use the GPS feedback formula on one assignment this week.'\n\n**Instead of:** 'I'll implement retrieval practice in every lesson.'\n**Try:** 'I'll start each Monday class with 3 retrieval questions from last week.'\n\nSmall changes compound over time."
        },
        {
          type: "text",
          title: "Make It Specific: The Implementation Intention",
          content: "Psychologist Peter Gollwitzer's research on 'implementation intentions' shows that people are 2-3x more likely to follow through when they specify exactly when, where, and how they'll act.\n\nThe formula is simple: **'When [situation], I will [action].'**\n\n**Examples:**\n✓ 'When I plan my Tuesday lesson, I will replace the video with a hands-on activity.'\n\n✓ 'When I grade essays on Friday, I will use the GPS feedback formula: positive + specific + next step.'\n\n✓ 'When I start class on Monday, I will ask 3 retrieval questions from last week's lesson.'\n\n✓ 'When I design my next slide deck, I will remove decorative images and simplify the language.'\n\nThe more specific you are, the more likely you are to actually do it."
        },
        {
          type: "text",
          title: "Choose Your Strategy",
          content: "You've learned five powerful strategies in this course. You don't need to implement all of them at once. Choose ONE that resonates most with you and your current teaching challenges:\n\n**1. Cognitive Load Management** - Best if your students seem overwhelmed or confused by your materials\n\n**2. Intrinsic Motivation (AMP)** - Best if your students seem disengaged or unmotivated\n\n**3. Active Learning** - Best if your students forget quickly or struggle to apply knowledge\n\n**4. Effective Feedback** - Best if your students don't improve despite your feedback\n\n**5. Retrieval Practice** - Best if your students struggle to remember past content\n\nWhich one speaks to you? That's your starting point."
        },
        {
          type: "callout",
          style: "success",
          title: "Your Turn",
          content: "In the reflection below, commit to ONE specific change you'll make next week. Be as specific as possible: What will you do? When will you do it? Why does it matter to you?"
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
          title: "What You've Learned",
          content: "**Module 1: The Foundation**\nYou discovered that traditional teaching often works against how the brain learns. You learned about the Forgetting Curve and how cognitive load affects learning. You now understand the difference between extraneous load (bad) and germane load (good), and you have practical strategies to reduce cognitive overload in your lessons.\n\n**Module 2: The Fuel**\nYou explored what truly motivates learners. You learned that extrinsic rewards (grades, stickers) often undermine long-term motivation, while intrinsic motivation (Autonomy, Mastery, Purpose) creates self-directed learners who persist through challenges. You now have concrete strategies to build AMP into your classroom.\n\n**Module 3: The Method**\nYou discovered why active learning is so much more powerful than passive learning. You learned that students retain 90% of what they do and teach to others, compared to just 10-20% of what they read or hear. You explored the levels of active learning and generated your own active learning activities using AI.\n\n**Module 4: The Accelerators**\nYou learned two powerful strategies to accelerate learning: GPS feedback (specific, actionable, forward-focused) and retrieval practice (the testing effect). You discovered that the struggle to remember is what builds long-term memory, and that spaced retrieval can flatten the Forgetting Curve.\n\n**Module 5: The Action Plan**\nYou committed to making one specific change in your teaching practice. You learned that small, consistent changes compound over time, and that implementation intentions dramatically increase follow-through."
        },
        {
          type: "text",
          title: "The Research Behind What You've Learned",
          content: "Every strategy in this course is backed by decades of research from cognitive psychology, neuroscience, and education science. Here are some of the key researchers whose work informed this course:\n\n• **Hermann Ebbinghaus** - The Forgetting Curve\n• **George Miller** - Working memory capacity\n• **John Sweller** - Cognitive Load Theory\n• **Edward Deci & Richard Ryan** - Self-Determination Theory (AMP)\n• **Edgar Dale** - The Cone of Experience (active vs. passive learning)\n• **Henry Roediger & Jeffrey Karpicke** - The Testing Effect (retrieval practice)\n• **John Hattie** - Visible Learning (effect sizes of teaching strategies)\n• **Carol Dweck** - Growth Mindset\n• **Peter Gollwitzer** - Implementation Intentions\n\nYou're now part of a global movement of educators who are applying learning science to create more effective, engaging, and equitable learning experiences."
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
