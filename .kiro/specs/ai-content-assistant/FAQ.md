# AI Content Assistant - Frequently Asked Questions

## Table of Contents
1. [General Questions](#general-questions)
2. [Getting Started](#getting-started)
3. [Content Generation](#content-generation)
4. [Templates](#templates)
5. [Refinement](#refinement)
6. [Performance & Costs](#performance--costs)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)
9. [Technical Questions](#technical-questions)
10. [Privacy & Security](#privacy--security)

## General Questions

### What is the AI Content Assistant?

The AI Content Assistant is an intelligent content generation system integrated into the Admin Course Builder V2. It helps you create high-quality educational content for all block types using AI, reducing course creation time by 60-80%.

### Who can use the AI Content Assistant?

The AI Content Assistant is available to all admin users with course creation permissions. Regular learners cannot access the content generation features.

### Which AI model powers the assistant?

The assistant uses Inflection AI's Pi-3.1 model, which is optimized for educational content generation and conversational interactions.

### Does the AI replace manual content creation?

No. The AI assists and accelerates content creation, but you maintain full creative control. All generated content is editable and should be reviewed for accuracy and alignment with your teaching goals.

### How much does it cost to use?

AI usage is tracked and billed based on token consumption. Check the AI Usage Dashboard for your current usage and estimated costs. Caching helps reduce costs by reusing previously generated content.


## Getting Started

### How do I access the AI Assistant?

1. Log in as an admin
2. Navigate to the Admin Course Builder
3. Open any course and lesson
4. Click on a block or add a new block
5. Look for the "Generate with AI" button

Alternatively, use the keyboard shortcut: **Cmd/Ctrl + G**

### Which block types support AI generation?

All major block types support AI generation:
- Text Block
- Video Block
- Code Block
- Reflection Block
- Poll Block
- Interactive Block (Quiz/Assessment)
- List Block
- Image Block (alt text generation)

### Do I need special training to use it?

No special training is required. The interface is intuitive, and templates provide guidance. However, reviewing the User Guide and watching tutorial videos will help you get the most out of the system.

### Can I use the AI Assistant offline?

No, the AI Assistant requires an internet connection to generate content. However, you can access cached content and edit previously generated content offline.

### How do I know if the AI is working?

When you click "Generate," you'll see a loading indicator. Generation typically takes 5-10 seconds. If it takes longer or fails, you'll see an error message with details.

## Content Generation

### How do I write effective prompts?

**Be specific:**
- ❌ "Explain databases"
- ✅ "Explain relational databases for beginners, including tables, rows, and relationships"

**Include context:**
- Mention the course, module, or lesson
- Reference previous topics
- Specify target audience

**Specify format:**
- Request specific structures (lists, steps, examples)
- Indicate desired length
- Mention any special requirements

### Why is my generated content off-topic?

**Common causes:**
- Vague or ambiguous prompts
- Missing context
- Wrong block type selected

**Solutions:**
- Be more specific in your prompt
- Use a content template
- Include course/lesson context explicitly
- Try regenerating with a clearer prompt

### Can I generate content in multiple languages?

Currently, the AI Content Assistant primarily supports English. Multi-language support is planned for future releases.

### How long does generation take?

- **Text blocks**: 5-10 seconds
- **Code blocks**: 5-10 seconds
- **Quiz questions**: 10-15 seconds
- **Lesson outlines**: 10-15 seconds
- **Refinements**: 3-5 seconds

Times may vary based on complexity and API load.

### Can I generate multiple blocks at once?

Yes! Use the "Generate Lesson Outline" feature to create multiple blocks simultaneously. This generates a complete lesson structure with placeholder content for each block.

### What if I don't like the generated content?

You have several options:
1. **Refine**: Use refinement options to improve the content
2. **Regenerate**: Generate new content with the same prompt
3. **Edit**: Manually modify the generated content
4. **Discard**: Delete and start over
5. **Try a different prompt**: Rephrase your request

### Does the AI understand my course context?

Yes! The AI automatically includes:
- Course title
- Module name
- Lesson name
- Learning objectives (if defined)
- Existing blocks in the lesson

This helps generate contextually relevant content.

### Can I save prompts for reuse?

Yes, in two ways:
1. **Templates**: Save prompts as custom templates
2. **History**: Access previous generations from the history panel

### How accurate is AI-generated content?

AI-generated content is generally accurate but should always be reviewed. The AI may occasionally:
- Make factual errors
- Use outdated information
- Misinterpret complex prompts
- Generate plausible but incorrect information

Always verify technical details, facts, and code examples.

## Templates

### What are templates?

Templates are pre-configured prompts for common content generation scenarios. They provide structure and best practices, making generation faster and more consistent.

### How many templates are available?

The system includes 15+ built-in templates covering:
- Lesson introductions
- Concept explanations
- Practice activities
- Knowledge checks
- Summaries
- Case studies
- And more

You can also create unlimited custom templates.

### Can I create my own templates?

Yes! Navigate to AI Settings → Custom Templates → Create New Template. Define your prompt, variables, and default options.

### Can I share templates with my team?

Yes. Export templates as JSON or Markdown files and share them with colleagues. They can import them into their own template libraries.

### How do I edit existing templates?

Built-in templates cannot be edited, but you can:
1. Create a custom template based on a built-in one
2. Modify the prompt before generating
3. Save your modified version as a new custom template

### What are template variables?

Variables are placeholders in templates that get replaced with actual values. For example:
- `{courseTitle}` → "Introduction to React"
- `{topic}` → "React Hooks"
- `{readingLevel}` → "College"

### Can I delete templates?

You can delete custom templates you've created. Built-in templates cannot be deleted but can be hidden from your template list.

## Refinement

### What is content refinement?

Refinement allows you to improve AI-generated content without starting over. It's faster than regenerating and preserves the core message while making specific improvements.

### What refinement options are available?

- **Make Shorter**: Reduce length by 30-50%
- **Make Longer**: Expand with more details and examples
- **Simplify Language**: Lower reading level, use simpler words
- **Add Examples**: Include 1-3 concrete examples
- **Change Tone**: Adjust formality (formal, conversational, encouraging)

### Can I apply multiple refinements?

Yes! You can apply refinements sequentially. For example:
1. Generate content
2. Refine: "Add Examples"
3. Refine: "Simplify Language"
4. Accept final version

### How is refinement different from regeneration?

- **Refinement**: Modifies existing content, faster (3-5 seconds), preserves core message
- **Regeneration**: Creates entirely new content, slower (5-10 seconds), may be completely different

### Does refinement cost less than generation?

Yes, refinement typically uses fewer tokens than full generation, resulting in lower costs.

### Can I undo a refinement?

No, but you can:
1. Click "Regenerate" to start fresh
2. Use the history panel to access the original version
3. Manually edit the refined content

### Why doesn't refinement always work as expected?

Refinement works best when:
- The original content is well-formed
- The refinement request is clear
- The content isn't too short or too long

If refinement doesn't work well, try regenerating with a modified prompt instead.

## Performance & Costs

### How is AI usage calculated?

Usage is calculated based on:
- **Tokens**: Number of words/characters processed
- **Generation type**: Full generation vs refinement
- **Content length**: Longer content = more tokens

View detailed usage in the AI Usage Dashboard.

### What is the cache hit rate?

Cache hit rate is the percentage of requests served from cache instead of calling the AI API. Higher rates mean lower costs.

**Target**: 30-40% hit rate
**Good**: 40-60% hit rate
**Excellent**: 60%+ hit rate

### How can I reduce AI costs?

1. **Use cache**: Similar prompts retrieve cached content
2. **Use templates**: Optimized prompts are more efficient
3. **Refine instead of regenerate**: Uses fewer tokens
4. **Generate outlines**: Batch creation is more efficient
5. **Review before generating**: Avoid unnecessary generations
6. **Reuse from history**: Copy previous generations

### Why is generation slow sometimes?

**Possible causes:**
- Complex prompts requiring more processing
- High API load during peak times
- Network latency
- Large content requests

**Solutions:**
- Simplify your prompt
- Try during off-peak hours
- Check your internet connection
- Break large requests into smaller ones

### Is there a usage limit?

Usage limits depend on your subscription plan. Check with your administrator for specific limits. You'll receive warnings as you approach limits.

### Can I see usage by course or user?

Yes! The AI Usage Dashboard provides filters for:
- Date range
- Course
- Block type
- Admin user (admin view only)

### Does cached content expire?

Yes, cached content expires after 7 days. After expiration, the same prompt will trigger a new generation.

## Troubleshooting

### "Generation Failed" error - what do I do?

**Possible causes:**
- Network connectivity issues
- API timeout
- Rate limiting
- Invalid prompt

**Solutions:**
1. Check your internet connection
2. Click "Retry"
3. Simplify your prompt
4. Wait 30 seconds and try again
5. Check AI Usage Dashboard for service status

### Generated content is too long/short

**Solutions:**
1. Use refinement: "Make Shorter" or "Make Longer"
2. Adjust default length in AI Settings
3. Specify length in your prompt
4. Override length setting for this generation

### AI Assistant panel won't open

**Solutions:**
1. Verify you're logged in as admin
2. Refresh the page
3. Try keyboard shortcut: Cmd/Ctrl + G
4. Check browser console for errors
5. Try a different browser

### Keyboard shortcuts not working

**Solutions:**
1. Click inside the block editor first
2. Disable conflicting browser extensions
3. Check for OS-level shortcut conflicts
4. Use mouse/click alternatives

### History not saving

**Solutions:**
1. Enable localStorage in browser settings
2. Exit private/incognito mode
3. Clear old history entries
4. Check browser storage quota

### Cache not working

**Solutions:**
1. Enable localStorage in browser settings
2. Use exact same prompts for cache hits
3. Check cache statistics in Usage Dashboard
4. Clear browser cache and try again

### Content quality is poor

**Solutions:**
1. Add more details to your prompt
2. Adjust reading level in settings
3. Use a more specific template
4. Provide examples in your prompt
5. Regenerate with refined prompt
6. Edit manually after generation

## Best Practices

### When should I use AI generation vs manual creation?

**Use AI for:**
- First drafts and outlines
- Standard explanations
- Common patterns (intros, summaries)
- Generating multiple options
- Overcoming writer's block

**Use manual creation for:**
- Unique insights and experiences
- Highly specialized content
- Personal anecdotes
- Brand-specific messaging
- Final polish and refinement

### How do I maintain my teaching voice?

1. **Set tone preferences**: Choose tone that matches your style
2. **Edit generated content**: Add your personal touch
3. **Create custom templates**: Encode your style in templates
4. **Use AI as starting point**: Build on generated content
5. **Review and refine**: Ensure content sounds like you

### Should I always review AI-generated content?

**Yes!** Always review for:
- **Accuracy**: Verify facts and technical details
- **Relevance**: Ensure alignment with learning objectives
- **Clarity**: Check for confusing language
- **Completeness**: Add missing information
- **Tone**: Adjust to match your style

### How do I handle AI errors or inaccuracies?

1. **Identify the error**: What's incorrect?
2. **Edit manually**: Fix the specific issue
3. **Regenerate if needed**: Try a more specific prompt
4. **Report patterns**: If errors repeat, contact support
5. **Document**: Note common issues for future reference

### Can I use AI-generated content commercially?

Yes, you own the rights to AI-generated content created through the platform. However, always review and edit content to ensure it meets your quality standards and legal requirements.

### How do I train my team to use the AI Assistant?

1. **Start with User Guide**: Share documentation
2. **Watch tutorials**: Video guides available
3. **Practice with templates**: Begin with built-in templates
4. **Share best practices**: Document what works
5. **Regular training**: Schedule refresher sessions
6. **Encourage experimentation**: Learn through use

## Technical Questions

### What happens to my prompts and generated content?

- **Prompts**: Sent to Inflection AI API, not stored permanently
- **Generated content**: Cached locally for 7 days
- **History**: Stored in browser localStorage
- **Usage data**: Tracked in database for billing and analytics

### Is my data secure?

Yes. All API communications are encrypted (HTTPS). Generated content is stored securely. See Privacy & Security section for details.

### Can I use the API directly?

The AI Content Assistant uses internal APIs not exposed for direct access. If you need API access for custom integrations, contact your administrator.

### What browsers are supported?

- Chrome (recommended)
- Firefox
- Safari
- Edge

Modern versions (last 2 years) are required for full functionality.

### Does it work on mobile devices?

The AI Content Assistant is optimized for desktop use. Mobile support is limited but functional for basic operations.

### Can I integrate with other tools?

Currently, the AI Content Assistant is integrated only with the Admin Course Builder V2. Additional integrations may be available in future releases.

### What's the maximum content length?

- **Text blocks**: Up to 600 words per generation
- **Code blocks**: Up to 100 lines
- **Quiz questions**: Up to 20 questions
- **List items**: Up to 15 items

For longer content, break into multiple blocks or generations.

## Privacy & Security

### Is my course content private?

Yes. Your course content is private and secure. AI-generated content is associated with your account and not shared with other users.

### Does the AI learn from my content?

The Inflection AI model does not learn from individual user interactions. Your prompts and generated content do not train the model or affect other users' generations.

### Can other admins see my AI usage?

System administrators can view aggregate usage statistics. Individual prompts and generated content are private unless you explicitly share them.

### What data is collected?

We collect:
- Usage statistics (generation count, block types)
- Performance metrics (generation time, cache hits)
- Error logs (for troubleshooting)
- User preferences (settings, templates)

We do NOT collect:
- Specific prompt content (beyond metadata)
- Personal learner information
- Course content details

### How long is data retained?

- **Cache**: 7 days
- **History**: 30 days (browser localStorage)
- **Usage statistics**: 1 year
- **Error logs**: 90 days

### Can I delete my AI usage data?

Yes. Contact your administrator to request data deletion. Note that this will clear your history and cache.

### Is the AI GDPR compliant?

Yes. The system follows GDPR guidelines for data collection, storage, and processing. See the Privacy Policy for full details.

### What about FERPA compliance (for educational institutions)?

The system is designed to be FERPA compliant. No student data is sent to the AI API. Only admin-created content and prompts are processed.

## Still Have Questions?

### Contact Support

- **Email**: support@example.com
- **Help Center**: help.example.com
- **Live Chat**: Available in admin dashboard

### Additional Resources

- [User Guide](./USER_GUIDE.md) - Comprehensive documentation
- [Block Capabilities](./BLOCK_CAPABILITIES.md) - Block-specific features
- [Templates Guide](./TEMPLATES_GUIDE.md) - Template system details
- [Video Tutorials](./VIDEO_TUTORIAL_SCRIPT.md) - Step-by-step videos

### Community

- **Forum**: community.example.com
- **Discord**: discord.gg/example
- **Monthly Webinars**: Register in admin dashboard

### Feature Requests

Have an idea for improving the AI Content Assistant? Submit feature requests through the feedback form in the admin dashboard.

---

**Last Updated**: December 2025
**Version**: 1.0
