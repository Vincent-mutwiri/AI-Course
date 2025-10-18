# Implementation Guide: Building an Interactive "AI in Education" Course

## Overview
This guide provides a step-by-step breakdown for implementing interactive features for Modules 1-6. The approach uses simulation-first thinking to deliver high-quality learning experiences efficiently.

---

## Phase 1: Core Foundation Setup

### Step 1.1: Update MongoDB Schema
**Goal**: Extend the Course model to support new interactive element types.

**Files to modify**:
- `server/src/models/Course.ts`

**Changes**:
```typescript
// Add to ILesson interface
interactiveElements?: Array<{
  type: 'reflection' | 'visualTokens' | 'sentenceBuilder' | 'aiGenerator' | 'simulation' | 'dragAndDropQuiz' | 'buildABot' | 'ethicalSimulator';
  [key: string]: any;
}>;
```

**Commit message**: `feat: extend Course schema for interactive elements`

---

### Step 1.2: Create Simulation Data Files
**Goal**: Create hardcoded JSON data for simulations.

**Files to create**:
- `src/data/simulations/presentationCoach.json`
- `src/data/simulations/schoolData.json`
- `src/data/simulations/sentenceBuilder.json`

**Commit message**: `feat: add simulation data files`

---

### Step 1.3: Create AI Generator Backend Endpoint
**Goal**: Build a single reusable endpoint for all AI-powered features.

**Files to create**:
- `server/src/routes/aiGenerator.ts`
- `server/src/config/aiPrompts.ts`

**Files to modify**:
- `server/src/index.ts` (add route)

**Commit message**: `feat: add AI generator endpoint with prompt templates`

---

### Step 1.4: Create Frontend AI Service
**Goal**: Add frontend service for AI generator calls.

**Files to modify**:
- `src/services/api.ts` (add aiGeneratorAPI)

**Commit message**: `feat: add AI generator service to frontend`

---

## Phase 2: Reusable Components

### Step 2.1: Create AIGeneratorComponent
**Goal**: Build reusable component for all AI-powered interactions.

**Files to create**:
- `src/components/interactive/AIGeneratorComponent.tsx`

**Commit message**: `feat: create reusable AI generator component`

---

### Step 2.2: Create Simulation Components Base
**Goal**: Build base components for client-side simulations.

**Files to create**:
- `src/components/interactive/VisualTokens.tsx`
- `src/components/interactive/SentenceBuilder.tsx`
- `src/components/interactive/PresentationCoach.tsx`

**Commit message**: `feat: add client-side simulation components`

---

### Step 2.3: Create Interactive Element Router
**Goal**: Build a component that routes to the correct interactive element based on type.

**Files to create**:
- `src/components/interactive/InteractiveElementRouter.tsx`

**Commit message**: `feat: add interactive element router component`

---

## Phase 3: Module 1 Implementation

### Step 3.1: Visual Tokens Component
**Goal**: Implement tokenization visualization.

**Implementation**: Already created in Step 2.2
- Pure client-side
- Uses regex to split text
- No backend needed

**Test**: Add to a lesson's interactiveElements array
```json
{
  "type": "visualTokens",
  "title": "See How AI Reads Text",
  "description": "Type a sentence to see how AI breaks it into tokens"
}
```

**Commit message**: `feat: implement visual tokens interactive element`

---

### Step 3.2: Sentence Builder Component
**Goal**: Implement predictive text simulation.

**Implementation**: Already created in Step 2.2
- Uses hardcoded prediction model
- Client-side only
- Simulates AI predictions

**Test**: Add to lesson
```json
{
  "type": "sentenceBuilder",
  "seedWords": ["Artificial", "intelligence", "is"],
  "title": "Build a Sentence with AI"
}
```

**Commit message**: `feat: implement sentence builder interactive element`

---

### Step 3.3: Build-a-Bot Component
**Goal**: Let users create custom AI personalities.

**Files to create**:
- `src/components/interactive/BuildABot.tsx`

**Backend**: Uses AI generator endpoint with `generatorType: "buildABot"`

**Test**: Add to lesson
```json
{
  "type": "aiGenerator",
  "generatorType": "buildABot",
  "title": "Build Your Own AI Assistant"
}
```

**Commit message**: `feat: implement build-a-bot interactive element`

---

## Phase 4: Module 2 Implementation

### Step 4.1: AI Study Buddy
**Goal**: Implement text summarization tool.

**Implementation**: Uses AIGeneratorComponent with `generatorType: "studyBuddy"`

**Test**: Add to lesson
```json
{
  "type": "aiGenerator",
  "generatorType": "studyBuddy",
  "title": "AI Study Buddy",
  "promptTemplate": "Summarize the following text for a high school student: {userInput}"
}
```

**Commit message**: `feat: implement AI study buddy`

---

### Step 4.2: Creative Writing Partner
**Goal**: Implement writing assistance tool.

**Implementation**: Uses AIGeneratorComponent with `generatorType: "writingPartner"`

**Test**: Add to lesson
```json
{
  "type": "aiGenerator",
  "generatorType": "writingPartner",
  "title": "Creative Writing Partner"
}
```

**Commit message**: `feat: implement creative writing partner`

---

### Step 4.3: Code Debugger
**Goal**: Implement code debugging assistant.

**Implementation**: Uses AIGeneratorComponent with `generatorType: "codeDebugger"`

**Test**: Add to lesson
```json
{
  "type": "aiGenerator",
  "generatorType": "codeDebugger",
  "title": "Code Debugger"
}
```

**Commit message**: `feat: implement code debugger`

---

### Step 4.4: Presentation Coach (Simulation)
**Goal**: Analyze presentation scripts client-side.

**Implementation**: Already created in Step 2.2
- Calculates word count, speaking time
- Detects filler words
- Analyzes sentence length
- Pure client-side

**Test**: Add to lesson
```json
{
  "type": "simulation",
  "simulationType": "presentationCoach",
  "title": "Presentation Coach"
}
```

**Commit message**: `feat: implement presentation coach simulation`

---

### Step 4.5: Ethical AI Simulator
**Goal**: Interactive ethical scenarios.

**Implementation**: Extend existing EthicalDilemmaSolver component

**Test**: Add to lesson
```json
{
  "type": "simulation",
  "simulationType": "ethicalSimulator",
  "title": "Ethical AI Scenarios"
}
```

**Commit message**: `feat: integrate ethical AI simulator`

---

## Phase 5: Module 3 & 4 Implementation (Teacher/Admin Tools)

### Step 5.1: Lesson Plan Generator
**Goal**: Generate lesson plans with AI.

**Implementation**: Uses AIGeneratorComponent with `generatorType: "lessonPlanner"`

**Backend**: Add prompt template to `aiPrompts.ts`

**Test**: Add to lesson
```json
{
  "type": "aiGenerator",
  "generatorType": "lessonPlanner",
  "title": "AI Lesson Plan Generator"
}
```

**Commit message**: `feat: implement lesson plan generator`

---

### Step 5.2: Rubric Builder
**Goal**: Generate assessment rubrics.

**Implementation**: Uses AIGeneratorComponent with `generatorType: "rubricBuilder"`

**Commit message**: `feat: implement rubric builder`

---

### Step 5.3: AI Policy Drafter
**Goal**: Generate school AI policies.

**Implementation**: Uses AIGeneratorComponent with `generatorType: "policyDrafter"`

**Commit message**: `feat: implement AI policy drafter`

---

### Step 5.4: Data Insights Dashboard (Simulation)
**Goal**: Display simulated school analytics.

**Files to create**:
- `src/components/interactive/DataDashboard.tsx`
- `server/src/routes/simulations.ts`

**Implementation**:
- Backend returns hardcoded school data
- Frontend uses Recharts for visualization
- "AI Insights" button shows pre-written analysis

**Test**: Add to lesson
```json
{
  "type": "simulation",
  "simulationType": "dataDashboard",
  "title": "School Data Insights"
}
```

**Commit message**: `feat: implement data insights dashboard simulation`

---

## Phase 6: Module 5 & 6 Implementation (Summary & Assessment)

### Step 6.1: AI Journey Timeline
**Goal**: Visualize user's course progress.

**Files to create**:
- `src/components/interactive/AIJourney.tsx`

**Implementation**:
- Fetches from existing `/api/progress` endpoint
- Displays as visual timeline

**Commit message**: `feat: implement AI journey timeline`

---

### Step 6.2: Interactive Concept Map
**Goal**: Visual knowledge map.

**Files to create**:
- `src/components/interactive/ConceptMap.tsx`
- `src/data/conceptMap.json`

**Dependencies**: Install `reactflow`
```bash
npm install reactflow
```

**Commit message**: `feat: implement interactive concept map`

---

### Step 6.3: Certificate Generator
**Goal**: Generate completion certificates.

**Files to create**:
- `src/components/interactive/CertificateGenerator.tsx`

**Dependencies**: Install `jspdf`
```bash
npm install jspdf
```

**Implementation**: Client-side PDF generation

**Commit message**: `feat: implement certificate generator`

---

### Step 6.4: New Quiz Types
**Goal**: Add drag-and-drop and ranking quiz types.

**Files to modify**:
- `src/components/quiz/QuizComponent.tsx`
- `server/src/models/Quiz.ts`

**Dependencies**: Install `react-beautiful-dnd`
```bash
npm install react-beautiful-dnd @types/react-beautiful-dnd
```

**Commit message**: `feat: add drag-and-drop and ranking quiz types`

---

## Phase 7: Integration & Testing

### Step 7.1: Update ModuleContent Page
**Goal**: Integrate InteractiveElementRouter into lesson display.

**Files to modify**:
- `src/pages/ModuleContent.tsx`

**Commit message**: `feat: integrate interactive elements into module content`

---

### Step 7.2: Create Sample Lessons
**Goal**: Add sample lessons with new interactive elements.

**Files to create**:
- `server/src/scripts/seedInteractiveLessons.ts`

**Commit message**: `feat: add seed script for interactive lessons`

---

### Step 7.3: Testing & Documentation
**Goal**: Test all interactive elements and document usage.

**Files to create**:
- `INTERACTIVE_ELEMENTS_GUIDE.md`

**Commit message**: `docs: add interactive elements usage guide`

---

## Quick Reference: Commit Sequence

1. `feat: extend Course schema for interactive elements`
2. `feat: add simulation data files`
3. `feat: add AI generator endpoint with prompt templates`
4. `feat: add AI generator service to frontend`
5. `feat: create reusable AI generator component`
6. `feat: add client-side simulation components`
7. `feat: add interactive element router component`
8. `feat: implement visual tokens interactive element`
9. `feat: implement sentence builder interactive element`
10. `feat: implement build-a-bot interactive element`
11. `feat: implement AI study buddy`
12. `feat: implement creative writing partner`
13. `feat: implement code debugger`
14. `feat: implement presentation coach simulation`
15. `feat: integrate ethical AI simulator`
16. `feat: implement lesson plan generator`
17. `feat: implement rubric builder`
18. `feat: implement AI policy drafter`
19. `feat: implement data insights dashboard simulation`
20. `feat: implement AI journey timeline`
21. `feat: implement interactive concept map`
22. `feat: implement certificate generator`
23. `feat: add drag-and-drop and ranking quiz types`
24. `feat: integrate interactive elements into module content`
25. `feat: add seed script for interactive lessons`
26. `docs: add interactive elements usage guide`

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  InteractiveElementRouter                                    │
│    ├── Client-Side Simulations (No Backend)                 │
│    │   ├── VisualTokens                                     │
│    │   ├── SentenceBuilder                                  │
│    │   ├── PresentationCoach                                │
│    │   └── ConceptMap                                       │
│    │                                                         │
│    ├── AI-Powered Components (Backend Required)             │
│    │   └── AIGeneratorComponent                             │
│    │       ├── Study Buddy                                  │
│    │       ├── Writing Partner                              │
│    │       ├── Code Debugger                                │
│    │       ├── Build-a-Bot                                  │
│    │       ├── Lesson Planner                               │
│    │       ├── Rubric Builder                               │
│    │       └── Policy Drafter                               │
│    │                                                         │
│    └── Hybrid Components                                    │
│        ├── DataDashboard (Simulated backend data)           │
│        ├── EthicalSimulator (Hardcoded scenarios)           │
│        └── AIJourney (Real progress data)                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Node.js/Express)                  │
├─────────────────────────────────────────────────────────────┤
│  POST /api/ai/generate                                       │
│    ├── Accepts: { generatorType, userInput, options }       │
│    ├── Looks up prompt template                             │
│    ├── Calls Inflection AI                                  │
│    └── Returns formatted response                           │
│                                                              │
│  GET /api/simulations/school-data                           │
│    └── Returns hardcoded sample data                        │
│                                                              │
│  GET /api/progress/:courseId                                │
│    └── Returns real user progress                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB                                 │
├─────────────────────────────────────────────────────────────┤
│  courses.modules.lessons.interactiveElements[]              │
│    ├── type: string                                         │
│    ├── generatorType?: string                               │
│    ├── simulationType?: string                              │
│    └── ...additional config                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Development Tips

### Simulation-First Approach
- Start with hardcoded data
- Focus on UX before complex backend
- Iterate based on user feedback

### Code Reusability
- One AIGeneratorComponent for all AI features
- One endpoint for all AI calls
- Shared styling and patterns

### Testing Strategy
1. Test each component in isolation
2. Add to a lesson's interactiveElements
3. Verify in ModuleContent page
4. Check mobile responsiveness

### Performance Considerations
- Client-side simulations = instant response
- AI calls should show loading states
- Cache AI responses when appropriate
- Lazy load heavy components (ReactFlow, jsPDF)

---

## Next Steps After Implementation

1. **Analytics**: Track which interactive elements users engage with most
2. **Feedback**: Add rating system for each interactive element
3. **Expansion**: Create more simulation scenarios based on user data
4. **Optimization**: Cache common AI responses
5. **Accessibility**: Ensure all components are keyboard navigable and screen-reader friendly
