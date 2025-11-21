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
          type: "text",
          title: "The Science: Why Passive Learning Fails",
          content: "When students passively receive information—listening to lectures, watching videos, reading textbooks—they're using shallow processing. The information enters working memory but doesn't get encoded into long-term memory effectively.\n\nThink of it like this: watching someone ride a bike doesn't teach you to ride a bike. You need to actually get on the bike, wobble, fall, adjust, and try again. The same is true for learning anything.\n\nNeuroscience research shows that active learning creates stronger, more numerous neural connections. When students actively manipulate information—solving problems, creating projects, teaching others—they're building robust memory networks that last."
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
          title: "The Levels of Active Learning",
          content: "Not all 'active' learning is equally effective. Here's a hierarchy from least to most active:\n\n**Level 1: Passive Reception**\nListening to lectures, watching videos, reading textbooks\n*Retention: ~10-20%*\n\n**Level 2: Active Reception**\nTaking notes, highlighting, discussing with peers\n*Retention: ~30-50%*\n\n**Level 3: Active Processing**\nSolving problems, analyzing case studies, comparing/contrasting\n*Retention: ~50-70%*\n\n**Level 4: Active Creation**\nBuilding projects, designing solutions, creating explanations\n*Retention: ~70-90%*\n\n**Level 5: Teaching Others**\nExplaining concepts to peers, creating tutorials, peer teaching\n*Retention: ~90%+*\n\nThe goal isn't to eliminate all passive learning—sometimes direct instruction is necessary—but to maximize time spent at Levels 3-5."
        },
        {
          type: "text",
          title: "Examples of Active Learning Across Subjects",
          content: "**Science:**\n- Instead of lecturing about ecosystems → Build a terrarium and observe changes\n- Instead of explaining chemical reactions → Conduct experiments and predict outcomes\n- Instead of teaching about forces → Design and test paper airplanes\n\n**Math:**\n- Instead of explaining fractions → Divide pizzas among friends with different appetites\n- Instead of teaching geometry → Design a dream bedroom to scale\n- Instead of lecturing on statistics → Collect and analyze real data from the class\n\n**Language Arts:**\n- Instead of teaching grammar rules → Edit real writing and explain corrections\n- Instead of analyzing literature → Rewrite scenes from different perspectives\n- Instead of teaching persuasive writing → Create campaigns for real issues\n\n**Social Studies:**\n- Instead of describing historical events → Role-play debates from that time period\n- Instead of teaching about government → Simulate elections and policy-making\n- Instead of explaining geography → Plan a trip with budget and logistics\n\n**Technology:**\n- Instead of teaching about coding loops → Program a robot to dance or navigate a maze\n- Instead of explaining algorithms → Debug broken code and explain fixes\n- Instead of teaching design principles → Create apps that solve real problems\n\nNotice the pattern? Every active approach puts the student in the driver's seat."
        },
        {
          type: "callout",
          style: "warning",
          title: "Common Misconception",
          content: "Active learning doesn't mean students are always physically moving or that the classroom is chaotic. A student silently solving a complex problem is engaged in active learning. A student watching a video while taking notes is more active than one just watching. The key is mental engagement, not just physical activity."
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
