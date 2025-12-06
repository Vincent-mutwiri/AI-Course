# Implementation Plan

- [x] 1. Set up AI content generation infrastructure
  - Create `server/src/config/aiContentPrompts.ts` with prompt templates for all block types (text, video, code, reflection, poll, quiz, list, lesson outline)
  - Add refinement prompt templates (make-shorter, make-longer, simplify, add-examples, change-tone)
  - Create TypeScript interfaces for GenerationOptions, GeneratedContent, RefinementType, and CourseContext
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 2. Enhance AI service with content generation methods
  - [x] 2.1 Implement `generateBlockContent()` method in `server/src/services/aiService.ts`
    - Accept blockType, prompt, context, and options parameters
    - Build context-aware prompt using course/module/lesson information
    - Call Inflection AI API with constructed prompt
    - Parse and format response based on block type
    - Return GeneratedContent with metadata
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 2.2 Implement `refineContent()` method in `server/src/services/aiService.ts`
    - Accept content, refinementType, and context parameters
    - Build refinement prompt based on type
    - Call Inflection AI API
    - Return refined content
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 2.3 Implement `generateLessonOutline()` method in `server/src/services/aiService.ts`
    - Accept topic, objectives, and context parameters
    - Build outline generation prompt
    - Call Inflection AI API
    - Parse response into BlockOutline array
    - Generate placeholder content for each block
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 3. Create API endpoints for AI content generation
  - [x] 3.1 Implement POST /api/ai/generate-content endpoint
    - Add route in `server/src/routes/` with admin authentication
    - Validate request body (blockType, prompt, context, options)
    - Call `generateBlockContent()` service method
    - Track usage in database
    - Check cache before generating
    - Return generated content with metadata
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 14.1, 14.2, 14.3, 14.4_
  
  - [x] 3.2 Implement POST /api/ai/refine-content endpoint
    - Add route with admin authentication
    - Validate request body (content, refinementType, context)
    - Call `refineContent()` service method
    - Track usage in database
    - Return refined content
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 3.3 Implement POST /api/ai/generate-outline endpoint
    - Add route with admin authentication
    - Validate request body (topic, objectives, context)
    - Call `generateLessonOutline()` service method
    - Track usage in database
    - Return outline with placeholder content
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 3.4 Implement GET /api/ai/usage-stats endpoint
    - Add route with admin authentication
    - Query AIUsage collection with filters (courseId, date range)
    - Calculate statistics (total generations, by type, cache hit rate)
    - Return usage statistics
    - _Requirements: 14.1, 14.2, 14.5_

- [x] 4. Create AI usage tracking model
  - Create `server/src/models/AIUsage.ts` with Mongoose schema
  - Include fields: userId, courseId, blockType, generationType, promptLength, responseLength, tokensUsed, cached, timestamp
  - Add indexes for efficient querying (userId, courseId, timestamp)
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 5. Build frontend AI content cache utility
  - Create `src/utils/aiContentCache.ts` extending existing aiCache
  - Implement cache key generation based on blockType, prompt, context, and options
  - Implement localStorage-based caching with 7-day expiration
  - Implement max 50 entries per course with LRU eviction
  - Add cache statistics tracking (hit rate)
  - _Requirements: 14.3, 14.4_

- [x] 6. Create CourseContextBuilder service
  - Create `src/services/courseContextBuilder.ts`
  - Implement `buildContext()` method to extract course/module/lesson data
  - Implement `summarizeExistingContent()` to create concise summary of existing blocks
  - Handle missing or incomplete context data gracefully
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 7. Create PromptConstructor service
  - Create `src/services/promptConstructor.ts`
  - Implement `buildPrompt()` method combining template, user input, context, and options
  - Implement variable replacement in templates (topic, courseTitle, moduleName, etc.)
  - Implement `buildRefinementPrompt()` for content refinement
  - Add formatting instructions based on block type
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 8.1, 8.2, 8.3, 13.1, 13.2, 13.3_

- [x] 8. Create ResponseParser service
  - Create `src/services/responseParser.ts`
  - Implement `parseTextBlock()` to clean and format text content
  - Implement `parseCodeBlock()` to extract code and explanation
  - Implement `parseQuizQuestions()` to parse structured quiz data
  - Implement `parseListItems()` to extract list items and detect type
  - Implement `parseVideoScript()` to extract timestamps and sections
  - Implement `parseReflectionPrompts()` to extract multiple prompt options
  - Implement `parsePollData()` to extract question and options
  - Handle malformed responses with fallback strategies
  - _Requirements: 1.5, 1.6, 2.2, 2.3, 3.2, 3.3, 4.2, 4.3, 5.2, 5.3, 6.2, 6.3_

- [x] 9. Create AIAssistantPanel component
  - [x] 9.1 Create base component structure
    - Create `src/components/admin/AIAssistantPanel.tsx`
    - Implement collapsible panel UI with expand/collapse state
    - Add props interface (blockType, courseContext, onContentGenerated, currentContent)
    - Implement loading state with spinner
    - Add error state display
    - _Requirements: 1.1, 1.2, 8.1, 15.1, 15.2_
  
  - [x] 9.2 Implement template selector
    - Add dropdown for template selection
    - Load templates based on blockType
    - Display template description on selection
    - Pre-fill prompt input with template
    - Allow custom prompt override
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [x] 9.3 Implement generation controls
    - Add prompt input textarea with character counter
    - Add generation options (tone, readingLevel, length)
    - Add "Generate" button with loading state
    - Implement API call to /api/ai/generate-content
    - Check cache before API call
    - Display generated content in preview area
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 13.1, 13.2, 13.3, 13.4, 13.5, 14.3, 14.4_
  
  - [x] 9.4 Implement refinement controls
    - Add refinement option buttons (shorter, longer, simplify, add examples, change tone)
    - Implement API call to /api/ai/refine-content
    - Update preview with refined content
    - Allow multiple sequential refinements
    - Track refinement history
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 9.5 Implement content actions
    - Add "Accept" button to insert content into block editor
    - Add "Regenerate" button to generate new content with same prompt
    - Add "Discard" button to clear generated content
    - Add "Edit" button to manually modify generated content
    - Implement onContentGenerated callback
    - _Requirements: 1.6, 8.1_

- [x] 10. Integrate AIAssistantPanel into Text Block Editor
  - Import AIAssistantPanel into `src/components/admin/PageEditor/BlockEditors/TextBlockEditor.tsx`
  - Build CourseContext from available props
  - Add AIAssistantPanel above or beside text editor
  - Implement onContentGenerated to insert text into editor
  - Handle rich text formatting from AI
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 11. Integrate AIAssistantPanel into Video Block Editor
  - Import AIAssistantPanel into `src/components/admin/PageEditor/BlockEditors/VideoBlockEditor.tsx`
  - Configure for video script generation
  - Implement onContentGenerated to populate title and description fields
  - Display generated script in separate section
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 12. Integrate AIAssistantPanel into Code Block Editor
  - Import AIAssistantPanel into `src/components/admin/PageEditor/BlockEditors/CodeBlockEditor.tsx`
  - Configure for code example generation
  - Implement onContentGenerated to insert code and explanation
  - Auto-detect language from generated code
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 13. Integrate AIAssistantPanel into Reflection Block Editor
  - Import AIAssistantPanel into `src/components/admin/PageEditor/BlockEditors/ReflectionBlockEditor.tsx`
  - Configure for reflection prompt generation
  - Display multiple prompt options for selection
  - Implement onContentGenerated to populate prompt field
  - Auto-populate suggested minimum length
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 14. Integrate AIAssistantPanel into Poll Block Editor
  - Import AIAssistantPanel into `src/components/admin/PageEditor/BlockEditors/PollBlockEditor.tsx`
  - Configure for poll question generation
  - Implement onContentGenerated to populate question and options
  - Display generated discussion questions
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 15. Integrate AIAssistantPanel into Interactive Block Editor
  - Import AIAssistantPanel into `src/components/admin/PageEditor/BlockEditors/InteractiveBlockEditor.tsx`
  - Configure for quiz question generation (Final Assessment type)
  - Implement onContentGenerated to populate questions, options, and answers
  - Handle multiple question types (multiple choice, true/false, short answer)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 16. Integrate AIAssistantPanel into List Block Editor
  - Import AIAssistantPanel into `src/components/admin/PageEditor/BlockEditors/ListBlockEditor.tsx`
  - Configure for list generation (steps, requirements, tips, checklist)
  - Implement onContentGenerated to populate list items
  - Auto-detect list type from generated content
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 17. Create lesson outline generation feature
  - [ ] 17.1 Add "Generate Lesson Outline" button to lesson canvas
    - Add button to empty lesson state or lesson toolbar
    - Open modal dialog for outline generation
    - Add input fields for topic and learning objectives
    - Add block count preference (8-12 default)
    - _Requirements: 11.1, 11.2_
  
  - [ ] 17.2 Implement outline generation and preview
    - Call /api/ai/generate-outline endpoint
    - Display suggested blocks in preview list
    - Show block type, title, description, and estimated time for each
    - Allow reordering of suggested blocks
    - _Requirements: 11.2, 11.3_
  
  - [ ] 17.3 Implement outline acceptance workflow
    - Add checkboxes to accept/reject individual blocks
    - Add "Accept All" and "Reject All" buttons
    - Add "Add Selected Blocks" button
    - Create blocks on canvas with placeholder content
    - Close modal after blocks are added
    - _Requirements: 11.4, 11.5_

- [ ] 18. Create generation history feature
  - [ ] 18.1 Create GenerationHistory component
    - Create `src/components/admin/GenerationHistory.tsx`
    - Display list of previous generations for current course
    - Show prompt, block type, date, and preview of content
    - Organize by block type and date
    - _Requirements: 10.1, 10.2, 10.4_
  
  - [ ] 18.2 Implement history actions
    - Add "Copy to Clipboard" button for each entry
    - Add "Reuse" button to load content into current block
    - Add "Delete" button to remove individual entries
    - Add "Clear All" button to clear entire history
    - Store history in localStorage per course
    - _Requirements: 10.2, 10.3, 10.5_

- [ ] 19. Create AI settings panel
  - Create `src/components/admin/AISettings.tsx`
  - Add settings for default tone (formal, conversational, encouraging)
  - Add settings for default reading level (high school, college, professional)
  - Add settings for default content length (brief, moderate, detailed)
  - Save settings to localStorage per user
  - Load settings on component mount
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 20. Create AI usage dashboard
  - Create `src/pages/admin/AIUsageDashboard.tsx`
  - Fetch usage stats from /api/ai/usage-stats endpoint
  - Display total generations count
  - Display generations by block type (chart)
  - Display cache hit rate
  - Display estimated cost
  - Display usage by day (line chart)
  - Add date range filter
  - Add course filter
  - _Requirements: 14.1, 14.2, 14.5_

- [ ] 21. Implement image alt text generation
  - Add "Generate Alt Text" button to ImageBlockEditor
  - Analyze surrounding text and lesson topic for context
  - Call AI service to generate descriptive alt text (under 125 characters)
  - Generate caption text with additional context
  - Implement onContentGenerated to populate alt text and caption fields
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 22. Add error handling and user feedback
  - Implement error toast notifications for generation failures
  - Display specific error messages (network, timeout, rate limit, validation)
  - Add retry button for failed generations
  - Preserve user prompt on error
  - Show offline indicator when network unavailable
  - Add loading progress indicator for long generations
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 23. Implement content templates system
  - Create `src/config/contentTemplates.ts` with template definitions
  - Define templates for common scenarios (lesson intro, learning objectives, summary, practice activity)
  - Add template metadata (name, description, block types, required fields)
  - Implement template loading in AIAssistantPanel
  - Allow admins to save custom templates
  - Store custom templates in localStorage
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 24. Add keyboard shortcuts for AI features
  - Add Cmd/Ctrl+G to open AI assistant panel
  - Add Cmd/Ctrl+Shift+G to generate with current prompt
  - Add Cmd/Ctrl+R to regenerate content
  - Add Cmd/Ctrl+Shift+R to refine content
  - Display keyboard shortcuts in tooltip or help panel
  - _Requirements: 1.1, 8.1_

- [ ]* 25. Write comprehensive documentation
  - Create user guide for AI Content Assistant features
  - Document each block type's AI capabilities
  - Document template system and custom templates
  - Document refinement options and best practices
  - Add troubleshooting section for common issues
  - Create video tutorial for AI-assisted course creation
  - _Requirements: All requirements_
