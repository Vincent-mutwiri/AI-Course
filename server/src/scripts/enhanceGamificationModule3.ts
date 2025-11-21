import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function enhanceModule3() {
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

        // Enhance Module 3: The Gamification Toolbox
        if (course.modules[2] && course.modules[2].lessons[0]) {
            console.log("Enhancing Module 3, Lesson 1: MDA Framework...");

            course.modules[2].lessons[0].content = {
                blocks: [
                    {
                        type: "heading",
                        level: 1,
                        content: "The Gamification Toolbox: Mechanics, Dynamics, and Aesthetics"
                    },
                    {
                        type: "text",
                        content: "Now that you understand the psychology behind gamification, it's time to learn the practical tools and frameworks for designing engaging experiences. The most fundamental framework in game design is **MDA: Mechanics, Dynamics, and Aesthetics**."
                    },
                    {
                        type: "heading",
                        level: 2,
                        content: "The MDA Framework Explained"
                    },
                    {
                        type: "text",
                        content: "Created by Robin Hunicke, Marc LeBlanc, and Robert Zubek, the MDA framework breaks down games into three interconnected layers. Understanding these layers is crucial because designers and players experience games in opposite directions."
                    },
                    {
                        type: "callout",
                        variant: "info",
                        content: "**The Designer's View:** Mechanics → Dynamics → Aesthetics\n\n**The Player's View:** Aesthetics → Dynamics → Mechanics\n\nDesigners create mechanics that generate dynamics that produce aesthetics. Players experience aesthetics that emerge from dynamics that come from mechanics."
                    },
                    {
                        type: "heading",
                        level: 2,
                        content: "Mechanics: The Rules of the Game"
                    },
                    {
                        type: "text",
                        content: "**Mechanics** are the rules, systems, and components of the game. They're what players CAN do—the verbs of your experience.\n\n**Common Gamification Mechanics:**\n\n**Points**\n- Purpose: Track progress, enable exchange, provide feedback\n- Example: XP for completing lessons, coins for achievements\n- Best for: Achievers, providing immediate feedback\n- Pitfall: Meaningless if not tied to real value or progression\n\n**Badges/Achievements**\n- Purpose: Signal accomplishment, create collection goals, guide behavior\n- Example: 'First Steps' badge, 'Master Learner' achievement\n- Best for: Achievers and Explorers, milestone recognition\n- Pitfall: Too many badges dilute their value\n\n**Leaderboards**\n- Purpose: Create competition, show relative performance, motivate improvement\n- Example: Top 10 learners this week, team rankings\n- Best for: Killers/Disruptors, competitive scenarios\n- Pitfall: Demotivates those not at the top; can undermine autonomy\n\n**Levels/Progression**\n- Purpose: Structure difficulty, show advancement, unlock content\n- Example: Beginner → Intermediate → Advanced → Expert\n- Best for: All player types, providing clear structure\n- Pitfall: Arbitrary levels without meaningful progression\n\n**Challenges/Quests**\n- Purpose: Provide goals, create narrative, guide learning path\n- Example: 'Complete 5 lessons this week', 'Master Module 2'\n- Best for: Achievers and Explorers, goal-oriented engagement\n- Pitfall: Too many simultaneous challenges overwhelm\n\n**Unlockable Content**\n- Purpose: Reward progress, create anticipation, incentivize completion\n- Example: Advanced modules unlock after basics, bonus content for high performers\n- Best for: Explorers and Achievers, creating progression value\n- Pitfall: Locking essential content frustrates learners\n\n**Social Features**\n- Purpose: Enable connection, facilitate collaboration, build community\n- Example: Team challenges, peer endorsements, discussion forums\n- Best for: Socializers, creating relatedness\n- Pitfall: Forced social interaction undermines autonomy\n\n**Customization**\n- Purpose: Support autonomy, enable self-expression, increase ownership\n- Example: Avatar creation, theme selection, learning path choices\n- Best for: All types, especially Explorers and Socializers\n- Pitfall: Too many options create decision paralysis"
                    },
                    {
                        type: "heading",
                        level: 2,
                        content: "Dynamics: What Emerges from Play"
                    },
                    {
                        type: "text",
                        content: "**Dynamics** are the runtime behaviors that emerge when mechanics interact with player actions. They're what HAPPENS during play—the patterns that emerge.\n\n**Common Dynamics in Gamified Learning:**\n\n**Competition**\n- Emerges from: Leaderboards, timed challenges, limited rewards\n- Creates: Urgency, comparison, drive to excel\n- Supports: Competence (for winners), can undermine relatedness\n- Best for: Killers/Disruptors, short-term motivation\n\n**Cooperation**\n- Emerges from: Team challenges, shared goals, collaborative rewards\n- Creates: Social bonds, shared responsibility, peer support\n- Supports: Relatedness, competence through teamwork\n- Best for: Socializers, building community\n\n**Collection**\n- Emerges from: Badges, achievements, unlockables\n- Creates: Completionist drive, exploration, systematic engagement\n- Supports: Competence, autonomy in what to collect\n- Best for: Achievers and Explorers\n\n**Progression**\n- Emerges from: Levels, skill trees, unlocking content\n- Creates: Sense of advancement, visible growth, momentum\n- Supports: Competence, clear path forward\n- Best for: All types, fundamental to engagement\n\n**Discovery**\n- Emerges from: Hidden content, easter eggs, exploration rewards\n- Creates: Curiosity, surprise, delight\n- Supports: Autonomy, competence through exploration\n- Best for: Explorers, creating depth\n\n**Expression**\n- Emerges from: Customization, creation tools, sharing features\n- Creates: Identity, creativity, personal meaning\n- Supports: Autonomy, relatedness through sharing\n- Best for: Socializers and Explorers\n\n**Strategy**\n- Emerges from: Multiple paths, resource management, optimization\n- Creates: Planning, decision-making, mastery\n- Supports: Competence, autonomy in approach\n- Best for: Achievers and Explorers"
                    },
                    {
                        type: "heading",
                        level: 2,
                        content: "Aesthetics: The Emotional Experience"
                    },
                    {
                        type: "text",
                        content: "**Aesthetics** are the emotional responses evoked in the player. They're what players FEEL—the experience you're trying to create.\n\n**The 8 Types of Fun (LeBlanc's Taxonomy):**\n\n**1. Sensation**\n- Feeling: Sensory pleasure, delight in perception\n- In learning: Beautiful design, satisfying interactions, pleasant sounds\n- Example: Smooth animations, rewarding sound effects, elegant UI\n\n**2. Fantasy**\n- Feeling: Imaginary world, make-believe, role-play\n- In learning: Narrative wrappers, character roles, immersive scenarios\n- Example: 'You're a detective solving a mystery' training scenario\n\n**3. Narrative**\n- Feeling: Drama, story, unfolding plot\n- In learning: Story-driven courses, character arcs, plot progression\n- Example: Learning journey framed as a hero's quest\n\n**4. Challenge**\n- Feeling: Obstacle course, problem-solving, mastery\n- In learning: Difficult problems, skill tests, progressive difficulty\n- Example: Increasingly complex scenarios that test growing skills\n\n**5. Fellowship**\n- Feeling: Social connection, teamwork, community\n- In learning: Collaborative projects, team challenges, peer interaction\n- Example: Group problem-solving with shared rewards\n\n**6. Discovery**\n- Feeling: Exploration, finding the unknown, curiosity\n- In learning: Hidden content, bonus materials, deep-dive resources\n- Example: Easter eggs that reveal interesting facts\n\n**7. Expression**\n- Feeling: Self-expression, creativity, identity\n- In learning: Creative projects, customization, personal interpretation\n- Example: Build your own solution to a problem\n\n**8. Submission**\n- Feeling: Relaxation, mindless enjoyment, flow\n- In learning: Meditative practice, repetitive mastery, flow state\n- Example: Satisfying practice exercises that create flow"
                    },
                    {
                        type: "callout",
                        variant: "tip",
                        content: "**Design Principle:** Start with the aesthetic (emotion) you want to create, then work backwards to the dynamics and mechanics that will produce it. Don't just add points and badges—ask yourself what emotional experience you're trying to create."
                    },
                    {
                        type: "heading",
                        level: 2,
                        content: "Reward Schedules: The Science of Timing"
                    },
                    {
                        type: "text",
                        content: "Not all rewards are created equal. The TIMING and PREDICTABILITY of rewards dramatically affect behavior. This comes from behavioral psychology research on reinforcement schedules."
                    },
                    {
                        type: "text",
                        content: "**Fixed Ratio Schedule**\n\nReward after a SET number of actions (e.g., every 5 completions)\n\n**Pros:**\n- Predictable and fair\n- Creates steady behavior\n- Easy to understand\n- Supports competence (clear goals)\n\n**Cons:**\n- Can lead to 'post-reward pauses' (slacking after getting reward)\n- Less exciting than variable rewards\n- Behavior drops off quickly when rewards stop\n\n**Best for:** Onboarding, building habits, clear milestones\n\n**Example:** 'Complete 10 lessons to earn a badge'"
                    },
                    {
                        type: "text",
                        content: "**Variable Ratio Schedule**\n\nReward after an UNPREDICTABLE number of actions (e.g., random chance)\n\n**Pros:**\n- Creates strongest, most persistent behavior\n- Exciting and engaging\n- Resistant to extinction (behavior continues even when rewards stop)\n- Creates anticipation\n\n**Cons:**\n- Can feel unfair or manipulative\n- Can create compulsive behavior\n- Ethically questionable if overused\n- May undermine autonomy\n\n**Best for:** Optional engagement, bonus rewards, surprise and delight\n\n**Example:** 'Random chance to earn bonus points after each quiz'"
                    },
                    {
                        type: "callout",
                        variant: "warning",
                        content: "**Ethical Warning:** Variable ratio schedules are the same mechanism used in slot machines and loot boxes. They're incredibly powerful but can be manipulative. Use them sparingly, transparently, and only for optional content. Never use them to gate essential learning."
                    },
                    {
                        type: "text",
                        content: "**Fixed Interval Schedule**\n\nReward after a SET time period (e.g., daily login bonus)\n\n**Pros:**\n- Builds routine and habits\n- Predictable and reliable\n- Good for sustained engagement\n\n**Cons:**\n- Behavior spikes right before reward time\n- Can feel like a chore\n- May create obligation rather than motivation\n\n**Best for:** Building daily habits, sustained engagement\n\n**Example:** 'Log in daily for 7 days to earn a streak badge'"
                    },
                    {
                        type: "text",
                        content: "**Variable Interval Schedule**\n\nReward after UNPREDICTABLE time periods (e.g., surprise bonuses)\n\n**Pros:**\n- Creates steady, consistent behavior\n- Feels like pleasant surprises\n- Resistant to extinction\n\n**Cons:**\n- Less powerful than variable ratio\n- Can be confusing if not communicated well\n\n**Best for:** Surprise and delight, maintaining engagement\n\n**Example:** 'Random surprise rewards for active learners'"
                    },
                    {
                        type: "heading",
                        level: 2,
                        content: "Combining Mechanics: The Art of the Mashup"
                    },
                    {
                        type: "text",
                        content: "The real power of gamification comes from combining multiple mechanics thoughtfully. A single mechanic (like points) is boring. Multiple mechanics working together create engaging systems.\n\n**Example Mashup: Onboarding Quest**\n\nGoal: Get new employees engaged with company culture and systems\n\n**Mechanics:**\n- Story/Narrative: 'Welcome to your first week at TechCorp!'\n- Points: Earn XP for completing onboarding tasks\n- Badges: Milestone achievements (First Day, First Week, Fully Onboarded)\n- Challenges: Daily quests (Meet 3 colleagues, Complete security training)\n- Unlockables: Advanced resources unlock after basics\n- Social: Team challenge with other new hires\n- Customization: Create your employee profile\n\n**Dynamics:**\n- Progression: Clear path from newbie to fully onboarded\n- Cooperation: Team challenge creates bonds with other new hires\n- Discovery: Hidden tips and tricks throughout\n- Collection: Gather all the onboarding badges\n\n**Aesthetics:**\n- Fellowship: Connect with other new hires\n- Challenge: Complete all tasks successfully\n- Discovery: Learn about company culture\n- Narrative: Your first week story\n\nNotice how each mechanic serves a purpose and supports the overall experience. This is design thinking, not just adding game elements."
                    },
                    {
                        type: "callout",
                        variant: "success",
                        content: "**Your Turn:** In the interactive element below, you'll design your own mechanic mashup. Think about your learning context, choose 3-5 mechanics, and explain how they work together to create a cohesive experience."
                    }
                ]
            };
        }

        await course.save();
        console.log("✅ Module 3 enhanced successfully!");
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error enhancing Module 3:", error);
        process.exit(1);
    }
}

enhanceModule3();
