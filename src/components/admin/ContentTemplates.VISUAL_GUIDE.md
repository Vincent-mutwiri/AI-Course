# Content Templates Visual Guide

## How to Use Content Templates in AI Assistant

### Step 1: Open AI Assistant Panel

When editing any block, you'll see the AI Content Assistant panel at the top of the editor.

```
┌─────────────────────────────────────────────────────┐
│ ✨ AI Content Assistant                        ▼   │
└─────────────────────────────────────────────────────┘
```

Click to expand the panel.

### Step 2: Select a Template

```
┌─────────────────────────────────────────────────────┐
│ Content Template                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Choose a template or write custom prompt    ▼  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ Available templates:                                 │
│ • Custom Prompt                                      │
│ • Lesson Introduction                                │
│ • Concept Explanation                                │
│ • Lesson Summary                                     │
│ • Activity Instructions                              │
│ • ... and more                                       │
└─────────────────────────────────────────────────────┘
```

Templates are filtered by block type. For example:
- **Text blocks** show: Lesson Introduction, Concept Explanation, Summary
- **Video blocks** show: Tutorial Script, Demonstration Script
- **Code blocks** show: Basic Example, Advanced Example
- **Reflection blocks** show: Self-Assessment, Application, Critical Thinking

### Step 3: Review Template Description

After selecting a template, you'll see its description:

```
┌─────────────────────────────────────────────────────┐
│ Content Template                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Lesson Introduction                          ▼  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ Engaging introduction that sets context and          │
│ learning goals                                       │
└─────────────────────────────────────────────────────┘
```

### Step 4: Customize the Prompt

The template prompt is automatically filled in. You can customize it:

```
┌─────────────────────────────────────────────────────┐
│ Prompt                          💾 Save as Template │
│                                            250 / 2000│
│ ┌─────────────────────────────────────────────────┐ │
│ │ Create an engaging lesson introduction that:    │ │
│ │ - Hooks the learner with a relevant scenario    │ │
│ │ - Explains why this topic matters               │ │
│ │ - Previews what will be covered                 │ │
│ │ - Sets clear expectations                       │ │
│ │                                                  │ │
│ │ [Add your specific topic here]                  │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Step 5: Adjust Generation Options

```
┌─────────────────────────────────────────────────────┐
│ ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│ │ Tone  ▼  │  │ Level ▼  │  │ Length▼  │           │
│ └──────────┘  └──────────┘  └──────────┘           │
│                                                      │
│ • Tone: Formal / Conversational / Encouraging        │
│ • Level: High School / College / Professional        │
│ • Length: Brief / Moderate / Detailed                │
└─────────────────────────────────────────────────────┘
```

### Step 6: Generate Content

```
┌─────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────┐ │
│ │        ✨ Generate Content                      │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

The AI will generate content based on your prompt and settings.

### Step 7: Review and Refine

```
┌─────────────────────────────────────────────────────┐
│ Generated Content                      ← Undo (0)   │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Welcome to Introduction to Gamification!        │ │
│ │                                                  │ │
│ │ Have you ever wondered why some apps keep you   │ │
│ │ coming back day after day? The secret lies in   │ │
│ │ gamification...                                  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ Refine Content                                       │
│ [Make Shorter] [Make Longer] [Simplify]             │
│ [Add Examples] [Change Tone]                         │
│                                                      │
│ ┌────────┐ ┌────────────┐ ┌──────┐ ┌─────────┐    │
│ │ Accept │ │ Regenerate │ │ Edit │ │ Discard │    │
│ └────────┘ └────────────┘ └──────┘ └─────────┘    │
└─────────────────────────────────────────────────────┘
```

Options:
- **Accept**: Insert content into your block
- **Regenerate**: Generate new content with same prompt
- **Edit**: Manually modify the generated content
- **Discard**: Clear and start over
- **Refine buttons**: Adjust the content (shorter, longer, simpler, etc.)

## Saving Custom Templates

### When to Save a Template

Save a prompt as a template when:
- You've crafted a prompt that works well
- You'll use this type of content again
- You want to share your approach with team members
- You've found a good formula for a specific content type

### How to Save

1. **Write or customize a prompt** in the Prompt field
2. **Click "Save as Template"** (appears when prompt is not empty)
3. **Fill in template details**:

```
┌─────────────────────────────────────────────────────┐
│ Save as Template                                  × │
├─────────────────────────────────────────────────────┤
│ Save this prompt as a reusable template for future  │
│ use.                                                 │
│                                                      │
│ Template Name *                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ e.g., My Custom Introduction                    │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ Description                                          │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Brief description of when to use this template  │ │
│ │                                                  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ Prompt Preview                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Create an engaging lesson introduction...       │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│              [Cancel]  [💾 Save Template]           │
└─────────────────────────────────────────────────────┘
```

4. **Click "Save Template"**

Your custom template will now appear in the template dropdown with "(Custom)" label.

### Managing Custom Templates

**View Custom Templates:**
```
┌─────────────────────────────────────────────────────┐
│ Content Template                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ My Custom Introduction (Custom)              ▼  │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Delete Custom Templates:**
```
┌─────────────────────────────────────────────────────┐
│ My custom template for course introductions      🗑️ │
└─────────────────────────────────────────────────────┘
```

Click the trash icon (🗑️) to delete a custom template.

## Template Categories

### Introduction Templates
Perfect for starting lessons or modules:
- **Lesson Introduction**: Engaging opening with context
- **Learning Objectives**: Clear, measurable goals

### Explanation Templates
For teaching concepts:
- **Concept Explanation**: Clear definitions with examples
- **Concrete Example**: Real-world illustrations
- **Tutorial Video Script**: Structured instructional content

### Practice Templates
For hands-on activities:
- **Activity Instructions**: Step-by-step guidance
- **Step-by-Step Process**: Ordered task breakdown
- **Checklist**: Verification lists

### Assessment Templates
For testing understanding:
- **Knowledge Check Poll**: Quick comprehension checks
- **Formative Assessment**: Low-stakes quizzes
- **Summative Assessment**: Comprehensive evaluations

### Reflection Templates
For deeper thinking:
- **Self-Assessment**: Evaluate understanding
- **Application Reflection**: Connect to real situations
- **Critical Thinking**: Analyze and evaluate

## Tips for Effective Template Use

### 1. Start with Built-in Templates
Built-in templates are designed by instructional designers. Use them as starting points.

### 2. Customize for Your Context
Add specific details about your course, audience, or topic to the template prompt.

### 3. Experiment with Options
Try different combinations of tone, level, and length to find what works best.

### 4. Refine Iteratively
Use the refinement buttons to adjust generated content rather than regenerating from scratch.

### 5. Save Your Best Prompts
When you find a prompt formula that works well, save it as a custom template.

### 6. Name Templates Clearly
Use descriptive names that indicate:
- Content type (e.g., "Introduction", "Summary")
- Subject area (e.g., "Technical Concept", "Soft Skills")
- Audience level (e.g., "Beginner", "Advanced")

### 7. Review Before Accepting
Always review generated content for accuracy, tone, and alignment with your course goals.

## Troubleshooting

### Template Not Showing
- **Check block type**: Templates are filtered by block type
- **Reload templates**: Close and reopen the AI Assistant panel

### Can't Delete Template
- **Built-in templates**: Cannot be deleted (no trash icon)
- **Custom templates**: Must have "(Custom)" label to delete

### Template Prompt Too Long
- **Character limit**: 2000 characters maximum
- **Solution**: Break into smaller, focused prompts

### Generated Content Not as Expected
- **Refine the prompt**: Add more specific instructions
- **Adjust options**: Try different tone, level, or length
- **Use refinement**: Apply "Simplify" or "Add Examples"
- **Regenerate**: Try again for different results

## Best Practices

### Writing Good Template Prompts

✅ **DO:**
- Use clear, specific instructions
- Break down into bullet points
- Include quality criteria
- Specify desired format
- Give context about audience

❌ **DON'T:**
- Be vague or ambiguous
- Use overly complex language
- Include contradictory instructions
- Forget to specify tone/style
- Make prompts too long

### Example: Good vs. Bad Prompts

**Bad Prompt:**
```
Write something about gamification
```

**Good Prompt:**
```
Create an engaging lesson introduction that:
- Hooks the learner with a relevant scenario about game mechanics
- Explains why gamification matters in education
- Previews the 3 main topics we'll cover
- Sets expectations for hands-on activities
- Uses an encouraging, conversational tone
```

## Storage and Privacy

- **Local Storage**: Custom templates are stored in your browser
- **Per User**: Each user has their own custom templates
- **Not Synced**: Templates don't sync across devices
- **Export/Import**: Currently not available (future feature)

## Keyboard Shortcuts

- **Cmd/Ctrl + G**: Open AI Assistant panel (future feature)
- **Cmd/Ctrl + Shift + G**: Generate with current prompt (future feature)

## Related Features

- **Generation History**: View and reuse previous generations
- **AI Settings**: Set default tone, level, and length preferences
- **AI Usage Dashboard**: Track your AI generation usage

## Need Help?

- Check the AI Content Assistant documentation
- Review example templates for inspiration
- Experiment with different prompts and options
- Contact support if you encounter issues
