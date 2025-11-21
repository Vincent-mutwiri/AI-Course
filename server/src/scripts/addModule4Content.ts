import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

async function addModule4Content() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    const course = await Course.findOne({ title: "The Learning Science Playbook for Educators" });

    if (!course) {
      console.log("Course not found");
      await mongoose.disconnect();
      return;
    }

    // Update Module 4, Lesson 4.1: Feedback that "Feeds Forward"
    if (course.modules[3] && course.modules[3].lessons[0]) {
      course.modules[3].lessons[0].content = [
        {
          type: "text",
          title: "Strategy 2: Feedback that 'Feeds Forward'",
          content: "Most feedback acts like a 'stop sign'—it tells the student the 'road is closed' (the grade is final) and offers no path forward. Great feedback, backed by learning science, acts like a 'GPS'. It tells the student *exactly* where they are, where they need to go, and the next turn to take."
        },
        {
          type: "callout",
          style: "info",
          title: "The Purpose of Feedback",
          content: "The goal of feedback is not to justify a grade; it's to cause learning."
        },
        {
          type: "text",
          title: "GPS vs. Stop Sign Feedback",
          content: "**Stop Sign Feedback:**\n- Vague and judgmental ('This is messy', 'Try harder')\n- Focuses on what's wrong, not how to fix it\n- Ends the conversation with a grade\n- Leaves students feeling stuck\n\n**GPS Feedback:**\n- Specific and descriptive ('Your variable names on line 15...')\n- Provides a clear next step\n- Starts with a positive\n- Empowers students to improve"
        },
        {
          type: "text",
          title: "The Science Behind Effective Feedback",
          content: "Research shows that feedback is most effective when it:\n\n1. **Focuses on the task, not the person** ('Your argument needs more evidence' vs. 'You're not a good writer')\n\n2. **Is timely** (given while the work is still fresh in the student's mind)\n\n3. **Is specific and actionable** (tells them exactly what to do next)\n\n4. **Balances positive and constructive** (starts with what's working)\n\nWhen feedback meets these criteria, students are 3x more likely to improve on their next attempt."
        },
        {
          type: "callout",
          style: "success",
          title: "Try It Yourself",
          content: "In the interactive below, you'll compare two examples of feedback. Can you spot which one acts like a GPS and which one is a stop sign?"
        }
      ];

      course.modules[3].lessons[0].interactiveElements = [
        {
          type: "choiceComparison",
          prompt: "A student submitted a small coding project. Which feedback example is more effective at causing learning?",
          options: [
            {
              id: "optA",
              title: "Feedback A",
              text: "Your code has a lot of bugs and is messy. The logic is hard to follow. You need to try harder to keep your work organized. 6/10.",
              isCorrect: false
            },
            {
              id: "optB",
              title: "Feedback B",
              text: "Great start! The program runs. I noticed your variable names (like 'x' and 'arr') are a bit vague. Try using descriptive names (like 'userName' or 'studentList')—it will make debugging much easier! Also, this function on line 15 is doing two jobs. See if you can split it into two smaller functions. Keep up the good work!",
              isCorrect: true
            }
          ],
          explanation: "Did you choose B? You're right! Feedback A is a 'stop sign.' It's vague ('messy') and provides no clear path forward. Feedback B is a 'GPS.' It starts with a positive, is specific ('variable names', 'function on line 15'), and gives the student a concrete, actionable *next step*. This is feedback that feeds forward!"
        }
      ];
    }

    // Update Module 4, Lesson 4.2: The Power of Retrieval
    if (course.modules[3] && course.modules[3].lessons[1]) {
      course.modules[3].lessons[1].content = [
        {
          type: "text",
          title: "The Power of Retrieval Practice",
          content: "Here's a counterintuitive truth: The best way to learn something isn't to study it over and over. It's to *retrieve* it from memory. Every time students pull information from their brain (instead of just re-reading it), they strengthen the neural pathways that make that knowledge stick."
        },
        {
          type: "callout",
          style: "info",
          title: "The Retrieval Effect",
          content: "Students who spend 30% of their study time testing themselves (retrieval) outperform students who spend 100% of their time re-reading by up to 50%. The struggle to remember is what builds long-term memory."
        },
        {
          type: "text",
          title: "Why Retrieval Works: The Science",
          content: "When you retrieve information from memory, you're not just checking if it's there—you're actually strengthening it. Each successful retrieval makes the memory more accessible in the future. This is called the 'testing effect' or 'retrieval practice effect.'\n\nThink of memory like a path through a forest. The first time you walk it, you're pushing through brush and branches. But each time you walk that path again, it becomes clearer and easier to follow. Retrieval practice is like walking that memory path repeatedly, making it a well-worn trail.\n\nResearch by cognitive psychologists Henry Roediger and Jeffrey Karpicke shows that retrieval practice is more effective than re-studying, even when students feel like re-studying is working better. This is because retrieval creates 'desirable difficulties'—challenges that feel harder in the moment but lead to stronger, longer-lasting learning."
        },
        {
          type: "text",
          title: "The Spacing Effect: When to Retrieve",
          content: "Retrieval is most powerful when it's spaced out over time. This is called the 'spacing effect,' and it's one of the most robust findings in learning science.\n\n**The Optimal Spacing Schedule:**\n- **First retrieval**: 1 day after initial learning\n- **Second retrieval**: 3-7 days later\n- **Third retrieval**: 2-4 weeks later\n- **Fourth retrieval**: 1-3 months later\n\nEach time you retrieve information just as you're about to forget it, you dramatically strengthen the memory. This is why cramming doesn't work—it's all massed practice with no spacing.\n\n**Practical Application:**\nDon't just 'cover' a topic once and move on. Spiral back to old topics regularly. Start each class with a few questions from last week, last month, and last unit."
        },
        {
          type: "text",
          title: "How to Use Retrieval in Your Classroom",
          content: "**Low-Stakes Quizzes:**\nStart class with 3 quick questions about last week's lesson. No grades—just activation. The key word is 'low-stakes.' If students are anxious about grades, they won't benefit from the retrieval practice.\n\n**Brain Dumps:**\nGive students 2 minutes to write everything they remember about a topic before you teach it. This activates prior knowledge and reveals gaps.\n\n**Exit Tickets:**\nEnd class by asking students to write down the 3 most important things they learned today. This forces retrieval while the information is still fresh.\n\n**Flashcards (Done Right):**\nHave students create flashcards and quiz themselves regularly. The key is to remove cards they've mastered and focus on the ones they struggle with.\n\n**Spaced Practice:**\nRevisit old topics regularly. Don't just 'cover' material once and move on. Build review into every lesson.\n\n**Peer Teaching:**\nHave students explain concepts to each other. Teaching requires retrieval and is one of the most powerful learning strategies.\n\n**Retrieval Before Re-Teaching:**\nBefore reviewing a topic, have students try to recall what they remember first. This makes the re-teaching far more effective."
        },
        {
          type: "callout",
          style: "warning",
          title: "Important: Make It Low-Stakes",
          content: "Retrieval practice only works when students feel safe to struggle and make mistakes. If every retrieval attempt is graded, students will experience anxiety that interferes with learning. Use retrieval for learning, not for grades."
        },
        {
          type: "text",
          title: "The Forgetting Curve Revisited",
          content: "Remember the Forgetting Curve from Module 1? Without reinforcement, we forget 70% of new information within 24 hours. But here's the good news: each time we successfully retrieve information, we flatten that curve.\n\nAfter the first retrieval, we might retain information for a few days. After the second, a few weeks. After the third, months. After multiple spaced retrievals, the information becomes part of long-term memory and can last a lifetime.\n\nThis is why students who cram for tests forget everything shortly after. They never engaged in spaced retrieval practice."
        },
        {
          type: "callout",
          style: "success",
          title: "AI-Powered Retrieval Tool",
          content: "Use the tool below to generate quick retrieval questions for any topic you taught recently. These questions are perfect for starting your next class and activating prior knowledge!"
        }
      ];

      course.modules[3].lessons[1].interactiveElements = [
        {
          type: "aiGenerator",
          generatorType: "quizGenerator",
          title: "AI Retrieval Quiz Generator",
          description: "Retrieval is the #1 way to build strong memory. Enter a topic you taught last week, and the AI will generate 3 quick 'warm-up' questions for your next class.",
          placeholder: "Enter a lesson topic (e.g., 'Photosynthesis', 'World War I Causes', 'Quadratic Equations')...",
          buttonText: "Generate Retrieval Questions",
          inputLabel: "Lesson Topic"
        }
      ];
    }

    await course.save();
    console.log("Successfully updated Module 4 content");
    console.log("Lesson 4.1: Added feedback GPS vs Stop Sign content + Choice Comparison");
    console.log("Lesson 4.2: Added retrieval practice content + AI Quiz Generator");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error updating Module 4 content:", error);
    process.exit(1);
  }
}

addModule4Content();
