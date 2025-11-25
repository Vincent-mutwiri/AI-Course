# Admin Course Builder User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Interface Overview](#interface-overview)
3. [Creating Course Content](#creating-course-content)
4. [Block Types Reference](#block-types-reference)
5. [Tips and Best Practices](#tips-and-best-practices)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### Accessing the Course Builder

1. Log in to the admin panel at `/admin`
2. Navigate to the Courses section
3. Select a course you want to edit
4. Click the "Edit Course" button to open the Course Builder

The Course Builder will load with your course structure and content ready to edit.

### Understanding Auto-Save

The Course Builder automatically saves your changes every 2 seconds after you stop editing. You'll see a saving indicator in the top-right corner:
- **Saving...** - Your changes are being saved
- **Saved** - All changes have been saved successfully
- **Error** - There was a problem saving (your changes are preserved locally)

**Important:** Don't close the browser tab while "Saving..." is displayed to avoid losing changes.

## Interface Overview

The Course Builder has three main panels:

### 1. Course Structure (Left Panel)

Displays your course hierarchy:
- **Modules** - Expandable sections containing lessons
- **Lessons** - Individual learning units containing blocks
- **Active Lesson** - Highlighted in blue

**Actions:**
- Click a lesson to edit its content
- Click "Add Module" to create a new module
- Expand/collapse modules using the arrow icons

### 2. Canvas (Center Panel)

The main editing area where you arrange and configure blocks:
- Drag blocks to reorder them
- Click block actions (edit, duplicate, delete, preview)
- See a live preview of your content

**Empty State:** When a lesson has no blocks, you'll see a message prompting you to add blocks from the library.

### 3. Block Library (Right Panel)

Browse and add blocks to your lesson:
- **Basic Tab** - Text, video, image, code, list, divider blocks
- **Interactive Tab** - Polls, quizzes, reflections, and specialized tools
- **Search** - Filter blocks by name or description

## Creating Course Content

### Adding Blocks

1. Select a lesson from the Course Structure
2. Browse the Block Library or use search
3. Click on a block type to add it to the canvas
4. The block appears at the bottom of your lesson
5. Configure the block by clicking the edit icon

### Configuring Blocks

Each block type has its own configuration modal:

1. Click the **Edit** icon (pencil) on any block
2. Fill in the required fields (marked with *)
3. Add optional settings as needed
4. Click **Save** to apply changes
5. Click **Cancel** to discard changes

**Validation:** The form will show error messages if required fields are missing or invalid.

### Reordering Blocks

Use drag-and-drop to arrange blocks:

1. Hover over a block to see the drag handle
2. Click and hold the drag handle
3. Drag the block to its new position
4. Release to drop the block
5. The new order saves automatically

**Visual Feedback:** You'll see a blue indicator showing where the block will be placed.

### Duplicating Blocks

To create a copy of an existing block:

1. Click the **Duplicate** icon on the block
2. A copy appears immediately below the original
3. Edit the duplicate to customize it

**Keyboard Shortcut:** Press `Cmd+D` (Mac) or `Ctrl+D` (Windows/Linux)

### Deleting Blocks

To remove a block:

1. Click the **Delete** icon (trash) on the block
2. Confirm the deletion in the dialog
3. The block is removed immediately

**Warning:** Deletion cannot be undone. Consider duplicating important blocks before deleting.

### Previewing Content

To see how content appears to students:

1. Click the **Preview** icon (eye) on any block
2. The block displays in student view format
3. Interactive elements are fully functional
4. Close the preview to return to editing

## Block Types Reference

### Basic Blocks

#### Text Block
Rich text content with formatting options.

**Configuration:**
- **Content*** - Rich text editor with formatting toolbar
  - Headings (H1-H6)
  - Bold, italic, underline
  - Bullet and numbered lists
  - Links and inline code

**Best For:** Explanations, instructions, learning objectives

**Tips:**
- Use headings to structure content
- Keep paragraphs short for readability
- Use lists for step-by-step instructions

---

#### Video Block
Embed or upload video content.

**Configuration:**
- **Source Type*** - Choose "Upload" or "Embed"
- **Video URL** (for embed) - YouTube or Vimeo URL
- **Video File** (for upload) - MP4, WebM, or MOV file (max 100MB)
- **Title** - Video title for accessibility

**Supported Platforms:**
- YouTube (embed)
- Vimeo (embed)
- Direct upload to S3

**Best For:** Lectures, demonstrations, tutorials

**Tips:**
- Use embed for existing videos to save storage
- Upload for custom content or offline access
- Add captions for accessibility

---

#### Image Block
Display images with captions.

**Configuration:**
- **Image File*** - JPG, PNG, GIF, or WebP (max 5MB)
- **Alt Text*** - Description for screen readers (required)
- **Caption** - Optional text displayed below image

**Best For:** Diagrams, screenshots, infographics

**Tips:**
- Always provide descriptive alt text
- Optimize images before upload
- Use captions to explain complex visuals

---

#### Code Block
Display code with syntax highlighting.

**Configuration:**
- **Code*** - The code to display
- **Language*** - Programming language for syntax highlighting

**Supported Languages:**
- JavaScript, TypeScript, Python, Java, C++, C#
- HTML, CSS, SQL, JSON, YAML
- And many more...

**Best For:** Code examples, technical documentation

**Tips:**
- Choose the correct language for proper highlighting
- Keep code snippets focused and concise
- Add a text block above to explain the code

---

#### List Block
Create bullet, numbered, or checkbox lists.

**Configuration:**
- **List Type*** - Bullet, Numbered, or Checkbox
- **Items*** - Add/remove list items

**Best For:** Steps, requirements, checklists

**Tips:**
- Use numbered lists for sequential steps
- Use bullet lists for unordered items
- Use checkboxes for tasks or requirements

---

#### Divider Block
Visual separator between content sections.

**Configuration:**
- Minimal configuration (style options)

**Best For:** Separating content sections, improving visual flow

**Tips:**
- Use sparingly to avoid cluttering the page
- Place between major content sections

### Interactive Blocks

#### Reflection Block
Prompt students to write reflective responses.

**Configuration:**
- **Question/Prompt*** - The reflection question
- **Minimum Length** - Minimum character count
- **Placeholder** - Hint text in the input field

**Best For:** Critical thinking, self-assessment, journaling

**Tips:**
- Ask open-ended questions
- Set reasonable minimum lengths (100-200 characters)
- Provide clear prompts

---

#### Poll Block
Gather student opinions with multiple choice questions.

**Configuration:**
- **Question*** - The poll question
- **Options*** - 2-6 answer choices

**Best For:** Quick feedback, gauging understanding, engagement

**Tips:**
- Keep questions clear and concise
- Provide 3-5 options for best results
- Use for formative assessment

---

#### Word Cloud Block
Collect and visualize student responses as a word cloud.

**Configuration:**
- **Prompt*** - What students should respond to
- **Max Words** - Maximum words per response

**Best For:** Brainstorming, concept association, quick feedback

**Tips:**
- Use for single-word or short phrase responses
- Great for activating prior knowledge
- Review word cloud with students

---

#### AI Generator Block
Let students generate content using AI assistance.

**Configuration:**
- **Generator Type*** - Type of content to generate
- **Title*** - Block title
- **Description** - Instructions for students
- **Placeholder** - Input field hint
- **Options** - Generator-specific settings

**Best For:** Creative writing, ideation, personalized examples

**Tips:**
- Provide clear instructions
- Set appropriate constraints
- Review AI-generated content with students

---

#### Choice Comparison Block
Compare two options with pros/cons analysis.

**Configuration:**
- **Scenario*** - The decision context
- **Option A*** - First choice
- **Option B*** - Second choice

**Best For:** Decision-making, critical analysis, trade-offs

---

#### Design Fixer Block
Identify and fix design problems in examples.

**Configuration:**
- **Design Example*** - The design to analyze
- **Problem Areas** - Specific issues to identify

**Best For:** Design thinking, problem-solving, UX education

---

#### Player Type Simulator Block
Explore different player types in gamification.

**Configuration:**
- **Scenario*** - The gamification context
- **Player Types** - Types to explore

**Best For:** Gamification courses, user psychology

---

#### Reward Schedule Designer Block
Design and test reward schedules.

**Configuration:**
- **Context*** - The reward scenario
- **Schedule Types** - Available schedule options

**Best For:** Behavioral psychology, gamification design

---

#### Flow Channel Evaluator Block
Assess activities for flow state potential.

**Configuration:**
- **Activity*** - The activity to evaluate
- **Criteria** - Evaluation dimensions

**Best For:** Learning design, engagement optimization

---

#### Certificate Generator Block
Generate completion certificates for students.

**Configuration:**
- **Certificate Template*** - Design template
- **Fields** - Customizable certificate fields

**Best For:** Course completion, achievements

---

#### Final Assessment Block
Comprehensive assessment with multiple question types.

**Configuration:**
- **Assessment Title*** - Name of the assessment
- **Questions*** - Multiple choice, short answer, essay
- **Passing Score** - Minimum score to pass

**Best For:** Summative assessment, course completion

## Tips and Best Practices

### Content Organization

1. **Start with Structure** - Plan your modules and lessons before adding blocks
2. **Logical Flow** - Arrange blocks in a clear learning sequence
3. **Mix Block Types** - Combine text, media, and interactive elements
4. **Break Up Content** - Use dividers and headings to create visual breaks

### Engagement

1. **Interactive Elements** - Add at least one interactive block per lesson
2. **Multimedia** - Include videos and images to support different learning styles
3. **Reflection Points** - Use reflection blocks after key concepts
4. **Formative Assessment** - Add polls or quizzes to check understanding

### Accessibility

1. **Alt Text** - Always provide descriptive alt text for images
2. **Video Captions** - Add captions to all video content
3. **Clear Language** - Use simple, direct language
4. **Heading Structure** - Use proper heading hierarchy in text blocks

### Performance

1. **Image Optimization** - Compress images before upload
2. **Video Length** - Keep videos under 10 minutes when possible
3. **Block Count** - Aim for 10-20 blocks per lesson
4. **File Sizes** - Stay within size limits (100MB videos, 5MB images)

## Keyboard Shortcuts

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Undo | `Cmd+Z` | `Ctrl+Z` |
| Duplicate Block | `Cmd+D` | `Ctrl+D` |
| Save (manual) | `Cmd+S` | `Ctrl+S` |

## Troubleshooting

### Auto-Save Issues

**Problem:** Changes aren't saving
**Solutions:**
- Check your internet connection
- Look for error messages in the top-right corner
- Try manually refreshing the page
- Contact support if the issue persists

### Upload Failures

**Problem:** File uploads fail
**Solutions:**
- Check file size (100MB for videos, 5MB for images)
- Verify file format is supported
- Try a different file
- Check your internet connection

### Drag-and-Drop Not Working

**Problem:** Can't reorder blocks
**Solutions:**
- Make sure you're dragging from the drag handle
- Try refreshing the page
- Check if the block is locked (some blocks can't be moved)

### Preview Not Showing

**Problem:** Preview mode doesn't display correctly
**Solutions:**
- Save your changes first
- Refresh the page
- Check browser console for errors
- Try a different browser

### Lost Changes

**Problem:** Changes disappeared after closing the browser
**Solutions:**
- Always wait for "Saved" indicator before closing
- Check if auto-save was enabled
- Contact support to recover recent changes

## Getting Help

If you encounter issues not covered in this guide:

1. Check the browser console for error messages
2. Take a screenshot of the issue
3. Note what you were doing when the problem occurred
4. Contact your system administrator or support team

---

**Last Updated:** November 2025
**Version:** 2.0
