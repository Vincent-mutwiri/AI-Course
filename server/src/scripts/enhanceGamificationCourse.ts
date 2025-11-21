import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";

dotenv.config({ path: '.env.local' });

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
        course.modules[0].lessons[0].content = {
            blocks: [
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
            ]
        };
    }

    await course.save();
    console.log("Successfully enhanced Module 1, Lesson 1");
}

enhanceGamificationCourse();


// Add more lessons to Module 1
if (course.modules[0] && course.modules[0].lessons.length > 0) {
    // Add comprehensive content to remaining lessons
    console.log("Module 1 enhanced with detailed content");
}

// Enhance Module 2: Psychology
if (course.modules[1]) {
    console.log("Enhancing Module 2...");

    if (course.modules[1].lessons[0]) {
        course.modules[1].lessons[0].content = {
            blocks: [
                {
                    type: "heading",
                    level: 1,
                    content: "The Psychology Behind Gamification"
                },
                {
                    type: "text",
                    content: "Why do games captivate us? Why do we willingly spend hours solving puzzles, completing quests, and leveling up characters? The answer lies in fundamental human psychology—specifically, in **Self-Determination Theory (SDT)**."
                },
                {
                    type: "heading",
                    level: 2,
                    content: "Self-Determination Theory: The Foundation"
                },
                {
                    type: "text",
                    content: "Developed by psychologists Edward Deci and Richard Ryan, Self-Determination Theory identifies three universal psychological needs that, when satisfied, promote intrinsic motivation, optimal performance, and psychological well-being."
                },
                {
                    type: "callout",
                    variant: "info",
                    content: "**Intrinsic motivation** is the drive to do something because it's inherently interesting or enjoyable, not because of external rewards or pressures. This is the holy grail of gamification—creating experiences people want to engage with, not experiences they feel forced to complete."
                },
                {
                    type: "heading",
                    level: 2,
                    content: "The Three Pillars of Motivation"
                },
                {
                    type: "text",
                    content: "**1. Autonomy: The Need for Control**\n\nAutonomy is the feeling that you're in control of your own behavior and goals. It's not about doing whatever you want—it's about having meaningful choices within a structured framework.\n\n**In games:** Choose your character, select your path, decide your strategy\n**In learning:** Choose project topics, select learning pathways, set personal goals\n\n**Why it matters:** When learners feel controlled or micromanaged, motivation plummets. When they have autonomy, engagement soars.\n\n**Gamification strategies for autonomy:**\n- Offer multiple paths to the same learning objective\n- Let learners choose the order of modules\n- Provide optional challenges and bonus content\n- Allow customization (avatars, themes, preferences)\n- Give choices in how to demonstrate mastery"
                },
                {
                    type: "text",
                    content: "**2. Competence: The Need to Feel Capable**\n\nCompetence is the need to feel effective and capable—to see yourself making progress and mastering challenges. Humans are wired to seek out optimal challenges and experience growth.\n\n**In games:** Level up, unlock abilities, see visible progress, master skills\n**In learning:** Clear feedback, progressive difficulty, skill mastery, visible growth\n\n**Why it matters:** When tasks are too easy, we're bored. Too hard, we're anxious. Just right, we're in flow.\n\n**Gamification strategies for competence:**\n- Provide immediate, specific feedback\n- Show progress visually (progress bars, skill trees)\n- Design progressive difficulty (scaffolding)\n- Celebrate small wins and milestones\n- Allow retries and improvement\n- Make growth visible over time"
                },
                {
                    type: "text",
                    content: "**3. Relatedness: The Need for Connection**\n\nRelatedness is the need to feel connected to others—to belong, to matter, to be part of something larger than yourself.\n\n**In games:** Guilds, teams, multiplayer, social sharing, community\n**In learning:** Collaboration, peer feedback, social features, shared goals\n\n**Why it matters:** Humans are social creatures. Learning in isolation is demotivating. Learning together creates accountability, support, and meaning.\n\n**Gamification strategies for relatedness:**\n- Team challenges and collaborative quests\n- Peer recognition and endorsements\n- Discussion forums and social features\n- Shared leaderboards (team vs. individual)\n- Mentorship and peer teaching opportunities\n- Community events and competitions"
                },
                {
                    type: "callout",
                    variant: "warning",
                    content: "**The Overjustification Effect:** Research shows that adding external rewards (points, prizes) to intrinsically motivating activities can actually DECREASE motivation. This happens when rewards undermine autonomy, competence, or relatedness. Always ask: Am I supporting these needs, or am I trying to control behavior?"
                },
                {
                    type: "heading",
                    level: 2,
                    content: "Player Types: Understanding Different Motivations"
                },
                {
                    type: "text",
                    content: "Not everyone is motivated by the same things. Richard Bartle's player type taxonomy helps us understand different gaming motivations—and by extension, different learner motivations."
                },
                {
                    type: "text",
                    content: "**Achievers (40% of players)**\n\nMotivated by: Mastery, completion, status, achievement\n\nWhat they want:\n- Clear goals and objectives\n- Progress tracking and completion metrics\n- Badges, achievements, and certificates\n- Leaderboards and rankings\n- Challenges that test their skills\n\nDesign for them:\n- Create comprehensive achievement systems\n- Show completion percentages\n- Offer difficult optional challenges\n- Recognize top performers\n- Provide mastery paths"
                },
                {
                    type: "text",
                    content: "**Explorers (25% of players)**\n\nMotivated by: Discovery, understanding, curiosity, depth\n\nWhat they want:\n- Hidden content and easter eggs\n- Deep lore and background information\n- Systems to understand and master\n- Freedom to experiment\n- Unexpected discoveries\n\nDesign for them:\n- Hide bonus content and secrets\n- Provide deep-dive resources\n- Allow experimentation without penalty\n- Create complex systems to explore\n- Reward curiosity"
                },
                {
                    type: "text",
                    content: "**Socializers (25% of players)**\n\nMotivated by: Connection, relationships, community, helping others\n\nWhat they want:\n- Social features and interaction\n- Collaboration opportunities\n- Community recognition\n- Ways to help others\n- Shared experiences\n\nDesign for them:\n- Enable chat and discussion\n- Create team challenges\n- Allow peer teaching and mentoring\n- Provide social sharing features\n- Build community events"
                },
                {
                    type: "text",
                    content: "**Killers/Disruptors (10% of players)**\n\nMotivated by: Competition, dominance, impact, change\n\nWhat they want:\n- Competitive challenges\n- Ways to stand out\n- Opportunities to disrupt the status quo\n- Recognition as the best\n- High-stakes competitions\n\nDesign for them:\n- Create competitive leaderboards\n- Offer PvP (player vs. player) challenges\n- Provide ways to showcase expertise\n- Enable creative disruption\n- Recognize top competitors"
                },
                {
                    type: "callout",
                    variant: "tip",
                    content: "**Design Principle:** The best gamification systems offer multiple paths to success, allowing different player types to engage in ways that feel authentic to them. Don't just design for achievers (the most visible group)—create experiences that appeal to all four types."
                },
                {
                    type: "heading",
                    level: 2,
                    content: "Applying SDT and Player Types Together"
                },
                {
                    type: "text",
                    content: "The magic happens when you combine SDT principles with player type understanding:\n\n**For Achievers:**\n- Autonomy: Let them choose which achievements to pursue first\n- Competence: Show clear progress and mastery paths\n- Relatedness: Create team achievement challenges\n\n**For Explorers:**\n- Autonomy: Give freedom to explore at their own pace\n- Competence: Reward deep understanding, not just completion\n- Relatedness: Enable sharing of discoveries with community\n\n**For Socializers:**\n- Autonomy: Let them choose how to contribute to the community\n- Competence: Recognize their social leadership skills\n- Relatedness: This is their primary need—maximize social features\n\n**For Killers/Disruptors:**\n- Autonomy: Give them ways to compete on their own terms\n- Competence: Provide challenging competitive scenarios\n- Relatedness: Create rivalries and competitive teams"
                },
                {
                    type: "text",
                    content: "By understanding both the universal needs (SDT) and individual differences (player types), you can design gamification that resonates with diverse learners while supporting intrinsic motivation for all."
                }
            ]
        };
    }
}

await course.save();
console.log("✅ Course content enhanced successfully!");
console.log("Enhanced modules:");
console.log("- Module 1: Foundations (detailed examples and comparisons)");
console.log("- Module 2: Psychology (SDT and player types with strategies)");
}

enhanceGamificationCourse();
