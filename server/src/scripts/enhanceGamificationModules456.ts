import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function enhanceModules456() {
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

        // Enhance Module 4: The Loop - Core Loop & Flow Channel
        if (course.modules[3] && course.modules[3].lessons[0]) {
            console.log("Enhancing Module 4: The Loop...");

            course.modules[3].lessons[0].content = [
                {
                    type: "text",
                    title: "The Core Loop: The Heart of Engagement",
                    content: "Every great game has a **core loop**—a cycle of actions that players repeat over and over, each time becoming more engaged. In gamified learning, the core loop is what transforms one-time activities into habit-forming experiences that learners crave."
                },
                {
                    type: "callout",
                    style: "info",
                    title: "The Core Loop Formula",
                    content: "**Action → Feedback → Reward → Progression → New Challenge → Action**\n\nThis cycle creates what psychologists call 'intermittent reinforcement'—the most powerful driver of repeated behavior."
                },
                {
                    type: "text",
                    title: "Anatomy of a Learning Core Loop",
                    content: "**1. Action (What learners DO)**\n\nThe core action should be the learning behavior you want to encourage:\n- Answering questions\n- Creating content\n- Helping peers\n- Practicing skills\n- Reflecting on progress\n\n**Design Principle:** Make the core action intrinsically valuable. If the action isn't worth doing without rewards, gamification won't save it.\n\n**2. Feedback (What learners SEE)**\n\nImmediate, clear feedback that shows the impact of their action:\n- Points earned\n- Progress bars filled\n- Skills unlocked\n- Peer reactions\n- Performance metrics\n\n**Design Principle:** Feedback should be instant (< 1 second) and visually satisfying. The brain craves immediate confirmation.\n\n**3. Reward (What learners GET)**\n\nTangible recognition of their effort:\n- Badges and achievements\n- Unlocked content\n- Social recognition\n- Leaderboard advancement\n- Customization options\n\n**Design Principle:** Vary the rewards. Predictable rewards lose their power quickly.\n\n**4. Progression (What learners UNLOCK)**\n\nVisible advancement toward meaningful goals:\n- Level increases\n- New challenges\n- Advanced tools\n- Mentor status\n- Course completion\n\n**Design Principle:** Progression should feel earned, not given. Easy wins early, meaningful challenges later.\n\n**5. New Challenge (What's NEXT)**\n\nSlightly harder tasks that build on previous success:\n- More complex problems\n- Leadership opportunities\n- Creative projects\n- Teaching others\n- Real-world application\n\n**Design Principle:** Follow the 'Goldilocks Zone'—not too easy (boring), not too hard (frustrating), but just right (engaging)."
                },
                {
                    type: "text",
                    title: "The Flow Channel: Finding the Sweet Spot",
                    content: "Psychologist Mihaly Csikszentmihalyi discovered that optimal learning happens in the **Flow Channel**—the sweet spot between boredom and anxiety where challenge perfectly matches skill level.\n\n**The Flow States:**\n\n**Flow (Optimal Experience)**\n- Challenge = Skill Level\n- Time seems to disappear\n- Effortless concentration\n- Intrinsic motivation peaks\n- Learning accelerates\n\n**Anxiety (Too Hard)**\n- Challenge > Skill Level\n- Stress and frustration\n- Cognitive overload\n- Avoidance behaviors\n- Learning shuts down\n\n**Boredom (Too Easy)**\n- Challenge < Skill Level\n- Disengagement\n- Mind wandering\n- Seeking distractions\n- No growth\n\n**Arousal (Slightly Hard)**\n- Challenge slightly > Skill\n- Focused attention\n- Manageable stress\n- Growth mindset activated\n- Skills develop\n\n**Control (Slightly Easy)**\n- Skill slightly > Challenge\n- Confidence building\n- Mastery reinforcement\n- Preparation for harder tasks\n- Competence satisfaction"
                },
                {
                    type: "callout",
                    style: "info",
                    title: "Design Insight",
                    content: "Great gamified learning systems dynamically adjust difficulty. When learners master a skill, the system should automatically increase challenge. When they struggle, it should provide scaffolding and support."
                },
                {
                    type: "text",
                    title: "Building Your Core Loop",
                    content: "**Step 1: Define Your Core Action**\n\nWhat's the ONE thing you want learners to do repeatedly?\n- Be specific (not 'learn' but 'solve coding problems')\n- Make it measurable (can you count it?)\n- Ensure it drives real learning (not just engagement)\n\n**Step 2: Design Immediate Feedback**\n\nHow will learners know they succeeded?\n- Visual indicators (checkmarks, progress bars)\n- Numerical feedback (points, scores)\n- Social feedback (peer reactions, comments)\n- System feedback (unlocks, achievements)\n\n**Step 3: Create Meaningful Rewards**\n\nWhat will learners value?\n- Autonomy rewards (choices, customization)\n- Mastery rewards (skill badges, certifications)\n- Purpose rewards (impact metrics, helping others)\n- Social rewards (recognition, status)\n\n**Step 4: Show Clear Progression**\n\nHow will learners see they're advancing?\n- Skill trees or learning paths\n- Experience points and levels\n- Portfolio building\n- Increasing responsibilities\n\n**Step 5: Escalate Thoughtfully**\n\nHow will challenges grow with learners?\n- Adaptive difficulty algorithms\n- Branching scenarios\n- Peer-to-peer challenges\n- Real-world projects"
                },
                {
                    type: "callout",
                    style: "success",
                    title: "Interactive Challenge",
                    content: "Use the Flow Channel Evaluator below to test different skill/challenge combinations and see how they affect learner experience. Then design a core loop for your own learning context."
                }
            ];

            // Redistribute interactive elements for Module 4
            course.modules[3].lessons[0].interactiveElements = [
                {
                    type: "flowChannelEvaluator",
                    config: {
                        title: "Flow Channel Evaluator",
                        description: "Adjust skill and difficulty levels to see how they affect learner experience. Find the optimal balance for flow state."
                    }
                }
            ];
        }

        // Enhance Module 5: Story Mode - Narrative & Immersion
        if (course.modules[4] && course.modules[4].lessons[0]) {
            console.log("Enhancing Module 5: Story Mode...");

            course.modules[4].lessons[0].content = [
                {
                    type: "text",
                    title: "The Power of Story: From Information to Transformation",
                    content: "Humans are wired for story. Our brains don't just process narratives—they crave them. When you wrap learning in story, you transform abstract concepts into memorable experiences that stick long after the lesson ends."
                },
                {
                    type: "callout",
                    style: "info",
                    title: "The Narrative Advantage",
                    content: "Stories are 22x more memorable than facts alone. When information is embedded in narrative, the brain activates multiple regions simultaneously—language, sensory, motor, and emotional centers—creating rich, interconnected memories."
                },
                {
                    type: "text",
                    title: "The Hero's Journey in Learning",
                    content: "Joseph Campbell's **Hero's Journey** isn't just for movies—it's the perfect framework for learning experiences. Every learner is a hero on a quest for knowledge, facing challenges and growing stronger.\n\n**The Learning Hero's Journey:**\n\n**1. The Ordinary World (Current State)**\n- Learner's existing knowledge\n- Comfort zone\n- Status quo\n\n*Example: 'You're a marketing manager who's heard about data analytics but never used it.'*\n\n**2. The Call to Adventure (Learning Opportunity)**\n- New challenge or opportunity\n- Problem to solve\n- Skill to master\n\n*Example: 'Your CEO asks you to prove ROI on the next campaign using data.'*\n\n**3. Refusal of the Call (Resistance)**\n- Fear of failure\n- Imposter syndrome\n- Comfort with current methods\n\n*Example: 'You think: I'm not a numbers person. I'll just wing it like always.'*\n\n**4. Meeting the Mentor (Guidance)**\n- Teacher, coach, or guide\n- Tools and resources\n- Encouragement and wisdom\n\n*Example: 'Your colleague shows you a simple analytics dashboard and says: You can do this.'*\n\n**5. Crossing the Threshold (Commitment)**\n- Decision to learn\n- First steps taken\n- Point of no return\n\n*Example: 'You sign up for the analytics course and complete the first lesson.'*\n\n**6. Tests and Trials (Learning Challenges)**\n- Practice exercises\n- Skill-building activities\n- Overcoming obstacles\n\n*Example: 'You struggle with pivot tables, make mistakes, but keep practicing.'*\n\n**7. The Ordeal (Major Challenge)**\n- Biggest test\n- Moment of truth\n- Risk of failure\n\n*Example: 'You have to present data insights to the executive team next week.'*\n\n**8. The Reward (Mastery)**\n- Success achieved\n- Skills demonstrated\n- Confidence gained\n\n*Example: 'Your presentation reveals insights that save the company $50K.'*\n\n**9. The Road Back (Application)**\n- Returning to real world\n- Using new skills\n- Sharing knowledge\n\n*Example: 'You become the go-to person for marketing analytics in your company.'*\n\n**10. Return Transformed (New Identity)**\n- Permanent change\n- New capabilities\n- Ready for next adventure\n\n*Example: 'You're no longer just a marketer—you're a data-driven marketing strategist.'*"
                },
                {
                    type: "text",
                    title: "Narrative Techniques for Learning",
                    content: "**Character Development**\n\nLearners need to see themselves in the story:\n- **Relatable Protagonist:** Someone like them facing similar challenges\n- **Clear Motivation:** Why does the character need to learn this?\n- **Growth Arc:** How does the character change through learning?\n- **Authentic Voice:** Dialogue and thoughts that feel real\n\n*Example: Instead of 'Students will learn Python,' try 'Meet Sarah, a biologist who needs to analyze thousands of DNA sequences but doesn't know how to code—yet.'*\n\n**Conflict and Stakes**\n\nWithout conflict, there's no story:\n- **External Conflict:** Challenges in the environment (tight deadlines, limited resources)\n- **Internal Conflict:** Self-doubt, fear, competing priorities\n- **Clear Stakes:** What happens if they don't learn this?\n- **Escalating Tension:** Challenges that build on each other\n\n*Example: 'Sarah has 48 hours to analyze the data before the research deadline. Manual analysis would take weeks. She must learn Python—or her research project fails.'*\n\n**Immersive World-Building**\n\nCreate a believable context:\n- **Authentic Details:** Real workplace scenarios, actual tools, genuine challenges\n- **Consistent Rules:** How does this world work? What are the constraints?\n- **Sensory Details:** What does it look, sound, feel like?\n- **Cultural Context:** Norms, values, and expectations of this environment\n\n*Example: 'The lab is quiet except for the hum of sequencing machines. Sarah stares at spreadsheets with 10,000 rows of genetic data. Her coffee has gone cold. The grant application is due Monday.'*"
                },
                {
                    type: "text",
                    title: "Branching Narratives: Choose Your Own Learning",
                    content: "Interactive narratives put learners in control, supporting their autonomy while maintaining engagement:\n\n**Decision Points**\n- Meaningful choices that affect outcomes\n- No 'wrong' paths, just different learning routes\n- Consequences that teach through experience\n- Opportunities to retry with new knowledge\n\n**Multiple Perspectives**\n- Same scenario from different roles (manager, employee, customer)\n- Different approaches to the same problem\n- Various skill levels and backgrounds\n- Cultural and contextual variations\n\n**Adaptive Storytelling**\n- Story adjusts based on learner choices\n- Difficulty scales with demonstrated competence\n- Personal interests influence narrative direction\n- Previous decisions create unique story paths"
                },
                {
                    type: "text",
                    title: "Emotional Engagement Through Story",
                    content: "**The Neuroscience of Narrative**\n\nWhen we hear stories, our brains release oxytocin (the 'trust hormone') and dopamine (the 'reward chemical'). This neurochemical cocktail makes us more empathetic, focused, and motivated to learn.\n\n**Creating Emotional Connection:**\n\n**Vulnerability and Struggle**\n- Show characters making mistakes\n- Reveal internal doubts and fears\n- Demonstrate that learning is hard for everyone\n- Celebrate small wins along the way\n\n**Triumph and Transformation**\n- Clear before/after contrasts\n- Moments of breakthrough and insight\n- Recognition and celebration of growth\n- Connection to larger purpose and meaning\n\n**Relatability and Authenticity**\n- Real challenges that learners face\n- Genuine emotions and reactions\n- Diverse characters and perspectives\n- Honest portrayal of learning struggles"
                },
                {
                    type: "callout",
                    style: "warning",
                    title: "Avoid These Narrative Pitfalls",
                    content: "• **Perfect Protagonists:** Characters who never struggle aren't relatable\n• **Forced Conflict:** Artificial drama that doesn't serve learning\n• **Preachy Tone:** Let the story teach, don't lecture through characters\n• **Stereotypes:** Avoid clichéd characters and situations\n• **Overly Complex Plots:** Keep the focus on learning, not entertainment"
                },
                {
                    type: "callout",
                    style: "success",
                    title: "Your Turn",
                    content: "Use the AI Narrative Generator below to create a compelling learning story for your context. Input your learning objectives and target audience, and get a complete narrative framework with characters, conflict, and resolution."
                }
            ];

            // Redistribute interactive elements for Module 5
            course.modules[4].lessons[0].interactiveElements = [
                {
                    type: "narrativeGenerator",
                    config: {
                        title: "AI Narrative Generator",
                        description: "Transform your learning objectives into compelling stories. Describe your learning context and get a complete narrative framework with characters, conflict, and resolution.",
                        promptTemplate: "narrative-generator"
                    }
                }
            ];
        }

        // Enhance Module 6: Boss Battle - Ethics & ROI
        if (course.modules[5] && course.modules[5].lessons[0]) {
            console.log("Enhancing Module 6: Boss Battle...");

            course.modules[5].lessons[0].content = [
                {
                    type: "text",
                    title: "The Final Boss: Ethics, ROI, and Sustainable Gamification",
                    content: "You've learned the psychology, mastered the mechanics, and crafted compelling narratives. Now comes the final challenge: building gamification that's both ethical and effective. This is where theory meets reality, and where good intentions can go wrong without careful design."
                },
                {
                    type: "callout",
                    style: "warning",
                    title: "The Gamification Paradox",
                    content: "The same techniques that create engaging learning experiences can also manipulate and exploit. The difference lies not in the mechanics themselves, but in the designer's intent and the learner's agency."
                },
                {
                    type: "text",
                    title: "Dark Patterns: The Shadow Side of Gamification",
                    content: "**Dark patterns** are design techniques that trick users into doing things they didn't intend to do. In gamification, they exploit psychological vulnerabilities for short-term engagement at the cost of long-term trust and learning.\n\n**Common Dark Patterns in Learning:**\n\n**1. Addiction Mechanics**\n- **What it is:** Variable ratio rewards designed to create compulsive behavior\n- **Example:** Random loot boxes for completing lessons\n- **Why it's harmful:** Creates dependency, not genuine learning motivation\n- **Ethical alternative:** Predictable rewards tied to real achievement\n\n**2. Pay-to-Win**\n- **What it is:** Better learning outcomes available only through payment\n- **Example:** Premium badges, exclusive content, or faster progression for paying users\n- **Why it's harmful:** Creates inequality and undermines intrinsic motivation\n- **Ethical alternative:** Equal access to core learning, optional cosmetic upgrades\n\n**3. Forced Social Sharing**\n- **What it is:** Requiring social media posts or peer pressure to progress\n- **Example:** 'Share your achievement to unlock the next level'\n- **Why it's harmful:** Violates privacy and autonomy\n- **Ethical alternative:** Optional sharing with clear value to the learner\n\n**4. Artificial Scarcity**\n- **What it is:** Creating false urgency or limited availability\n- **Example:** 'Only 3 spots left in this course!' (when it's digital)\n- **Why it's harmful:** Manipulates decision-making through fear\n- **Ethical alternative:** Real deadlines with educational purpose\n\n**5. Grinding**\n- **What it is:** Requiring repetitive, low-value tasks to progress\n- **Example:** Completing 100 flashcards to unlock the next module\n- **Why it's harmful:** Wastes time and creates busywork, not learning\n- **Ethical alternative:** Meaningful practice that builds real skills\n\n**6. Shame and Punishment**\n- **What it is:** Using negative emotions to drive behavior\n- **Example:** Public failure notifications, streak-breaking penalties\n- **Why it's harmful:** Undermines psychological safety and growth mindset\n- **Ethical alternative:** Private feedback with growth-oriented messaging"
                },
                {
                    type: "text",
                    title: "Ethical Design Principles",
                    content: "**1. Transparency and Informed Consent**\n\nLearners should understand how the system works:\n- Clear explanation of reward mechanisms\n- Visible progress tracking and data use\n- Easy opt-out from gamified elements\n- No hidden mechanics or surprise changes\n\n**2. Learner Agency and Autonomy**\n\nRespect learners' right to choose:\n- Multiple paths to the same learning outcome\n- Ability to customize or disable game elements\n- No forced social interaction or sharing\n- Respect for different learning preferences\n\n**3. Genuine Value Creation**\n\nEvery game element should serve learning:\n- Rewards tied to real skill development\n- Challenges that build competence\n- Social features that enhance understanding\n- Progress metrics that reflect actual growth\n\n**4. Psychological Safety**\n\nCreate an environment where failure is learning:\n- Private spaces for struggle and mistakes\n- Growth-oriented feedback, not judgment\n- Multiple attempts without penalty\n- Celebration of effort, not just achievement\n\n**5. Inclusive Design**\n\nWork for all learners, not just some:\n- Accessible to different abilities and backgrounds\n- Culturally sensitive content and mechanics\n- Multiple ways to succeed and be recognized\n- Avoid stereotypes in characters and scenarios"
                },
                {
                    type: "text",
                    title: "Measuring Return on Engagement (ROE)",
                    content: "Traditional ROI focuses on financial returns, but in learning, we need **Return on Engagement (ROE)**—measuring whether gamification actually improves learning outcomes.\n\n**Key ROE Metrics:**\n\n**Engagement Metrics (Leading Indicators)**\n- Time spent in learning activities\n- Frequency of return visits\n- Completion rates for modules\n- Voluntary participation in optional activities\n- Peer interaction and collaboration\n\n**Learning Metrics (Outcome Indicators)**\n- Knowledge retention over time\n- Skill application in real contexts\n- Performance improvement on assessments\n- Transfer to new situations\n- Long-term behavior change\n\n**Experience Metrics (Quality Indicators)**\n- Learner satisfaction and enjoyment\n- Perceived value and relevance\n- Confidence and self-efficacy gains\n- Motivation to continue learning\n- Recommendation to others\n\n**Business Metrics (Impact Indicators)**\n- Reduced training time and costs\n- Improved job performance\n- Decreased turnover and increased retention\n- Innovation and problem-solving improvements\n- Customer satisfaction increases"
                },
                {
                    type: "text",
                    title: "Building Sustainable Gamification",
                    content: "**The Novelty Problem**\n\nGamification often suffers from the 'honeymoon effect'—initial excitement that fades as novelty wears off. Sustainable systems evolve with learners.\n\n**Strategies for Long-term Engagement:**\n\n**1. Progressive Complexity**\n- Start simple, add depth over time\n- Unlock new mechanics as learners advance\n- Introduce meta-games and advanced strategies\n- Create mastery paths for different interests\n\n**2. Community and Social Learning**\n- Peer mentoring and teaching opportunities\n- Collaborative challenges and projects\n- Knowledge sharing and discussion forums\n- Recognition for helping others learn\n\n**3. Real-world Connection**\n- Application projects with actual impact\n- Portfolio building and skill demonstration\n- Industry connections and networking\n- Career advancement opportunities\n\n**4. Continuous Evolution**\n- Regular content updates and new challenges\n- Seasonal events and special programs\n- Learner-generated content and challenges\n- Feedback-driven improvements and additions\n\n**5. Intrinsic Motivation Focus**\n- Gradually reduce external rewards\n- Emphasize personal growth and mastery\n- Connect learning to individual goals and values\n- Support self-directed learning paths"
                },
                {
                    type: "callout",
                    style: "success",
                    title: "Final Challenge",
                    content: "Use the tools below to audit your gamification design for dark patterns, then explore the ROE dashboard to see how engagement translates to real learning outcomes. Finally, generate your certificate as a Gamification Designer!"
                }
            ];

            // Redistribute interactive elements for Module 6
            course.modules[5].lessons[0].interactiveElements = [
                {
                    type: "darkPatternRedesigner",
                    config: {
                        title: "Dark Pattern Redesigner",
                        description: "Identify and redesign problematic gamification mechanics. Input a potentially manipulative design and get ethical alternatives that maintain engagement while respecting learners.",
                        promptTemplate: "dark-pattern-redesigner"
                    }
                },
                {
                    type: "roeDashboard",
                    config: {
                        title: "Return on Engagement Dashboard",
                        description: "Explore how different gamification strategies impact learning outcomes. See real metrics on engagement, retention, and skill development."
                    }
                },
                {
                    type: "certificateGenerator",
                    config: {
                        title: "Gamification Designer Certificate",
                        description: "Congratulations! You've completed the journey from passive to active learning design. Generate your official certificate as a Gamification Designer."
                    }
                }
            ];
        }

        await course.save();
        console.log("✅ Modules 4, 5, and 6 enhanced successfully!");
        console.log("📊 Module 4: Core Loop & Flow Channel - 1 interactive element");
        console.log("📖 Module 5: Narrative & Immersion - 1 interactive element");
        console.log("🏆 Module 6: Ethics & ROI - 3 interactive elements");
        console.log("🎯 Total interactive elements redistributed: 5");
        
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error enhancing modules 4, 5, and 6:", error);
        process.exit(1);
    }
}

enhanceModules456();