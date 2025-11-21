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

    // Update Module 1, Lesson 1.1 with video, core concept, and poll
    if (course.modules[0] && course.modules[0].lessons[0]) {
      course.modules[0].lessons[0].content = [
        {
          type: "video",
          s3Key: "videos/lesson_1_1_hook.mp4", // Admin will upload this
          title: "The 'Forgotten Lesson' Hook",
          duration: "2 min"
        },
        {
          type: "text",
          title: "What is Learning Science?",
          content: "Learning Science is the practical study of what makes learning stick. It combines insights from cognitive psychology, neuroscience, and education research to understand how people learn most effectively. Rather than relying on intuition or tradition, Learning Science gives us evidence-based strategies to help students retain information, develop skills, and transfer knowledge to new situations."
        },
        {
          type: "callout",
          style: "info",
          title: "Core Definition",
          content: "Learning Science = Understanding how the brain processes, stores, and retrieves information + Applying that knowledge to create better learning experiences."
        },
        {
          type: "text",
          title: "Why It Matters for Educators",
          content: "As educators, we often see students struggle to remember what we taught them last week, last month, or even yesterday. This isn't because our students aren't trying hard enough—it's because traditional teaching methods don't always align with how the brain actually learns. Learning Science provides a roadmap for designing instruction that works with the brain, not against it."
        },
        {
          type: "text",
          title: "The Forgetting Curve: A Wake-Up Call",
          content: "In 1885, German psychologist Hermann Ebbinghaus discovered something shocking: without reinforcement, we forget approximately 50% of new information within an hour, and up to 70% within 24 hours. This phenomenon, known as the 'Forgetting Curve,' explains why students can ace a test on Friday and forget everything by Monday.\n\nBut here's the good news: Learning Science has identified specific strategies that can flatten this curve and help information stick for the long term."
        },
        {
          type: "callout",
          style: "warning",
          title: "The Traditional Teaching Trap",
          content: "Traditional 'coverage-based' teaching—where we rush through content to 'cover' everything—actually works against how the brain learns. When we prioritize breadth over depth, we create shallow learning that evaporates quickly. Learning Science shows us a better way."
        },
        {
          type: "text",
          title: "From Theory to Practice",
          content: "Throughout this course, you'll learn five evidence-based strategies that transform teaching:\n\n**1. Cognitive Load Management** - Design lessons that work with, not against, working memory\n\n**2. Intrinsic Motivation** - Tap into the psychological drives that fuel deep engagement\n\n**3. Active Learning** - Move students from passive consumers to active constructors of knowledge\n\n**4. Effective Feedback** - Give feedback that actually causes learning, not just justifies grades\n\n**5. Retrieval Practice** - Use the testing effect to strengthen long-term memory\n\nEach strategy is backed by decades of research and proven to work across subjects, grade levels, and learning contexts."
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

    // Update Module 1, Lesson 1.2 with comprehensive content and Design Fixer
    if (course.modules[0] && course.modules[0].lessons[1]) {
      course.modules[0].lessons[1].content = [
        {
          type: "text",
          title: "The Brain's Bottleneck: Understanding Cognitive Load",
          content: "Imagine your brain's working memory as a small desk where you process new information. This desk can only hold 3-5 items at once. When we try to cram too much onto this desk—complex jargon, cluttered visuals, confusing layouts—students can't process the actual learning. This is cognitive load in action."
        },
        {
          type: "callout",
          style: "warning",
          title: "The Problem",
          content: "Traditional teaching often creates EXTRANEOUS cognitive load—mental effort wasted on poor design, confusing presentation, or irrelevant information—instead of GERMANE cognitive load, which is the good kind that helps students build understanding."
        },
        {
          type: "text",
          title: "Three Types of Cognitive Load",
          content: "1. **Intrinsic Load**: The inherent difficulty of the content itself. (We can't change this much)\n\n2. **Extraneous Load**: Mental effort wasted on poor design, confusing presentation, or irrelevant information. (We CAN reduce this!)\n\n3. **Germane Load**: Productive mental effort that builds understanding and creates learning. (We WANT to maximize this!)"
        },
        {
          type: "text",
          title: "The Science Behind Working Memory",
          content: "Cognitive psychologist George Miller's famous research revealed that working memory can hold approximately 7±2 'chunks' of information at once—but more recent studies suggest the number is closer to 4 for complex information. This is why phone numbers are broken into chunks (555-1234) and why trying to learn too many new concepts at once leads to overwhelm.\n\nThink of working memory as the 'loading dock' where new information arrives before being processed and stored in long-term memory. If the loading dock is cluttered with irrelevant information (extraneous load), there's no room for the important stuff."
        },
        {
          type: "callout",
          style: "success",
          title: "The Solution",
          content: "By reducing extraneous load (bad design, clutter, jargon), we free up mental space for germane load (actual learning). This is the core principle behind effective instructional design."
        },
        {
          type: "text",
          title: "Practical Strategies to Reduce Cognitive Load",
          content: "**1. Simplify Language** - Replace jargon with plain language. Instead of 'photosynthesis is the process of converting light energy into chemical energy,' try 'plants use sunlight to make food.'\n\n**2. Use Visual Hierarchy** - Make important information stand out. Use headings, bullet points, and white space to guide attention.\n\n**3. Remove Decorative Elements** - That cute clipart might look nice, but if it doesn't support learning, it's creating extraneous load.\n\n**4. Chunk Information** - Break complex topics into smaller, digestible pieces. Teach one concept at a time.\n\n**5. Provide Worked Examples** - Show students the solution process step-by-step before asking them to solve problems independently.\n\n**6. Use Dual Coding** - Combine words with relevant visuals (diagrams, charts) to support understanding—but avoid redundant text and narration."
        },
        {
          type: "text",
          title: "Real-World Example: The Slide Makeover",
          content: "Imagine a slide about the water cycle. A high-cognitive-load version might have:\n- Small, hard-to-read font\n- Technical jargon ('evapotranspiration,' 'condensation nuclei')\n- Decorative images of clouds and rainbows\n- Cluttered layout with text everywhere\n\nA low-cognitive-load version would have:\n- Large, clear font\n- Simple language ('water evaporates,' 'forms clouds,' 'falls as rain')\n- A single, clear diagram showing the cycle\n- Plenty of white space\n\nSame content. Dramatically different cognitive load."
        },
        {
          type: "text",
          title: "Try It Yourself",
          content: "In the interactive challenge below, you'll identify three common design mistakes that create unnecessary cognitive load. Click on the problem areas to see why they're problematic and how to fix them."
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
