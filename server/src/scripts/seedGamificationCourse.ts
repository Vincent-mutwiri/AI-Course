import mongoose from "mongoose";
import Course from "../models/Course";
import { connectDB } from "../config/database";

const gamificationCourseData = {
    title: "Gamification for Engagement",
    description: "Transform passive content into active learning experiences using game design principles. Learn to design balanced core loops, map mechanics to behavioral outcomes, and measure Return on Engagement (ROE).",
    instructor: "Game Master",
    category: "Instructional Design",
    level: "intermediate" as const,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    totalDuration: 360,
    isPublished: true,
    modules: [
        {
            title: "Module 1: Foundations of Gamification",
            description: "Understand the core differences between gamification and game-based learning, and master the essential terminology.",
            order: 1,
            lessons: [
                {
                    title: "Gamification vs. Game-Based Learning",
                    description: "Learn the critical distinctions between gamification and game-based learning approaches.",
                    duration: 15,
                    order: 1,
                    objective: "Differentiate between gamification and game-based learning, and identify when to use each approach.",
                    content: {
                        sections: [
                            {
                                type: "text",
                                content: "Gamification and Game-Based Learning (GBL) are often confused, but they serve different purposes in education and training."
                            },
                            {
                                type: "heading",
                                content: "What is Gamification?"
                            },
                            {
                                type: "text",
                                content: "Gamification applies game design elements (points, badges, leaderboards) to non-game contexts to increase engagement and motivation. It's about adding game mechanics to existing content."
                            },
                            {
                                type: "heading",
                                content: "What is Game-Based Learning?"
                            },
                            {
                                type: "text",
                                content: "Game-Based Learning uses actual games as the primary learning vehicle. The game itself teaches the content through gameplay, not just motivates learners to engage with separate content."
                            },
                            {
                                type: "callout",
                                variant: "info",
                                content: "Think of it this way: Gamification is adding chocolate chips to your cookie. Game-Based Learning is making the entire cookie out of chocolate."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "reflection",
                            prompt: "Think of a training program you've experienced. Was it gamified, game-based, or neither? What elements made you classify it that way?",
                            placeholder: "Describe the program and explain your classification..."
                        },
                        {
                            type: "poll",
                            question: "Which approach do you think is more effective for corporate training?",
                            options: [
                                "Gamification - easier to implement",
                                "Game-Based Learning - more immersive",
                                "Depends on the content and audience",
                                "Neither - traditional methods work best"
                            ]
                        }
                    ]
                },
                {
                    title: "Core Terminology Builder",
                    description: "Master the essential vocabulary of gamification and game design.",
                    duration: 20,
                    order: 2,
                    objective: "Define and apply key gamification terms including mechanics, dynamics, and aesthetics.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "The MDA Framework"
                            },
                            {
                                type: "text",
                                content: "The MDA (Mechanics-Dynamics-Aesthetics) framework is the foundation of game design thinking."
                            },
                            {
                                type: "definition",
                                term: "Mechanics",
                                definition: "The rules and systems of the game. What players CAN do. Examples: points, levels, challenges, rewards."
                            },
                            {
                                type: "definition",
                                term: "Dynamics",
                                definition: "The runtime behavior of mechanics acting on player inputs. What EMERGES from play. Examples: competition, cooperation, progression."
                            },
                            {
                                type: "definition",
                                term: "Aesthetics",
                                definition: "The emotional responses evoked in the player. What players FEEL. Examples: challenge, fellowship, discovery, expression."
                            },
                            {
                                type: "callout",
                                variant: "tip",
                                content: "Designers create Mechanics, which create Dynamics, which create Aesthetics. But players experience it in reverse: they feel Aesthetics, which come from Dynamics, which come from Mechanics."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "wordCloud",
                            title: "Gamification Vocabulary",
                            words: [
                                { text: "Points", value: 80 },
                                { text: "Badges", value: 75 },
                                { text: "Leaderboards", value: 70 },
                                { text: "Levels", value: 65 },
                                { text: "Challenges", value: 60 },
                                { text: "Rewards", value: 85 },
                                { text: "Feedback", value: 90 },
                                { text: "Progress", value: 75 },
                                { text: "Achievements", value: 70 },
                                { text: "Quests", value: 55 }
                            ]
                        }
                    ]
                },
                {
                    title: "Easter Egg Hunt: Hidden Principles",
                    description: "Discover hidden gamification principles throughout real-world examples.",
                    duration: 25,
                    order: 3,
                    objective: "Identify gamification elements in everyday applications and understand their psychological impact.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "Gamification in the Wild"
                            },
                            {
                                type: "text",
                                content: "Gamification is everywhere - from your fitness tracker to your coffee shop loyalty card. Let's hunt for the hidden game mechanics."
                            },
                            {
                                type: "example",
                                title: "Duolingo: The Language Learning Game",
                                content: "Duolingo uses streaks (consecutive days), XP points, leagues (competitive leaderboards), and hearts (lives) to keep learners engaged. The app doesn't teach through games - it gamifies the learning process."
                            },
                            {
                                type: "example",
                                title: "LinkedIn: Professional Networking Gamified",
                                content: "Profile strength meter, endorsements (badges), connection milestones, and 'Who viewed your profile' create a game-like experience around professional networking."
                            },
                            {
                                type: "example",
                                title: "Starbucks Rewards: Coffee as a Quest",
                                content: "Stars (points), tiers (levels), bonus star challenges (quests), and free drinks (rewards) transform coffee buying into a progression system."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "dragAndDropQuiz",
                            question: "Match each app to its primary gamification mechanic:",
                            pairs: [
                                { left: "Duolingo", right: "Streak System" },
                                { left: "LinkedIn", right: "Profile Completion" },
                                { left: "Fitbit", right: "Step Challenges" },
                                { left: "Starbucks", right: "Points & Tiers" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 2: Psychology of Play",
            description: "Explore Self-Determination Theory and player types to understand what truly motivates learners.",
            order: 2,
            lessons: [
                {
                    title: "Self-Determination Theory (SDT)",
                    description: "Understand the three psychological needs that drive intrinsic motivation.",
                    duration: 20,
                    order: 1,
                    objective: "Apply SDT principles (Autonomy, Competence, Relatedness) to design intrinsically motivating experiences.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "The Three Pillars of Motivation"
                            },
                            {
                                type: "text",
                                content: "Self-Determination Theory (SDT) identifies three universal psychological needs that, when satisfied, promote intrinsic motivation and well-being."
                            },
                            {
                                type: "definition",
                                term: "Autonomy",
                                definition: "The need to feel in control of one's own behavior and goals. In gamification: choice, customization, optional challenges."
                            },
                            {
                                type: "definition",
                                term: "Competence",
                                definition: "The need to feel effective and capable. In gamification: clear feedback, progressive difficulty, skill mastery."
                            },
                            {
                                type: "definition",
                                term: "Relatedness",
                                definition: "The need to feel connected to others. In gamification: social features, collaboration, shared goals."
                            },
                            {
                                type: "callout",
                                variant: "warning",
                                content: "Extrinsic rewards (points, badges) can actually DECREASE intrinsic motivation if they undermine these three needs. This is called the 'overjustification effect.'"
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "choiceComparison",
                            scenario: "You're designing a compliance training module. Which approach better supports SDT?",
                            optionA: {
                                title: "Mandatory Quiz with Points",
                                description: "All employees must complete a 20-question quiz. Top scorers get badges displayed on their profile.",
                                sdtAnalysis: "Low Autonomy (mandatory), Moderate Competence (quiz feedback), Low Relatedness (individual competition)"
                            },
                            optionB: {
                                title: "Choose Your Path Challenge",
                                description: "Employees choose from 3 scenario-based challenges matching their role. Teams collaborate to solve cases and share solutions.",
                                sdtAnalysis: "High Autonomy (choice), High Competence (relevant scenarios), High Relatedness (team collaboration)"
                            }
                        }
                    ]
                },
                {
                    title: "Player Type Analyzer",
                    description: "Discover your dominant player type and learn to design for diverse motivations.",
                    duration: 25,
                    order: 2,
                    objective: "Identify player types using Bartle's taxonomy and design mechanics that appeal to each type.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "Bartle's Player Types"
                            },
                            {
                                type: "text",
                                content: "Richard Bartle identified four player types based on what motivates them in games. Understanding these helps you design for diverse learners."
                            },
                            {
                                type: "definition",
                                term: "Achievers",
                                definition: "Motivated by mastery and completion. They want to level up, earn all badges, and top leaderboards. Design for them: clear goals, progress bars, achievements."
                            },
                            {
                                type: "definition",
                                term: "Explorers",
                                definition: "Motivated by discovery and understanding. They want to find hidden content and understand how systems work. Design for them: easter eggs, unlockable content, deep lore."
                            },
                            {
                                type: "definition",
                                term: "Socializers",
                                definition: "Motivated by connection and relationships. They want to interact with others and build community. Design for them: chat, teams, social sharing."
                            },
                            {
                                type: "definition",
                                term: "Killers",
                                definition: "Motivated by competition and dominance. They want to win and be recognized as the best. Design for them: PvP, leaderboards, competitive challenges."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "playerTypeSimulator",
                            title: "Discover Your Player Type",
                            description: "Answer these questions to identify your dominant player motivation.",
                            questions: [
                                {
                                    id: 1,
                                    text: "In a training program, I'm most excited when...",
                                    options: [
                                        { text: "I complete all modules and earn every badge", type: "Achiever", points: 3 },
                                        { text: "I discover hidden resources or bonus content", type: "Explorer", points: 3 },
                                        { text: "I collaborate with colleagues and share insights", type: "Socializer", points: 3 },
                                        { text: "I rank #1 on the leaderboard", type: "Killer", points: 3 }
                                    ]
                                },
                                {
                                    id: 2,
                                    text: "The best reward for completing a challenge is...",
                                    options: [
                                        { text: "A certificate or achievement badge", type: "Achiever", points: 3 },
                                        { text: "Access to advanced or secret content", type: "Explorer", points: 3 },
                                        { text: "Recognition from my team or peers", type: "Socializer", points: 3 },
                                        { text: "Beating others' scores or times", type: "Killer", points: 3 }
                                    ]
                                },
                                {
                                    id: 3,
                                    text: "I lose interest in a gamified experience when...",
                                    options: [
                                        { text: "There are no more goals to achieve", type: "Achiever", points: 3 },
                                        { text: "I've seen everything there is to see", type: "Explorer", points: 3 },
                                        { text: "I'm working alone with no social interaction", type: "Socializer", points: 3 },
                                        { text: "There's no competition or ranking", type: "Killer", points: 3 }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    title: "Avatar Creation Station",
                    description: "Design a learner persona and customize their gamification journey.",
                    duration: 15,
                    order: 3,
                    objective: "Create learner personas that reflect different player types and motivation profiles.",
                    content: {
                        sections: [
                            {
                                type: "text",
                                content: "Just as games let players create avatars, effective gamification considers the diverse identities and motivations of learners."
                            },
                            {
                                type: "callout",
                                variant: "tip",
                                content: "The best gamification systems offer multiple paths to success, allowing different player types to engage in ways that feel authentic to them."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "reflection",
                            prompt: "Create a learner persona for your target audience. Include: Name, Role, Primary Player Type, Key Motivations, and Preferred Game Mechanics.",
                            placeholder: "Example: Sarah, Sales Manager, Achiever, motivated by recognition and career growth, prefers progress tracking and skill badges..."
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 3: The Gamification Toolbox",
            description: "Master the core mechanics (PBL, rewards, scarcity) and learn to combine them creatively.",
            order: 3,
            lessons: [
                {
                    title: "Points, Badges, and Leaderboards (PBL)",
                    description: "Understand the most common gamification mechanics and when to use them.",
                    duration: 20,
                    order: 1,
                    objective: "Design balanced PBL systems that motivate without manipulating.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "The PBL Trinity"
                            },
                            {
                                type: "text",
                                content: "Points, Badges, and Leaderboards are the most recognizable gamification mechanics, but they're often misused."
                            },
                            {
                                type: "definition",
                                term: "Points",
                                definition: "Numerical feedback for actions. Best for: tracking progress, enabling exchange systems, providing immediate feedback. Pitfall: meaningless if not tied to real value."
                            },
                            {
                                type: "definition",
                                term: "Badges",
                                definition: "Visual achievements for milestones. Best for: signaling accomplishment, creating collection goals, onboarding. Pitfall: too many badges dilute their value."
                            },
                            {
                                type: "definition",
                                term: "Leaderboards",
                                definition: "Ranked comparison of performance. Best for: competitive players, time-limited events, team challenges. Pitfall: demotivates those not at the top."
                            },
                            {
                                type: "callout",
                                variant: "warning",
                                content: "PBL without purpose is 'pointsification' - adding game elements without game thinking. Always ask: What behavior am I trying to encourage, and why?"
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "simulation",
                            title: "PBL Balancing Simulator",
                            description: "Adjust point values, badge thresholds, and leaderboard settings to see their impact on engagement.",
                            config: {
                                variables: ["pointsPerAction", "badgeThreshold", "leaderboardSize"],
                                outcomes: ["engagement", "completion", "competition"]
                            }
                        }
                    ]
                },
                {
                    title: "Reward Schedule Designer",
                    description: "Explore fixed vs. variable reward schedules and their psychological impact.",
                    duration: 25,
                    order: 2,
                    objective: "Design reward schedules that sustain engagement without creating addiction.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "The Science of Rewards"
                            },
                            {
                                type: "text",
                                content: "Not all rewards are created equal. The TIMING and PREDICTABILITY of rewards dramatically affect behavior."
                            },
                            {
                                type: "definition",
                                term: "Fixed Ratio Schedule",
                                definition: "Reward after a set number of actions (e.g., every 5 completions). Predictable but can lead to 'post-reward pauses.'"
                            },
                            {
                                type: "definition",
                                term: "Variable Ratio Schedule",
                                definition: "Reward after an unpredictable number of actions (e.g., random chance). Creates the strongest, most persistent behavior - this is how slot machines work."
                            },
                            {
                                type: "callout",
                                variant: "warning",
                                content: "Variable ratio schedules are incredibly powerful but ethically questionable. They can create compulsive behavior. Use with caution and transparency."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "rewardScheduleDesigner",
                            title: "Reward Schedule Simulator",
                            description: "Compare fixed vs. variable reward schedules and see their impact on sustained engagement.",
                            config: {
                                scheduleTypes: ["fixed", "variable"],
                                metrics: ["attempts", "rewards", "engagement"]
                            }
                        }
                    ]
                },
                {
                    title: "Mechanic Mashup Pitch",
                    description: "Combine multiple mechanics into a cohesive gamification strategy.",
                    duration: 30,
                    order: 3,
                    objective: "Create and pitch a gamification design that combines at least 3 mechanics for a specific learning goal.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "Combining Mechanics for Impact"
                            },
                            {
                                type: "text",
                                content: "The magic happens when you combine mechanics thoughtfully. A point system alone is boring. Points + badges + social sharing + unlockable content = engagement."
                            },
                            {
                                type: "example",
                                title: "Example Mashup: Onboarding Quest",
                                content: "New employees complete a 'First Week Quest' that combines: Story (narrative wrapper), Points (progress tracking), Badges (milestone achievements), Team Challenge (social relatedness), and Unlockable Content (advanced resources). Each mechanic serves a purpose."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "pitchAnalysisGenerator",
                            title: "AI-Powered Pitch Analyzer",
                            description: "Submit your gamification pitch and receive feedback from the Game Master AI on balance, player type alignment, and feasibility.",
                            generatorType: "mechanic-analyst",
                            promptTemplate: "Analyze this gamification pitch for a training program. Evaluate: 1) Mechanic balance, 2) Player type alignment, 3) Feasibility, 4) Ethical considerations. Provide a score (1-10) and specific improvement suggestions.",
                            placeholder: "Example: For our sales training, we'll use a leaderboard (competition), daily challenges (habit formation), and team badges (collaboration). Top performers get featured in the company newsletter..."
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 4: The Core Loop",
            description: "Design balanced core loops and master the Flow Channel for optimal engagement.",
            order: 4,
            lessons: [
                {
                    title: "Anatomy of a Core Loop",
                    description: "Understand the Action-Feedback-Reward cycle that drives all games.",
                    duration: 20,
                    order: 1,
                    objective: "Design core loops that create sustainable engagement without burnout.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "The Engine of Engagement"
                            },
                            {
                                type: "text",
                                content: "Every game, from Candy Crush to Call of Duty, runs on a core loop: the repeating cycle of actions that keeps players engaged."
                            },
                            {
                                type: "definition",
                                term: "Action",
                                definition: "What the player DOES. In learning: complete a module, answer a question, submit a project."
                            },
                            {
                                type: "definition",
                                term: "Feedback",
                                definition: "What the system SHOWS. In learning: correct/incorrect, progress bar update, peer comments."
                            },
                            {
                                type: "definition",
                                term: "Reward",
                                definition: "What the player GETS. In learning: points, badges, unlocked content, recognition."
                            },
                            {
                                type: "callout",
                                variant: "tip",
                                content: "The loop must be FAST. If it takes too long to complete one cycle, engagement drops. Aim for loops that complete in seconds to minutes, not hours or days."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "journeyTimeline",
                            title: "Core Loop Diagrammer",
                            description: "Map out the core loop for your learning experience.",
                            stages: [
                                { name: "Action", description: "What does the learner do?" },
                                { name: "Feedback", description: "What immediate response do they get?" },
                                { name: "Reward", description: "What value do they receive?" },
                                { name: "Motivation", description: "Why do they repeat the loop?" }
                            ]
                        }
                    ]
                },
                {
                    title: "Flow Channel Evaluator",
                    description: "Balance challenge and skill to keep learners in the optimal flow state.",
                    duration: 25,
                    order: 2,
                    objective: "Apply Csikszentmihalyi's Flow Theory to design appropriately challenging experiences.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "The Flow Channel"
                            },
                            {
                                type: "text",
                                content: "Mihaly Csikszentmihalyi discovered that optimal engagement happens in a narrow channel between anxiety (too hard) and boredom (too easy)."
                            },
                            {
                                type: "definition",
                                term: "Flow State",
                                definition: "Complete immersion in an activity. Time flies, self-consciousness disappears, and performance peaks. Occurs when challenge slightly exceeds skill."
                            },
                            {
                                type: "callout",
                                variant: "info",
                                content: "The Flow Channel is dynamic. As learners' skills increase, you must increase challenge to maintain flow. This is why games have levels."
                            },
                            {
                                type: "text",
                                content: "If difficulty >> skill = Anxiety (frustration, giving up). If skill >> difficulty = Boredom (disengagement, multitasking). If difficulty ≈ skill + 10% = Flow (optimal learning)."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "flowChannelEvaluator",
                            title: "Flow Channel Simulator",
                            description: "Adjust learner skill and content difficulty to find the flow zone.",
                            config: {
                                xAxis: "Skill Level (1-10)",
                                yAxis: "Challenge Level (1-10)",
                                zones: {
                                    flow: "Optimal engagement",
                                    anxiety: "Too difficult - frustration",
                                    boredom: "Too easy - disengagement",
                                    apathy: "Low skill, low challenge"
                                }
                            }
                        }
                    ]
                },
                {
                    title: "Level Up Logic",
                    description: "Design progression systems that scaffold learning and maintain flow.",
                    duration: 15,
                    order: 3,
                    objective: "Create level progression that balances accessibility with challenge.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "Progression Design"
                            },
                            {
                                type: "text",
                                content: "Levels aren't just about status - they're a scaffolding system that gradually increases complexity while maintaining flow."
                            },
                            {
                                type: "example",
                                title: "Good Progression: Duolingo",
                                content: "Level 1: Basic vocabulary with pictures. Level 2: Simple sentences. Level 3: Listening comprehension. Level 4: Conversation. Each level builds on the last, maintaining flow."
                            },
                            {
                                type: "example",
                                title: "Bad Progression: Sudden Difficulty Spike",
                                content: "Level 1-5: Easy multiple choice. Level 6: Suddenly requires essay writing. This breaks flow and creates anxiety."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "reflection",
                            prompt: "Design a 5-level progression system for a topic you teach. For each level, specify: 1) What new skill/concept is introduced, 2) How difficulty increases, 3) What support is provided.",
                            placeholder: "Level 1: Introduction to [concept] with guided examples...\nLevel 2: Practice with hints available...\nLevel 3: Independent application..."
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 5: Story Mode - Narrative & Immersion",
            description: "Use narrative wrappers and storytelling to transform dry content into compelling experiences.",
            order: 5,
            lessons: [
                {
                    title: "The Power of Narrative Wrappers",
                    description: "Learn how story transforms boring content into engaging quests.",
                    duration: 20,
                    order: 1,
                    objective: "Apply narrative frameworks to create immersive learning experiences.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "Why Story Matters"
                            },
                            {
                                type: "text",
                                content: "The same content can feel like a chore or an adventure depending on how it's framed. Narrative wrappers provide context, meaning, and emotional engagement."
                            },
                            {
                                type: "example",
                                title: "Without Narrative",
                                content: "Complete 10 compliance training modules about data security policies."
                            },
                            {
                                type: "example",
                                title: "With Narrative",
                                content: "You're a new Security Agent at CyberCorp. A data breach has occurred, and you must investigate 10 case files to identify the vulnerability and prevent future attacks. Each module is a case file with clues."
                            },
                            {
                                type: "callout",
                                variant: "tip",
                                content: "The narrative doesn't need to be complex. Even a simple metaphor (learning as a journey, training as a mission) can dramatically increase engagement."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "narrativeGenerator",
                            title: "AI Narrative Wrapper Generator",
                            description: "Enter your dry topic and desired theme, and the Game Master AI will create a narrative wrapper.",
                            generatorType: "narrative-generator",
                            promptTemplate: "Create a compelling narrative wrapper for this training topic. Include: 1) Core metaphor, 2) Inciting incident (hook), 3) Learner's hero role, 4) Quest structure. Make it immersive but not cheesy.",
                            placeholder: "Topic: Annual compliance training on workplace harassment\nTheme: Detective mystery"
                        }
                    ]
                },
                {
                    title: "Inciting Incidents & Hooks",
                    description: "Master the art of the opening hook that pulls learners into the experience.",
                    duration: 15,
                    order: 2,
                    objective: "Craft compelling inciting incidents that create immediate engagement.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "The First 30 Seconds"
                            },
                            {
                                type: "text",
                                content: "In storytelling, the inciting incident is the event that disrupts the status quo and launches the hero's journey. In gamified learning, it's your hook."
                            },
                            {
                                type: "definition",
                                term: "Inciting Incident",
                                definition: "The moment that creates urgency and stakes. It answers: Why should I care? What's at risk? What's the opportunity?"
                            },
                            {
                                type: "example",
                                title: "Weak Hook",
                                content: "Welcome to Customer Service Training. In this course, you'll learn best practices for handling difficult customers."
                            },
                            {
                                type: "example",
                                title: "Strong Hook",
                                content: "URGENT: Customer satisfaction scores dropped 15% last quarter. The CEO wants answers. You've been selected for an elite task force to identify what's going wrong and fix it. Your first mission starts now."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "reflection",
                            prompt: "Rewrite a boring training introduction as a compelling inciting incident. Include: 1) A disruption or opportunity, 2) Stakes (what's at risk), 3) The learner's role, 4) Immediate action.",
                            placeholder: "Original: Welcome to Time Management Training...\nRewritten: Your inbox has 247 unread emails. Three deadlines are tomorrow. Your manager just scheduled an 'urgent' meeting. Sound familiar? You're not alone - but you're about to learn the system that top performers use to take back control..."
                        }
                    ]
                },
                {
                    title: "Branching Scenarios & Choice",
                    description: "Design meaningful choices that create autonomy and consequence.",
                    duration: 25,
                    order: 3,
                    objective: "Create branching scenarios that provide autonomy while teaching decision-making.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "The Illusion of Choice"
                            },
                            {
                                type: "text",
                                content: "Games create engagement through meaningful choices. Even if all paths lead to the same learning outcome, the act of choosing creates ownership and investment."
                            },
                            {
                                type: "callout",
                                variant: "info",
                                content: "You don't need complex branching. Even 2-3 choices with different paths that reconverge can create a sense of agency."
                            },
                            {
                                type: "example",
                                title: "Branching Scenario: Difficult Conversation",
                                content: "A team member missed a deadline. How do you respond?\nA) Address it immediately in public (leads to conflict resolution module)\nB) Schedule a private 1-on-1 (leads to coaching module)\nC) Ignore it this time (leads to accountability module)\nAll paths teach important skills, but the choice creates investment."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "choiceComparison",
                            scenario: "Design a branching scenario for your content. What choice point creates the most meaningful learning?",
                            optionA: {
                                title: "Path A",
                                description: "Describe the first choice and where it leads",
                                outcome: "What does the learner experience and learn?"
                            },
                            optionB: {
                                title: "Path B",
                                description: "Describe the alternative choice and where it leads",
                                outcome: "What does the learner experience and learn?"
                            }
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 6: Boss Battle - Ethics & ROI",
            description: "Navigate ethical considerations, avoid dark patterns, and measure Return on Engagement.",
            order: 6,
            lessons: [
                {
                    title: "Dark Patterns & Ethical Design",
                    description: "Identify manipulative mechanics and redesign them ethically.",
                    duration: 25,
                    order: 1,
                    objective: "Recognize dark patterns in gamification and apply ethical design principles.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "The Dark Side of Gamification"
                            },
                            {
                                type: "text",
                                content: "Gamification can be used to manipulate, not just motivate. Dark patterns are deceptive design choices that trick users into behavior that benefits the designer, not the user."
                            },
                            {
                                type: "definition",
                                term: "Dark Pattern",
                                definition: "A user interface designed to trick users into doing things they didn't mean to do, or that benefit the company at the user's expense."
                            },
                            {
                                type: "example",
                                title: "Dark Pattern: Forced Sharing",
                                content: "You must share your achievement on social media to unlock the next level. This exploits social pressure and violates autonomy."
                            },
                            {
                                type: "example",
                                title: "Ethical Alternative",
                                content: "Sharing is optional and provides a small bonus, but all content is accessible without sharing. This respects autonomy while encouraging organic promotion."
                            },
                            {
                                type: "callout",
                                variant: "warning",
                                content: "Ask yourself: Am I designing for the learner's benefit or my metrics? If removing a mechanic would improve the learning experience but hurt your numbers, it's probably a dark pattern."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "darkPatternRedesigner",
                            title: "Ethical Redesign Consultant",
                            description: "Submit a potentially manipulative mechanic and receive an ethical redesign from the Game Master AI.",
                            generatorType: "dark-pattern-redesigner",
                            promptTemplate: "Analyze this gamification mechanic for ethical concerns. Identify: 1) The manipulative element, 2) Which SDT need it violates, 3) An ethical alternative that achieves the same goal. Be specific and actionable.",
                            placeholder: "Example: We require employees to complete training during their lunch break to earn points toward a prize drawing..."
                        }
                    ]
                },
                {
                    title: "Return on Engagement (ROE)",
                    description: "Measure the impact of gamification beyond completion rates.",
                    duration: 20,
                    order: 2,
                    objective: "Define and measure ROE metrics that demonstrate gamification's business value.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "Beyond Completion Rates"
                            },
                            {
                                type: "text",
                                content: "Traditional training measures completion rates and test scores. Gamification enables deeper engagement metrics that predict real behavior change."
                            },
                            {
                                type: "definition",
                                term: "Return on Engagement (ROE)",
                                definition: "The measurable business value generated by increased learner engagement. Includes: time on task, voluntary participation, knowledge retention, behavior change, and peer interaction."
                            },
                            {
                                type: "callout",
                                variant: "tip",
                                content: "ROE metrics to track: 1) Time spent (not just completion), 2) Return visits (voluntary engagement), 3) Social interactions (peer learning), 4) Content creation (application), 5) Performance improvement (real-world impact)."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "roeDashboard",
                            title: "ROE Dashboard (Simulated Data)",
                            description: "Explore how gamification metrics correlate with business outcomes.",
                            config: {
                                metrics: ["enrollments", "completions", "timeSpent", "aiInteractions", "socialShares"],
                                timeframe: "6 months"
                            }
                        }
                    ]
                },
                {
                    title: "Boss Battle: Final Pitch",
                    description: "Design and pitch a complete gamification strategy for your organization.",
                    duration: 35,
                    order: 3,
                    objective: "Create a comprehensive gamification proposal that demonstrates mastery of all course concepts.",
                    content: {
                        sections: [
                            {
                                type: "heading",
                                content: "Your Final Challenge"
                            },
                            {
                                type: "text",
                                content: "You've learned the theory, explored the psychology, mastered the mechanics, and considered the ethics. Now it's time to put it all together."
                            },
                            {
                                type: "callout",
                                variant: "info",
                                content: "Your pitch should include: 1) Target audience & player types, 2) Learning objectives, 3) Core loop design, 4) Mechanic selection (with SDT justification), 5) Narrative wrapper, 6) Ethical considerations, 7) ROE metrics."
                            },
                            {
                                type: "text",
                                content: "This is your Boss Battle - the culminating challenge that proves you've mastered gamification design. Take your time, be creative, and remember: the best gamification serves the learner, not just the metrics."
                            }
                        ]
                    },
                    interactiveElements: [
                        {
                            type: "finalAssessment",
                            title: "Submit Your Gamification Strategy",
                            description: "Upload your final pitch document (PDF, max 5 pages) outlining your complete gamification design.",
                            requirements: [
                                "Target audience analysis with player types",
                                "Clear learning objectives",
                                "Core loop diagram",
                                "Mechanic selection with SDT justification",
                                "Narrative wrapper or theme",
                                "Ethical design considerations",
                                "ROE measurement plan"
                            ],
                            submissionType: "file",
                            fileTypes: ["pdf", "docx"],
                            maxSize: "5MB"
                        },
                        {
                            type: "reflection",
                            prompt: "Reflect on your gamification journey. What was your biggest insight? What will you implement first? What ethical concern will you prioritize?",
                            placeholder: "My biggest insight was...\nI'll implement first...\nMy ethical priority is..."
                        }
                    ]
                }
            ]
        }
    ]
};

async function seedGamificationCourse() {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        // Check if course already exists
        const existingCourse = await Course.findOne({ title: "Gamification for Engagement" });
        if (existingCourse) {
            console.log("Gamification course already exists. Deleting old version...");
            await Course.findByIdAndDelete(existingCourse._id);
        }

        // Create the course
        const course = await Course.create(gamificationCourseData);
        console.log("✅ Gamification course created successfully!");
        console.log(`Course ID: ${course._id}`);
        console.log(`Modules: ${course.modules.length}`);
        console.log(`Total Lessons: ${course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)}`);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding gamification course:", error);
        process.exit(1);
    }
}

seedGamificationCourse();
