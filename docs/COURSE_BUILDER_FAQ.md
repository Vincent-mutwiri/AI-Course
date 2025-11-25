# Course Builder FAQ

Frequently asked questions about the Admin Course Builder.

## Table of Contents

- [Getting Started](#getting-started)
- [Interface and Navigation](#interface-and-navigation)
- [Adding and Editing Content](#adding-and-editing-content)
- [File Uploads](#file-uploads)
- [Auto-Save and Data](#auto-save-and-data)
- [Block Types](#block-types)
- [Organization and Management](#organization-and-management)
- [Preview and Publishing](#preview-and-publishing)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Technical Questions](#technical-questions)

---

## Getting Started

### Q: How do I access the Course Builder?

**A:** Log in to your admin account, navigate to the Courses section, select a course, and click the "Edit Course" button. The Course Builder will open with your course ready to edit.

### Q: Do I need special permissions to use the Course Builder?

**A:** Yes, you need admin-level access. Regular users and students cannot access the Course Builder. Contact your system administrator if you need access.

### Q: Can I use the Course Builder on my phone?

**A:** The Course Builder is optimized for tablet and desktop screens (1024px width minimum). While you can access it on mobile, some features may be limited. We recommend using a tablet or desktop for the best experience.

### Q: Is there a tutorial or training available?

**A:** Yes! Check out:
- **Quick Start Guide** - 5-minute overview
- **Video Tutorials** - 5 videos covering all features
- **User Guide** - Comprehensive documentation

All documentation is available in the `docs` folder.

---

## Interface and Navigation

### Q: What are the three panels in the Course Builder?

**A:** 
- **Left Panel (Course Structure)** - Navigate between modules and lessons
- **Center Panel (Canvas)** - Arrange and edit your content blocks
- **Right Panel (Block Library)** - Browse and add new blocks

### Q: How do I switch between lessons?

**A:** Click on any lesson in the Course Structure panel (left side). If you have unsaved changes, you'll be prompted to confirm before switching.

### Q: Can I collapse the side panels to get more space?

**A:** On desktop, the panels are fixed. On mobile/tablet, they collapse into menus accessible from the header buttons. This is automatic based on screen size.

### Q: What does the "Saved" indicator mean?

**A:** The indicator in the top-right shows your save status:
- **Saving...** - Changes are being saved
- **Saved** ✓ - All changes saved successfully
- **Error** - Problem saving (changes preserved locally)

### Q: How do I get back to the admin dashboard?

**A:** Click the "← Back" button in the top-left corner. If you have unsaved changes, you'll be prompted to confirm.

---

## Adding and Editing Content

### Q: How do I add a block to my lesson?

**A:** 
1. Select a lesson from the Course Structure
2. In the Block Library (right panel), click on the block type you want
3. Configure the block in the modal that opens
4. Click Save

The block appears in your canvas and auto-saves.

### Q: Can I edit a block after adding it?

**A:** Yes! Hover over the block and click the edit icon (pencil). The configuration modal opens with the current content. Make your changes and click Save.

### Q: How do I delete a block?

**A:** Hover over the block and click the delete icon (trash can). Confirm the deletion in the dialog. **Warning:** This cannot be undone.

### Q: Can I duplicate a block?

**A:** Yes! Hover over the block and click the duplicate icon (two overlapping squares). A copy appears immediately below the original. You can also use **Cmd+D** (Mac) or **Ctrl+D** (Windows/Linux).

### Q: How do I reorder blocks?

**A:** Click and drag the handle on the left side of any block. A blue indicator shows where the block will be placed. Release to drop it in the new position.

### Q: What's the maximum number of blocks per lesson?

**A:** There's no hard limit, but we recommend 10-20 blocks per lesson for optimal performance and student engagement.

---

## File Uploads

### Q: What file types can I upload?

**A:**
- **Videos:** MP4, WebM, MOV
- **Images:** JPG, PNG, GIF, WebP

### Q: What are the file size limits?

**A:**
- **Videos:** 100MB maximum
- **Images:** 5MB maximum

### Q: Why did my upload fail?

**A:** Common reasons:
- File exceeds size limit
- Unsupported file format
- Poor internet connection
- Server storage full (contact admin)

Try compressing your file or using a different format.

### Q: Should I upload videos or embed them?

**A:** 
- **Embed** (YouTube/Vimeo) - Best for existing videos, saves storage, often better streaming
- **Upload** - Best for custom content, offline access, or when embed isn't available

### Q: How do I compress images before uploading?

**A:** Use tools like:
- TinyPNG (online)
- ImageOptim (Mac)
- GIMP (free, cross-platform)
- Photoshop (if available)

Aim for under 500KB per image when possible.

### Q: Can I upload PDFs or other documents?

**A:** Currently, the Course Builder supports videos and images only. For documents, consider:
- Converting to images (for short documents)
- Hosting elsewhere and linking in text blocks
- Requesting document block support from your admin

---

## Auto-Save and Data

### Q: How does auto-save work?

**A:** The Course Builder automatically saves your changes 2 seconds after you stop editing. You'll see a "Saving..." indicator, then "Saved" when complete.

### Q: What if I close the browser before it saves?

**A:** You'll lose any unsaved changes. Always wait for the "Saved" indicator before closing the tab. The browser will warn you if you try to close with unsaved changes.

### Q: Can I undo changes?

**A:** Currently, undo functionality is limited. The best practice is to:
- Preview before publishing
- Duplicate blocks before major edits
- Save frequently (auto-save handles this)

Full undo/redo is planned for a future update.

### Q: Are my changes visible to students immediately?

**A:** Yes! Once you see the "Saved" indicator, your changes are live. Students will see the updated content when they refresh or navigate to the lesson.

### Q: Can I save drafts without publishing?

**A:** Currently, all saved changes are immediately visible to students. Draft functionality is planned for a future update. For now:
- Create a test course for drafts
- Use a "Coming Soon" text block as a placeholder
- Coordinate with students about update times

### Q: What happens if two admins edit the same lesson?

**A:** The last person to save will overwrite previous changes. We recommend:
- Coordinating with other admins
- Working on different lessons
- Communicating before editing

Real-time collaboration is planned for a future update.

---

## Block Types

### Q: What's the difference between Basic and Interactive blocks?

**A:**
- **Basic Blocks** - Static content (text, video, image, code, list, divider)
- **Interactive Blocks** - Require student interaction (polls, quizzes, reflections, specialized tools)

### Q: Which block type should I use for...?

**Explanations and instructions:** Text Block  
**Video lectures:** Video Block  
**Diagrams and screenshots:** Image Block  
**Code examples:** Code Block  
**Step-by-step instructions:** List Block (numbered)  
**Section breaks:** Divider Block  
**Student responses:** Reflection Block  
**Quick feedback:** Poll Block  
**Brainstorming:** Word Cloud Block  
**Assessments:** Final Assessment Block  

See the [Block Types Reference](BLOCK_TYPES_REFERENCE.md) for complete details.

### Q: Can I create custom block types?

**A:** Not currently. The system includes 22 block types (6 basic, 16 interactive). If you need a specific block type, contact your system administrator to request it.

### Q: What's the AI Generator block?

**A:** The AI Generator block lets students generate content using AI assistance. You configure the type of content (story, scenario, example, etc.) and students provide prompts. The AI generates responses based on their input.

### Q: Are interactive blocks graded?

**A:** It depends on the block type:
- **Graded:** Final Assessment Block
- **Not Graded:** Reflection, Poll, Word Cloud (used for engagement and formative assessment)

Check the specific block type documentation for details.

---

## Organization and Management

### Q: How do I organize my course structure?

**A:** Courses are organized as:
```
Course
└── Modules (major topics)
    └── Lessons (individual learning units)
        └── Blocks (content pieces)
```

Plan your structure before adding content.

### Q: Can I add new modules and lessons?

**A:** Currently, you can edit existing lessons. Adding new modules and lessons is planned for a future update. Contact your system administrator if you need to add modules/lessons.

### Q: Can I move blocks between lessons?

**A:** Not directly. You can:
1. Duplicate the block
2. Switch to the target lesson
3. Add a new block with the same content
4. Delete the original

Copy-paste between lessons is planned for a future update.

### Q: How do I organize blocks within a lesson?

**A:** Use drag-and-drop to reorder blocks. Best practices:
1. Start with learning objectives (text block)
2. Present content (text, video, image)
3. Add interactive elements (poll, reflection)
4. End with summary or assessment

### Q: Can I create templates for common lesson structures?

**A:** Not currently. Block templates are planned for a future update. For now:
- Create a "template lesson" in a test course
- Duplicate blocks from it as needed
- Document your preferred structures

---

## Preview and Publishing

### Q: How do I preview my lesson?

**A:** Click the "Preview" button in the top-right corner. The lesson displays exactly as students will see it, with all interactive elements functional.

### Q: Can I preview without saving?

**A:** Yes! Preview shows your current canvas state, including unsaved changes. This lets you test before committing.

### Q: How do I exit preview mode?

**A:** Click the "X" or "Exit Preview" button. You return to editing mode with your lesson context preserved.

### Q: Can students see my lesson while I'm editing?

**A:** Yes, students can access the lesson. They'll see the last saved version. Your unsaved changes aren't visible until you save.

### Q: How do I unpublish a lesson?

**A:** There's no unpublish feature currently. To hide content:
- Delete all blocks (students see empty lesson)
- Add a "Coming Soon" text block
- Contact your admin about course visibility settings

### Q: Can I schedule content to publish later?

**A:** Not currently. Scheduled publishing is planned for a future update. For now, all saved changes are immediately visible.

---

## Troubleshooting

### Q: The Course Builder won't load. What should I do?

**A:**
1. Check your internet connection
2. Try refreshing the page
3. Clear your browser cache
4. Try a different browser
5. Contact your system administrator

### Q: I can't drag blocks. What's wrong?

**A:**
1. Make sure you're dragging from the handle (left side)
2. Try refreshing the page
3. Check if your browser supports drag-and-drop
4. Try a different browser

### Q: My changes aren't saving. Help!

**A:**
1. Check the save indicator for error messages
2. Verify your internet connection
3. Try manually refreshing the page
4. Check browser console for errors
5. Contact support with error details

### Q: The rich text editor isn't loading.

**A:**
1. Wait a few seconds (it loads lazily)
2. Check your internet connection
3. Try refreshing the page
4. Disable browser extensions that might interfere
5. Try a different browser

### Q: I accidentally deleted a block. Can I recover it?

**A:** Unfortunately, no. Deletion is permanent. Best practices:
- Duplicate important blocks before deleting
- Preview before major changes
- Be careful with the delete button

Undo functionality is planned for a future update.

### Q: The preview isn't showing my changes.

**A:**
1. Make sure you saved your changes (check indicator)
2. Try closing and reopening preview
3. Refresh the page
4. Check browser console for errors

### Q: I'm getting validation errors. What do they mean?

**A:** Validation errors indicate:
- Required fields are empty (marked with *)
- Content exceeds length limits
- Invalid format (e.g., URL format)
- File size too large

Read the error message carefully and correct the indicated field.

---

## Best Practices

### Q: How long should my lessons be?

**A:** Aim for 15-30 minutes of content per lesson. This typically means:
- 10-20 blocks per lesson
- 1-2 videos (5-10 minutes each)
- 3-5 text blocks
- 2-3 interactive elements

### Q: How many interactive blocks should I include?

**A:** Include at least one interactive block per lesson. More is fine, but balance with content blocks. A good ratio is 1 interactive block for every 3-4 content blocks.

### Q: Should I use headings in text blocks?

**A:** Yes! Use headings to structure content:
- H2 for main sections
- H3 for subsections
- H4 for sub-subsections

This helps with readability and accessibility.

### Q: How do I make my content accessible?

**A:**
1. **Always** add alt text to images
2. Add titles to videos
3. Use proper heading hierarchy
4. Ensure sufficient color contrast
5. Keep language clear and simple
6. Provide captions for videos

See the [Accessibility section](COURSE_BUILDER_GUIDE.md#accessibility) in the User Guide.

### Q: What's the best way to structure a lesson?

**A:** A typical lesson structure:
1. **Introduction** - Learning objectives (text block)
2. **Content** - Main teaching (text, video, image blocks)
3. **Engagement** - Interactive elements (poll, reflection)
4. **Practice** - Application activities
5. **Summary** - Key takeaways (text block)
6. **Assessment** - Check understanding (quiz, reflection)

### Q: How often should I use divider blocks?

**A:** Use dividers sparingly - only between major sections. Too many dividers clutter the page. Typically 2-3 per lesson is sufficient.

---

## Technical Questions

### Q: What browsers are supported?

**A:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

For best experience, use the latest version of Chrome or Firefox.

### Q: What screen size do I need?

**A:** Minimum 1024px width (tablet/desktop). The Course Builder is not optimized for phone screens.

### Q: Does the Course Builder work offline?

**A:** No, you need an internet connection for:
- Loading the Course Builder
- Auto-saving changes
- Uploading files
- Accessing the Block Library

### Q: Where are uploaded files stored?

**A:** Files are uploaded to AWS S3 cloud storage. Your system administrator manages storage capacity and costs.

### Q: Can I export my course content?

**A:** Not currently. Export functionality is planned for a future update. Contact your system administrator if you need to export content.

### Q: Is there an API for the Course Builder?

**A:** The Course Builder uses internal APIs. Public API access is not currently available. Contact your system administrator if you need programmatic access.

### Q: How is my data backed up?

**A:** Your system administrator manages backups. Contact them for details about backup frequency and retention policies.

### Q: Can I integrate with other systems?

**A:** Integration capabilities depend on your system configuration. Contact your system administrator about:
- LMS integration
- Single sign-on (SSO)
- Analytics platforms
- Content repositories

---

## Still Have Questions?

### Documentation Resources
- **[Quick Start Guide](COURSE_BUILDER_QUICK_START.md)** - Get started in 5 minutes
- **[User Guide](COURSE_BUILDER_GUIDE.md)** - Comprehensive reference
- **[Block Types Reference](BLOCK_TYPES_REFERENCE.md)** - Detailed block information
- **[Video Tutorials](VIDEO_TUTORIAL_SCRIPT.md)** - Visual walkthroughs

### Getting Help
- **Technical Issues:** Contact your system administrator
- **Training:** Request training from your organization
- **Feature Requests:** Submit through your organization's process
- **Bug Reports:** Include screenshots and steps to reproduce

### Before Contacting Support
Please have ready:
- What you were trying to do
- What happened instead
- Any error messages (screenshot if possible)
- Browser and operating system version
- Course and lesson you were editing

---

**Last Updated:** November 2025  
**Version:** 1.0

**Didn't find your answer?** Contact your system administrator or documentation team to suggest additions to this FAQ.
