# Implementation Plan

- [x] 1. Set up project infrastructure and environment configuration
  - Create `.env.local` file with all required environment variables (MongoDB URI, JWT secret, Inflection AI API key/URL, AWS credentials, S3 bucket)
  - Add environment variable validation on server startup
  - Configure `.gitignore` to exclude `.env.local` from version control
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 2. Extend MongoDB schema for gamification course structure
  - [x] 2.1 Update Course model to support interactive elements
    - Add `InteractiveElementType` enum with all 9 element types (reflection, playerTypeSimulator, rewardScheduleDesigner, flowChannelEvaluator, pitchAnalysisGenerator, narrativeGenerator, darkPatternRedesigner, roeDashboard, certificateGenerator)
    - Create `IInteractiveElement` interface with type, promptTemplate, and config fields
    - Update `ILesson` interface to include interactiveElements array
    - Modify Mongoose LessonSchema to include interactiveElements with validation
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3. Implement AI Game Master backend service
  - [x] 3.1 Create AI prompt configuration file
    - Define `GAME_MASTER_PERSONA` constant with expert consultant persona
    - Create `AIPrompts` object with 5 prompt templates (mechanic-analyst, narrative-generator, dark-pattern-redesigner, core-loop-critique, roe-measurement-advisor)
    - Export `AIGeneratorType` type for type safety
    - _Requirements: 1.4, 1.5, 1.6_
  
  - [x] 3.2 Implement AI service layer
    - Create `generateAIGameMasterResponse` function with generatorType, userInput, and context parameters
    - Build Inflection API payload with model 'Pi-3.1' and context array
    - Implement axios POST request to Inflection AI API with authorization header
    - Extract completion text from API response
    - Add error handling with logging and user-friendly error messages
    - _Requirements: 1.1, 1.2, 1.3, 1.7_
  
  - [x] 3.3 Create AI API route
    - Create `/api/ai/game-master` POST endpoint
    - Add authentication middleware to protect the route
    - Validate required parameters (generatorType, userInput)
    - Call AI service and return response
    - Implement error handling for 400 and 500 status codes
    - _Requirements: 1.1, 1.7_

- [ ] 4. Build client-side simulation components
  - [x] 4.1 Implement PlayerTypeAnalyzer component
    - Create component with questions array mapped to player types (Achiever, Explorer, Socializer, Disruptor)
    - Implement state management for answers and result
    - Build scoring algorithm (Strongly Agree = 2 points, etc.)
    - Create calculateResult function to determine dominant player type
    - Design UI with question cards and answer selection
    - Display result with color-coded feedback
    - _Requirements: 2.1, 2.6_
  
  - [x] 4.2 Implement RewardScheduleDesigner component
    - Create component with state for attempts, rewards, schedule type, and nextFixedReward
    - Implement handleAttempt function with fixed ratio logic (every 3rd attempt)
    - Implement variable ratio logic (33% random chance)
    - Build UI with radio buttons for schedule selection
    - Add "Make an Effort" button to trigger attempts
    - Display real-time statistics (attempts, rewards, next reward)
    - Add educational commentary on engagement psychology
    - _Requirements: 2.2, 2.3, 2.6_
  
  - [x] 4.3 Implement FlowChannelEvaluator component
    - Create component with state for skill and difficulty (1-10 scale)
    - Implement getFlowState function with delta calculation
    - Map delta to flow states (Anxiety, Boredom, Flow Channel, Arousal/Control)
    - Build UI with dual range sliders for skill and difficulty
    - Display current flow state with color-coded visualization
    - Ensure sub-100ms recalculation performance
    - _Requirements: 2.4, 2.5, 2.6_

- [ ] 5. Create reusable AI component for frontend
  - [x] 5.1 Implement AIGameMasterGenerator component
    - Create component with props interface (generatorType, title, description)
    - Implement state management for userInput, aiResponse, and loading
    - Add character limit validation (5000 characters)
    - Build textarea with character counter and visual warning at 90%
    - Implement handleSubmit function with API call to `/api/ai/game-master`
    - Add loading state with disabled submit button
    - Display AI response in visually distinct section with markdown rendering
    - Implement error handling with toast notifications
    - _Requirements: 1.1, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 6. Implement ROE analytics dashboard
  - [x] 6.1 Create simulations backend route
    - Create `/api/simulations/roe-data` GET endpoint
    - Return mock data array with monthly metrics (enrollments, completions, aiRequests, timeSpent)
    - Add comment noting future migration to real MongoDB aggregation
    - _Requirements: 4.1_
  
  - [x] 6.2 Build ROEDashboard component
    - Create component with ROEData interface
    - Implement useEffect to fetch data from `/api/simulations/roe-data`
    - Build Recharts BarChart with multiple data series
    - Configure distinct colors for completions, AI interactions, and time spent
    - Add responsive container for mobile support
    - Implement error handling for failed data fetches
    - Add educational commentary on ROE metrics
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

- [-] 7. Create certificate generation feature
  - [ ] 7.1 Implement CertificateGenerator component
    - Create component with props interface (userName, courseTitle)
    - Implement generatePdf async function using pdf-lib
    - Create landscape PDF page (800x600)
    - Add certificate title, learner name, course title, and completion date
    - Implement auto-download functionality with proper filename formatting
    - Add validation to prevent generation without userName
    - Display error message for missing required fields
    - Style component with congratulatory UI
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 8. Build concept map visualization
  - [x] 8.1 Implement GamificationConceptMap component
    - Create component using React Flow library
    - Define initialNodes array with 5 nodes (Gamification, Psychology, Design, Core Loop, Player Types)
    - Define initialEdges array with relationship labels
    - Implement state management for nodes and edges
    - Add callbacks for node changes, edge changes, and connections
    - Configure MiniMap, Controls, and Background components
    - Style container with proper dimensions
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 9. Create interactive element router
  - [ ] 9.1 Implement InteractiveElementRouter component
    - Create component with props interface (element, userName)
    - Build switch statement to map element types to components
    - Map playerTypeSimulator to PlayerTypeAnalyzer
    - Map rewardScheduleDesigner to RewardScheduleDesigner
    - Map flowChannelEvaluator to FlowChannelEvaluator
    - Map pitchAnalysisGenerator to AIGameMasterGenerator with mechanic-analyst type
    - Map narrativeGenerator to AIGameMasterGenerator with narrative-generator type
    - Map darkPatternRedesigner to AIGameMasterGenerator with dark-pattern-redesigner type
    - Map roeDashboard to ROEDashboard
    - Map certificateGenerator to CertificateGenerator
    - Add default case with error message for unknown types
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 10. Integrate components into course rendering system
  - [ ] 10.1 Update lesson rendering logic
    - Import InteractiveElementRouter component
    - Map over lesson.interactiveElements array
    - Render InteractiveElementRouter for each element
    - Pass element data and userName as props
    - Ensure proper key assignment for list rendering
    - _Requirements: 6.2, 10.3_

- [ ] 11. Implement module structure and progress tracking
  - [ ] 11.1 Create module data structure
    - Define 6 modules with titles and descriptions (Foundations, Psychology, Toolbox, The Loop, Story Mode, Boss Battle)
    - Assign at least 3 interactive elements per module
    - Structure lessons with content blocks and interactive elements
    - _Requirements: 10.1, 10.2_
  
  - [ ] 11.2 Implement progress tracking
    - Create UserProgress model with completedModules, completedLessons, and interactionHistory
    - Add certificateGenerated and certificateDate fields
    - Implement API endpoints for updating progress
    - Add logic to enable certificate generation only when all modules are completed
    - _Requirements: 10.4, 10.5_

- [ ] 12. Add authentication and authorization
  - [ ] 12.1 Implement authentication middleware
    - Create authMiddleware for JWT token validation
    - Add token expiration checking
    - Implement error responses for invalid/missing tokens
    - Apply middleware to protected routes
    - _Requirements: 8.1_

- [ ] 13. Install and configure required dependencies
  - Install React 19, React Flow, Recharts, pdf-lib, axios, sonner (toast notifications)
  - Install server dependencies: express, mongoose, axios, jsonwebtoken, bcrypt
  - Configure TypeScript for both frontend and backend
  - Set up build scripts and development server

- [ ] 14. Testing and validation
  - [ ] 14.1 Write unit tests for simulation components
    - Test PlayerTypeAnalyzer scoring algorithm
    - Test RewardScheduleDesigner reward distribution
    - Test FlowChannelEvaluator state calculation
    - _Requirements: 2.1, 2.2, 2.4_
  
  - [ ] 14.2 Write integration tests for AI service
    - Mock Inflection API responses
    - Test prompt selection logic
    - Test error handling paths
    - _Requirements: 1.1, 1.7_
  
  - [ ] 14.3 Write end-to-end tests for user flows
    - Test complete module progression
    - Test AI analysis submission and feedback
    - Test certificate generation
    - _Requirements: 10.3, 5.1_

- [ ] 15. Documentation and deployment preparation
  - [ ] 15.1 Create API documentation
    - Document all endpoints with request/response formats
    - Add authentication requirements
    - Include error response examples
  
  - [ ] 15.2 Write deployment guide
    - Document environment variable setup
    - Add database migration instructions
    - Include production configuration checklist
