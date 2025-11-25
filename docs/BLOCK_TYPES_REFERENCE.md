# Block Types Reference

Quick reference for all available block types in the Admin Course Builder.

## Basic Blocks

### 🔤 Text Block
**Purpose:** Rich text content with formatting  
**Required Fields:** Content  
**Max Size:** N/A  
**Use Cases:** Explanations, instructions, learning objectives

**Configuration Options:**
- Rich text editor with formatting toolbar
- Headings (H1-H6)
- Bold, italic, underline, strikethrough
- Bullet and numbered lists
- Links and inline code
- Blockquotes

---

### 🎥 Video Block
**Purpose:** Embed or upload video content  
**Required Fields:** Video source (URL or file)  
**Max Size:** 100MB (uploads)  
**Use Cases:** Lectures, demonstrations, tutorials

**Configuration Options:**
- **Source Type:** Upload or Embed
- **Upload:** MP4, WebM, MOV files
- **Embed:** YouTube, Vimeo URLs
- **Title:** For accessibility
- **Autoplay:** Optional
- **Controls:** Show/hide player controls

**Supported Platforms:**
- YouTube (embed)
- Vimeo (embed)
- Direct S3 upload

---

### 🖼️ Image Block
**Purpose:** Display images with captions  
**Required Fields:** Image file, alt text  
**Max Size:** 5MB  
**Use Cases:** Diagrams, screenshots, infographics

**Configuration Options:**
- **Image File:** JPG, PNG, GIF, WebP
- **Alt Text:** Required for accessibility
- **Caption:** Optional descriptive text
- **Alignment:** Left, center, right
- **Size:** Small, medium, large, full-width

---

### 💻 Code Block
**Purpose:** Display code with syntax highlighting  
**Required Fields:** Code, language  
**Max Size:** N/A  
**Use Cases:** Code examples, technical documentation

**Configuration Options:**
- **Code:** The code content
- **Language:** Programming language for highlighting
- **Line Numbers:** Show/hide
- **Wrap Lines:** Enable/disable line wrapping

**Supported Languages:**
JavaScript, TypeScript, Python, Java, C++, C#, Ruby, PHP, Go, Rust, Swift, Kotlin, HTML, CSS, SCSS, SQL, JSON, YAML, XML, Markdown, Bash, Shell

---

### 📝 List Block
**Purpose:** Create structured lists  
**Required Fields:** List type, items  
**Max Size:** N/A  
**Use Cases:** Steps, requirements, checklists

**Configuration Options:**
- **List Type:** Bullet, Numbered, Checkbox
- **Items:** Add/remove list items
- **Nested Lists:** Support for sub-items

---

### ➖ Divider Block
**Purpose:** Visual separator between sections  
**Required Fields:** None  
**Max Size:** N/A  
**Use Cases:** Section breaks, visual organization

**Configuration Options:**
- **Style:** Solid, dashed, dotted
- **Thickness:** Thin, medium, thick
- **Spacing:** Margin above/below

---

## Interactive Blocks

### 💭 Reflection Block
**Purpose:** Prompt students for written reflections  
**Required Fields:** Question/prompt  
**Use Cases:** Critical thinking, self-assessment, journaling

**Configuration Options:**
- **Question/Prompt:** The reflection question
- **Minimum Length:** Character count requirement
- **Placeholder:** Hint text
- **Private/Public:** Visibility settings

**Student Experience:**
- Text area for response
- Character counter
- Save draft functionality
- Submit when complete

---

### 📊 Poll Block
**Purpose:** Gather student opinions  
**Required Fields:** Question, options (2-6)  
**Use Cases:** Quick feedback, gauging understanding

**Configuration Options:**
- **Question:** The poll question
- **Options:** 2-6 answer choices
- **Allow Multiple:** Single or multiple selection
- **Show Results:** Display results after voting

**Student Experience:**
- Select one or more options
- Submit vote
- View aggregated results

---

### ☁️ Word Cloud Block
**Purpose:** Visualize collective responses  
**Required Fields:** Prompt  
**Use Cases:** Brainstorming, concept association

**Configuration Options:**
- **Prompt:** What to respond to
- **Max Words:** Words per response
- **Min Word Length:** Filter short words
- **Update Frequency:** Real-time or on-demand

**Student Experience:**
- Enter words or short phrases
- Submit response
- View live word cloud
- Larger words = more frequent

---

### 🤖 AI Generator Block
**Purpose:** Generate content with AI assistance  
**Required Fields:** Generator type, title  
**Use Cases:** Creative writing, ideation, examples

**Configuration Options:**
- **Generator Type:** Story, scenario, example, etc.
- **Title:** Block title
- **Description:** Instructions
- **Placeholder:** Input hint
- **AI Model:** Model selection
- **Temperature:** Creativity level
- **Max Length:** Output length limit

**Student Experience:**
- Enter prompt or parameters
- Click generate
- Review AI output
- Regenerate or edit

---

### ⚖️ Choice Comparison Block
**Purpose:** Compare two options with analysis  
**Required Fields:** Scenario, two options  
**Use Cases:** Decision-making, trade-off analysis

**Configuration Options:**
- **Scenario:** Decision context
- **Option A:** First choice with details
- **Option B:** Second choice with details
- **Criteria:** Comparison dimensions
- **Scoring:** Enable/disable scoring

**Student Experience:**
- Review both options
- Analyze pros/cons
- Rate on criteria
- Make final choice
- See reasoning

---

### 🎨 Design Fixer Block
**Purpose:** Identify and fix design problems  
**Required Fields:** Design example  
**Use Cases:** Design thinking, UX education

**Configuration Options:**
- **Design Example:** Image or description
- **Problem Areas:** Issues to identify
- **Hints:** Optional guidance
- **Solution Examples:** Reference fixes

**Student Experience:**
- View design example
- Identify problems
- Propose solutions
- Compare with examples

---

### 🎮 Player Type Simulator Block
**Purpose:** Explore player types in gamification  
**Required Fields:** Scenario  
**Use Cases:** Gamification courses, user psychology

**Configuration Options:**
- **Scenario:** Gamification context
- **Player Types:** Achiever, Explorer, Socializer, Killer
- **Mechanics:** Game elements to test
- **Feedback:** Response patterns

**Student Experience:**
- Select player type
- Experience scenario
- See type-specific responses
- Compare different types

---

### 🎁 Reward Schedule Designer Block
**Purpose:** Design and test reward schedules  
**Required Fields:** Context  
**Use Cases:** Behavioral psychology, gamification

**Configuration Options:**
- **Context:** Reward scenario
- **Schedule Types:** Fixed, variable, ratio, interval
- **Parameters:** Frequency, amount
- **Visualization:** Graph options

**Student Experience:**
- Choose schedule type
- Set parameters
- Run simulation
- View behavior patterns
- Compare schedules

---

### 🌊 Flow Channel Evaluator Block
**Purpose:** Assess flow state potential  
**Required Fields:** Activity  
**Use Cases:** Learning design, engagement

**Configuration Options:**
- **Activity:** Activity to evaluate
- **Criteria:** Challenge, skill, feedback, etc.
- **Scale:** Rating scale
- **Visualization:** Flow channel diagram

**Student Experience:**
- Rate activity on criteria
- View position in flow channel
- Get recommendations
- Adjust parameters

---

### 🎯 Pitch Analysis Generator Block
**Purpose:** Analyze and improve pitches  
**Required Fields:** Pitch content  
**Use Cases:** Business courses, communication

**Configuration Options:**
- **Pitch Type:** Elevator, investor, sales
- **Analysis Criteria:** Clarity, impact, structure
- **AI Feedback:** Enable/disable
- **Examples:** Reference pitches

**Student Experience:**
- Enter pitch content
- Get AI analysis
- Review feedback
- Revise and resubmit

---

### 📖 Narrative Generator Block
**Purpose:** Create interactive narratives  
**Required Fields:** Story parameters  
**Use Cases:** Creative writing, storytelling

**Configuration Options:**
- **Genre:** Story type
- **Parameters:** Characters, setting, conflict
- **Branching:** Enable choices
- **Length:** Story length

**Student Experience:**
- Set story parameters
- Generate narrative
- Make choices (if branching)
- View complete story

---

### 🚫 Dark Pattern Redesigner Block
**Purpose:** Identify and fix dark patterns  
**Required Fields:** Design example  
**Use Cases:** UX ethics, design courses

**Configuration Options:**
- **Example:** Dark pattern to analyze
- **Pattern Type:** Specific dark pattern
- **Ethical Principles:** Guidelines
- **Solution Framework:** Redesign approach

**Student Experience:**
- Identify dark pattern
- Explain harm
- Propose ethical redesign
- Compare solutions

---

### 📈 ROE Dashboard Block
**Purpose:** Return on Education analysis  
**Required Fields:** Course/program data  
**Use Cases:** Educational leadership, analytics

**Configuration Options:**
- **Metrics:** Completion, engagement, outcomes
- **Data Sources:** Manual or API
- **Visualization:** Charts and graphs
- **Time Period:** Date range

**Student Experience:**
- View dashboard
- Explore metrics
- Filter data
- Export reports

---

### 🗺️ Journey Timeline Block
**Purpose:** Visualize learning journeys  
**Required Fields:** Journey stages  
**Use Cases:** Course overview, progress tracking

**Configuration Options:**
- **Stages:** Journey milestones
- **Timeline Type:** Linear, branching
- **Icons:** Stage icons
- **Descriptions:** Stage details

**Student Experience:**
- View timeline
- See current position
- Navigate to stages
- Track progress

---

### 🏆 Certificate Generator Block
**Purpose:** Generate completion certificates  
**Required Fields:** Template  
**Use Cases:** Course completion, achievements

**Configuration Options:**
- **Template:** Certificate design
- **Fields:** Name, date, course, etc.
- **Signature:** Instructor signature
- **Branding:** Logo, colors
- **Format:** PDF, PNG

**Student Experience:**
- Complete requirements
- Generate certificate
- Download/print
- Share on social media

---

### ✅ Final Assessment Block
**Purpose:** Comprehensive course assessment  
**Required Fields:** Questions, passing score  
**Use Cases:** Summative assessment, certification

**Configuration Options:**
- **Questions:** Multiple choice, short answer, essay
- **Passing Score:** Minimum percentage
- **Time Limit:** Optional time constraint
- **Attempts:** Number of retries
- **Feedback:** Immediate or delayed
- **Randomization:** Question order

**Student Experience:**
- Start assessment
- Answer questions
- Submit for grading
- View results
- Retry if needed

---

## Block Selection Guide

### By Learning Objective

**Knowledge Acquisition:**
- Text Block
- Video Block
- Code Block
- Image Block

**Comprehension Check:**
- Poll Block
- Reflection Block
- Quiz (in Final Assessment)

**Application:**
- AI Generator Block
- Design Fixer Block
- Code Block (with exercises)

**Analysis:**
- Choice Comparison Block
- Flow Channel Evaluator Block
- ROE Dashboard Block

**Synthesis:**
- Narrative Generator Block
- Reward Schedule Designer Block
- Player Type Simulator Block

**Evaluation:**
- Final Assessment Block
- Dark Pattern Redesigner Block
- Pitch Analysis Generator Block

### By Course Type

**Technical/Programming:**
- Code Block
- Text Block
- Video Block
- AI Generator Block

**Design/UX:**
- Image Block
- Design Fixer Block
- Dark Pattern Redesigner Block
- Choice Comparison Block

**Business:**
- Pitch Analysis Generator Block
- ROE Dashboard Block
- Choice Comparison Block
- Final Assessment Block

**Gamification:**
- Player Type Simulator Block
- Reward Schedule Designer Block
- Flow Channel Evaluator Block
- Certificate Generator Block

**General Education:**
- Text Block
- Video Block
- Reflection Block
- Poll Block
- Word Cloud Block
- Final Assessment Block

---

## Best Practices by Block Type

### Content Blocks (Text, Video, Image)
- Keep content focused and concise
- Use headings for structure
- Optimize media files before upload
- Always provide alt text for images

### Interactive Blocks
- Provide clear instructions
- Set appropriate constraints
- Give immediate feedback when possible
- Allow multiple attempts for learning

### Assessment Blocks
- Align with learning objectives
- Provide constructive feedback
- Set reasonable time limits
- Allow retries for formative assessment

### Engagement Blocks (Poll, Word Cloud)
- Use early in lessons to activate prior knowledge
- Review results with students
- Keep questions simple and focused
- Use for formative, not summative, assessment

---

**Last Updated:** November 2025
**Version:** 2.0
