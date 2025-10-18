import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';

dotenv.config();

const newModule1 = {
  title: "Module 1: How AI Thinks",
  description: "Explore the fundamentals of how AI processes information and makes decisions",
  order: 1,
  lessons: [
    {
      title: "Lesson 1.1: Understanding Tokens",
      description: "Learn how AI breaks down text",
      duration: 15,
      order: 1,
      objective: "Learn how AI breaks down and processes text into tokens",
      content: {
        sections: [
          {
            type: "text",
            title: "What Are Tokens?",
            content: "When you type a sentence, AI doesn't see words the way you do. Instead, it breaks text into smaller pieces called 'tokens'. Think of tokens as the building blocks of language that AI can understand and process."
          },
          {
            type: "text",
            title: "Why Tokens Matter",
            content: "Understanding tokenization helps you:\n• Write more effective prompts for AI\n• Understand AI limitations (token limits)\n• Predict how AI will interpret your text\n• Optimize your AI interactions"
          }
        ]
      },
      interactiveElements: [
        {
          type: "visualTokens",
          title: "Visual Tokens: See How AI Reads Text",
          description: "Type a sentence to see how AI breaks it into tokens"
        }
      ]
    },
    {
      title: "Lesson 1.2: Predictive Text and AI",
      description: "Understand AI text generation",
      duration: 15,
      order: 2,
      objective: "Understand how AI predicts and generates text",
      content: {
        sections: [
          {
            type: "text",
            title: "How AI Predicts",
            content: "AI language models work by predicting the most likely next word based on patterns learned from massive amounts of text. It's like an incredibly sophisticated autocomplete system."
          },
          {
            type: "text",
            title: "The Prediction Process",
            content: "1. AI analyzes the current context (previous words)\n2. Calculates probability for thousands of possible next words\n3. Selects the most likely option (or samples from top options)\n4. Repeats the process for each new word"
          }
        ]
      },
      interactiveElements: [
        {
          type: "sentenceBuilder",
          title: "Sentence Builder: AI Predictions",
          description: "Click words to build a sentence and see how AI predicts the next word"
        }
      ]
    },
    {
      title: "Lesson 1.3: AI Personalities",
      description: "Explore AI behavior customization",
      duration: 15,
      order: 3,
      objective: "Explore how AI behavior can be customized through personality traits",
      content: {
        sections: [
          {
            type: "text",
            title: "Customizing AI Behavior",
            content: "AI assistants can be programmed with different 'personalities' by adjusting how they respond. This is done through system prompts that guide the AI's tone, style, and approach."
          },
          {
            type: "text",
            title: "Common Personality Traits",
            content: "• Formal: Professional and structured responses\n• Creative: Imaginative and innovative thinking\n• Socratic: Asks guiding questions instead of giving direct answers\n• Encouraging: Supportive and positive feedback\n• Concise: Brief and to-the-point\n• Detailed: Thorough explanations"
          }
        ]
      },
      interactiveElements: [
        {
          type: "aiGenerator",
          generatorType: "buildABot",
          title: "Build-a-Bot: Create Your AI Assistant",
          description: "Select personality traits and chat with your custom AI"
        }
      ]
    }
  ]
};

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    const result = await Course.updateMany(
      {},
      { $set: { "modules.0": newModule1 } }
    );

    console.log(`Updated ${result.modifiedCount} course(s)`);
    console.log('Migration complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
