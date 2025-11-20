# Requirements Document

## Introduction

The Gamification Course System is an interactive learning platform designed to teach instructional designers, corporate trainers, and L&D managers the principles of game design for transforming passive content into active learning experiences. The System leverages the existing Golden Stack (React 19, Node.js/Express, MongoDB, Inflection AI, AWS S3) to deliver high-impact, client-side simulations and AI-powered learning features through a unified Game Master service.

## Glossary

- **System**: The Gamification Course System (the complete learning platform)
- **Game Master**: The AI-powered assistant service using Inflection AI (Pi-3.1) that provides personalized feedback and analysis
- **Learner**: A user enrolled in the gamification course
- **Interactive Element**: A client-side simulation or AI-powered component embedded within course lessons
- **ROE**: Return on Engagement - metrics measuring learner interaction and completion rates
- **MDA Framework**: Mechanics, Dynamics, Aesthetics - a game design framework
- **SDT**: Self-Determination Theory - psychological framework for motivation
- **Flow Channel**: The optimal balance between skill level and challenge difficulty
- **Player Type**: Classification of learner preferences (Achiever, Explorer, Socializer, Disruptor)
- **Core Loop**: The fundamental cycle of Action → Feedback → Reward in gamified systems
- **Dark Pattern**: Manipulative design mechanics that exploit user psychology

## Requirements

### Requirement 1: AI-Powered Game Master Service

**User Story:** As an instructional designer, I want to receive expert feedback on my gamification designs, so that I can validate my approach against established game design principles.

#### Acceptance Criteria

1. WHEN the Learner submits a gamification pitch to the System, THE System SHALL send the pitch to the Game Master with the appropriate prompt template
2. WHEN the Game Master receives a request, THE System SHALL include the generator type, user input, and conversation context in the API payload
3. WHEN the Inflection AI API returns a response, THE System SHALL extract the completion text and return it to the Learner within 10 seconds
4. WHERE the generator type is "mechanic-analyst", THE Game Master SHALL evaluate pitch balance, player type alignment, and mechanic feasibility
5. WHERE the generator type is "narrative-generator", THE Game Master SHALL provide a core metaphor, inciting incident, and hero role
6. WHERE the generator type is "dark-pattern-redesigner", THE Game Master SHALL identify ethical flaws and provide redesigned mechanics
7. IF the Inflection AI API call fails, THEN THE System SHALL return an error message to the Learner and log the failure details

### Requirement 2: Client-Side Simulation Components

**User Story:** As a corporate trainer, I want to experiment with different gamification mechanics in real-time, so that I can understand their impact on learner engagement without backend delays.

#### Acceptance Criteria

1. THE System SHALL provide a Player Type Analyzer that calculates dominant player types based on Learner responses
2. THE System SHALL provide a Reward Schedule Designer that simulates fixed ratio and variable ratio reward schedules
3. WHEN the Learner selects a reward schedule type, THE System SHALL update the simulation behavior immediately without server requests
4. THE System SHALL provide a Flow Channel Evaluator that maps skill level and difficulty to flow states
5. WHEN the Learner adjusts skill or difficulty sliders, THE System SHALL recalculate the flow state within 100 milliseconds
6. WHILE the Learner interacts with simulations, THE System SHALL display real-time feedback and visual indicators

### Requirement 3: Course Content Management

**User Story:** As a system administrator, I want to store gamification course modules with their interactive elements in the database, so that content can be dynamically rendered for learners.

#### Acceptance Criteria

1. THE System SHALL extend the Course model schema to support gamification-specific interactive element types
2. THE System SHALL store interactive elements with type, prompt template, and configuration data
3. THE System SHALL support the following interactive element types: reflection, playerTypeSimulator, rewardScheduleDesigner, flowChannelEvaluator, pitchAnalysisGenerator, narrativeGenerator, darkPatternRedesigner, roeDashboard, certificateGenerator
4. WHEN a Lesson document is saved, THE System SHALL validate that each interactive element has a valid type from the enumerated list
5. THE System SHALL store prompt templates for AI-powered interactive elements in the configuration field

### Requirement 4: ROE Analytics Dashboard

**User Story:** As an L&D manager, I want to view engagement metrics and completion rates, so that I can measure the return on engagement for the gamification course.

#### Acceptance Criteria

1. THE System SHALL provide an endpoint that returns monthly enrollment, completion, AI request, and time spent data
2. THE System SHALL render ROE data using bar charts with distinct colors for each metric
3. WHEN the ROE Dashboard loads, THE System SHALL fetch analytics data within 3 seconds
4. THE System SHALL display course completions, AI interactions, and total time spent as separate bars in the chart
5. IF the analytics data fetch fails, THEN THE System SHALL display an error message to the Learner

### Requirement 5: Certificate Generation

**User Story:** As a learner, I want to download a certificate of completion when I finish the course, so that I can demonstrate my mastery of gamification principles.

#### Acceptance Criteria

1. WHEN the Learner completes all course modules, THE System SHALL enable the certificate generation feature
2. WHEN the Learner requests a certificate, THE System SHALL generate a PDF document using pdf-lib in the browser
3. THE System SHALL include the Learner name, course title, and completion date on the certificate
4. WHEN the PDF is generated, THE System SHALL automatically download the file to the Learner's device
5. THE System SHALL format the certificate filename as "Certificate-{LearnerName}.pdf" with spaces replaced by underscores
6. IF the Learner name is missing, THEN THE System SHALL display an error message and prevent certificate generation

### Requirement 6: Interactive Element Routing

**User Story:** As a learner, I want to see the appropriate interactive component for each lesson activity, so that I can engage with diverse learning experiences throughout the course.

#### Acceptance Criteria

1. THE System SHALL provide a router component that maps interactive element types to React components
2. WHEN a Lesson contains interactive elements, THE System SHALL render each element using the appropriate component
3. THE System SHALL pass the Learner name and element configuration to interactive components
4. WHERE an interactive element type is "pitchAnalysisGenerator", THE System SHALL render the AIGameMasterGenerator with generator type "mechanic-analyst"
5. WHERE an interactive element type is "narrativeGenerator", THE System SHALL render the AIGameMasterGenerator with generator type "narrative-generator"
6. WHERE an interactive element type is "darkPatternRedesigner", THE System SHALL render the AIGameMasterGenerator with generator type "dark-pattern-redesigner"
7. IF an unknown interactive element type is encountered, THEN THE System SHALL display an error message indicating the unknown type

### Requirement 7: Concept Map Visualization

**User Story:** As a learner, I want to explore an interactive concept map of gamification principles, so that I can understand the relationships between key concepts.

#### Acceptance Criteria

1. THE System SHALL provide a Gamification Concept Map using React Flow
2. THE System SHALL display nodes for Gamification, Psychology (SDT), Design (MDA), Core Loop, and Player Types
3. THE System SHALL display edges showing relationships between concepts with descriptive labels
4. WHEN the Learner interacts with the concept map, THE System SHALL allow dragging nodes and zooming the view
5. THE System SHALL provide minimap and controls for navigation within the concept map

### Requirement 8: Environment Configuration

**User Story:** As a developer, I want to configure API keys and service endpoints through environment variables, so that the system can connect to external services securely.

#### Acceptance Criteria

1. THE System SHALL require environment variables for MongoDB URI, JWT secret, Inflection AI API key, Inflection AI API URL, AWS credentials, AWS region, and S3 bucket name
2. WHEN the AI service initializes, THE System SHALL read the Inflection AI API key and URL from environment variables
3. IF required environment variables are missing, THEN THE System SHALL log an error message and fail to start
4. THE System SHALL not expose API keys or secrets in client-side code or error messages

### Requirement 9: Reusable AI Component Interface

**User Story:** As a developer, I want to use a single reusable component for all AI-powered features, so that I can minimize code duplication and maintain consistency.

#### Acceptance Criteria

1. THE System SHALL provide an AIGameMasterGenerator component that accepts generator type, title, and description as props
2. THE System SHALL enforce a character limit of 5000 characters for user input
3. WHEN the Learner submits input, THE System SHALL display a loading state until the AI response is received
4. WHEN the AI response is received, THE System SHALL render the feedback in a visually distinct section
5. THE System SHALL display character count with visual warning when approaching the limit
6. IF the input length is zero or exceeds the limit, THEN THE System SHALL display an error message and prevent submission

### Requirement 10: Module Structure and Content Delivery

**User Story:** As a learner, I want to progress through six distinct modules covering gamification foundations, psychology, mechanics, core loops, narrative, and ethics, so that I can build comprehensive knowledge systematically.

#### Acceptance Criteria

1. THE System SHALL organize course content into six modules: Foundations, Psychology, Toolbox, The Loop, Story Mode, and Boss Battle
2. THE System SHALL provide at least three interactive features per module
3. WHEN a Learner accesses a module, THE System SHALL render lesson content blocks and interactive elements in sequence
4. THE System SHALL track Learner progress through modules and lessons
5. THE System SHALL enable certificate generation only when all modules are completed
