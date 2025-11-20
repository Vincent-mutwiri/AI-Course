import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';

// Load environment variables
dotenv.config({ path: '.env.local' });

const gamificationCourseData = {
    title: "Gamification for Learning: From Passive to Active",
    description: "Master the art of transforming passive content into engaging, active learning experiences using game design principles.",
    instructor: "Game Master AI",
    category: "Instructional Design",
    level: "intermediate" as const,
    isPublished: true,
    modules: [
        {
            title: "Module 1: Foundations",
            description: "Understand the core differences between gamification and game-based learning, and build your foundational vocabulary.",
            order: 1,
            lessons: [
                {
                    title: "Gamification vs. Game-Based Learning",
                    description: "Learn the critical distinctions between gamification and game-based learning approaches.",
                    duration: 15,
                    order: 1,
                    objective: "Distinguish between gamification and GBL, and identify when to use each approach.",
                    content: {
                        blocks: [
                            {
                                type: "text",
                                content: "Gamification applies game mechanics to non-game contexts, while Game-Based Learning (GBL) uses complete games as the learning vehicle. Understanding this distinction is crucial for effective instructional design."
                            },
                            {
                                type: "text",
                                content: "**Gamification**: Adding points, badges, leaderboards, and progress bars to existing learning content.\n\n**Game-Based Learning**: Creating or using complete games where learning objectives are embedded in gameplay."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "reflection",
                            config: {
                                prompt: "Think about a recent learning experience. Was it gamified, game-based, or neither? What elements made it engaging or disengaging?"
                            }
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 2: Psychology",
            description: "Explore the psychological foundations of motivation, including Self-Determination Theory and player types.",
            order: 2,
            lessons: [
                {
                    title: "Self-Determination Theory & Player Types",
                    description: "Understand intrinsic vs. extrinsic motivation and discover your dominant player type.",
                    duration: 20,
                    order: 1,
                    objective: "Apply SDT principles and identify player type preferences to design more engaging experiences.",
                    content: {
                        blocks: [
                            {
                                type: "text",
                                content: "Self-Determination Theory (SDT) identifies three core psychological needs: **Autonomy** (control over choices), **Competence** (feeling capable), and **Relatedness** (connection to others)."
                            },
                            {
                                type: "text",
                                content: "Player types help us understand different learner motivations:\n\n- **Achievers**: Goal-oriented, love completing challenges\n- **Explorers**: Curious, enjoy discovering new content\n- **Socializers**: Relationship-focused, thrive on collaboration\n- **Disruptors**: Change-makers, push boundaries creatively"
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "playerTypeSimulator",
                            config: {
                                title: "Discover Your Player Type",
                                description: "Answer questions to identify your dominant player type preference."
                            }
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 3: Toolbox",
            description: "Master the MDA framework and explore game mechanics, dynamics, and aesthetics for learning design.",
            order: 3,
            lessons: [
                {
                    title: "Mechanics, Dynamics, Aesthetics (MDA)",
                    description: "Learn the MDA framework and experiment with reward schedules and game mechanics.",
                    duration: 25,
                    order: 1,
                    objective: "Apply the MDA framework to analyze and design gamified learning experiences.",
                    content: {
                        blocks: [
                            {
                                type: "text",
                                content: "The MDA Framework breaks down games into three layers:\n\n**Mechanics**: The rules and systems (points, levels, challenges)\n**Dynamics**: The runtime behavior (competition, cooperation, progression)\n**Aesthetics**: The emotional responses (excitement, curiosity, accomplishment)"
                            },
                            {
                                type: "text",
                                content: "Reward schedules dramatically impact engagement:\n\n- **Fixed Ratio**: Predictable rewards (every 3rd attempt)\n- **Variable Ratio**: Unpredictable rewards (random chance)\n\nVariable ratio schedules create higher engagement but must be used ethically."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "rewardScheduleDesigner",
                            config: {
                                title: "Reward Schedule Simulator",
                                description: "Experience the difference between fixed and variable reward schedules."
                            }
                        },
                        {
                            type: "pitchAnalysisGenerator",
                            promptTemplate: "mechanic-analyst",
                            config: {
                                title: "Pitch Your Gamification Design",
                                description: "Submit your gamification idea and receive expert feedback on mechanics, player type alignment, and feasibility."
                            }
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 4: The Loop",
            description: "Design effective core loops and master the flow channel for optimal challenge-skill balance.",
            order: 4,
            lessons: [
                {
                    title: "Core Loop & Flow Channel",
                    description: "Understand the action-feedback-reward cycle and find the optimal flow state.",
                    duration: 20,
                    order: 1,
                    objective: "Design core loops that maintain learners in the flow channel.",
                    content: {
                        blocks: [
                            {
                                type: "text",
                                content: "The **Core Loop** is the fundamental cycle that keeps learners engaged:\n\n1. **Action**: Learner performs a task\n2. **Feedback**: System responds immediately\n3. **Reward**: Learner receives recognition or progression\n\nThis loop should repeat every 30-90 seconds for optimal engagement."
                            },
                            {
                                type: "text",
                                content: "The **Flow Channel** represents the sweet spot between skill and challenge:\n\n- Too easy → Boredom\n- Too hard → Anxiety\n- Just right → Flow (optimal engagement)\n\nContinuously adjust difficulty to keep learners in flow."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "flowChannelEvaluator",
                            config: {
                                title: "Flow Channel Evaluator",
                                description: "Adjust skill and difficulty levels to find the flow state."
                            }
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 5: Story Mode",
            description: "Harness the power of narrative and immersion to create memorable learning experiences.",
            order: 5,
            lessons: [
                {
                    title: "Narrative & Immersion",
                    description: "Learn how to craft compelling narratives that enhance learning engagement.",
                    duration: 20,
                    order: 1,
                    objective: "Create narrative frameworks that immerse learners in meaningful contexts.",
                    content: {
                        blocks: [
                            {
                                type: "text",
                                content: "Narrative transforms abstract learning into concrete experiences. Key elements:\n\n- **Core Metaphor**: The central theme (e.g., 'Learning as a Quest')\n- **Inciting Incident**: The problem that launches the journey\n- **Hero Role**: The learner's identity in the story\n- **Stakes**: What matters if they succeed or fail"
                            },
                            {
                                type: "text",
                                content: "Effective learning narratives:\n\n✓ Connect to real-world applications\n✓ Give learners agency and choice\n✓ Create emotional investment\n✓ Provide meaningful context for skills"
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "narrativeGenerator",
                            promptTemplate: "narrative-generator",
                            config: {
                                title: "Generate Your Learning Narrative",
                                description: "Describe your learning context and receive a custom narrative framework."
                            }
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 6: Boss Battle",
            description: "Navigate ethical considerations, measure ROE (Return on Engagement), and earn your certificate.",
            order: 6,
            lessons: [
                {
                    title: "Ethics & ROI",
                    description: "Identify dark patterns, redesign for ethics, and measure engagement effectiveness.",
                    duration: 25,
                    order: 1,
                    objective: "Apply ethical design principles and measure the return on engagement for gamified learning.",
                    content: {
                        blocks: [
                            {
                                type: "text",
                                content: "**Dark Patterns** are manipulative design mechanics that exploit psychology:\n\n- Forced scarcity (fake urgency)\n- Infinite loops (endless scrolling)\n- Shame mechanics (public failure)\n- Pay-to-win (unfair advantages)\n\nEthical gamification respects learner autonomy and wellbeing."
                            },
                            {
                                type: "text",
                                content: "**Return on Engagement (ROE)** measures gamification effectiveness:\n\n- Completion rates\n- Time spent learning\n- Knowledge retention\n- Learner satisfaction\n- Behavior change\n\nTrack these metrics to validate your design decisions."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "darkPatternRedesigner",
                            promptTemplate: "dark-pattern-redesigner",
                            config: {
                                title: "Redesign Dark Patterns",
                                description: "Submit a potentially manipulative mechanic and receive an ethical redesign."
                            }
                        },
                        {
                            type: "roeDashboard",
                            config: {
                                title: "ROE Analytics Dashboard",
                                description: "Explore engagement metrics and completion data."
                            }
                        },
                        {
                            type: "certificateGenerator",
                            config: {
                                title: "Generate Your Certificate",
                                description: "Congratulations! You've completed all modules. Generate your certificate of completion."
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

async function seedGamificationModules() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Check if gamification course already exists
        const existingCourse = await Course.findOne({ title: gamificationCourseData.title });

        if (existingCourse) {
            console.log('Gamification course already exists. Updating...');
            await Course.findByIdAndUpdate(existingCourse._id, gamificationCourseData);
            console.log('Gamification course updated successfully!');
        } else {
            console.log('Creating new gamification course...');
            const course = new Course(gamificationCourseData);
            await course.save();
            console.log('Gamification course created successfully!');
        }

        console.log('\nCourse Structure:');
        gamificationCourseData.modules.forEach((module, idx) => {
            console.log(`\n${idx + 1}. ${module.title}`);
            console.log(`   ${module.description}`);
            console.log(`   Lessons: ${module.lessons.length}`);
            module.lessons.forEach(lesson => {
                console.log(`   - ${lesson.title} (${lesson.duration} min)`);
                console.log(`     Interactive Elements: ${lesson.interactiveElements?.length || 0}`);
            });
        });

        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding gamification modules:', error);
        process.exit(1);
    }
}

seedGamificationModules();
