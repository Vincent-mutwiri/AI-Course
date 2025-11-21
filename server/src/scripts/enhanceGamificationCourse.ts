import mongoose from "mongoose";
import { config } from "dotenv";
import Course from "../models/Course";

config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
}

async function enhanceGamificationCourse() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log("Connected to MongoDB");

        // Find the course by ID
        const course = await Course.findById("691f728da3a6c29d2fc44a34");

        if (!course) {
            console.log("Course not found with that ID. Searching by title...");
            const courseByTitle = await Course.findOne({
                title: "Gamification for Learning: From Passive to Active"
            });

            if (!courseByTitle) {
                console.log("Course not found. Please check the ID or title.");
                await mongoose.disconnect();
                return;
            }

            console.log("Found course by title. Updating...");
            await updateCourseContent(courseByTitle);
        } else {
            console.log("Found course by ID. Updating...");
            await updateCourseContent(course);
        }

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error enhancing gamification course:", error);
        process.exit(1);
    }
}

async function updateCourseContent(course: any) {
    // Enhance Module 1: Foundations
    if (course.modules[0]) {
        course.modules[0].lessons[0].content = [
                {
                    type: "text",
                    content: "Welcome to the world of gamification! Before we dive into game mechanics and design strategies, we need to establish a critical distinction that will shape everything you create: the difference between **gamification** and **game-based learning**."
                },
                {
                    type: "heading",
                    level: 2,
                    content: "What is Gamification?"
                },
                {
                    type: "text",
                    content: "**Gamification** is the application of game design elements and game principles to non-game contexts. Think of it as sprinkling game mechanics—like points, badges, leaderboards, progress bars, and challenges—onto existing content or processes to increase engagement and motivation.\n\nKey characteristics of gamification:\n- The core content remains unchanged\n- Game elements are layered on top\n- Focus is on motivation and engagement\n- Typically easier and faster to implement\n- Works well for existing systems and processes"
                },
                {
                    type: "callout",
                    variant: "info",
                    content: "**Example:** Duolingo uses gamification. The language lessons are traditional exercises (translate this sentence, match these words), but they're wrapped in game mechanics: XP points, daily streaks, leagues, and hearts (lives). The learning content isn't a game—it's gamified."
                },
                {
                    type: "heading",
                    level: 2,
                    content: "What is Game-Based Learning?"
                },
                {
                    type: "text",
                    content: "**Game-Based Learning (GBL)** uses actual games—complete with rules, goals, challenges, and interactions—as the primary vehicle for learning. The game itself teaches the content through gameplay. The learning objectives are embedded in the game mechanics, not layered on top.\n\nKey characteristics of game-based learning:\n- The game IS the learning experience\n- Content is integrated into gameplay\n- Often requires custom development\n- More immersive and engaging\n- Higher development cost and time"
                },
                {
                    type: "callout",
                    variant: "info",
                    content: "**Example:** Minecraft Education Edition uses game-based learning. Students learn chemistry by combining elements in the game world, learn history by recreating historical sites, and learn coding by programming in-game behaviors. The game mechanics themselves teach the content."
                },
                {
                    type: "heading",
                    level: 2,
                    content: "The Key Distinction"
                },
                {
                    type: "text",
                    content: "Here's the simplest way to remember the difference:\n\n**Gamification** = Adding chocolate chips to your cookie\n**Game-Based Learning** = Making the entire cookie out of chocolate\n\nWith gamification, you're enhancing something that already exists. With GBL, you're creating something entirely new where the game and the learning are inseparable."
                },
                {
                    type: "heading",
                    level: 2,
                    content: "When to Use Each Approach"
                },
                {
                    type: "text",
                    content: "**Choose Gamification when:**\n- You have existing content that works but needs more engagement\n- You have limited time or budget\n- You need to motivate completion of required tasks\n- Your audience is diverse with varying gaming experience\n- You want quick wins and iterative improvements\n\n**Choose Game-Based Learning when:**\n- You're creating new content from scratch\n- You have significant development resources\n- The learning objectives involve complex systems or simulations\n- Your audience is comfortable with gaming\n- You want deep immersion and transformative experiences"
                },
                {
                    type: "callout",
                    variant: "tip",
                    content: "**Pro Tip:** Most organizations start with gamification because it's faster and less risky. Once you prove the value of game thinking, you can invest in full game-based learning for high-priority content."
                },
                {
                    type: "heading",
                    level: 2,
                    content: "Real-World Examples Compared"
                },
                {
                    type: "text",
                    content: "Let's look at how the same learning objective could be approached with both methods:\n\n**Learning Objective:** Teach employees about cybersecurity best practices\n\n**Gamification Approach:**\n- Traditional training modules with quizzes\n- Points for completing each module\n- Badges for mastering topics (Password Pro, Phishing Detective)\n- Leaderboard showing top learners\n- Weekly challenges with bonus points\n\n**Game-Based Learning Approach:**\n- Interactive simulation where you play a security analyst\n- Investigate actual phishing attempts and breaches\n- Make decisions with real consequences in the game world\n- Unlock new tools and abilities as you progress\n- Compete against AI hackers trying to breach your defenses\n\nBoth can be effective, but they require different resources and create different experiences."
                },
                {
                    type: "heading",
                    level: 2,
                    content: "The Hybrid Approach"
                },
                {
                    type: "text",
                    content: "Many successful learning experiences use a hybrid approach: gamified structure with game-based elements. For example:\n\n- Overall course uses gamification (points, progress, badges)\n- Individual lessons include mini-games for practice\n- Assessments are game-based scenarios\n- Social features create community dynamics\n\nThis gives you the best of both worlds: the efficiency of gamification with the engagement of game-based learning."
                }
        ];
    }

    // Enhance Module 2: Psychology
    if (course.modules[1] && course.modules[1].lessons[0]) {
        course.modules[1].lessons[0].content = [
            {
                type: "heading",
                level: 1,
                content: "The Psychology Behind Gamification"
            },
            {
                type: "text",
                content: "Why do games captivate us? The answer lies in **Self-Determination Theory (SDT)** and understanding different player motivations."
            },
            {
                type: "heading",
                level: 2,
                content: "Self-Determination Theory: Three Core Needs"
            },
            {
                type: "text",
                content: "**1. Autonomy:** The need for control and meaningful choices\n**2. Competence:** The need to feel capable and see progress\n**3. Relatedness:** The need for connection and belonging"
            },
            {
                type: "heading",
                level: 2,
                content: "Player Types (Bartle Taxonomy)"
            },
            {
                type: "text",
                content: "**Achievers (40%):** Motivated by mastery and completion\n**Explorers (25%):** Driven by discovery and understanding\n**Socializers (25%):** Seek connection and community\n**Killers (10%):** Thrive on competition and dominance"
            }
        ];
    }

    await course.save();
    console.log("✅ Course content enhanced successfully!");
}

enhanceGamificationCourse();
