# Design Document: Gamification Course System

## Overview

The Gamification Course System is a full-stack learning platform built on the Golden Stack (React 19, Node.js/Express, MongoDB, Inflection AI, AWS S3). The architecture follows a "Simulation-First" design philosophy where interactive components provide instant client-side feedback, complemented by AI-powered features through a unified Game Master service. This design minimizes backend complexity while maximizing learner engagement through real-time interactions.

The system delivers six comprehensive modules covering gamification principles, each containing at least three interactive elements ranging from client-side simulations to AI-powered analysis tools.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (React 19)                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐│
│  │   Course Pages   │  │   Interactive    │  │  Dashboard ││
│  │   & Navigation   │  │   Components     │  │  & Charts  ││
│  └──────────────────┘  └──────────────────┘  └────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              API Layer (Node.js/Express)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Course     │  │   AI Game    │  │   Simulations   │  │
│  │   Routes     │  │   Master     │  │   Routes        │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   MongoDB Database       │  │   Inflection AI API      │
│   - Courses              │  │   - Pi-3.1 Model         │
│   - Modules              │  │   - Game Master Prompts  │
│   - Lessons              │  │                          │
│   - User Progress        │  │                          │
└──────────────────────────┘  └──────────────────────────┘
```

### Component Architecture

The system uses a component-based architecture with three primary layers:

1. **Presentation Layer**: React components for UI rendering
2. **Service Layer**: Backend services for AI integration and data management
3. **Data Layer**: MongoDB for persistent storage

### Key Architectural Decisions

**Decision 1: Unified AI Endpoint**
- Single `POST /api/ai/game-master` endpoint handles all AI features
- Generator type parameter determines which system prompt to use
- Reduces backend boilerplate and simplifies maintenance
- Rationale: Avoids creating separate endpoints for each AI feature (5+ features)

**Decision 2: Client-Side Simulations**
- All simulation logic runs in the browser without server calls
- Instant feedback improves learner engagement
- Reduces server load and API costs
- Rationale: Simulations like Flow Channel Evaluator require sub-100ms response times

**Decision 3: Prompt Template Configuration**
- System prompts stored in a centralized configuration file
- Each AI feature has a dedicated prompt with Game Master persona
- Prompts include structured output requirements
- Rationale: Enables rapid iteration on AI behavior without code changes

**Decision 4: Interactive Element Type System**
- MongoDB schema uses enumerated types for interactive elements
- Router component maps types to React components
- Configuration stored as flexible mixed type
- Rationale: Supports diverse interactive elements while maintaining type safety

## Components and Interfaces

### Frontend Components

#### 1. AIGameMasterGenerator Component

**Purpose**: Reusable component for all AI-powered features

**Props Interface**:
```typescript
interface AIGameMasterGeneratorProps {
  generatorType: AIGeneratorType;
  title: string;
  description: string;
}
```

**State Management**:
- `userInput`: string (max 5000 characters)
- `aiResponse`: string (markdown formatted)
- `loading`: boolean

**Key Features**:
- Character count with visual warning at 90% threshold
- Loading state with disabled submit button
- Markdown rendering for AI responses
- Error handling with toast notifications

**Integration Points**:
- Calls `POST /api/ai/game-master` endpoint
- Used by Module 3 (Mechanic Mashup), Module 5 (Narrative Generator), Module 6 (Dark Pattern Redesigner)

#### 2. PlayerTypeAnalyzer Component

**Purpose**: Client-side simulation for Bartle/Marczewski player type assessment

**State Management**:
- `answers`: Record<number, string> (question ID to answer mapping)
- `result`: string | null (calculated player type)

**Algorithm**:
```
1. Present 3+ questions mapped to player types
2. Score responses (Strongly Agree = 2 points, Agree = 1, etc.)
3. Aggregate scores by type (Achiever, Explorer, Socializer, Disruptor)
4. Return dominant type with highest score
```

**Key Features**:
- No backend dependency
- Instant result calculation
- Visual feedback with color-coded results

#### 3. RewardScheduleDesigner Component

**Purpose**: Simulate fixed vs. variable ratio reward schedules

**State Management**:
- `attempts`: number (total learner attempts)
- `rewards`: number (total rewards received)
- `schedule`: 'fixed' | 'variable'
- `nextFixedReward`: number (for fixed schedule tracking)

**Algorithm**:
```
Fixed Ratio:
  - Reward every Nth attempt (e.g., every 3rd)
  - Predictable pattern

Variable Ratio:
  - Random chance per attempt (e.g., 33%)
  - Unpredictable, higher engagement
```

**Key Features**:
- Real-time simulation updates
- Visual comparison of reward patterns
- Educational commentary on engagement psychology

#### 4. FlowChannelEvaluator Component

**Purpose**: Map skill vs. difficulty to flow states

**State Management**:
- `skill`: number (1-10 scale)
- `difficulty`: number (1-10 scale)

**Algorithm**:
```
delta = difficulty - skill

if delta > 2:
  state = "Anxiety (Frustration)"
else if delta < -2:
  state = "Boredom (Passive)"
else if abs(delta) <= 1:
  state = "Flow Channel (Optimal)"
else:
  state = "Arousal/Control"
```

**Key Features**:
- Dual range sliders for input
- Color-coded state visualization
- Sub-100ms recalculation

#### 5. ROEDashboard Component

**Purpose**: Visualize Return on Engagement metrics

**Data Interface**:
```typescript
interface ROEData {
  month: string;
  enrollments: number;
  completions: number;
  aiRequests: number;
  timeSpent: number;
}
```

**Key Features**:
- Recharts bar chart with multiple data series
- Responsive container for mobile support
- Fetches data from `GET /api/simulations/roe-data`
- Error handling for failed data fetches

#### 6. GamificationConceptMap Component

**Purpose**: Interactive visualization of gamification concepts

**Data Structure**:
```typescript
Nodes:
  - Gamification (root)
  - Psychology (SDT)
  - Design (MDA)
  - Core Loop
  - Player Types

Edges:
  - Gamification → Psychology (Driven by)
  - Gamification → Design (Built using)
  - Psychology → Player Types (Defines)
  - Design → Core Loop (Creates)
```

**Key Features**:
- React Flow for node-based visualization
- Draggable nodes
- Minimap and zoom controls
- Background grid for spatial reference

#### 7. CertificateGenerator Component

**Purpose**: Client-side PDF certificate generation

**Props Interface**:
```typescript
interface CertificateGeneratorProps {
  userName: string;
  courseTitle: string;
}
```

**PDF Layout**:
- Landscape orientation (800x600)
- Certificate title at top
- Learner name (centered, large font)
- Course title
- Completion date
- Auto-download on generation

**Key Features**:
- Uses pdf-lib for browser-based PDF creation
- No server-side processing required
- Validation for required userName field

#### 8. InteractiveElementRouter Component

**Purpose**: Map interactive element types to React components

**Props Interface**:
```typescript
interface InteractiveElementRouterProps {
  element: InteractiveElement;
  userName: string;
}
```

**Routing Logic**:
```typescript
Type Mapping:
  - playerTypeSimulator → PlayerTypeAnalyzer
  - rewardScheduleDesigner → RewardScheduleDesigner
  - flowChannelEvaluator → FlowChannelEvaluator
  - pitchAnalysisGenerator → AIGameMasterGenerator (mechanic-analyst)
  - narrativeGenerator → AIGameMasterGenerator (narrative-generator)
  - darkPatternRedesigner → AIGameMasterGenerator (dark-pattern-redesigner)
  - roeDashboard → ROEDashboard
  - certificateGenerator → CertificateGenerator
```

**Error Handling**:
- Unknown types display error message with type name
- Prevents application crashes from invalid data

### Backend Services

#### 1. AI Service Layer

**File**: `server/src/services/aiService.ts`

**Function Signature**:
```typescript
async function generateAIGameMasterResponse(
  generatorType: AIGeneratorType,
  userInput: string,
  context: InflectionContext[] = []
): Promise<string>
```

**Inflection API Payload Structure**:
```typescript
{
  model: 'Pi-3.1',
  context: [
    { text: systemPrompt, type: 'System' },
    ...conversationHistory,
    { text: userInput, type: 'Human' }
  ]
}
```

**Error Handling**:
- Validates generator type exists in AIPrompts
- Catches API failures and logs details
- Returns user-friendly error messages
- Timeout handling for slow responses

**Performance Considerations**:
- Target response time: < 10 seconds
- Streaming support for future enhancement
- Context array for conversation continuity

#### 2. Prompt Configuration

**File**: `server/src/config/aiPrompts.ts`

**Prompt Structure**:
```typescript
const GAME_MASTER_PERSONA = 'You are the Game Master, a senior gamification consultant and design expert. Your tone is instructional, encouraging, and highly specific to game design principles (MDA, SDT). Always respond in clear, structured Markdown.';

export const AIPrompts = {
  'mechanic-analyst': `${GAME_MASTER_PERSONA} [specific instructions]`,
  'narrative-generator': `${GAME_MASTER_PERSONA} [specific instructions]`,
  'dark-pattern-redesigner': `${GAME_MASTER_PERSONA} [specific instructions]`,
  'core-loop-critique': `${GAME_MASTER_PERSONA} [specific instructions]`,
  'roe-measurement-advisor': `${GAME_MASTER_PERSONA} [specific instructions]`
};
```

**Prompt Design Principles**:
- Consistent persona across all prompts
- Structured output requirements (sections, scores)
- Domain-specific terminology (MDA, SDT, Bartle types)
- Clear evaluation criteria

#### 3. API Routes

**AI Route** (`server/src/routes/ai.ts`):
```typescript
POST /api/ai/game-master
  - Auth: Required (authMiddleware)
  - Body: { generatorType, userInput, context? }
  - Response: { result: string }
  - Errors: 400 (missing params), 500 (AI service failure)
```

**Simulations Route** (`server/src/routes/simulations.ts`):
```typescript
GET /api/simulations/roe-data
  - Auth: Optional (public dashboard)
  - Response: ROEData[]
  - Note: Currently returns mock data, future: MongoDB aggregation
```

## Data Models

### Course Schema Extension

**File**: `server/src/models/Course.ts`

```typescript
// Interactive Element Types
export type InteractiveElementType = 
  | 'reflection'
  | 'playerTypeSimulator'
  | 'rewardScheduleDesigner'
  | 'flowChannelEvaluator'
  | 'pitchAnalysisGenerator'
  | 'narrativeGenerator'
  | 'darkPatternRedesigner'
  | 'roeDashboard'
  | 'certificateGenerator';

// Interactive Element Interface
interface IInteractiveElement {
  type: InteractiveElementType;
  promptTemplate?: string;  // For AI features
  config?: any;             // Flexible configuration (Mixed type)
}

// Lesson Schema
interface ILesson extends Document {
  title: string;
  duration: string;
  content: IContentBlock[];
  interactielic)
, New RDog (Datanglerti and atoringAdd moniategy
- strkup utomated bacnt a
- Implemelingrottng and thitie limd API ratAdtry)
- ing (Senggloror rehensive erplement comp Im
- analytics to real ROE datam mockate frons

- Migrratiot Considehnical Debec
### Tt
contenurse cofor ol n contr
   - Versioilder buive elementinteractd-drop  - Drag-an
  tioncrear course ace fonterf- Admin item**:
   nt Sysagemean**Content Ms

5. e updatersns for counotificatiosh 
   - Pumulations mode for si Offlineersion
   -e vct Nativ:
   - Rea**e Appbil
4. **Momance
perforceived d per  - Improvedisplay
 back eedssive f   - Progrees
I responsevents for Arver-sent *:
   - Sereaming* St**AIcs

3.  analytimpletioncove Predicti- ps
   atmavior heer behaarn
   - Leoardhb ROE das forggregation aal MongoDB   - Realytics**:
 Aned*Advanc
2. *allenges
tion chifica Group gam  -ng
 ticept map editive conollabora   - Ck
edbacr fee peeivation for lintegrocket bS
   - Wetion**:laborae Coleal-tim

1. **RFeatures### Phase 2 ements

ture Enhanc
## Fusponses
reAPI  for ompression
- Gzip ce contentfor coursmization ge optiIma
- es for moduladingy lots
- Lazomponen React ctting for spli
- Codeion**: Optimizatrformanceents

**Peve componteractir inr caching fowse
- Bro assetsfor staticage
- CDN ession stor Redis for s**:
- Strategyhing

**Cace redundancy databasoret fica s replngoDBtion
- Mo distribuic for traffncer
- Load balaances)dd more inst (can aerversess API stelg**:
- Stacalin SalrizontHons

**Consideratioty calabili
### S``
-1
`ON=us-eastWS_REGI
Ateeneraai/v1/gon.pi.inflecti://a_URL=httpsION_AI_APILECTINFon_prod
]/gamificatier//[clust+srv:ngodbNGO_URI=moion
MOV=productE_ENbash
NODon**:
```**Producti
```

/generateion.ai/v1ctleinfps://api.=htt_URLAPIION_AI_ECTINFL
n_dbatio/gamificst:27017localhongodb://URI=mo
MONGO_pmentE_ENV=develo
NOD**:
```bashlopment

**Deveationfigurment Con## Environre

# Architectument
## Deploy
eratione genntity befordeser iation of uer)
- Validn servo PII oion (nratt-side gene
- Cliente Data**:tifica
**Cera
 user datpliance for
- GDPR comgementession mana Secure s
-ationsll communicfor aTPS 
- HTypt)ords (bcr passwed
- Encryptata**:r Dty

**UseData Securibuse

### event aoint to prndp eting on AIRate limi
- side onlyver-entials ser AWS credly
-de oner-sirv seon AI key
- Inflectitection**:y ProAPI Ke

**ctionging/produ dev/staeys for krate Sepa)
-.gitignoren local itrol (.env.n consiocrets in ver se code
- No-sideientecrets in cl
- No sall API keyses for riablment va Environ:
-ent**gems Mana**Secret
Security
ironment Env### n)

for markdowify MPurDOng, to-escapi(React auion SS preventon)
- Xrizatieteram(Mongoose pa prevention ctioninjeent
- SQL erated contf user-gen otizations)
- Sani5000 char input (s on userlimitter - Charaction**:
ut Validanpation

**Ivalidss tracking 
- Progren verificatiollmentroe en)
- Coursminer, adol (learnccess contrsed ale-ba- Rotion**:
uthoriza**As)

y cookiege (httpOnl storaSecure tokenlogic
- resh ef and rionaten expirutes
- Tokected rorotcation for pthentiWT-based au J
-*:ation*entic

**Authecurity### API S

erationsnsidcurity Co
## Se
erformanceng prenderint-side 
- Cliecerman query perfo- Database
ers) 50+ uslatemuests (siqu rerent AIoncur
- C**:oad Testing**L-AI)

nonr 00ms foarget: < 5onse time (tespoint rndpAPI eseconds)
- t: < 3  (targe load time)
- Page00ms(target: < 1 time lculationlation cands)
- Simueco < 10 sme (target: response ti*:
- AIMonitor*to etrics 

**Mngestiance T# Performht

## Playwrig: Cypress or
- Toolsdashboardiew ROE 
- Vompletionate after ccertificerate en- Gfeedback
eceive s and r AI analysiubmit
- Sonrogressile pe moduomplets**:
- CUser Flowing

** Test-End End-to
###end-to-end
ation enerificate gst cert Te
-nentsI to compoom APow frdata flt pes
- Tesl element ty aluter withntRoemeEliveteract In
- Teston**: IntegratiComponent

**ropagationt error pns
- Teseratioatabase opt dare
- Testion middlewthentica Test aupoint
-for AI endponse cycle esuest/reqt full r
- Testion**: Integrang

**APIestiration T### Integpertest

est, Su Tools: J
-nvalidatio route esths
- Tling pat error hand
- Testogic lectionpt selTest promn API
- lectio mocked Infe withst AI servic**:
- Teesvicnd Serke

**Bac Librarysting React Teools: Jest,onents
- Tor AI comps fAPI call
- Mock ionidat and valinghandlt error ions
- Teser interactd usagement anmantate - Test shedule)
 Reward Scw Channel, (Flolationslation calcu Test simus**:
-ponentontend Com**FrTesting



### Unit egying Strat
## Test error
ric 500urn geneetLog and ry errors: rors
- Quereld erfic fih speciwit 400 Returnon errors: 
- Validatickoffial baponentith exy logic w Retrilures:nnection fa Co
-e Errors**:tabas``

**Da
`' });
}se.respon AI ed to get'Failage: ess{ mn(.jso00)atus(5.stor);
  resError:', errster  Maror('AI Gameconsole.ererror) {
   catch ( });
}ponselt: aiResresuson({ ;
  res.j...)sponse(rReeAIGameMasteait generatsponse = aw const aiRery {
 ors (500)
tervice err
}

// Sput' });e or userInatorTypng genersage: 'Missison({ mes).jus(400ats.st return reInput) {
 || !useratorType gener(!)
if rs (400tion erroalidapt
// Vypescring**:
```t Handliorute Err
**Ro;
}
```
ilable.') unavarrentlyervice is cu Error('AI Sthrow new);
  r.messagea || erroponse?.daterror.res', d:ileAPI Call FaInflection ('rornsole.er) {
  coatch (error.text;
} cesponse.dataext || rpletion.t.comsponse.dataeturn reoad);
  rI_URL, paylLECTION_APos.post(INF axi= awaitse ononst resptry {
  cscript
pe`ty
``s**:ce Error
**AI Servindling
rror Harver-Side E# Se
##ption
ith retry ont woneomptate in crror s: E
- DisplayresponsesMalformed I calls
- led AP*:
- Faiing Errors*Fetch

**Data efault statelback to dalges, fessar me errolay: Inlinrors
- Dispn erlatioCalcuons
- itistate transid al
- Inv**:n Errorsimulatio

**Sly messagesiendr-frwith useons notificatit lay: Toasses)
- Disp400 respon0, errors (50)
- API  connections (timeout,lureetwork fai)
- Nd fieldsquire(length, reidation put val
- In*:rs*t Erronen Compoing

**AIError Handl-Side ient

### Clandlingor H# Err

#
```
}centage// perer;  s: numbageProgres  averminutes
 // in ;       berpent: num
  timeSnumber;ts:   aiReques: number;
ionset  compl: number;
ntslme enrolc.
 ', 'Feb', et/ 'Jan           /d: string;io
  percs {MetriOEce IRfaipt
inter```typescrcs Data

lyti## ROE Ana
#```

}
Date?: Date;icate certifn;
 leaerated: booGencate
  certifi}[];?: any;
  datae;
    tamp: Dat;
    timesype: string  elementT{
  istory: interactionHd[];
  ns: ObjectIpletedLessocom
  er[];ules: numbodetedMcomplctId;
  urseId: ObjectId;
  coerId: Objeusgress {
  erProUsnterface It
iipscr``typeng

`ess Trackiser Progr
### U`
ator
``Genercatee: certifi- Interactivd
    arroeDashboteractive:    - Ingner
 rnRedesirkPatte daive:nteract- II
    Ethics & RO.1: son 6 Lesttle
  - Boss Badule 6:
Moder
 Builrioching Scena: Branactiveter    - Iner
ent Graditing IncidIncractive:  Inte    -erator
Genrativee: narractiv
    - Inte& Immersionative Narrsson 5.1: Le Mode
  - 5: Storye dulc

MoUp Logil e: Leveeractivnt
    - Ier Diagramme Loop: Corteractive
    - InrvaluatohannelEe: flowCInteractiv - el
    Flow Chann Loop &: Core 4.1  - Lessonoop
e Lle 4: Th

Modulatorancing SimuBL Balractive: P Intetor
    -alysisGeneraive: pitchAnct  - Interaer
  duleDesignchedS: rewarractive
    - Inte Aesthetics, Dynamics,nicsecha.1: Mon 3
  - LessToolbox
Module 3: 
tion Stationtar Creactive: Ava    - Interaorter
trinsic Ssic vs. Exive: Intrinnteract  - Iimulator
  eSe: playerTyp- Interactiv
    tion Theorymina Self-Deter.1:on 2
  - Lesssychology: Ple 2
Moduer
gy Buildrminolo Teractive:- Inte
    Quizferentiator  Diferactive: - Intracker
   gg Hunt Tster Eeractive: Ea Int -. GBL
    vsationficmi 1.1: Ga - Lessontions
  1: Foundaa
Moduleatle Module D/ Exampn[];
}

/s: ILessoessonring;
  lption: st
  descri: string;tle
  tinumber;Number: 
  moduleodule {face IMinter
``typescriptture

`ruc## Module St
```

#});ema]
  }
nSch: [Questionsstio{
    que: 
  quizd
  }],.Types.Mixe Schema    config:,
tringtTemplate: S  promp
    },
  uired: true ,
      req
      ]rator'ficateGene 'certi       
shboard',     'roeDa   ,
edesigner'ernRtt    'darkPa
    ator',erenveGti  'narra,
      enerator'sGalysi 'pitchAn       ',
Evaluatornnel    'flowCha  ner',
  uleDesigdSchedar    'rewator',
    ypeSimul    'playerTn',
    iolect      'ref
  : [
      enum String,      type:
 : { pe    tys: [{
ctiveElementerama],
  intBlockSche [Contentnt:,
  conterue }uired: t String, req type:ion: { durat },
 d: trueirering, requype: St  title: { tILesson>({
hema<a = new SconSchem
const Lessfinitionema DeMongoose Sch

// y[] };
}uestions: anquiz: { qment[];
  interactiveElements: IInteractiveElement[];
  quiz: { questions: any[] };
}

// Mongoose Schema Definition
const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  content: [ContentBlockSchema],
  interactiveElements: [{
    type: { 
      type: String, 
      enum: [
        'reflection',
        'playerTypeSimulator',
        'rewardScheduleDesigner',
        'flowChannelEvaluator',
        'pitchAnalysisGenerator',
        'narrativeGenerator',
        'darkPatternRedesigner',
        'roeDashboard',
        'certificateGenerator'
      ],
      required: true 
    },
    promptTemplate: String,
    config: Schema.Types.Mixed
  }],
  quiz: {
    questions: [QuestionSchema]
  }
});
```

### Module Structure

```typescript
interface IModule {
  moduleNumber: number;
  title: string;
  description: string;
  lessons: ILesson[];
}

// Example Module Data
Module 1: Foundations
  - Lesson 1.1: Gamification vs. GBL
    - Interactive: Easter Egg Hunt Tracker
    - Interactive: Differentiator Quiz
    - Interactive: Terminology Builder

Module 2: Psychology
  - Lesson 2.1: Self-Determination Theory
    - Interactive: playerTypeSimulator
    - Interactive: Intrinsic vs. Extrinsic Sorter
    - Interactive: Avatar Creation Station

Module 3: Toolbox
  - Lesson 3.1: Mechanics, Dynamics, Aesthetics
    - Interactive: rewardScheduleDesigner
    - Interactive: pitchAnalysisGenerator
    - Interactive: PBL Balancing Simulator

Module 4: The Loop
  - Lesson 4.1: Core Loop & Flow Channel
    - Interactive: flowChannelEvaluator
    - Interactive: Core Loop Diagrammer
    - Interactive: Level Up Logic

Module 5: Story Mode
  - Lesson 5.1: Narrative & Immersion
    - Interactive: narrativeGenerator
    - Interactive: Inciting Incident Grader
    - Interactive: Branching Scenario Builder

Module 6: Boss Battle
  - Lesson 6.1: Ethics & ROI
    - Interactive: darkPatternRedesigner
    - Interactive: roeDashboard
    - Interactive: certificateGenerator
```

### User Progress Tracking

```typescript
interface IUserProgress {
  userId: ObjectId;
  courseId: ObjectId;
  completedModules: number[];
  completedLessons: ObjectId[];
  interactionHistory: {
    elementType: string;
    timestamp: Date;
    data?: any;
  }[];
  certificateGenerated: boolean;
  certificateDate?: Date;
}
```

### ROE Analytics Data

```typescript
interface IROEMetrics {
  period: string;           // 'Jan', 'Feb', etc.
  enrollments: number;
  completions: number;
  aiRequests: number;
  timeSpent: number;        // in minutes
  averageProgress: number;  // percentage
}
```

## Error Handling

### Client-Side Error Handling

**AI Component Errors**:
- Input validation (length, required fields)
- Network failures (timeout, connection)
- API errors (500, 400 responses)
- Display: Toast notifications with user-friendly messages

**Simulation Errors**:
- Invalid state transitions
- Calculation errors
- Display: Inline error messages, fallback to default state

**Data Fetching Errors**:
- Failed API calls
- Malformed responses
- Display: Error state in component with retry option

### Server-Side Error Handling

**AI Service Errors**:
```typescript
try {
  const response = await axios.post(INFLECTION_API_URL, payload);
  return response.data.completion.text || response.data.text;
} catch (error) {
  console.error('Inflection API Call Failed:', error.response?.data || error.message);
  throw new Error('AI Service is currently unavailable.');
}
```

**Route Error Handling**:
```typescript
// Validation errors (400)
if (!generatorType || !userInput) {
  return res.status(400).json({ message: 'Missing generatorType or userInput' });
}

// Service errors (500)
try {
  const aiResponse = await generateAIGameMasterResponse(...);
  res.json({ result: aiResponse });
} catch (error) {
  console.error('AI Game Master Error:', error);
  res.status(500).json({ message: 'Failed to get AI response.' });
}
```

**Database Errors**:
- Connection failures: Retry logic with exponential backoff
- Validation errors: Return 400 with specific field errors
- Query errors: Log and return generic 500 error

## Testing Strategy

### Unit Testing

**Frontend Components**:
- Test simulation calculations (Flow Channel, Reward Schedule)
- Test state management and user interactions
- Test error handling and validation
- Mock API calls for AI components
- Tools: Jest, React Testing Library

**Backend Services**:
- Test AI service with mocked Inflection API
- Test prompt selection logic
- Test error handling paths
- Test route validation
- Tools: Jest, Supertest

### Integration Testing

**API Integration**:
- Test full request/response cycle for AI endpoint
- Test authentication middleware
- Test database operations
- Test error propagation

**Component Integration**:
- Test InteractiveElementRouter with all element types
- Test data flow from API to components
- Test certificate generation end-to-end

### End-to-End Testing

**User Flows**:
- Complete module progression
- Submit AI analysis and receive feedback
- Generate certificate after completion
- View ROE dashboard
- Tools: Cypress or Playwright

### Performance Testing

**Metrics to Monitor**:
- AI response time (target: < 10 seconds)
- Simulation calculation time (target: < 100ms)
- Page load time (target: < 3 seconds)
- API endpoint response time (target: < 500ms for non-AI)

**Load Testing**:
- Concurrent AI requests (simulate 50+ users)
- Database query performance
- Client-side rendering performance

## Security Considerations

### API Security

**Authentication**:
- JWT-based authentication for protected routes
- Token expiration and refresh logic
- Secure token storage (httpOnly cookies)

**Authorization**:
- Role-based access control (learner, admin)
- Course enrollment verification
- Progress tracking validation

**Input Validation**:
- Character limits on user input (5000 chars)
- Sanitization of user-generated content
- SQL injection prevention (Mongoose parameterization)
- XSS prevention (React auto-escaping, DOMPurify for markdown)

### Environment Security

**Secrets Management**:
- Environment variables for all API keys
- No secrets in client-side code
- No secrets in version control (.env.local in .gitignore)
- Separate keys for dev/staging/production

**API Key Protection**:
- Inflection AI key server-side only
- AWS credentials server-side only
- Rate limiting on AI endpoint to prevent abuse

### Data Security

**User Data**:
- Encrypted passwords (bcrypt)
- HTTPS for all communications
- Secure session management
- GDPR compliance for user data

**Certificate Data**:
- Client-side generation (no PII on server)
- Validation of user identity before generation

## Deployment Architecture

### Environment Configuration

**Development**:
```bash
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/gamification_db
INFLECTION_AI_API_URL=https://api.inflection.ai/v1/generate
```

**Production**:
```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://[cluster]/gamification_prod
INFLECTION_AI_API_URL=https://api.inflection.ai/v1/generate
AWS_REGION=us-east-1
```

### Scalability Considerations

**Horizontal Scaling**:
- Stateless API servers (can add more instances)
- Load balancer for traffic distribution
- MongoDB replica set for database redundancy

**Caching Strategy**:
- Redis for session storage
- CDN for static assets
- Browser caching for interactive components

**Performance Optimization**:
- Code splitting for React components
- Lazy loading for modules
- Image optimization for course content
- Gzip compression for API responses

## Future Enhancements

### Phase 2 Features

1. **Real-time Collaboration**:
   - WebSocket integration for live peer feedback
   - Collaborative concept map editing
   - Group gamification challenges

2. **Advanced Analytics**:
   - Real MongoDB aggregation for ROE dashboard
   - Learner behavior heatmaps
   - Predictive completion analytics

3. **AI Streaming**:
   - Server-sent events for AI responses
   - Progressive feedback display
   - Improved perceived performance

4. **Mobile App**:
   - React Native version
   - Offline mode for simulations
   - Push notifications for course updates

5. **Content Management System**:
   - Admin interface for course creation
   - Drag-and-drop interactive element builder
   - Version control for course content

### Technical Debt Considerations

- Migrate from mock ROE data to real analytics
- Implement comprehensive error logging (Sentry)
- Add API rate limiting and throttling
- Implement automated backup strategy
- Add monitoring and alerting (DataDog, New Relic)