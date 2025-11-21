import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function restructureCourse() {
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

        // Update instructor name
        course.instructor = "Vincent Mutwiri";

        // Restructure modules with multiple lessons
        course.modules = [
            {
                title: "Module 1: Foundations",
                description: "Understanding the fundamentals of gamification and game-based learning",
                order: 1,
                lessons: [
                    {
                        title: "Gamification vs Game-Based Learning",
                        description: "Learn the key differences and when to use each approach",
                        duration: 8,
                        order: 1,
                        content: [
                            {
                                type: "text",
                                title: "The Great Confusion: Gamification vs Game-Based Learning",
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
                                content: "**Gamification** takes the motivational elements that make games engaging and applies them to learning experiences. You're not creating a game—you're making learning feel more game-like.\n\n**Core Elements:**\n- Points & Scoring: Immediate feedback\n- Badges & Achievements: Milestone recognition\n- Leaderboards: Social comparison\n- Levels & Progression: Clear advancement\n- Challenges & Quests: Goal-oriented activities\n- Narrative & Themes: Story wrappers"
                            }
                        ],
                        interactiveElements: [
                            {
                                type: "reflection",
                                config: {
                                    title: "Your Gamification Context",
                                    question: "Describe your learning context. Are you looking to gamify existing content or create a game-based learning experience?",
                                    placeholder: "Think about your learners, objectives, and constraints..."
                                }
                            }
                        ]
                    },
                    {
                        title: "Real-World Examples and Applications",
                        description: "Explore successful gamification implementations across different industries",
                        duration: 6,
                        order: 2,
                        content: [
                            {
                                type: "text",
                                title: "Gamification Success Stories",
                                content: "**Duolingo: Language Learning Revolution**\n- Streaks and XP for daily practice\n- League competitions for motivation\n- Heart system for mistake management\n- Result: 500M+ users, 15+ minutes daily engagement\n\n**Khan Academy: Mastery-Based Learning**\n- Energy points for problem-solving\n- Badges for skill mastery\n- Progress tracking across subjects\n- Result: Improved learning outcomes and retention"
                            },
                            {
                                type: "text",
                                title: "Game-Based Learning Examples",
                                content: "**Minecraft Education: Building Knowledge**\n- Historical recreations for history class\n- Chemical compounds in chemistry\n- Coding through command blocks\n- Result: Enhanced spatial reasoning and collaboration\n\n**Kerbal Space Program: Physics in Action**\n- Rocket design and orbital mechanics\n- Trial-and-error learning\n- Real physics simulation\n- Result: Intuitive understanding of complex concepts"
                            }
                        ]
                    },
                    {
                        title: "Common Pitfalls and How to Avoid Them",
                        description: "Learn from others' mistakes to design better gamified experiences",
                        duration: 5,
                        order: 3,
                        content: [
                            {
                                type: "text",
                                title: "The Top 5 Gamification Mistakes",
                                content: "**1. Pointsification**\nAdding points without purpose. Points should reflect meaningful progress.\n\n**2. Chocolate-Covered Broccoli**\nSlapping game elements onto boring content. Fix the core experience first.\n\n**3. One-Size-Fits-All**\nIgnoring different player motivations. Provide multiple paths to success.\n\n**4. Overcomplication**\nToo many mechanics at once. Start simple, build complexity gradually.\n\n**5. Ignoring Context**\nUsing mechanics that don't fit your culture or environment."
                            },
                            {
                                type: "callout",
                                style: "warning",
                                title: "Red Flags to Watch For",
                                content: "• Learners gaming the system instead of learning\n• Engagement drops when rewards are removed\n• Focus shifts from learning to point collection\n• Increased anxiety or competition stress\n• Exclusion of less competitive learners"
                            }
                        ]
                    }
                ]
            },
            {
                title: "Module 2: Psychology",
                description: "The psychological foundations that make gamification effective",
                order: 2,
                lessons: [
                    {
                        title: "Self-Determination Theory: The Foundation",
                        description: "Understand the three basic human needs that drive motivation",
                        duration: 10,
                        order: 1,
                        content: [
                            {
                                type: "text",
                                title: "The Science of Human Motivation",
                                content: "Great gamification isn't about tricks—it's about understanding what genuinely motivates humans. **Self-Determination Theory** reveals three basic psychological needs that, when satisfied, lead to natural motivation and engagement."
                            },
                            {
                                type: "callout",
                                style: "info",
                                title: "The Three Pillars of Motivation",
                                content: "**Autonomy:** Feeling volitional and self-directed\n**Mastery:** Experiencing competence and growth\n**Purpose:** Connecting to something meaningful\n\nSatisfy these needs, and motivation flourishes naturally."
                            },
                            {
                                type: "text",
                                title: "Autonomy: The Power of Choice",
                                content: "**Autonomy** means learners feel they're choosing to engage, not being forced. Even small choices dramatically increase motivation.\n\n**Support Autonomy Through:**\n- Multiple learning paths\n- Customization options\n- Optional challenges\n- Flexible pacing\n- Choice in difficulty\n\n**Autonomy Killers:**\n- Forced social sharing\n- Rigid progression\n- No opt-out options\n- Micromanagement"
                            }
                        ],
                        interactiveElements: [
                            {
                                type: "playerTypeSimulator",
                                config: {
                                    title: "Motivation Assessment",
                                    description: "Discover your motivational profile and see how different game mechanics appeal to different personality types."
                                }
                            }
                        ]
                    },
                    {
                        title: "Player Types and Individual Differences",
                        description: "Explore how different people are motivated by different game elements",
                        duration: 8,
                        order: 2,
                        content: [
                            {
                                type: "text",
                                title: "Understanding Player Diversity",
                                content: "Not everyone is motivated by the same things. **Bartle's Player Types** help us understand different motivational profiles and design inclusive experiences."
                            },
                            {
                                type: "text",
                                title: "The Four Core Player Types",
                                content: "**Achievers (25-30%)**\n- Motivated by: Completion, mastery, recognition\n- Love: Badges, leaderboards, skill progression\n- Design for: Clear goals, measurable progress\n\n**Socializers (60-70%)**\n- Motivated by: Connection, collaboration, helping\n- Love: Team challenges, peer interaction\n- Design for: Group activities, mentoring\n\n**Explorers (10-15%)**\n- Motivated by: Discovery, understanding, novelty\n- Love: Hidden content, deep dives\n- Design for: Optional content, easter eggs\n\n**Disruptors (5-10%)**\n- Motivated by: Competition, system mastery\n- Love: PvP challenges, optimization\n- Design for: Advanced challenges, complexity"
                            }
                        ]
                    },
                    {
                        title: "Intrinsic vs Extrinsic Motivation",
                        description: "Learn when external rewards help and when they hurt motivation",
                        duration: 7,
                        order: 3,
                        content: [
                            {
                                type: "text",
                                title: "The Motivation Spectrum",
                                content: "**Extrinsic Motivation:** External rewards (points, badges, grades)\n**Intrinsic Motivation:** Internal satisfaction from the activity itself\n\n**The Overjustification Effect:** Too many external rewards can undermine intrinsic motivation. People start doing things for the reward, not for inherent satisfaction."
                            },
                            {
                                type: "callout",
                                style: "warning",
                                title: "The Reward Paradox",
                                content: "Research shows that external rewards can actually decrease motivation for activities people already find interesting. Use rewards to scaffold intrinsic motivation, not replace it."
                            },
                            {
                                type: "text",
                                title: "Best Practices for Rewards",
                                content: "**Do:**\n- Use informational feedback\n- Reward effort and improvement\n- Gradually fade external rewards\n- Support natural curiosity\n\n**Don't:**\n- Over-reward interesting activities\n- Use controlling language\n- Make everything about points\n- Ignore individual preferences"
                            }
                        ]
                    }
                ]
            },
            {
                title: "Module 3: The Gamification Toolbox",
                description: "Master the mechanics, dynamics, and aesthetics of game design",
                order: 3,
                lessons: [
                    {
                        title: "The MDA Framework",
                        description: "Understand how mechanics create dynamics that produce aesthetics",
                        duration: 12,
                        order: 1,
                        content: [
                            {
                                type: "text",
                                title: "The MDA Framework: Your Design Compass",
                                content: "The **MDA Framework** (Mechanics, Dynamics, Aesthetics) is the most fundamental tool in game design. It helps you understand how game elements work together to create engaging experiences."
                            },
                            {
                                type: "callout",
                                style: "info",
                                title: "The Designer vs Player Perspective",
                                content: "**Designer View:** Mechanics → Dynamics → Aesthetics\n**Player View:** Aesthetics → Dynamics → Mechanics\n\nDesigners create mechanics that generate dynamics that produce aesthetics. Players experience aesthetics that emerge from dynamics that come from mechanics."
                            },
                            {
                                type: "text",
                                title: "Mechanics: The Rules of Engagement",
                                content: "**Mechanics** are the rules, systems, and components. They're what players CAN do.\n\n**Common Gamification Mechanics:**\n- Points: Track progress, provide feedback\n- Badges: Signal accomplishment, guide behavior\n- Leaderboards: Create competition, show performance\n- Levels: Structure difficulty, show advancement\n- Challenges: Provide goals, create narrative\n- Social Features: Enable connection, collaboration"
                            }
                        ],
                        interactiveElements: [
                            {
                                type: "rewardScheduleDesigner",
                                config: {
                                    title: "Reward Schedule Designer",
                                    description: "Experiment with different reward timing patterns and see how they affect learner behavior and engagement."
                                }
                            }
                        ]
                    },
                    {
                        title: "Dynamics: What Emerges from Play",
                        description: "Explore the behaviors that emerge when mechanics interact with players",
                        duration: 8,
                        order: 2,
                        content: [
                            {
                                type: "text",
                                title: "Understanding Game Dynamics",
                                content: "**Dynamics** are the runtime behaviors that emerge when mechanics interact with player actions. They're what HAPPENS during play.\n\n**Key Dynamics in Learning:**\n- Competition: Urgency, comparison, drive to excel\n- Cooperation: Social bonds, shared responsibility\n- Collection: Completionist drive, systematic engagement\n- Progression: Sense of advancement, momentum\n- Discovery: Curiosity, surprise, exploration\n- Expression: Identity, creativity, personal meaning"
                            },
                            {
                                type: "text",
                                title: "Designing for Positive Dynamics",
                                content: "**Encourage Healthy Competition:**\n- Multiple ways to win\n- Personal best tracking\n- Team-based challenges\n- Seasonal resets\n\n**Foster Collaboration:**\n- Shared goals and rewards\n- Peer teaching opportunities\n- Group problem-solving\n- Community challenges"
                            }
                        ]
                    },
                    {
                        title: "Aesthetics: The Emotional Experience",
                        description: "Create the feelings and emotions that drive engagement",
                        duration: 9,
                        order: 3,
                        content: [
                            {
                                type: "text",
                                title: "The 8 Types of Fun",
                                content: "**Aesthetics** are the emotional responses evoked in players. Marc LeBlanc identified 8 types of fun:\n\n1. **Sensation:** Sensory pleasure\n2. **Fantasy:** Make-believe, role-play\n3. **Narrative:** Drama, unfolding story\n4. **Challenge:** Obstacle course, problem-solving\n5. **Fellowship:** Social connection, teamwork\n6. **Discovery:** Exploration, finding the unknown\n7. **Expression:** Self-expression, creativity\n8. **Submission:** Relaxation, mindless enjoyment"
                            },
                            {
                                type: "callout",
                                style: "success",
                                title: "Design Principle",
                                content: "Start with the aesthetic (emotion) you want to create, then work backwards to the dynamics and mechanics that will produce it. Don't just add points and badges—ask what emotional experience you're creating."
                            }
                        ],
                        interactiveElements: [
                            {
                                type: "pitchAnalysisGenerator",
                                config: {
                                    title: "Mechanic Mashup Analyzer",
                                    description: "Describe your gamification concept and get expert analysis on how your mechanics work together.",
                                    promptTemplate: "mechanic-analyst"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: "Module 4: The Core Loop",
                description: "Design engagement cycles that keep learners coming back",
                order: 4,
                lessons: [
                    {
                        title: "Understanding Core Loops",
                        description: "Learn the anatomy of engagement cycles in gamified learning",
                        duration: 10,
                        order: 1,
                        content: [
                            {
                                type: "text",
                                title: "The Heart of Engagement",
                                content: "Every great game has a **core loop**—a cycle of actions that players repeat, each time becoming more engaged. In gamified learning, the core loop transforms one-time activities into habit-forming experiences."
                            },
                            {
                                type: "callout",
                                style: "info",
                                title: "The Core Loop Formula",
                                content: "**Action → Feedback → Reward → Progression → New Challenge → Action**\n\nThis cycle creates 'intermittent reinforcement'—the most powerful driver of repeated behavior."
                            },
                            {
                                type: "text",
                                title: "Building Effective Core Loops",
                                content: "**1. Action:** The learning behavior you want to encourage\n**2. Feedback:** Immediate, clear response to their action\n**3. Reward:** Tangible recognition of effort\n**4. Progression:** Visible advancement toward goals\n**5. New Challenge:** Slightly harder tasks that build on success"
                            }
                        ]
                    },
                    {
                        title: "Flow Theory and Optimal Challenge",
                        description: "Master the balance between skill and difficulty for optimal learning",
                        duration: 8,
                        order: 2,
                        content: [
                            {
                                type: "text",
                                title: "Finding the Flow Channel",
                                content: "Psychologist Mihaly Csikszentmihalyi discovered that optimal learning happens in the **Flow Channel**—the sweet spot between boredom and anxiety where challenge perfectly matches skill level."
                            },
                            {
                                type: "text",
                                title: "The Flow States",
                                content: "**Flow (Optimal):** Challenge = Skill Level\n- Time disappears\n- Effortless concentration\n- Intrinsic motivation peaks\n\n**Anxiety (Too Hard):** Challenge > Skill\n- Stress and frustration\n- Cognitive overload\n- Learning shuts down\n\n**Boredom (Too Easy):** Challenge < Skill\n- Disengagement\n- Mind wandering\n- No growth"
                            }
                        ],
                        interactiveElements: [
                            {
                                type: "flowChannelEvaluator",
                                config: {
                                    title: "Flow Channel Evaluator",
                                    description: "Adjust skill and difficulty levels to see how they affect learner experience."
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: "Module 5: Narrative and Immersion",
                description: "Use storytelling to transform learning experiences",
                order: 5,
                lessons: [
                    {
                        title: "The Power of Story in Learning",
                        description: "Understand why narratives are 22x more memorable than facts",
                        duration: 9,
                        order: 1,
                        content: [
                            {
                                type: "text",
                                title: "Why Stories Stick",
                                content: "Humans are wired for story. When you wrap learning in narrative, you transform abstract concepts into memorable experiences that stick long after the lesson ends."
                            },
                            {
                                type: "callout",
                                style: "info",
                                title: "The Narrative Advantage",
                                content: "Stories are 22x more memorable than facts alone. When information is embedded in narrative, the brain activates multiple regions simultaneously—creating rich, interconnected memories."
                            }
                        ]
                    },
                    {
                        title: "The Hero's Journey for Learning",
                        description: "Apply Campbell's monomyth to create compelling learning narratives",
                        duration: 11,
                        order: 2,
                        content: [
                            {
                                type: "text",
                                title: "Every Learner is a Hero",
                                content: "Joseph Campbell's **Hero's Journey** isn't just for movies—it's the perfect framework for learning experiences. Every learner is a hero on a quest for knowledge, facing challenges and growing stronger."
                            },
                            {
                                type: "text",
                                title: "The Learning Hero's Journey",
                                content: "**1. Ordinary World:** Current knowledge state\n**2. Call to Adventure:** Learning opportunity\n**3. Refusal of Call:** Resistance and fear\n**4. Meeting Mentor:** Guidance and support\n**5. Crossing Threshold:** Commitment to learn\n**6. Tests and Trials:** Practice and challenges\n**7. The Ordeal:** Major test of skills\n**8. The Reward:** Mastery achieved\n**9. Road Back:** Real-world application\n**10. Return Transformed:** New identity and capabilities"
                            }
                        ],
                        interactiveElements: [
                            {
                                type: "narrativeGenerator",
                                config: {
                                    title: "AI Narrative Generator",
                                    description: "Transform your learning objectives into compelling stories with characters, conflict, and resolution.",
                                    promptTemplate: "narrative-generator"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: "Module 6: Ethics and Sustainability",
                description: "Build responsible gamification that respects learners and delivers results",
                order: 6,
                lessons: [
                    {
                        title: "Dark Patterns and Ethical Design",
                        description: "Identify and avoid manipulative design practices",
                        duration: 10,
                        order: 1,
                        content: [
                            {
                                type: "text",
                                title: "The Shadow Side of Gamification",
                                content: "**Dark patterns** are design techniques that trick users into unintended actions. In gamification, they exploit psychological vulnerabilities for short-term engagement at the cost of long-term trust."
                            },
                            {
                                type: "callout",
                                style: "warning",
                                title: "The Gamification Paradox",
                                content: "The same techniques that create engaging experiences can also manipulate and exploit. The difference lies in the designer's intent and the learner's agency."
                            },
                            {
                                type: "text",
                                title: "Common Dark Patterns",
                                content: "**1. Addiction Mechanics:** Variable rewards designed for compulsion\n**2. Pay-to-Win:** Better outcomes only through payment\n**3. Forced Sharing:** Required social media posts\n**4. Artificial Scarcity:** False urgency and limited availability\n**5. Grinding:** Repetitive, low-value tasks\n**6. Shame and Punishment:** Negative emotions to drive behavior"
                            }
                        ],
                        interactiveElements: [
                            {
                                type: "darkPatternRedesigner",
                                config: {
                                    title: "Dark Pattern Redesigner",
                                    description: "Identify problematic mechanics and get ethical alternatives that maintain engagement.",
                                    promptTemplate: "dark-pattern-redesigner"
                                }
                            }
                        ]
                    },
                    {
                        title: "Measuring Return on Engagement",
                        description: "Track the right metrics to prove gamification effectiveness",
                        duration: 8,
                        order: 2,
                        content: [
                            {
                                type: "text",
                                title: "Beyond Traditional ROI",
                                content: "Traditional ROI focuses on financial returns, but in learning we need **Return on Engagement (ROE)**—measuring whether gamification actually improves learning outcomes."
                            },
                            {
                                type: "text",
                                title: "Key ROE Metrics",
                                content: "**Engagement Metrics:** Time spent, return visits, completion rates\n**Learning Metrics:** Knowledge retention, skill application, performance improvement\n**Experience Metrics:** Satisfaction, perceived value, motivation to continue\n**Business Metrics:** Reduced training costs, improved performance, retention"
                            }
                        ],
                        interactiveElements: [
                            {
                                type: "roeDashboard",
                                config: {
                                    title: "ROE Analytics Dashboard",
                                    description: "Explore how different gamification strategies impact learning outcomes and business metrics."
                                }
                            }
                        ]
                    },
                    {
                        title: "Your Gamification Certificate",
                        description: "Complete your journey and earn your designer credentials",
                        duration: 5,
                        order: 3,
                        content: [
                            {
                                type: "text",
                                title: "Congratulations, Gamification Designer!",
                                content: "You've completed the journey from passive to active learning design. You now have the knowledge, tools, and ethical framework to create engaging, effective gamified learning experiences."
                            },
                            {
                                type: "callout",
                                style: "success",
                                title: "Your Achievement",
                                content: "You've mastered:\n• Psychology of motivation\n• Game design frameworks\n• Ethical design principles\n• Measurement and analytics\n• Practical implementation strategies"
                            }
                        ],
                        interactiveElements: [
                            {
                                type: "certificateGenerator",
                                config: {
                                    title: "Generate Your Certificate",
                                    description: "Create your official Gamification Designer certificate to showcase your new expertise."
                                }
                            }
                        ]
                    }
                ]
            }
        ];

        await course.save();
        console.log("✅ Course restructured successfully!");
        console.log("👨‍🏫 Instructor updated to: Vincent Mutwiri");
        console.log("📚 Total modules: 6");
        console.log("📖 Total lessons: 16");
        console.log("🎮 Total interactive elements: 10");
        
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error restructuring course:", error);
        process.exit(1);
    }
}

restructureCourse();