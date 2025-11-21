import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function enhanceModules123() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log("Connected to MongoDB");

        const course = await Course.findOne({
            title: "Gamification for Learning: From Passive to Active"
        });

        if (!course) {
            console.log("Course not found");
            await mongoose.disconnect();
            return;
        }

        // Enhance Module 1: Foundations
        if (course.modules[0] && course.modules[0].lessons[0]) {
            console.log("Enhancing Module 1: Foundations...");

            course.modules[0].lessons[0].content = [
                {
                    type: "text",
                    title: "Gamification vs. Game-Based Learning: Know the Difference",
                    content: "Before we dive into design, let's clear up the biggest confusion in the field. **Gamification** and **Game-Based Learning** are not the same thing—and mixing them up can derail your entire project."
                },
                {
                    type: "callout",
                    style: "info",
                    title: "The Key Distinction",
                    content: "**Gamification:** Adding game elements to non-game contexts\n**Game-Based Learning:** Using actual games as the learning medium\n\nThink: Duolingo (gamification) vs. Minecraft Education (game-based learning)"
                },
                {
                    type: "text",
                    title: "What Gamification Really Is",
                    content: "**Gamification** takes the motivational elements that make games engaging and applies them to learning experiences. You're not creating a game—you're making learning feel more game-like.\n\n**Core Elements:**\n- **Points & Scoring:** Immediate feedback on progress\n- **Badges & Achievements:** Recognition of milestones\n- **Leaderboards:** Social comparison and competition\n- **Levels & Progression:** Clear advancement paths\n- **Challenges & Quests:** Goal-oriented activities\n- **Narrative & Themes:** Story wrappers around content\n\n**Real-World Examples:**\n- **Duolingo:** Language learning with streaks, XP, and leagues\n- **Khan Academy:** Mastery badges and energy points\n- **Codecademy:** Skill tracks and completion certificates\n- **Fitbit:** Step challenges and achievement badges"
                },
                {
                    type: "text",
                    title: "What Game-Based Learning Is",
                    content: "**Game-Based Learning** uses actual games—digital or physical—as the primary learning vehicle. The game IS the curriculum.\n\n**Characteristics:**\n- **Immersive Worlds:** Rich, interactive environments\n- **Complex Mechanics:** Multiple interconnected systems\n- **Emergent Learning:** Discovery through play\n- **Simulation:** Safe practice of real-world skills\n\n**Examples:**\n- **Minecraft Education:** Building and exploring to learn history, science, math\n- **Kerbal Space Program:** Rocket science through trial and error\n- **SimCity:** Urban planning and resource management\n- **DragonBox:** Algebra through puzzle mechanics"
                },
                {
                    type: "text",
                    title: "When to Use Which Approach",
                    content: "**Choose Gamification When:**\n- You have existing curriculum to enhance\n- Budget/time constraints limit game development\n- Learning objectives are knowledge-focused\n- You need quick implementation\n- Learners are diverse in gaming experience\n\n**Choose Game-Based Learning When:**\n- You can build/buy custom games\n- Learning objectives involve complex problem-solving\n- Simulation adds significant value\n- Learners are comfortable with gaming\n- You have resources for ongoing game maintenance\n\n**Hybrid Approach:**\nMany successful programs combine both—gamified learning management with game-based activities for specific skills."
                },
                {
                    type: "text",
                    title: "Common Gamification Mistakes to Avoid",
                    content: "**1. Pointsification**\nAdding points to everything without purpose. Points should reflect meaningful progress, not just activity.\n\n**2. Chocolate-Covered Broccoli**\nSlapping game elements onto boring content. If the core experience isn't valuable, gamification won't save it.\n\n**3. One-Size-Fits-All**\nIgnoring that different people are motivated by different things. Provide multiple paths to success.\n\n**4. Overcomplication**\nAdding too many game elements at once. Start simple and build complexity gradually.\n\n**5. Ignoring Context**\nUsing game mechanics that don't fit your learning environment or culture."
                },
                {
                    type: "callout",
                    style: "success",
                    title: "Your Foundation Check",
                    content: "Use the reflection tool below to clarify your approach and avoid common pitfalls before you start designing."
                }
            ];
        }

        // Enhance Module 2: Psychology
        if (course.modules[1] && course.modules[1].lessons[0]) {
            console.log("Enhancing Module 2: Psychology...");

            course.modules[1].lessons[0].content = [
                {
                    type: "text",
                    title: "The Psychology Behind the Magic",
                    content: "Great gamification isn't about tricks or manipulation—it's about understanding what genuinely motivates human beings. The secret lies in **Self-Determination Theory** and knowing your players."
                },
                {
                    type: "callout",
                    style: "info",
                    title: "Self-Determination Theory (SDT)",
                    content: "Humans have three basic psychological needs:\n**Autonomy:** Feeling volitional and self-directed\n**Mastery:** Experiencing competence and growth\n**Purpose:** Connecting to something meaningful\n\nSatisfy these needs, and motivation flourishes naturally."
                },
                {
                    type: "text",
                    title: "Autonomy: The Power of Choice",
                    content: "**Autonomy** means learners feel they're choosing to engage, not being forced. Even small choices can dramatically increase motivation.\n\n**How to Support Autonomy:**\n- **Multiple Paths:** Different ways to achieve the same learning goal\n- **Customization:** Let learners personalize their experience\n- **Optional Challenges:** Extra activities for those who want them\n- **Flexible Pacing:** Self-directed progression when possible\n- **Choice in Difficulty:** Easy, medium, hard options\n\n**Autonomy Killers:**\n- Forced social sharing\n- Rigid, linear progression\n- No opt-out options\n- Micromanagement of every action\n- Punishment for different approaches"
                },
                {
                    type: "text",
                    title: "Mastery: The Joy of Getting Better",
                    content: "**Mastery** is the satisfaction of developing competence. People love feeling themselves improve over time.\n\n**How to Support Mastery:**\n- **Clear Progression:** Visible skill development\n- **Appropriate Challenge:** Not too easy, not too hard\n- **Immediate Feedback:** Know results quickly\n- **Skill Trees:** Show how abilities build on each other\n- **Mastery Badges:** Recognize deep competence, not just completion\n\n**Mastery Killers:**\n- Participation trophies (rewards without achievement)\n- Unclear success criteria\n- No feedback or delayed feedback\n- Overwhelming difficulty spikes\n- Focus on speed over understanding"
                },
                {
                    type: "text",
                    title: "Purpose: Why This Matters",
                    content: "**Purpose** connects learning to something larger than the individual. It answers 'Why should I care?'\n\n**How to Support Purpose:**\n- **Real-World Application:** Show how skills transfer\n- **Impact Metrics:** Demonstrate the difference learning makes\n- **Helping Others:** Peer tutoring and mentoring opportunities\n- **Mission Alignment:** Connect to organizational or personal values\n- **Social Good:** Learning that benefits the community\n\n**Purpose Killers:**\n- Abstract, theoretical content with no clear application\n- Learning for learning's sake without context\n- No connection to learner goals or values\n- Purely individual, competitive environments\n- Emphasis on compliance over contribution"
                },
                {
                    type: "text",
                    title: "Player Types: Different Motivations for Different People",
                    content: "Not everyone is motivated by the same things. **Bartle's Player Types** (updated by Andrzej Marczewski) help us understand different motivational profiles:\n\n**Achievers (25-30%)**\n- Motivated by: Completion, mastery, recognition\n- Love: Badges, leaderboards, skill progression\n- Design for: Clear goals, measurable progress, achievement recognition\n\n**Explorers (10-15%)**\n- Motivated by: Discovery, understanding, novelty\n- Love: Hidden content, deep dives, experimentation\n- Design for: Optional content, easter eggs, multiple approaches\n\n**Socializers (60-70%)**\n- Motivated by: Connection, collaboration, helping others\n- Love: Team challenges, peer interaction, sharing\n- Design for: Group activities, discussion forums, mentoring\n\n**Disruptors/Killers (5-10%)**\n- Motivated by: Competition, dominance, system mastery\n- Love: PvP challenges, leaderboards, optimization\n- Design for: Competitive elements, advanced challenges, system complexity\n\n**Free Spirits (5-10%)**\n- Motivated by: Creativity, self-expression, autonomy\n- Love: Customization, creation tools, open-ended challenges\n- Design for: Creative projects, personalization, flexible paths"
                },
                {
                    type: "text",
                    title: "Intrinsic vs. Extrinsic Motivation",
                    content: "**Extrinsic Motivation:** External rewards and punishments (points, badges, grades)\n**Intrinsic Motivation:** Internal satisfaction from the activity itself\n\n**The Overjustification Effect:**\nToo many external rewards can actually undermine intrinsic motivation. People start doing things for the reward, not for the inherent satisfaction.\n\n**Best Practice:**\n- Use extrinsic rewards to **scaffold** intrinsic motivation\n- Focus on **informational** feedback, not **controlling** rewards\n- Gradually **fade** external rewards as intrinsic motivation develops\n- Ensure rewards **support** rather than **replace** natural curiosity"
                },
                {
                    type: "callout",
                    style: "success",
                    title: "Discover Your Player Type",
                    content: "Use the Player Type Simulator below to explore different motivational profiles and see how they affect engagement with various game mechanics."
                }
            ];
        }

        // Module 3 already has enhanced content, just ensure interactive elements are properly set
        if (course.modules[2] && course.modules[2].lessons[0]) {
            console.log("Ensuring Module 3 interactive elements...");
            
            course.modules[2].lessons[0].interactiveElements = [
                {
                    type: "rewardScheduleDesigner",
                    config: {
                        title: "Reward Schedule Designer",
                        description: "Experiment with different reward timing patterns and see how they affect learner behavior and engagement."
                    }
                },
                {
                    type: "pitchAnalysisGenerator",
                    config: {
                        title: "Mechanic Mashup Analyzer",
                        description: "Describe your gamification concept and get expert analysis on how your mechanics work together to create engaging dynamics.",
                        promptTemplate: "mechanic-analyst"
                    }
                }
            ];
        }

        await course.save();
        console.log("✅ Modules 1, 2, and 3 enhanced successfully!");
        console.log("🎯 Module 1: Foundations - 1 interactive element");
        console.log("🧠 Module 2: Psychology - 1 interactive element");
        console.log("🔧 Module 3: Toolbox - 2 interactive elements");
        
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error enhancing modules 1, 2, and 3:", error);
        process.exit(1);
    }
}

enhanceModules123();