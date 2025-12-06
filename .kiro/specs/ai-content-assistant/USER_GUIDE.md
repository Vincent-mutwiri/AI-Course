# AI Content Assistant - User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Block-Specific AI Capabilities](#block-specific-ai-capabilities)
4. [Content Templates](#content-templates)
5. [Content Refinement](#content-refinement)
6. [Lesson Outline Generation](#lesson-outline-generation)
7. [Generation History](#generation-history)
8. [AI Settings](#ai-settings)
9. [Usage Dashboard](#usage-dashboard)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

## Introduction

The AI Content Assistant is an intelligent content generation system that accelerates course creation by providing context-aware AI suggestions for block content. It integrates seamlessly with the Admin Course Builder V2, helping you create high-quality educational content in seconds.

### Key Features
- **Inline Generation**: Generate content directly within block editors
- **Context-Aware**: AI learns from your course structure and existing content
- **One-Click Refinement**: Improve generated content with simple refinement options
- **Content Templates**: Pre-configured prompts for common scenarios
- **Multi-Block Generation**: Create entire lesson outlines at once
- **Generation History**: Reuse and reference previously generated content
- **Usage Tracking**: Monitor AI usage and costs

### Benefits
- **60-80% faster course creation**: Generate content in seconds instead of minutes
- **Consistent quality**: AI maintains tone and terminology across your course
- **Reduced writer's block**: Get started quickly with AI suggestions
- **Accessibility compliance**: Auto-generate alt text and captions
- **Full creative control**: Edit, refine, or regenerate any content

## Getting Started

### Accessing the AI Assistant

The AI Content Assistant is available in all block editors when you're logged in as an admin.

1. Navigate to the Admin Course Builder
2. Open any course and lesson
3. Click on a block or add a new block
4. Look for the **"Generate with AI"** button or the AI Assistant panel

### Your First Generation

Let's generate content for a text block:

1. **Open a text block editor**
2. **Click "Generate with AI"** - The AI Assistant panel will expand
3. **Enter a prompt**: For example, "Explain the concept of machine learning"
4. **Select options** (optional):
   - Tone: Conversational
   - Reading Level: College
   - Length: Moderate
5. **Click "Generate"** - Wait 5-10 seconds for the AI to generate content
6. **Review the content** - The generated text appears in the preview area
7. **Accept or refine**:
   - Click "Accept" to insert the content into your block
   - Click "Refine" to improve the content
   - Click "Regenerate" to try again with the same prompt

### Keyboard Shortcuts

Speed up your workflow with these shortcuts:

- **Cmd/Ctrl + G**: Open AI Assistant panel
- **Cmd/Ctrl + Shift + G**: Generate with current prompt
- **Cmd/Ctrl + R**: Regenerate content
- **Cmd/Ctrl + Shift + R**: Open refinement options

## Block-Specific AI Capabilities

### Text Block

**What it generates:**
- Explanations and definitions
- Instructions and procedures
- Summaries and overviews
- Examples and case studies
- Learning objectives
- Lesson introductions

**How to use:**
1. Open the text block editor
2. Click "Generate with AI"
3. Enter your topic or select a template
4. Choose content type: Explanation, Instructions, Summary, or Example
5. Generate and review

**Tips:**
- Be specific in your prompts: "Explain photosynthesis for high school students"
- Include context: "Write an introduction to Module 2 on data structures"
- Use templates for common scenarios like lesson intros or summaries

**Example prompts:**
- "Explain the difference between supervised and unsupervised learning"
- "Write step-by-step instructions for setting up a Python development environment"
- "Create a summary of key concepts from this lesson on neural networks"

### Video Block

**What it generates:**
- Video scripts with timestamps
- Video titles and descriptions
- Key points to cover
- Section breakdowns (intro, main content, conclusion)

**How to use:**
1. Open the video block editor
2. Click "Generate Script"
3. Enter the video topic and desired duration
4. Review the generated script with timestamps
5. Use the script to guide your video recording

**Tips:**
- Specify video duration for appropriate pacing
- Include learning objectives in your prompt
- Generated scripts include natural transitions between sections

**Example prompts:**
- "Create a 5-minute video script introducing React hooks"
- "Generate a video outline for explaining database normalization"
- "Write a script for a 10-minute tutorial on Git branching"

### Code Block

**What it generates:**
- Working code examples
- Inline comments explaining the code
- Text explanations of what the code does
- Best practices and conventions
- Related concepts to cover

**How to use:**
1. Open the code block editor
2. Click "Generate Code Example"
3. Specify the programming language and concept
4. Review the generated code and explanation
5. The language is auto-detected from the code

**Tips:**
- Specify the programming language explicitly
- Include skill level: "beginner-friendly" or "advanced"
- Ask for specific patterns: "using async/await" or "with error handling"

**Example prompts:**
- "Generate a Python function to calculate factorial with recursion"
- "Create a JavaScript example of the observer pattern"
- "Write a SQL query to join three tables with filtering"

### Reflection Block

**What it generates:**
- Thought-provoking reflection prompts
- Multiple prompt options (3-5 variations)
- Different prompt types: open-ended, scenario-based, comparative
- Suggested minimum response lengths

**How to use:**
1. Open the reflection block editor
2. Click "Generate Prompt"
3. Enter the lesson topic
4. Review 3-5 generated prompt options
5. Select the one that best fits your learning objectives

**Tips:**
- Generated prompts encourage critical thinking
- Prompts connect to real-world applications
- Choose prompts that align with Bloom's taxonomy levels

**Example prompts:**
- "Generate reflection prompts for a lesson on ethical AI"
- "Create prompts about applying agile methodology in real projects"
- "Write reflection questions for a lesson on climate change"

### Poll Block

**What it generates:**
- Clear poll questions
- 3-5 mutually exclusive answer options
- Poll type suggestions (opinion, knowledge check, preference)
- Follow-up discussion questions

**How to use:**
1. Open the poll block editor
2. Click "Generate Poll"
3. Enter the topic or concept
4. Review the question and options
5. Customize if needed

**Tips:**
- Generated options are balanced and comprehensive
- Use polls for engagement and formative assessment
- Follow-up questions help facilitate discussion

**Example prompts:**
- "Create a poll about preferred learning styles"
- "Generate a knowledge check poll on JavaScript data types"
- "Write a poll about ethical considerations in AI development"

### Interactive Block (Quiz/Assessment)

**What it generates:**
- Multiple choice questions
- True/false questions
- Short answer questions
- Correct answers and explanations
- Distractors based on common misconceptions
- Questions aligned with Bloom's taxonomy

**How to use:**
1. Open the interactive block editor (Final Assessment type)
2. Click "Generate Questions"
3. Specify question count and difficulty level
4. Review generated questions with answers
5. Edit or regenerate individual questions

**Tips:**
- Specify Bloom's taxonomy level: "knowledge", "application", "analysis"
- Generated distractors reflect realistic misconceptions
- Explanations help learners understand correct answers

**Example prompts:**
- "Generate 5 multiple choice questions on Python loops at application level"
- "Create 3 true/false questions about database transactions"
- "Write assessment questions for a lesson on UX design principles"

### List Block

**What it generates:**
- Structured lists (numbered or bulleted)
- Steps and procedures
- Requirements and prerequisites
- Tips and best practices
- Checklists
- Auto-detected list type

**How to use:**
1. Open the list block editor
2. Click "Generate List"
3. Specify list type: steps, requirements, tips, or checklist
4. Review generated items
5. Reorder or edit as needed

**Tips:**
- Be specific about list type for better results
- Generated lists are comprehensive and well-organized
- Use for procedural content or key takeaways

**Example prompts:**
- "Generate a checklist for code review best practices"
- "Create steps for deploying a web application"
- "List requirements for learning machine learning"

### Image Block

**What it generates:**
- Descriptive alt text (under 125 characters)
- Extended caption text
- Context-aware descriptions based on surrounding content

**How to use:**
1. Upload an image to the image block
2. Click "Generate Alt Text"
3. Review the generated alt text and caption
4. Edit if needed for accuracy

**Tips:**
- AI analyzes surrounding text for context
- Generated alt text follows WCAG 2.1 AA guidelines
- Captions provide additional educational context

**Example use cases:**
- Diagrams and charts
- Screenshots and UI examples
- Photographs and illustrations

## Content Templates

Templates are pre-configured prompts for common content generation scenarios. They save time and ensure consistency.

### Available Templates

#### Lesson Introduction
- **Purpose**: Start lessons with engaging introductions
- **Includes**: Hook, overview, learning objectives
- **Best for**: Text blocks at the beginning of lessons

#### Learning Objectives
- **Purpose**: Define clear, measurable learning outcomes
- **Includes**: Action verbs, specific outcomes, assessment criteria
- **Best for**: Text blocks in lesson overview

#### Concept Explanation
- **Purpose**: Explain complex concepts clearly
- **Includes**: Definition, examples, analogies, applications
- **Best for**: Text blocks in main content

#### Lesson Summary
- **Purpose**: Recap key points and reinforce learning
- **Includes**: Main concepts, key takeaways, next steps
- **Best for**: Text blocks at the end of lessons

#### Practice Activity
- **Purpose**: Create hands-on learning activities
- **Includes**: Instructions, expected outcomes, tips
- **Best for**: Text or list blocks for activities

#### Knowledge Check
- **Purpose**: Quick formative assessments
- **Includes**: Questions, answers, explanations
- **Best for**: Quiz or poll blocks

### Using Templates

1. **Open the AI Assistant panel** in any block editor
2. **Click the template dropdown** at the top
3. **Select a template** - The prompt field auto-fills
4. **Customize the prompt** (optional) - Add specific details
5. **Generate** - Click the generate button
6. **Review and accept** - Edit if needed

### Creating Custom Templates

1. **Navigate to AI Settings** in the admin dashboard
2. **Click "Custom Templates"**
3. **Click "Add Template"**
4. **Fill in template details**:
   - Name: Descriptive name for your template
   - Description: What the template generates
   - Block Types: Which blocks can use this template
   - Prompt Template: The prompt with placeholders
5. **Save** - Your template is now available in the dropdown

**Placeholder variables:**
- `{courseTitle}` - Current course title
- `{moduleName}` - Current module name
- `{lessonName}` - Current lesson name
- `{topic}` - User-entered topic
- `{objectives}` - Learning objectives

**Example custom template:**
```
Name: Case Study
Description: Generate a real-world case study
Block Types: Text
Prompt: Create a detailed case study about {topic} that demonstrates 
concepts from {lessonName}. Include background, challenges, solution, 
and outcomes. Make it relevant to {courseTitle}.
```

## Content Refinement

Refinement allows you to improve AI-generated content without starting over.

### Refinement Options

#### Make Shorter
- **Purpose**: Reduce content length while preserving key points
- **Use when**: Content is too verbose or exceeds space constraints
- **Result**: 30-50% reduction in length

#### Make Longer
- **Purpose**: Expand content with more details and examples
- **Use when**: Content needs more depth or explanation
- **Result**: 50-100% increase in length

#### Simplify Language
- **Purpose**: Use simpler vocabulary and shorter sentences
- **Use when**: Content is too complex for target audience
- **Result**: Lower reading level, clearer explanations

#### Add Examples
- **Purpose**: Include concrete examples and use cases
- **Use when**: Content is too abstract or theoretical
- **Result**: 1-3 relevant examples added

#### Change Tone
- **Purpose**: Adjust formality and style
- **Options**: Formal, conversational, encouraging
- **Use when**: Tone doesn't match course style
- **Result**: Rewritten with new tone

### How to Refine Content

1. **Generate content** using the AI Assistant
2. **Review the generated content** in the preview area
3. **Click "Refine"** - Refinement options appear
4. **Select a refinement option** - Click the button
5. **Wait 3-5 seconds** - AI processes the refinement
6. **Review refined content** - Compare with original
7. **Refine again** (optional) - Apply multiple refinements
8. **Accept** - Insert the refined content into your block

### Multiple Refinements

You can apply multiple refinements sequentially:

**Example workflow:**
1. Generate: "Explain neural networks"
2. Refine: "Add Examples" → Content now includes 2 examples
3. Refine: "Simplify Language" → Examples are now easier to understand
4. Accept → Insert into block

### Best Practices for Refinement

- **Start with generation**: Get a solid foundation first
- **One refinement at a time**: See the effect of each change
- **Use "Regenerate" for major changes**: Refinement is for tweaks
- **Preserve your edits**: Accept content before manual editing
- **Experiment**: Try different refinement combinations

## Lesson Outline Generation

Generate complete lesson structures with multiple blocks at once.

### What It Does

The Lesson Outline Generator creates a suggested sequence of blocks for an entire lesson, including:
- Block types (text, video, code, quiz, etc.)
- Block titles and descriptions
- Placeholder content for each block
- Estimated time for each block
- Logical flow and progression

### How to Use

1. **Open a lesson** in the course builder
2. **Click "Generate Lesson Outline"** (in empty lesson or toolbar)
3. **Enter lesson details**:
   - Topic: Main subject of the lesson
   - Learning Objectives: What students should learn (2-5 objectives)
   - Block Count: Preferred number of blocks (8-12 default)
4. **Click "Generate Outline"** - Wait 10-15 seconds
5. **Review suggested blocks** in the preview list
6. **Reorder blocks** (optional) - Drag to rearrange
7. **Select blocks to add**:
   - Check/uncheck individual blocks
   - Click "Accept All" or "Reject All"
8. **Click "Add Selected Blocks"** - Blocks appear on canvas
9. **Edit block content** - Refine placeholder content as needed

### Example Outline

**Topic**: Introduction to React Hooks
**Objectives**: 
- Understand what hooks are and why they exist
- Use useState and useEffect hooks
- Build a simple component with hooks

**Generated Outline**:
1. Text Block: "What are React Hooks?" (5 min)
2. Video Block: "Hooks Overview" (8 min)
3. Code Block: "useState Example" (10 min)
4. Text Block: "Understanding useEffect" (7 min)
5. Code Block: "useEffect Example" (10 min)
6. Reflection Block: "When to Use Hooks" (5 min)
7. Interactive Block: "Hooks Quiz" (10 min)
8. Text Block: "Lesson Summary" (3 min)

### Tips for Better Outlines

- **Be specific with objectives**: Clear objectives = better structure
- **Adjust block count**: More blocks = more granular lessons
- **Review the flow**: Ensure logical progression
- **Customize placeholder content**: Use AI Assistant in each block
- **Save time on structure**: Focus your effort on content quality

## Generation History

Access and reuse previously generated content.

### What's Stored

The generation history tracks:
- All generated content for each course
- Original prompts used
- Block type and generation date
- Refinements applied
- Generation settings (tone, length, reading level)

### Accessing History

1. **Open the AI Assistant panel** in any block editor
2. **Click "History"** tab at the top
3. **Browse previous generations** organized by:
   - Block type (filter dropdown)
   - Date (most recent first)
   - Course (current course only)

### Using History

#### Copy to Clipboard
1. Find the content you want to reuse
2. Click the "Copy" icon
3. Paste into any text editor or block

#### Reuse in Current Block
1. Find relevant content
2. Click "Reuse" button
3. Content loads into the current block editor
4. Edit or refine as needed

#### Delete Entry
1. Find content you no longer need
2. Click the "Delete" icon
3. Confirm deletion

#### Clear All History
1. Click "Clear All" at the bottom of history
2. Confirm you want to delete all history for this course
3. History is permanently removed

### History Limits

- **Storage**: 50 most recent generations per course
- **Retention**: 30 days (older entries auto-deleted)
- **Location**: Stored in browser localStorage
- **Privacy**: History is local to your browser

### Best Practices

- **Review history before generating**: You may have already created similar content
- **Use history for consistency**: Reuse successful prompts and patterns
- **Clean up regularly**: Delete outdated or unused entries
- **Export important content**: Copy to external docs for backup

## AI Settings

Customize AI behavior and set default preferences.

### Accessing Settings

1. Navigate to **Admin Dashboard**
2. Click **"AI Settings"** in the sidebar
3. Or click the settings icon in the AI Assistant panel

### Available Settings

#### Default Tone
Controls the writing style of generated content.

**Options:**
- **Formal**: Academic, professional language
  - Use for: Technical courses, professional development
  - Example: "The implementation of asynchronous operations..."
  
- **Conversational**: Friendly, approachable language
  - Use for: General education, beginner courses
  - Example: "Let's talk about how async operations work..."
  
- **Encouraging**: Supportive, motivational language
  - Use for: Skill-building, challenging topics
  - Example: "You're doing great! Now let's explore async operations..."

#### Default Reading Level
Controls vocabulary complexity and sentence structure.

**Options:**
- **High School**: Grades 9-12 reading level
  - Vocabulary: Common words, some technical terms
  - Sentences: Moderate complexity
  
- **College**: Undergraduate reading level
  - Vocabulary: Advanced, discipline-specific terms
  - Sentences: Complex, varied structure
  
- **Professional**: Graduate/professional reading level
  - Vocabulary: Specialized, technical terminology
  - Sentences: Sophisticated, dense information

#### Default Content Length
Controls how much content is generated.

**Options:**
- **Brief**: Short, concise content
  - Text blocks: 100-200 words
  - Lists: 3-5 items
  - Use for: Quick explanations, summaries
  
- **Moderate**: Balanced content length
  - Text blocks: 200-400 words
  - Lists: 5-8 items
  - Use for: Standard lessons, explanations
  
- **Detailed**: Comprehensive, in-depth content
  - Text blocks: 400-600 words
  - Lists: 8-12 items
  - Use for: Complex topics, thorough coverage

### Per-Generation Overrides

You can override default settings for individual generations:

1. Open the AI Assistant panel
2. Expand "Advanced Options"
3. Select different tone, reading level, or length
4. Generate content
5. Settings return to defaults for next generation

### Saving Settings

- Settings are saved automatically
- Settings persist across sessions
- Settings are user-specific (not course-specific)
- Reset to defaults with "Reset Settings" button

## Usage Dashboard

Monitor AI usage and costs.

### Accessing the Dashboard

1. Navigate to **Admin Dashboard**
2. Click **"AI Usage"** in the sidebar
3. View usage statistics and charts

### Dashboard Metrics

#### Total Generations
- Count of all AI generations
- Breakdown by block type
- Trend over time (line chart)

#### Cache Hit Rate
- Percentage of requests served from cache
- Higher rate = lower costs
- Target: 30-40% hit rate

#### Estimated Cost
- Approximate cost based on token usage
- Calculated from API pricing
- Updated in real-time

#### Usage by Course
- Generations per course
- Identify most AI-assisted courses
- Filter by date range

#### Usage by Admin
- Generations per admin user
- Track team usage patterns
- Useful for training and support

### Filters

- **Date Range**: Last 7 days, 30 days, 90 days, custom
- **Course**: Filter by specific course
- **Block Type**: Filter by content type
- **Admin User**: Filter by user (admin view only)

### Exporting Data

1. Click "Export" button
2. Select format: CSV or JSON
3. Choose date range
4. Download file

### Cost Management Tips

- **Use cache**: Similar prompts retrieve cached content
- **Refine instead of regenerate**: Refinement uses fewer tokens
- **Use templates**: Pre-configured prompts are optimized
- **Review before generating**: Avoid unnecessary generations
- **Batch outline generation**: Generate multiple blocks at once

## Best Practices

### Writing Effective Prompts

#### Be Specific
❌ "Explain databases"
✅ "Explain relational databases for beginners, including tables, rows, and relationships"

#### Include Context
❌ "Create a quiz"
✅ "Create a 5-question quiz on SQL joins for college students who have completed the basics module"

#### Specify Format
❌ "Write about functions"
✅ "Write a step-by-step guide to creating functions in Python, with code examples"

#### Use Action Verbs
- Explain, describe, compare, contrast
- List, outline, summarize
- Create, generate, write
- Demonstrate, illustrate, show

### Leveraging Course Context

The AI automatically includes course context, but you can enhance it:

- **Reference previous lessons**: "Building on the concepts from Module 1..."
- **Connect to objectives**: "Explain how this relates to our learning objective about..."
- **Maintain terminology**: Use consistent terms from earlier content

### Iterative Refinement

Don't expect perfection on first generation:

1. **Generate** with a clear prompt
2. **Review** for accuracy and relevance
3. **Refine** with specific improvements
4. **Edit manually** for final polish
5. **Accept** and move to next block

### Quality Control

Always review AI-generated content for:

- **Accuracy**: Verify facts and technical details
- **Relevance**: Ensure content matches learning objectives
- **Clarity**: Check for confusing or ambiguous language
- **Completeness**: Add missing information
- **Tone**: Adjust to match your course style

### Combining AI and Manual Creation

Use AI strategically:

- **AI for structure**: Generate outlines and frameworks
- **AI for first drafts**: Get started quickly
- **Manual for expertise**: Add your unique insights
- **Manual for examples**: Use real-world cases from your experience
- **AI for variation**: Generate multiple options, pick the best

### Accessibility Considerations

- **Always review alt text**: Ensure accuracy for images
- **Check reading level**: Match to your audience
- **Use clear language**: Simplify when needed
- **Provide examples**: Make abstract concepts concrete
- **Test with screen readers**: Verify accessibility

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Generation Failed" Error

**Possible Causes:**
- Network connectivity issues
- API timeout
- Rate limiting
- Invalid prompt

**Solutions:**
1. Check your internet connection
2. Click "Retry" to try again
3. Simplify your prompt (reduce length)
4. Wait 30 seconds and try again (rate limit)
5. Check AI Usage Dashboard for service status

#### Issue: Generated Content is Off-Topic

**Possible Causes:**
- Vague or ambiguous prompt
- Missing context
- Wrong block type selected

**Solutions:**
1. Be more specific in your prompt
2. Include course/lesson context explicitly
3. Use a content template
4. Try regenerating with a clearer prompt
5. Use refinement: "Change Tone" or "Simplify"

#### Issue: Content is Too Long/Short

**Possible Causes:**
- Default length setting doesn't match needs
- Prompt doesn't specify desired length

**Solutions:**
1. Use refinement: "Make Shorter" or "Make Longer"
2. Adjust default length in AI Settings
3. Specify length in prompt: "Write a brief explanation..."
4. Override length setting for this generation

#### Issue: Content Quality is Poor

**Possible Causes:**
- Insufficient context in prompt
- Wrong reading level
- Generic template used

**Solutions:**
1. Add more details to your prompt
2. Adjust reading level in settings
3. Use a more specific template
4. Provide examples in your prompt
5. Regenerate with refined prompt
6. Edit manually after generation

#### Issue: Cache Not Working

**Possible Causes:**
- Browser localStorage disabled
- Cache cleared recently
- Prompt variations (even small changes create new cache keys)

**Solutions:**
1. Enable localStorage in browser settings
2. Use exact same prompts for cache hits
3. Check cache statistics in Usage Dashboard
4. Clear browser cache and try again

#### Issue: Slow Generation Times

**Possible Causes:**
- Complex prompts requiring more processing
- High API load
- Network latency

**Solutions:**
1. Simplify your prompt
2. Try during off-peak hours
3. Check your internet speed
4. Use cached content when available
5. Generate outlines instead of individual blocks

#### Issue: Can't Find AI Assistant Panel

**Possible Causes:**
- Not logged in as admin
- Panel is collapsed
- Browser compatibility issue

**Solutions:**
1. Verify admin login status
2. Look for "Generate with AI" button
3. Click to expand the panel
4. Try keyboard shortcut: Cmd/Ctrl + G
5. Refresh the page
6. Use a modern browser (Chrome, Firefox, Safari, Edge)

#### Issue: Keyboard Shortcuts Not Working

**Possible Causes:**
- Focus is not in the editor
- Conflicting browser extensions
- Operating system shortcuts override

**Solutions:**
1. Click inside the block editor first
2. Disable conflicting browser extensions
3. Check for OS-level shortcut conflicts
4. Use mouse/click alternatives

#### Issue: History Not Saving

**Possible Causes:**
- Browser localStorage full
- Private/incognito mode
- Browser settings blocking storage

**Solutions:**
1. Clear old history entries
2. Exit private browsing mode
3. Enable localStorage in browser settings
4. Check browser storage quota

### Error Messages

#### "Network Error: Unable to Connect"
- **Meaning**: Cannot reach the API server
- **Action**: Check internet connection, try again

#### "Request Timeout"
- **Meaning**: Generation took too long
- **Action**: Simplify prompt, try again with shorter content

#### "Rate Limit Exceeded"
- **Meaning**: Too many requests in short time
- **Action**: Wait 60 seconds, then retry

#### "Invalid Prompt"
- **Meaning**: Prompt contains prohibited content or formatting
- **Action**: Revise prompt, remove special characters

#### "Service Unavailable"
- **Meaning**: AI service is temporarily down
- **Action**: Check status page, try again later

#### "Insufficient Permissions"
- **Meaning**: Not authorized to use AI features
- **Action**: Verify admin login, contact administrator

### Getting Help

If you continue to experience issues:

1. **Check the FAQ**: Review common questions and answers
2. **Contact Support**: Email support with:
   - Description of the issue
   - Steps to reproduce
   - Screenshots (if applicable)
   - Browser and OS information
3. **Report a Bug**: Use the bug report form with:
   - Expected behavior
   - Actual behavior
   - Error messages
4. **Request a Feature**: Submit feature requests through the feedback form

### Performance Tips

- **Use templates**: Faster than custom prompts
- **Leverage cache**: Reuse similar prompts
- **Generate outlines**: Batch creation is more efficient
- **Refine vs regenerate**: Refinement is faster
- **Work offline**: Edit cached content without API calls

---

## Quick Reference Card

### Keyboard Shortcuts
- `Cmd/Ctrl + G` - Open AI Assistant
- `Cmd/Ctrl + Shift + G` - Generate
- `Cmd/Ctrl + R` - Regenerate
- `Cmd/Ctrl + Shift + R` - Refine

### Refinement Options
- Make Shorter
- Make Longer
- Simplify Language
- Add Examples
- Change Tone

### Content Templates
- Lesson Introduction
- Learning Objectives
- Concept Explanation
- Lesson Summary
- Practice Activity
- Knowledge Check

### Block Types with AI
- Text Block
- Video Block
- Code Block
- Reflection Block
- Poll Block
- Interactive Block (Quiz)
- List Block
- Image Block (Alt Text)

---

**Need more help?** Visit the [FAQ](./FAQ.md) or contact support.
