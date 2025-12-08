# AI Content Assistant - Testing Checklist

Use this checklist to verify that the AI Assistant is working correctly after the visibility fix.

## Pre-Testing Setup

- [ ] Environment variables are set in `.env.local`:
  - [ ] `INFLECTION_API_URL` is configured
  - [ ] `INFLECTION_API_KEY` is valid
  - [ ] `MONGODB_URI` is connected
  - [ ] `JWT_SECRET` is set
  - [ ] `VITE_API_URL` points to backend

- [ ] Backend server is running: `npm run dev` (in server directory)
- [ ] Frontend server is running: `npm run dev` (in root directory)
- [ ] Logged in as an admin user

## Visual Verification

### 1. Text Block Editor
- [ ] AI Assistant panel is visible and expanded by default
- [ ] Sparkles icon (✨) is displayed
- [ ] "AI Content Assistant" header is visible
- [ ] Template dropdown is present
- [ ] Prompt textarea is visible
- [ ] Generation options (tone, reading level, length) are shown
- [ ] Generate button is clickable

### 2. Video Block Editor
- [ ] AI Assistant panel is visible
- [ ] Video-specific templates are available
- [ ] Can generate video scripts

### 3. Code Block Editor
- [ ] AI Assistant panel is visible
- [ ] Code-specific templates are available
- [ ] Can generate code examples

### 4. Reflection Block Editor
- [ ] AI Assistant panel is visible
- [ ] Reflection-specific templates are available
- [ ] Can generate reflection prompts

### 5. Poll Block Editor
- [ ] AI Assistant panel is visible
- [ ] Poll-specific templates are available
- [ ] Can generate poll questions

### 6. List Block Editor
- [ ] AI Assistant panel is visible
- [ ] List-specific templates are available
- [ ] Can generate list items

### 7. Image Block Editor
- [ ] "Generate Alt Text" button is visible (when image URL is present)
- [ ] AI Assistant panel appears when button is clicked
- [ ] Can generate alt text and captions

### 8. Interactive Block Editor (Final Assessment)
- [ ] AI Assistant panel is visible for Final Assessment type
- [ ] Quiz-specific templates are available
- [ ] Can generate quiz questions

## Functional Testing

### Basic Generation
- [ ] Select a template from dropdown
- [ ] Prompt textarea is auto-filled with template
- [ ] Click "Generate" button
- [ ] Loading spinner appears
- [ ] Generated content appears in preview area
- [ ] Content is relevant to the prompt

### Custom Prompts
- [ ] Clear template selection
- [ ] Type a custom prompt
- [ ] Character counter updates
- [ ] Generate button works with custom prompt
- [ ] Generated content matches custom prompt

### Generation Options
- [ ] Change tone to "Formal" - content style changes
- [ ] Change tone to "Conversational" - content style changes
- [ ] Change tone to "Encouraging" - content style changes
- [ ] Change reading level - complexity adjusts
- [ ] Change length - content length varies

### Content Refinement
- [ ] Generate initial content
- [ ] Click "Make Shorter" - content is condensed
- [ ] Click "Make Longer" - content is expanded
- [ ] Click "Simplify" - language is simplified
- [ ] Click "Add Examples" - examples are added
- [ ] Refinement history is tracked
- [ ] Can undo refinements

### Content Actions
- [ ] Click "Accept" - content is inserted into editor
- [ ] Click "Regenerate" - new content is generated
- [ ] Click "Discard" - generated content is cleared
- [ ] Click "Edit" - can manually modify content

### Keyboard Shortcuts
- [ ] Press Cmd/Ctrl+G - panel toggles expand/collapse
- [ ] Press Cmd/Ctrl+Shift+G - generates content
- [ ] Press Cmd/Ctrl+R - regenerates content
- [ ] Keyboard shortcuts dialog is accessible

### Generation History
- [ ] Generate multiple pieces of content
- [ ] Open generation history
- [ ] Previous generations are listed
- [ ] Can copy content to clipboard
- [ ] Can reuse previous generation
- [ ] Can delete individual entries
- [ ] Can clear all history

### Caching
- [ ] Generate content with a specific prompt
- [ ] Generate again with same prompt
- [ ] Second generation is faster (cached)
- [ ] Cache indicator shows "From cache"

### Error Handling
- [ ] Disconnect internet - offline warning appears
- [ ] Try to generate offline - error message shown
- [ ] Reconnect internet - can generate again
- [ ] Invalid prompt - appropriate error message
- [ ] API error - retry button appears

## Integration Testing

### Text Block Integration
- [ ] Generate text content
- [ ] Accept content
- [ ] Content appears in rich text editor
- [ ] Formatting is preserved
- [ ] Can edit generated content
- [ ] Can save block with generated content

### Video Block Integration
- [ ] Generate video script
- [ ] Accept content
- [ ] Title field is populated
- [ ] Description field is populated
- [ ] Script is displayed separately
- [ ] Can save block with generated content

### Code Block Integration
- [ ] Generate code example
- [ ] Accept content
- [ ] Code appears in code editor
- [ ] Language is auto-detected
- [ ] Explanation is included
- [ ] Syntax highlighting works

### Quiz Block Integration
- [ ] Generate quiz questions
- [ ] Accept content
- [ ] Questions are added to quiz
- [ ] Options are populated
- [ ] Correct answers are marked
- [ ] Explanations are included

## Performance Testing

- [ ] Generation completes within 15 seconds
- [ ] UI remains responsive during generation
- [ ] No console errors during generation
- [ ] No memory leaks after multiple generations
- [ ] Cache improves performance for repeated prompts

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on macOS)

## Mobile Responsiveness

- [ ] AI Assistant panel is usable on tablet
- [ ] Buttons are clickable on touch devices
- [ ] Text is readable on smaller screens

## Edge Cases

- [ ] Very long prompts (near 5000 character limit)
- [ ] Empty prompt - validation error shown
- [ ] Special characters in prompt
- [ ] Multiple rapid generations
- [ ] Switching between blocks during generation
- [ ] Closing editor during generation

## Regression Testing

Ensure existing functionality still works:
- [ ] Can create blocks without using AI
- [ ] Can edit blocks manually
- [ ] Can delete blocks
- [ ] Can reorder blocks
- [ ] Can save lessons
- [ ] Can publish courses

## Documentation Verification

- [ ] `AI_ASSISTANT_FIX_SUMMARY.md` is accurate
- [ ] `AI_ASSISTANT_USER_GUIDE.md` is comprehensive
- [ ] Screenshots/videos match current UI (if applicable)
- [ ] All features mentioned in docs are working

## Final Checks

- [ ] No TypeScript errors in console
- [ ] No React warnings in console
- [ ] No network errors in browser DevTools
- [ ] Backend logs show successful API calls
- [ ] MongoDB is recording AI usage data
- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`

## Sign-Off

- **Tester Name**: _______________
- **Date**: _______________
- **Environment**: Development / Staging / Production
- **Overall Status**: ✅ Pass / ❌ Fail
- **Notes**: _______________________________________________

---

## Issues Found

If any tests fail, document them here:

| Test | Issue Description | Severity | Status |
|------|------------------|----------|--------|
|      |                  |          |        |
|      |                  |          |        |
|      |                  |          |        |

**Severity Levels:**
- Critical: Blocks core functionality
- High: Major feature broken
- Medium: Minor feature issue
- Low: Cosmetic or edge case

---

## Next Steps After Testing

1. [ ] Fix any critical or high severity issues
2. [ ] Update documentation if needed
3. [ ] Deploy to staging environment
4. [ ] Conduct user acceptance testing
5. [ ] Deploy to production
6. [ ] Monitor AI usage and costs
7. [ ] Gather user feedback
8. [ ] Plan improvements based on feedback
