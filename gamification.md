That's an excellent product vision for a technical course on Gamification in Learning. As the Technical Curriculum Architect, I'll translate this into a comprehensive **Product Requirement Document (PRD)**, focusing on how we will leverage your existing **Golden Stack** (React 19, Node.js/Express, MongoDB, Inflection AI, AWS S3) to build the interactive features you've outlined.

The core principle will be the **"Simulation" Mindset** for instantaneous, engaging feedback, and a **Reusable AI Service Pattern** for all generative features.

## 🚀 Product Requirement Document: Gamification for Engagement

-----

### **1. 🎯 Executive Summary**

This course, "**Gamification for Engagement,**" is designed to teach instructional designers and corporate trainers the principles of game design to transform passive content into active learning experiences. The implementation plan leverages the existing stack by creating high-impact, client-side simulations (e.g., Reward Schedule Designer, Flow Channel Calculator) and a unified AI-powered **Game Master** service using the Inflection AI API for features like the "Mechanic Mashup" pitch analysis.

### **2. 👥 Target Audience & Key Outcomes**

| Audience | Key Outcome | Core Interactive Feature |
| :--- | :--- | :--- |
| **Instructional Designers** | Design a balanced core loop to sustain engagement. | Flow Channel Evaluator (Simulation) |
| **Corporate Trainers** | Map game mechanics to specific behavioral outcomes. | Reward Schedule Designer (Simulation) |
| **L\&D Managers** | Measure and report on Return on Engagement (ROE). | ROE/ROI Dashboard (Data Visualization) |

### **3. 🧱 Technical & Structural Requirements**

The course will strictly adhere to the existing **Golden Stack** and the mandatory **11-Step Structural Framework** for implementation.

  * **Non-Negotiable Tech Stack:** React 19, Node.js/Express, MongoDB (Mongoose), Inflection AI (Pi-3.1), AWS S3, Recharts, React Flow, pdf-lib.
  * **Core Architectural Pattern:** Single `POST /api/ai/game-master` endpoint, driven by feature-specific **System Prompts** (e.g., `mechanic-analyst`, `narrative-critique`).

-----

### **4. 🛠️ Module-by-Module Feature Breakdown**

| Module | Core Learning Concept | Interactive Features (Minimum 3) | Tech Implementation Strategy |
| :--- | :--- | :--- | :--- |
| **Module 1: Foundations** | Gamification vs. GBL | **Easter Egg Hunt Tracker**, Differentiator Quiz, Terminology Builder | Client-Side State, Basic Form, Quiz Engine |
| **Module 2: Psychology** | Self-Determination Theory (SDT) | **Player Type Analyzer (Simulation)**, Intrinsic vs. Extrinsic Sorter, **Avatar Creation Station** | Client-Side JS Scoring Logic (Quiz-like), Component State |
| **Module 3: Toolbox** | Mechanics, Dynamics, Aesthetics | **Reward Schedule Designer (Simulation)**, **Mechanic Mashup Pitch (AI)**, PBL Balancing Simulator | Simulation (Math), AI Generator Service, Client-Side Math |
| **Module 4: The Loop** | Core Loop & Flow Channel | **Flow Channel Evaluator (Simulation)**, Core Loop Diagrammer, Level Up Logic (Form) | Client-Side Charting (Recharts), React Flow (Diagram), Form Submission |
| **Module 5: Story Mode** | Narrative & Immersion | **Narrative Wrapper Generator (AI)**, Inciting Incident Grader, Branching Scenario Builder | AI Generator Service, Client-Side Rule Engine |
| **Module 6: Boss Battle** | Ethics & ROI | **Dark Pattern Redesigner (AI)**, ROE/ROI Dashboard, **Boss Battle Pitch Submission (S3)** | AI Generator Service, Mock Data/Recharts, S3 File Upload |

-----

### **5. 11-Step Implementation Guide for Developers**

The following steps provide the technical blueprint for the development team.

#### **Step 1: Project Setup: Environment Variables**

We must ensure the environment is configured for the AI and storage services.

**File:** `.env.local`

```bash
# General
NODE_ENV=development
PORT=3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/gamification_db
JWT_SECRET=your_jwt_secret_here

# Inflection AI
INFLECTION_AI_API_KEY=your_inflection_api_key
INFLECTION_AI_API_URL=https://api.inflection.ai/v1/generate

# AWS S3 for Video/Asset/Pitch Uploads
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=gamification-course-uploads
```

```bash
git add .env.local
git commit -m "feat(infra): add Inflection AI and AWS S3 environment variables"
```

#### **Step 2: Schema Extension: MongoDB Mongoose Model**

The existing `Course` model must be extended to support the new gamification-specific interactive elements, replacing generic names with domain-specific ones like `playerTypeSimulator` and `rewardSchedule`.

**File:** `server/src/models/Course.ts`

```typescript
// Imports...
import { Schema, model, Document } from 'mongoose';

// Define specific types for the Gamification course's interactive elements
export type InteractiveElementType = 
  | 'reflection' // Existing
  | 'playerTypeSimulator' // New: Module 2 - Player Type Analyzer
  | 'rewardScheduleDesigner' // New: Module 3 - Reward Schedule Designer
  | 'flowChannelEvaluator' // New: Module 4 - Flow Channel Evaluator
  | 'pitchAnalysisGenerator'; // New: AI-powered pitch analysis

interface IInteractiveElement {
  type: InteractiveElementType;
  promptTemplate?: string; // For AI features
  config?: any; // e.g., Bartle types for the simulator
}

interface IContentBlock {
  type: string;
  content: string;
  // ... other content properties
}

export interface ILesson extends Document {
  title: string;
  duration: string;
  content: IContentBlock[];
  interactiveElements: IInteractiveElement[]; // EXTENDED
  quiz: { questions: any[] };
}

// ... rest of the Course, Module, and Lesson Schemas (unchanged)

// Update Lesson Schema usage to include new type
const LessonSchema = new Schema<ILesson>({
  // ... other fields
  interactiveElements: [{
    type: { type: String, enum: ['reflection', 'playerTypeSimulator', 'rewardScheduleDesigner', 'flowChannelEvaluator', 'pitchAnalysisGenerator'], required: true },
    promptTemplate: String,
    config: Schema.Types.Mixed,
  }],
  // ...
});

export const Lesson = model<ILesson>('Lesson', LessonSchema);
// Export other models
```

```bash
git add server/src/models/Course.ts
git commit -m "feat(schema): extend Lesson model for gamification-specific interactive elements"
```

#### **Step 3: AI Route Creation: Unified Express Route**

All AI features will be routed through a single, robust Express endpoint, minimizing backend boilerplate.

**File:** `server/src/routes/ai.ts`

```typescript
import { Router, Request, Response } from 'express';
import { generateAIGameMasterResponse } from '../services/aiService'; // Step 5
import { authMiddleware } from '../middleware/authMiddleware'; // Assuming auth middleware exists

const router = Router();

// POST /api/ai/game-master
router.post('/game-master', authMiddleware, async (req: Request, res: Response) => {
  const { generatorType, userInput, context } = req.body;

  if (!generatorType || !userInput) {
    return res.status(400).json({ message: 'Missing generatorType or userInput' });
  }

  try {
    const aiResponse = await generateAIGameMasterResponse(generatorType, userInput, context);
    // Stream response back to client (simulated here for brevity)
    res.json({ result: aiResponse });
  } catch (error) {
    console.error('AI Game Master Error:', error);
    res.status(500).json({ message: 'Failed to get AI response.' });
  }
});

export default router;

// In server/src/app.ts:
// app.use('/api/ai', aiRouter); 
```

```bash
git add server/src/routes/ai.ts
git commit -m "feat(api): create unified POST /api/ai/game-master endpoint"
```

#### **Step 4: Prompt Engineering: Game Master Prompts**

A configuration file will store all system prompts, defining the persona for the Inflection AI.

**File:** `server/src/config/aiPrompts.ts`

```typescript
// Define the persona for our AI assistant
const GAME_MASTER_PERSONA = 'You are the Game Master, a senior gamification consultant and design expert. Your tone is instructional, encouraging, and highly specific to game design principles (MDA, SDT). Always respond in clear, structured Markdown.';

export const AIPrompts = {
  // Module 3: Mechanic Mashup Pitch Analysis
  'mechanic-analyst': `${GAME_MASTER_PERSONA} Your task is to critique a learner's gamification pitch. The pitch includes a Content Topic, a Player Type, and a Constraint. Evaluate its balance, its alignment with the Player Type (Bartle/Marczewski), and the feasibility of the chosen mechanics (PBL, scarcity, chance). Respond with sections: 'Critique Score (1-10)', 'Alignment Feedback', 'Feasibility Check', and 'Next Level Suggestion'.`,
  
  // Module 5: Narrative Wrapper Generator
  'narrative-generator': `${GAME_MASTER_PERSONA} You are generating a compelling narrative wrapper for a dry topic. The user will provide the 'Dry Topic' and 'Desired Theme' (e.g., Cyberpunk, Medieval Quest). Your response must include: 'Core Metaphor', 'Inciting Incident (Hook)', and 'Learner's Hero Role'.`,

  // Module 6: Dark Pattern Redesigner
  'dark-pattern-redesigner': `${GAME_MASTER_PERSONA} You are an ethical design consultant. The user will input a 'Dark Pattern' (e.g., 'forcing a share to get points'). You must analyze the manipulative element and redesign it into an ethical, user-centric mechanic. Your response must have: 'Original Mechanic', 'Ethical Flaw', and 'Redesigned Mechanic (Ethical Equivalent)'.`,
  
  // Additional utility prompts
  'core-loop-critique': `${GAME_MASTER_PERSONA} You are reviewing a Core Loop (Action -> Feedback -> Reward). Critique its friction points and reward value.`,
  'roe-measurement-advisor': `${GAME_MASTER_PERSONA} Advise on the best metrics for Return on Engagement (ROE) for a given training module.`,
};

export type AIGeneratorType = keyof typeof AIPrompts;
```

```bash
git add server/src/config/aiPrompts.ts
git commit -m "feat(ai): define Game Master persona and system prompts for 5 features"
```

#### **Step 5: AI Service Layer: Inflection API Integration**

This service handles the logic of selecting the correct prompt, formatting the request, and calling the Inflection AI API.

**File:** `server/src/services/aiService.ts`

```typescript
import axios from 'axios';
import { AIPrompts, AIGeneratorType } from '../config/aiPrompts';

const INFLECTION_API_URL = process.env.INFLECTION_AI_API_URL || '';
const INFLECTION_API_KEY = process.env.INFLECTION_AI_API_KEY;

// Use the Inflection API format (context array with {text, type})
interface InflectionContext {
  text: string;
  type: 'Human' | 'AI' | 'System';
}

export async function generateAIGameMasterResponse(generatorType: AIGeneratorType, userInput: string, context: InflectionContext[] = []): Promise<string> {
  const systemPrompt = AIPrompts[generatorType];

  if (!systemPrompt) {
    throw new Error(`Invalid generatorType: ${generatorType}`);
  }

  const payload = {
    model: 'Pi-3.1', // The required model
    context: [
      { text: systemPrompt, type: 'System' }, // System prompt sets the persona
      ...context, // Previous conversation history (if applicable)
      { text: userInput, type: 'Human' } // Current user input
    ],
  };

  try {
    const response = await axios.post(INFLECTION_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${INFLECTION_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Extract the AI's response text based on the Inflection API structure
    const aiText = response.data.completion.text || response.data.text; 
    return aiText;
  } catch (error) {
    console.error('Inflection API Call Failed:', error.response?.data || error.message);
    throw new Error('AI Service is currently unavailable.');
  }
}
```

```bash
git add server/src/services/aiService.ts
git commit -m "feat(ai-service): implement Inflection API call with prompt template selection"
```

#### **Step 6: Reusable AI Component (Frontend)**

A single, reusable React component will handle all the AI-powered features, driven by the `generatorType` prop.

**File:** `src/components/interactive/AIGameMasterGenerator.tsx`

```typescript
import React, { useState } from 'react';
import axios from 'axios';
import { AIGeneratorType } from '../../../../server/src/config/aiPrompts'; // Import the type
// import { Button, Textarea, Spinner, CodeBlock } from '@radix-ui/themes'; // Assuming Radix UI components
import { toast } from 'sonner'; // Assuming Sonner for notifications

interface AIGameMasterGeneratorProps {
  generatorType: AIGeneratorType;
  title: string;
  description: string;
}

const AIGameMasterGenerator: React.FC<AIGameMasterGeneratorProps> = ({ generatorType, title, description }) => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const MAX_CHAR_LIMIT = 5000;

  const handleSubmit = async () => {
    if (userInput.length === 0 || userInput.length > MAX_CHAR_LIMIT) {
      toast.error(`Input must be between 1 and ${MAX_CHAR_LIMIT} characters.`);
      return;
    }

    setLoading(true);
    setAiResponse('');

    try {
      const response = await axios.post('/api/ai/game-master', {
        generatorType,
        userInput,
      });
      setAiResponse(response.data.result);
      toast.success(`${title} analysis complete!`);
    } catch (error) {
      toast.error('AI Game Master is offline. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
      <h3 className="text-xl font-bold mb-2 text-indigo-700">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder={`Enter your text here... (e.g., your pitch, dry topic, or dark pattern)`}
        rows={6}
        maxLength={MAX_CHAR_LIMIT}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex justify-between items-center mt-2">
        <span className={`text-sm ${userInput.length > MAX_CHAR_LIMIT * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
          {userInput.length}/{MAX_CHAR_LIMIT} characters
        </span>
        <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300">
          {loading ? `Analyzing...` : `Submit to Game Master`}
        </button>
      </div>

      {aiResponse && (
        <div className="mt-4 p-4 border-l-4 border-green-500 bg-green-50">
          <h4 className="font-semibold text-green-700">Game Master's Feedback:</h4>
          {/* Render Markdown using a library like 'react-markdown' or just render raw for simplicity */}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: aiResponse }} />
        </div>
      )}
    </div>
  );
};

export default AIGameMasterGenerator;
```

```bash
git add src/components/interactive/AIGameMasterGenerator.tsx
git commit -m "feat(frontend): create reusable AIGameMasterGenerator component"
```

#### **Step 7: Simulation-Based Components (Client-Side)**

These components provide instant feedback without backend calls, fulfilling the "Simulation" Mindset principle.

**1. Player Type Analyzer (Module 2)**
**File:** `src/components/interactive/PlayerTypeAnalyzer.tsx`

```typescript
// Based on a simplified Bartle/Marczewski-like assessment
import React, { useState } from 'react';
// import { Card, RadioGroup, Heading, Alert } from '@radix-ui/themes'; 

const questions = [
  { id: 1, text: "I prefer to explore hidden content than chat.", type: 'Explorer' },
  { id: 2, text: "The primary goal is to be at the top of the leaderboard.", type: 'Achiever' },
  { id: 3, text: "I enjoy helping new players learn the rules.", type: 'Socializer' },
];

const PlayerTypeAnalyzer: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<string | null>(null);

  const calculateResult = () => {
    const scores: Record<string, number> = { Achiever: 0, Explorer: 0, Socializer: 0, Disruptor: 0 };
    Object.entries(answers).forEach(([qId, answer]) => {
      if (answer === 'stronglyAgree') {
        const type = questions.find(q => q.id === parseInt(qId))?.type || 'Disruptor';
        scores[type] += 2;
      }
      // Add more scoring logic for other answers...
    });
    
    // Simple logic: Find the highest score
    const winningType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b, 'Achiever');
    setResult(`Your dominant Player Type is: **${winningType}**! This means you are primarily motivated by **${winningType}** mechanics.`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Player Type Analyzer</h3>
      {questions.map((q) => (
        <div key={q.id} className="p-3 border rounded-md">
          <p className="font-medium mb-2">{q.text}</p>
          {/* ... RadioGroup UI for stronglyAgree, agree, neutral etc. (omitted for brevity) */}
          <select onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})} className="border p-2 rounded">
            <option value="">Select...</option>
            <option value="stronglyAgree">Strongly Agree</option>
            {/* ... other options */}
          </select>
        </div>
      ))}
      <button onClick={calculateResult} className="bg-green-600 text-white p-2 rounded">Analyze My Type</button>
      {result && <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500" dangerouslySetInnerHTML={{ __html: result }} />}
    </div>
  );
};
export default PlayerTypeAnalyzer;
```

**2. Reward Schedule Designer (Module 3)**
**File:** `src/components/interactive/RewardScheduleDesigner.tsx`

```typescript
// Client-side math to visualize variable vs. fixed reward impact
import React, { useState } from 'react';
// ... UI imports

const RewardScheduleDesigner: React.FC = () => {
  const [attempts, setAttempts] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [schedule, setSchedule] = useState('variable'); // or 'fixed'
  const [nextFixedReward, setNextFixedReward] = useState(3);

  const handleAttempt = () => {
    setAttempts(a => a + 1);
    if (schedule === 'fixed') {
      if (attempts + 1 === nextFixedReward) {
        setRewards(r => r + 1);
        setNextFixedReward(a => a + 3); // Reward every 3rd attempt
      }
    } else { // Variable Ratio
      if (Math.random() < 0.33) { // 33% chance of reward
        setRewards(r => r + 1);
      }
    }
  };

  return (
    <div className="p-4 border">
      <h3 className="text-xl font-bold">Reward Schedule Designer</h3>
      <p>Simulate the impact of fixed vs. variable ratio schedules.</p>
      <div className="flex space-x-4 my-3">
        <label><input type="radio" name="schedule" value="fixed" checked={schedule === 'fixed'} onChange={() => setSchedule('fixed')} /> Fixed Ratio (Every 3)</label>
        <label><input type="radio" name="schedule" value="variable" checked={schedule === 'variable'} onChange={() => setSchedule('variable')} /> Variable Ratio (33% Chance)</label>
      </div>
      <button onClick={handleAttempt} className="bg-blue-600 text-white p-2 rounded">Make an Effort (Attempt)</button>
      <div className="mt-4">
        <p>Total Attempts: <span className="font-bold">{attempts}</span></p>
        <p>Total Rewards: <span className="font-bold text-green-600">{rewards}</span></p>
        {schedule === 'fixed' && <p>Next Fixed Reward on Attempt: <span className="font-bold">{nextFixedReward}</span></p>}
      </div>
      <p className="mt-3 text-sm text-gray-600">The variable ratio demonstrates higher, more sustained engagement (addiction).</p>
    </div>
  );
};
export default RewardScheduleDesigner;
```

**3. Flow Channel Evaluator (Module 4)**
**File:** `src/components/interactive/FlowChannelEvaluator.tsx`

```typescript
// Simple simulation to map Difficulty (x) vs. Skill (y) onto the Flow Channel
import React, { useState } from 'react';
// ... UI imports

const FlowChannelEvaluator: React.FC = () => {
  const [skill, setSkill] = useState(5); // 1-10
  const [difficulty, setDifficulty] = useState(7); // 1-10

  const getFlowState = (s: number, d: number): { state: string, color: string } => {
    const delta = d - s;
    if (delta > 2) return { state: 'Anxiety (Frustration)', color: 'red-500' };
    if (delta < -2) return { state: 'Boredom (Passive)', color: 'blue-500' };
    if (Math.abs(delta) <= 1) return { state: 'Flow Channel (Optimal)', color: 'green-500' };
    return { state: 'Arousal/Control', color: 'yellow-500' };
  };

  const { state, color } = getFlowState(skill, difficulty);

  return (
    <div className="p-4 border">
      <h3 className="text-xl font-bold">Flow Channel Evaluator</h3>
      <p>Find the balance between Learner Skill and Content Difficulty.</p>
      
      <label className="block mt-4">Learner Skill (1-10): {skill}</label>
      <input type="range" min="1" max="10" value={skill} onChange={(e) => setSkill(parseInt(e.target.value))} className="w-full" />
      
      <label className="block mt-4">Content Difficulty (1-10): {difficulty}</label>
      <input type="range" min="1" max="10" value={difficulty} onChange={(e) => setDifficulty(parseInt(e.target.value))} className="w-full" />

      <div className={`mt-4 p-3 bg-white border-l-4 border-${color}`}>
        <p className="font-bold">Current Learning State:</p>
        <p className={`text-${color} font-extrabold text-lg`}>{state}</p>
      </div>
    </div>
  );
};
export default FlowChannelEvaluator;
```

```bash
git add src/components/interactive/PlayerTypeAnalyzer.tsx src/components/interactive/RewardScheduleDesigner.tsx src/components/interactive/FlowChannelEvaluator.tsx
git commit -m "feat(simulation): implement 3 core client-side gamification simulators"
```

#### **Step 8: Data Dashboard: ROE/ROI Visualization**

We will create a mock backend endpoint for simulated school data and a frontend component using **Recharts** for visualization.

**Mock Data Endpoint**
**File:** `server/src/routes/simulations.ts`

```typescript
import { Router, Request, Response } from 'express';

const router = Router();

// Simulated data for Return on Engagement (ROE) dashboard
const simulatedRoeData = [
  { month: 'Jan', enrollments: 120, completions: 85, aiRequests: 500, timeSpent: 1250 },
  { month: 'Feb', enrollments: 150, completions: 100, aiRequests: 620, timeSpent: 1550 },
  { month: 'Mar', enrollments: 145, completions: 110, aiRequests: 700, timeSpent: 1600 },
  { month: 'Apr', enrollments: 160, completions: 130, aiRequests: 800, timeSpent: 1800 },
];

// GET /api/simulations/roe-data
router.get('/roe-data', (req: Request, res: Response) => {
  // In a real app, this would query MongoDB for real analytics data (Step 11 requirement)
  res.json(simulatedRoeData);
});

export default router;
// In server/src/app.ts: app.use('/api/simulations', simulationsRouter);
```

**Frontend Dashboard Component**
**File:** `src/components/interactive/ROEDashboard.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
// ... UI imports

interface ROEData {
  month: string;
  enrollments: number;
  completions: number;
  aiRequests: number;
  timeSpent: number;
}

const ROEDashboard: React.FC = () => {
  const [data, setData] = useState<ROEData[]>([]);

  useEffect(() => {
    axios.get('/api/simulations/roe-data')
      .then(res => setData(res.data))
      .catch(err => console.error('Failed to fetch ROE data', err));
  }, []);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-purple-700">Gamification ROE Dashboard (Simulated)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completions" name="Course Completions" fill="#8884d8" />
          <Bar dataKey="aiRequests" name="AI Interactions" fill="#82ca9d" />
          <Bar dataKey="timeSpent" name="Total Time Spent (min)" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-sm text-gray-600">Gamification leads to higher completion rates (ROE) and time on task, as seen in the steady monthly increase.</p>
    </div>
  );
};

export default ROEDashboard;
```

```bash
git add server/src/routes/simulations.ts src/components/interactive/ROEDashboard.tsx
git commit -m "feat(dashboard): add mock ROE data endpoint and Recharts dashboard component"
```

#### **Step 9: Summary Features: Interactive Concept Map**

Module 5/6 includes a summary component. We'll use **React Flow** to create an interactive Concept Map of the key Gamification terms.

**File:** `src/components/interactive/GamificationConceptMap.tsx`

```typescript
import React, { useCallback } from 'react';
import ReactFlow, { MiniMap, Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

// Hardcoded nodes and edges for the Gamification Concept Map
const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Gamification' }, position: { x: 250, y: 0 } },
  { id: '2', data: { label: 'Psychology (SDT)' }, position: { x: 150, y: 100 } },
  { id: '3', data: { label: 'Design (MDA)' }, position: { x: 350, y: 100 } },
  { id: '4', data: { label: 'Core Loop' }, position: { x: 350, y: 200 } },
  { id: '5', data: { label: 'Player Types' }, position: { x: 150, y: 200 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', label: 'Driven by' },
  { id: 'e1-3', source: '1', target: '3', label: 'Built using' },
  { id: 'e2-5', source: '2', target: '5', label: 'Defines' },
  { id: 'e3-4', source: '3', target: '4', label: 'Creates' },
];

const GamificationConceptMap: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #ddd' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default GamificationConceptMap;
```

```bash
git add src/components/interactive/GamificationConceptMap.tsx
git commit -m "feat(summary): implement ReactFlow Gamification Concept Map"
```

#### **Step 10: Certificate Generator: `pdf-lib` Implementation**

The certificate component will use **pdf-lib** to generate the final certificate client-side upon course completion.

**File:** `src/components/interactive/CertificateGenerator.tsx`

```typescript
import React from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
// import { Button } from '@radix-ui/themes';
import { toast } from 'sonner';

interface CertificateGeneratorProps {
  userName: string;
  courseTitle: string;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ userName, courseTitle }) => {
  const generatePdf = async () => {
    if (!userName) {
      toast.error('User name is required to generate the certificate.');
      return;
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([800, 600]); // Landscape page
    const { width, height } = page.getSize();
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // --- Certificate Design ---
    page.drawText('CERTIFICATE OF MASTERY', {
      x: 170,
      y: height - 100,
      size: 40,
      color: rgb(0.1, 0.1, 0.5),
    });

    page.drawText('This certifies that', {
      x: 310,
      y: height - 160,
      size: 18,
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText(userName.toUpperCase(), {
      x: width / 2 - (userName.length * 8), // Basic centering
      y: height - 210,
      size: 36,
      color: rgb(0, 0, 0),
    });

    page.drawText(`has successfully completed the comprehensive course:`, {
      x: 200,
      y: height - 250,
      size: 18,
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText(`"${courseTitle.toUpperCase()}"`, {
      x: 180,
      y: height - 300,
      size: 30,
      color: rgb(0.5, 0.1, 0.1),
    });

    page.drawText(`Awarded on: ${date}`, {
      x: 500,
      y: height - 400,
      size: 18,
    });
    // --- End Design ---

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Auto-download the PDF
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificate-${userName.replace(/\s/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 border border-green-500 bg-green-50 rounded-lg text-center">
      <h3 className="text-2xl font-bold text-green-700">Congratulations, Game Master!</h3>
      <p className="mt-2 mb-4">You have earned your Certificate of Mastery.</p>
      <button onClick={generatePdf} className="px-6 py-3 bg-green-600 text-white text-lg rounded-full shadow-md hover:bg-green-700">
        Download Certificate
      </button>
    </div>
  );
};

export default CertificateGenerator;
```

```bash
git add src/components/interactive/CertificateGenerator.tsx
git commit -m "feat(certificate): implement client-side pdf-lib certificate generation"
```

#### **Step 11: Module Renderer Integration: Updating the Router**

Finally, we need to integrate all the new components into the main lesson rendering logic (`InteractiveElementRouter`) to ensure they are rendered when the corresponding type is pulled from MongoDB.

**File:** `src/components/layout/InteractiveElementRouter.tsx`

```typescript
import React from 'react';
import AIGameMasterGenerator from '../interactive/AIGameMasterGenerator';
import PlayerTypeAnalyzer from '../interactive/PlayerTypeAnalyzer';
import RewardScheduleDesigner from '../interactive/RewardScheduleDesigner';
import FlowChannelEvaluator from '../interactive/FlowChannelEvaluator';
import ROEDashboard from '../interactive/ROEDashboard';
// ... other simulation/quiz imports

interface InteractiveElement {
  type: string;
  config: any; // Mongoose mixed type config
}

interface InteractiveElementRouterProps {
  element: InteractiveElement;
  // ... other props like lessonId, userName
}

const InteractiveElementRouter: React.FC<InteractiveElementRouterProps> = ({ element, userName }) => {
  switch (element.type) {
    case 'reflection':
      // return <ReflectionComponent {...element.config} />;
      return <div>Reflection (Existing)</div>; 
    
    // Module 2
    case 'playerTypeSimulator':
      return <PlayerTypeAnalyzer />; 

    // Module 3
    case 'rewardScheduleDesigner':
      return <RewardScheduleDesigner />;

    // Module 4
    case 'flowChannelEvaluator':
      return <FlowChannelEvaluator />;

    // AI-Powered Features (Module 3, 5, 6)
    case 'pitchAnalysisGenerator': // Module 3
      return <AIGameMasterGenerator 
        generatorType="mechanic-analyst" 
        title="Mechanic Mashup Pitch Analyzer" 
        description="Paste your 90-second pitch script to receive Game Master feedback."
      />;
    case 'narrativeGenerator': // Module 5
      return <AIGameMasterGenerator 
        generatorType="narrative-generator" 
        title="Narrative Wrapper Generator" 
        description="Enter a dry topic and a desired theme for an AI narrative hook."
      />;
    case 'darkPatternRedesigner': // Module 6
      return <AIGameMasterGenerator 
        generatorType="dark-pattern-redesigner" 
        title="Ethical Redesign Consultant" 
        description="Input a manipulative mechanic for an ethical redesign."
      />;

    case 'roeDashboard': // Module 6
        return <ROEDashboard />;
        
    case 'certificateGenerator': // Module 6
        return <CertificateGenerator userName={userName} courseTitle="Gamification for Engagement" />;


    default:
      return <div className="p-4 bg-red-100 text-red-800">Error: Unknown interactive element type: {element.type}</div>;
  }
};

export default InteractiveElementRouter;

// The main course renderer (e.g., ModuleContent.tsx) would call this component to render the appropriate activity:
// lesson.interactiveElements.map((el, i) => <InteractiveElementRouter key={i} element={el} userName={currentUser.name} />)
```

```bash
git add src/components/layout/InteractiveElementRouter.tsx
git commit -m "feat(router): integrate all new interactive and AI components into the main renderer"
```