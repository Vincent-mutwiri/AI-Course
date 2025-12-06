# AI Content Assistant - Block-Specific Capabilities Reference

This document provides detailed information about AI capabilities for each block type in the Admin Course Builder V2.

## Table of Contents
1. [Text Block](#text-block)
2. [Video Block](#video-block)
3. [Code Block](#code-block)
4. [Reflection Block](#reflection-block)
5. [Poll Block](#poll-block)
6. [Interactive Block (Quiz/Assessment)](#interactive-block-quizassessment)
7. [List Block](#list-block)
8. [Image Block](#image-block)
9. [Divider Block](#divider-block)
10. [AI Generator Block](#ai-generator-block)

---

## Text Block

### Overview
The Text Block is the most versatile block type, supporting rich text content for explanations, instructions, summaries, and more.

### AI Capabilities

#### Content Types
1. **Explanation**: Detailed explanations of concepts
2. **Instructions**: Step-by-step procedural content
3. **Summary**: Concise overviews and recaps
4. **Example**: Concrete examples and use cases
5. **Introduction**: Engaging lesson openings
6. **Learning Objectives**: Clear, measurable outcomes

#### Generation Options
- **Tone**: Formal, Conversational, Encouraging
- **Reading Level**: High School, College, Professional
- **Length**: Brief (100-200 words), Moderate (200-400 words), Detailed (400-600 words)

#### Output Format
- Formatted HTML with headings, paragraphs, lists
- Proper semantic structure (h2, h3, p, ul, ol)
- Bold and italic emphasis where appropriate
- Links to external resources (when relevant)

### Example Prompts

**Basic Explanation:**
```
Explain the concept of object-oriented programming for college students
```

**Contextual Instruction:**
```
Write step-by-step instructions for deploying a React application to Vercel, 
assuming students have completed the basics of React
```

**Lesson Introduction:**
```
Create an engaging introduction to a lesson on machine learning algorithms, 
highlighting real-world applications and what students will learn
```

**Summary with Key Takeaways:**
```
Summarize the key concepts from this lesson on database normalization, 
including the three normal forms and when to use each
```

### Best Practices

✅ **Do:**
- Be specific about the concept or topic
- Specify target audience and reading level
- Include context from previous lessons
- Request specific formatting (lists, headings)
- Ask for examples when explaining abstract concepts

❌ **Don't:**
- Use overly vague prompts like "write about databases"
- Forget to specify content type (explanation vs instructions)
- Request content longer than 600 words (use multiple blocks)
- Mix multiple unrelated topics in one prompt

### Refinement Tips

- **Make Shorter**: Reduces to key points, removes elaboration
- **Make Longer**: Adds examples, details, and context
- **Simplify Language**: Lowers reading level, uses common words
- **Add Examples**: Includes 1-3 concrete examples
- **Change Tone**: Adjusts formality and style

---

## Video Block

### Overview
The Video Block displays video content with titles, descriptions, and optional transcripts. AI assists with script generation and metadata.

### AI Capabilities

#### Content Types
1. **Video Script**: Complete script with timestamps
2. **Video Title**: Engaging, descriptive titles
3. **Video Description**: Summaries for accessibility
4. **Key Points**: Main topics to cover
5. **Section Breakdown**: Intro, main content, conclusion

#### Generation Options
- **Duration**: Specify video length (3, 5, 10, 15 minutes)
- **Tone**: Formal, Conversational, Encouraging
- **Depth**: Overview, Standard, In-depth

#### Output Format
```
Title: [Engaging video title]

Description: [2-3 sentence summary]

Script:
[00:00-00:30] Introduction
- Hook: [Attention-grabbing opening]
- Overview: [What will be covered]

[00:30-02:00] Main Content - Part 1
- Point 1: [Explanation]
- Example: [Concrete example]

[02:00-04:00] Main Content - Part 2
- Point 2: [Explanation]
- Demonstration: [What to show]

[04:00-04:45] Conclusion
- Summary: [Key takeaways]
- Next steps: [What's coming next]

Key Points to Emphasize:
- [Point 1]
- [Point 2]
- [Point 3]
```

### Example Prompts

**Basic Script:**
```
Create a 5-minute video script introducing React hooks, 
covering useState and useEffect with simple examples
```

**Tutorial Script:**
```
Generate a 10-minute tutorial script for setting up a PostgreSQL database, 
including installation, configuration, and creating the first table
```

**Concept Overview:**
```
Write a 3-minute video script explaining the difference between 
supervised and unsupervised learning for beginners
```

### Best Practices

✅ **Do:**
- Specify exact video duration
- Include skill level of target audience
- Request specific topics to cover
- Ask for visual cues (what to show on screen)
- Include learning objectives

❌ **Don't:**
- Request scripts longer than 15 minutes (break into multiple videos)
- Forget to specify if it's a lecture, tutorial, or demonstration
- Omit context about previous videos in the series

### Refinement Tips

- **Make Shorter**: Condenses script, removes less critical content
- **Make Longer**: Adds more examples and explanations
- **Simplify Language**: Uses simpler vocabulary for beginners
- **Add Examples**: Includes more concrete demonstrations

### Integration Notes

- Generated title populates the "Video Title" field
- Description populates the "Description" field
- Script appears in a separate "Script" section for reference
- Timestamps help with video editing and chapter markers

---

## Code Block

### Overview
The Code Block displays syntax-highlighted code with explanations. AI generates working code examples with comments and context.

### AI Capabilities

#### Content Types
1. **Code Example**: Working code demonstrating a concept
2. **Code Explanation**: Line-by-line or block-by-block explanation
3. **Best Practices**: Code following conventions and patterns
4. **Commented Code**: Inline comments explaining logic
5. **Related Concepts**: Suggestions for follow-up topics

#### Generation Options
- **Language**: Auto-detected or specified (JavaScript, Python, Java, etc.)
- **Complexity**: Beginner, Intermediate, Advanced
- **Style**: Functional, Object-Oriented, Procedural
- **Comments**: Inline, Block, Minimal

#### Output Format
```javascript
// [Brief description of what this code does]

// [Comment explaining this section]
function exampleFunction(param1, param2) {
  // [Comment explaining this line]
  const result = param1 + param2;
  
  // [Comment explaining this logic]
  if (result > 10) {
    return result * 2;
  }
  
  return result;
}

// [Usage example]
const output = exampleFunction(5, 7);
console.log(output); // Expected output: 24
```

**Explanation:**
[Detailed explanation of the code, including:
- What problem it solves
- How it works
- Key concepts demonstrated
- When to use this pattern]

### Example Prompts

**Basic Example:**
```
Generate a Python function to calculate the factorial of a number using recursion, 
with comments explaining each step
```

**Pattern Demonstration:**
```
Create a JavaScript example of the observer pattern for beginners, 
showing how to implement event listeners
```

**Algorithm Implementation:**
```
Write a Java implementation of binary search with detailed comments, 
including time complexity analysis
```

**Framework-Specific:**
```
Generate a React component that fetches data from an API using hooks, 
with error handling and loading states
```

### Best Practices

✅ **Do:**
- Specify programming language explicitly
- Include skill level (beginner, intermediate, advanced)
- Request specific patterns or approaches
- Ask for error handling when relevant
- Specify if you want tests included

❌ **Don't:**
- Request overly complex code (break into smaller examples)
- Forget to specify language (AI will guess)
- Ask for production-ready code (examples are for learning)
- Request code without explanation

### Refinement Tips

- **Make Shorter**: Simplifies code, removes advanced features
- **Make Longer**: Adds error handling, edge cases, validation
- **Simplify Language**: Uses more basic syntax and patterns
- **Add Examples**: Includes usage examples and test cases

### Language Support

Fully supported languages:
- JavaScript/TypeScript
- Python
- Java
- C/C++
- C#
- Ruby
- PHP
- Go
- Rust
- Swift
- Kotlin
- SQL
- HTML/CSS
- Shell/Bash

### Integration Notes

- Language is auto-detected from code
- Syntax highlighting applied automatically
- Explanation appears below code block
- Code is copyable with one click

---

## Reflection Block

### Overview
The Reflection Block prompts learners to think critically and reflect on their learning. AI generates thought-provoking prompts.

### AI Capabilities

#### Content Types
1. **Open-Ended Questions**: Encourage deep thinking
2. **Scenario-Based Prompts**: Apply concepts to situations
3. **Comparative Prompts**: Compare and contrast concepts
4. **Self-Assessment Prompts**: Evaluate own understanding
5. **Application Prompts**: Connect to real-world use

#### Generation Options
- **Bloom's Level**: Remember, Understand, Apply, Analyze, Evaluate, Create
- **Prompt Count**: Generate 3-5 options to choose from
- **Depth**: Surface-level, Moderate, Deep reflection

#### Output Format
```
Option 1: [Open-ended question]
Suggested minimum length: 150 words

Option 2: [Scenario-based prompt]
Suggested minimum length: 200 words

Option 3: [Comparative prompt]
Suggested minimum length: 175 words

Option 4: [Application prompt]
Suggested minimum length: 150 words

Option 5: [Self-assessment prompt]
Suggested minimum length: 100 words
```

### Example Prompts

**Concept Application:**
```
Generate reflection prompts for a lesson on agile methodology, 
focusing on how students might apply these concepts in their own projects
```

**Critical Thinking:**
```
Create reflection questions about ethical considerations in AI development, 
encouraging students to analyze different perspectives
```

**Self-Assessment:**
```
Write reflection prompts for students to evaluate their understanding 
of database normalization and identify areas for further study
```

**Real-World Connection:**
```
Generate prompts asking students to reflect on how machine learning 
impacts their daily lives and future careers
```

### Best Practices

✅ **Do:**
- Specify the lesson topic clearly
- Request prompts at appropriate Bloom's level
- Ask for variety (different prompt types)
- Include context about what students have learned
- Request prompts that encourage specific thinking skills

❌ **Don't:**
- Ask for yes/no questions (not reflective)
- Request prompts that are too broad or vague
- Forget to specify if prompts should be personal or analytical
- Use prompts that have single correct answers

### Refinement Tips

- **Make Shorter**: Simplifies prompts, reduces complexity
- **Make Longer**: Adds context and guidance
- **Simplify Language**: Uses clearer, more direct questions
- **Add Examples**: Includes example responses or scenarios

### Bloom's Taxonomy Alignment

**Remember**: "List the three types of..."
**Understand**: "Explain in your own words..."
**Apply**: "How would you use this concept to..."
**Analyze**: "Compare and contrast..."
**Evaluate**: "What is your opinion on... and why?"
**Create**: "Design a solution that..."

### Integration Notes

- Multiple prompt options displayed for selection
- Selected prompt populates the reflection field
- Suggested minimum length auto-filled
- Prompts can be edited before saving

---

## Poll Block

### Overview
The Poll Block creates interactive polls for engagement and formative assessment. AI generates questions and balanced options.

### AI Capabilities

#### Content Types
1. **Opinion Polls**: Gather learner perspectives
2. **Knowledge Checks**: Quick formative assessments
3. **Preference Polls**: Understand learner preferences
4. **Scenario Polls**: Present situations for decision-making
5. **Discussion Starters**: Generate conversation topics

#### Generation Options
- **Option Count**: 3-5 options (default 4)
- **Poll Type**: Opinion, Knowledge, Preference, Scenario
- **Difficulty**: Easy, Medium, Hard (for knowledge checks)

#### Output Format
```
Poll Question: [Clear, concise question]

Options:
A) [First option]
B) [Second option]
C) [Third option]
D) [Fourth option]

Poll Type: [Opinion/Knowledge/Preference/Scenario]

Follow-up Discussion Questions:
1. [Question to explore results]
2. [Question to deepen understanding]
3. [Question to connect to real-world]
```

### Example Prompts

**Opinion Poll:**
```
Create a poll asking students about their preferred learning style 
(visual, auditory, kinesthetic, reading/writing)
```

**Knowledge Check:**
```
Generate a poll to check understanding of the difference between 
GET and POST HTTP methods
```

**Preference Poll:**
```
Create a poll about which JavaScript framework students are most interested 
in learning (React, Vue, Angular, Svelte)
```

**Scenario Poll:**
```
Generate a poll presenting an ethical dilemma in data privacy, 
asking students to choose the best course of action
```

### Best Practices

✅ **Do:**
- Ensure options are mutually exclusive
- Make options collectively exhaustive
- Keep question clear and concise
- Balance option lengths
- Include "Other" or "Not sure" when appropriate

❌ **Don't:**
- Create overlapping options
- Use leading or biased questions
- Include too many options (max 5)
- Make one option obviously correct (for opinion polls)
- Use complex or confusing language

### Refinement Tips

- **Make Shorter**: Simplifies question and options
- **Make Longer**: Adds context to question
- **Simplify Language**: Uses clearer, more direct wording
- **Add Examples**: Includes scenarios or context

### Poll Types Explained

**Opinion Poll:**
- No correct answer
- Gathers perspectives
- Encourages discussion
- Example: "Which is more important: code readability or performance?"

**Knowledge Check:**
- Has a correct answer
- Formative assessment
- Identifies misconceptions
- Example: "Which data structure has O(1) lookup time?"

**Preference Poll:**
- Personal choice
- Understands audience
- Tailors future content
- Example: "Which topic would you like to explore next?"

**Scenario Poll:**
- Presents situation
- Requires decision-making
- Applies concepts
- Example: "Given this code review, what would you do first?"

### Integration Notes

- Question populates the poll question field
- Options populate the answer choices
- Poll type helps categorize results
- Follow-up questions appear in instructor notes

---

## Interactive Block (Quiz/Assessment)

### Overview
The Interactive Block supports various interactive elements, including Final Assessments (quizzes). AI generates questions with answers and explanations.

### AI Capabilities

#### Content Types
1. **Multiple Choice**: Questions with 4-5 options
2. **True/False**: Binary choice questions
3. **Short Answer**: Open-ended questions with sample answers
4. **Fill in the Blank**: Completion questions
5. **Matching**: Pair items (future capability)

#### Generation Options
- **Question Count**: 1-20 questions
- **Difficulty**: Easy, Medium, Hard
- **Bloom's Level**: Knowledge, Comprehension, Application, Analysis
- **Question Mix**: Specify types (e.g., "5 multiple choice, 3 true/false")

#### Output Format
```
Question 1: [Question text]
Type: Multiple Choice
Difficulty: Medium
Bloom's Level: Application

Options:
A) [Correct answer]
B) [Distractor based on common misconception]
C) [Distractor based on partial understanding]
D) [Distractor based on related concept]

Correct Answer: A

Explanation: [Why A is correct and why others are incorrect]

---

Question 2: [Question text]
Type: True/False
Difficulty: Easy
Bloom's Level: Knowledge

Correct Answer: True

Explanation: [Explanation of the concept]

---

[Additional questions...]
```

### Example Prompts

**Basic Quiz:**
```
Generate 5 multiple choice questions about Python loops, 
covering for loops, while loops, and loop control statements
```

**Mixed Assessment:**
```
Create a 10-question assessment on database concepts with 
6 multiple choice, 3 true/false, and 1 short answer question
```

**Application-Level:**
```
Generate 5 questions at the application level about React hooks, 
requiring students to analyze code and predict outcomes
```

**Concept-Specific:**
```
Create 8 questions about the differences between SQL and NoSQL databases, 
with varying difficulty levels
```

### Best Practices

✅ **Do:**
- Specify question count and types
- Request specific Bloom's taxonomy levels
- Ask for distractors based on misconceptions
- Include explanations for learning
- Vary difficulty levels
- Align questions with learning objectives

❌ **Don't:**
- Request more than 20 questions at once
- Use trick questions or ambiguous wording
- Create questions with multiple correct answers (unless specified)
- Forget to specify difficulty level
- Use "all of the above" or "none of the above" excessively

### Refinement Tips

- **Make Shorter**: Reduces question count or simplifies wording
- **Make Longer**: Adds more questions or detail to explanations
- **Simplify Language**: Uses clearer, more direct questions
- **Add Examples**: Includes code snippets or scenarios in questions

### Question Types Explained

**Multiple Choice:**
- 4-5 options
- One correct answer
- Distractors based on common errors
- Good for: Concept understanding, application

**True/False:**
- Binary choice
- Quick to answer
- Tests specific facts
- Good for: Knowledge checks, misconception identification

**Short Answer:**
- Open-ended response
- Requires explanation
- Sample answer provided
- Good for: Deep understanding, application

**Fill in the Blank:**
- Complete the sentence
- Tests specific knowledge
- One or more blanks
- Good for: Terminology, syntax

### Bloom's Taxonomy in Questions

**Knowledge**: "What is the definition of..."
**Comprehension**: "Explain in your own words..."
**Application**: "Given this code, what will happen..."
**Analysis**: "Compare the performance of..."
**Evaluation**: "Which approach is better and why..."
**Synthesis**: "Design a solution that..."

### Distractor Design

Good distractors:
- Reflect common misconceptions
- Are plausible to students who don't know the answer
- Are clearly wrong to students who understand
- Don't include clues to the correct answer
- Are similar in length and complexity to correct answer

### Integration Notes

- Questions populate the quiz configuration
- Correct answers and explanations included
- Difficulty and Bloom's level tracked
- Questions can be reordered or edited
- Individual questions can be regenerated

---

## List Block

### Overview
The List Block displays ordered or unordered lists. AI generates structured lists for steps, requirements, tips, and checklists.

### AI Capabilities

#### Content Types
1. **Steps**: Sequential procedures
2. **Requirements**: Prerequisites or criteria
3. **Tips**: Best practices and advice
4. **Checklist**: Items to complete
5. **Key Points**: Main takeaways
6. **Resources**: Links and references

#### Generation Options
- **List Type**: Ordered (numbered) or Unordered (bulleted)
- **Item Count**: 3-15 items
- **Detail Level**: Brief, Moderate, Detailed
- **Auto-detect**: AI determines best list type

#### Output Format
```
List Type: [Ordered/Unordered]

Items:
1. [First item with optional description]
2. [Second item with optional description]
3. [Third item with optional description]
...

[Or for unordered:]

• [First item]
• [Second item]
• [Third item]
...
```

### Example Prompts

**Steps:**
```
Generate a numbered list of steps for deploying a Node.js application to AWS, 
from setup to monitoring
```

**Requirements:**
```
Create a list of prerequisites for learning React, 
including JavaScript concepts and tools needed
```

**Tips:**
```
List 10 best practices for writing clean, maintainable Python code
```

**Checklist:**
```
Generate a code review checklist covering security, performance, 
and maintainability concerns
```

**Key Points:**
```
List the main takeaways from this lesson on machine learning algorithms
```

### Best Practices

✅ **Do:**
- Specify list type (steps, tips, requirements, etc.)
- Request appropriate item count (5-10 is ideal)
- Ask for descriptions when needed
- Use ordered lists for sequential content
- Use unordered lists for non-sequential content

❌ **Don't:**
- Request more than 15 items (breaks into multiple lists)
- Mix different list types in one prompt
- Forget to specify if order matters
- Use lists for content better suited to paragraphs

### Refinement Tips

- **Make Shorter**: Reduces item count or removes descriptions
- **Make Longer**: Adds more items or expands descriptions
- **Simplify Language**: Uses clearer, more concise wording
- **Add Examples**: Includes examples for each item

### List Type Guidelines

**Use Ordered Lists (Numbered) for:**
- Sequential steps or procedures
- Ranked items (priority order)
- Chronological events
- Hierarchical information

**Use Unordered Lists (Bulleted) for:**
- Non-sequential items
- Equal-importance points
- Features or characteristics
- Tips and best practices

### Auto-Detection

When you don't specify list type, AI determines the best format based on content:
- Steps → Ordered
- Tips → Unordered
- Requirements → Unordered
- Checklist → Unordered (with checkbox styling)
- Timeline → Ordered

### Integration Notes

- List type auto-detected or manually specified
- Items can be reordered via drag-and-drop
- Individual items can be edited
- Nested lists supported (sub-items)
- Checkbox styling for checklists

---

## Image Block

### Overview
The Image Block displays images with titles, captions, and alt text. AI generates descriptive alt text and captions for accessibility.

### AI Capabilities

#### Content Types
1. **Alt Text**: Concise description (under 125 characters)
2. **Caption**: Extended description with context
3. **Context-Aware**: Uses surrounding content for relevance

#### Generation Options
- **Context**: Automatic from lesson content
- **Detail Level**: Brief, Standard, Detailed
- **Focus**: Descriptive, Educational, Technical

#### Output Format
```
Alt Text: [Concise description under 125 characters]

Caption: [Extended description with educational context, 1-2 sentences]
```

### Example Use Cases

**Diagram:**
```
Image: Database schema diagram
Alt Text: "Entity-relationship diagram showing users, posts, and comments tables"
Caption: "This database schema illustrates the relationships between users, 
their posts, and comments, demonstrating one-to-many relationships."
```

**Screenshot:**
```
Image: Code editor screenshot
Alt Text: "VS Code editor showing React component with useState hook"
Caption: "Example of a functional React component using the useState hook 
to manage counter state, demonstrating the basic hook syntax."
```

**Chart:**
```
Image: Performance comparison chart
Alt Text: "Bar chart comparing algorithm time complexity"
Caption: "Performance comparison of sorting algorithms showing bubble sort, 
merge sort, and quick sort with varying input sizes."
```

### Best Practices

✅ **Do:**
- Generate alt text for all images
- Keep alt text under 125 characters
- Include relevant context in captions
- Describe what's important, not every detail
- Use captions to explain educational significance

❌ **Don't:**
- Start alt text with "Image of..." or "Picture of..."
- Include redundant information in both alt text and caption
- Describe decorative images (use empty alt text)
- Use overly technical language in alt text
- Forget to review AI-generated descriptions for accuracy

### Refinement Tips

- **Make Shorter**: Condenses description to essentials
- **Make Longer**: Adds more detail to caption
- **Simplify Language**: Uses clearer, more accessible terms
- **Add Examples**: Includes specific elements visible in image

### WCAG 2.1 AA Compliance

AI-generated alt text follows accessibility guidelines:
- **Concise**: Under 125 characters
- **Descriptive**: Conveys meaning, not just appearance
- **Context-appropriate**: Relevant to surrounding content
- **No redundancy**: Doesn't repeat caption or nearby text
- **Functional**: Describes purpose for functional images

### Alt Text Guidelines by Image Type

**Informative Images:**
- Describe the information conveyed
- Example: "Line graph showing 50% increase in user engagement"

**Functional Images:**
- Describe the function or action
- Example: "Download button for course materials"

**Decorative Images:**
- Use empty alt text (alt="")
- AI will suggest when images are decorative

**Complex Images:**
- Brief alt text + detailed caption
- Example: Alt: "System architecture diagram", Caption: [detailed description]

### Integration Notes

- Alt text populates the "Alt Text" field
- Caption populates the "Caption" field
- AI analyzes surrounding text blocks for context
- Descriptions can be edited before saving
- Regenerate if image context changes

---

## Divider Block

### Overview
The Divider Block creates visual separation between content sections. AI assistance is minimal for this block type.

### AI Capabilities

Limited AI capabilities:
- No content generation (dividers are visual only)
- No text or configuration needed

### Usage

Dividers are manually added and don't require AI assistance. They help:
- Separate major sections
- Create visual breaks
- Improve content readability
- Signal topic transitions

---

## AI Generator Block

### Overview
The AI Generator Block is a special interactive block that allows learners to generate AI content during the course. This is different from the AI Content Assistant (which helps admins create content).

### AI Capabilities for Admins

When configuring an AI Generator Block, admins can:

#### Content Types
1. **Prompt Template**: Pre-configured prompt for learners
2. **Instructions**: Guide learners on how to use the generator
3. **Example Outputs**: Show what learners can expect
4. **Constraints**: Limit what learners can generate

#### Generation Options
- **Generator Type**: Text, Code, Image (future), etc.
- **Prompt Flexibility**: Fixed, Semi-flexible, Open-ended
- **Output Format**: Specify expected format

### Example Use Cases

**Creative Writing:**
```
Prompt Template: "Write a short story about [topic] that demonstrates [concept]"
Instructions: "Use the AI to generate a creative example, then analyze how it applies the concepts we've learned."
```

**Code Generation:**
```
Prompt Template: "Generate a [language] function that [task]"
Instructions: "Create a code example, then review it for best practices and potential improvements."
```

**Brainstorming:**
```
Prompt Template: "List 10 innovative applications of [technology] in [industry]"
Instructions: "Generate ideas, then select the three most promising and explain why."
```

### Best Practices

✅ **Do:**
- Provide clear instructions for learners
- Include example prompts
- Set appropriate constraints
- Explain how to evaluate AI output
- Connect to learning objectives

❌ **Don't:**
- Allow completely open-ended generation without guidance
- Forget to explain AI limitations
- Use as a replacement for learning
- Skip the analysis/reflection component

### Integration Notes

- Admins configure the generator settings
- Learners interact with the generator during the course
- Outputs can be saved to learner profiles
- Usage tracked separately from admin AI usage

---

## Summary Table

| Block Type | Primary AI Capability | Output Format | Typical Use Case |
|-----------|----------------------|---------------|------------------|
| Text | Explanations, instructions, summaries | Formatted HTML | Main content, lessons |
| Video | Scripts with timestamps | Structured script | Video planning |
| Code | Working code with comments | Syntax-highlighted code | Technical examples |
| Reflection | Thought-provoking prompts | Multiple prompt options | Critical thinking |
| Poll | Questions with balanced options | Question + 3-5 options | Engagement, formative assessment |
| Interactive | Quiz questions with answers | Structured questions | Summative assessment |
| List | Structured lists | Ordered/unordered items | Steps, tips, requirements |
| Image | Alt text and captions | Accessibility text | Image descriptions |
| Divider | None | N/A | Visual separation |
| AI Generator | Configuration templates | Learner-facing prompts | Interactive generation |

---

## Cross-Block Workflows

### Creating a Complete Lesson

1. **Start with outline generation**: Generate lesson structure
2. **Text blocks**: Create introductions and explanations
3. **Code/Video blocks**: Add examples and demonstrations
4. **Reflection blocks**: Insert critical thinking prompts
5. **Poll blocks**: Add engagement checkpoints
6. **Interactive blocks**: Create assessments
7. **List blocks**: Summarize key takeaways
8. **Image blocks**: Generate alt text for visuals

### Maintaining Consistency

- AI uses course context across all blocks
- Terminology remains consistent
- Tone matches your settings
- Content builds progressively
- References previous blocks appropriately

### Efficiency Tips

- Generate outlines first, then fill in blocks
- Use templates for common patterns
- Refine instead of regenerating
- Leverage generation history
- Batch similar content generation

---

**Need more details?** See the [User Guide](./USER_GUIDE.md) for comprehensive instructions.
