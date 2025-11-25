# Implementation Plan

- [x] 1. Set up database schema and types
  - Add Block interface and BlockType enum to Course model types
  - Create Mongoose blockSchema with all required fields
  - Update lessonSchema to include blocks array field
  - Export IBlock interface for frontend use
  - _Requirements: 1.1, 1.2, 12.1, 12.2, 12.3_

- [x] 2. Create admin API routes for course builder
  - [x] 2.1 Implement GET /admin/courses/:id/edit endpoint
    - Add route handler to fetch course with modules and lessons
    - Apply authenticate and requireAdmin middleware
    - Select only necessary fields for builder (title, modules, lessons, blocks)
    - Return formatted course data
    - _Requirements: 1.2, 8.1_

  - [x] 2.2 Implement PUT /admin/courses/:courseId/modules/:moduleId/lessons/:lessonId/blocks endpoint
    - Create route handler to save blocks array
    - Add block validation middleware
    - Update lesson blocks in database
    - Return updated lesson data
    - _Requirements: 7.1, 7.3, 7.4_

  - [x] 2.3 Implement POST /admin/upload endpoint
    - Create route handler for file uploads
    - Add Multer middleware for file handling
    - Validate file type and size
    - Upload to S3 using existing AWS SDK setup
    - Return S3 URL and metadata
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

  - [x] 2.4 Implement PATCH /admin/courses/:courseId/lessons/:lessonId/blocks/reorder endpoint
    - Create route handler to reorder blocks
    - Validate blockIds array
    - Update block order in database
    - Return updated blocks array
    - _Requirements: 5.2, 5.3_

  - [x] 2.5 Implement POST /admin/courses/:courseId/lessons/:lessonId/blocks/:blockId/duplicate endpoint
    - Create route handler to duplicate block
    - Generate new UUID for duplicated block
    - Insert duplicated block after original
    - Return new block data
    - _Requirements: 6.1_

- [x] 3. Create block validation schemas
  - Create src/lib/validation/blockSchemas.ts file
  - Implement Zod schemas for all 6 basic block types (text, video, image, code, list, divider)
  - Implement Zod schemas for key interactive block types (reflection, poll, wordCloud)
  - Add file size and type validation constants
  - Export all schemas for use in modals
  - _Requirements: 4.3, 4.4, 4.5, 4.6_

- [x] 4. Build CourseBuilderPage foundation
  - [x] 4.1 Create CourseBuilderPage component structure
    - Create src/pages/admin/CourseBuilderPage.tsx
    - Set up component state (course, currentModuleId, currentLessonId, blocks, isLoading, isSaving)
    - Implement useEffect to fetch course data on mount
    - Add route at /admin/courses/:id/builder in App.tsx
    - Create three-panel layout with flex containers
    - _Requirements: 1.1, 1.2, 1.5_

  - [x] 4.2 Implement auto-save functionality
    - Create debounced save function with 2-second delay
    - Add useEffect to trigger save on blocks change
    - Display saving indicator in UI
    - Show success/error toast notifications
    - Handle save failures with retry logic
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 4.3 Add keyboard shortcuts
    - Implement Cmd/Ctrl+Z for undo
    - Implement Cmd/Ctrl+D for duplicate
    - Add event listeners in useEffect
    - Clean up listeners on unmount
    - _Requirements: 6.5_

  - [x] 4.4 Add unsaved changes warning
    - Track hasUnsavedChanges state
    - Add beforeunload event listener
    - Show confirmation dialog on navigation
    - _Requirements: 8.2_

- [x] 5. Build CourseStructure component
  - Create src/components/admin/course-builder/CourseStructure.tsx
  - Implement Accordion with modules and lessons
  - Add active lesson highlighting
  - Implement onLessonSelect handler
  - Add "Add Module" button with handler
  - Style with proper spacing and colors
  - _Requirements: 1.3, 1.4, 8.1, 8.3, 8.4_

- [x] 6. Build Canvas component with drag-and-drop
  - [x] 6.1 Create Canvas component structure
    - Create src/components/admin/course-builder/Canvas.tsx
    - Set up DragDropContext from @hello-pangea/dnd
    - Implement Droppable area for blocks
    - Add empty state when no blocks exist
    - _Requirements: 1.1, 5.1_

  - [x] 6.2 Implement drag-and-drop functionality
    - Create Draggable wrapper for each block
    - Implement onDragEnd handler
    - Update blocks order on drop
    - Add visual indicators during drag
    - Call API to persist new order
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 6.3 Add block action handlers
    - Implement onBlockEdit handler to open modal
    - Implement onBlockDuplicate handler
    - Implement onBlockDelete handler with confirmation
    - Implement onBlockPreview handler
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 7. Build BlockLibrary component
  - Create src/components/admin/course-builder/BlockLibrary.tsx
  - Define block type metadata (icon, title, description) for all 21 types
  - Implement Tabs for Basic and Interactive categories
  - Add search input with filter logic
  - Create BlockCard component for each block type
  - Implement onBlockAdd handler to add block to canvas
  - _Requirements: 2.1, 2.2, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 8. Build BlockRenderer component
  - Create src/components/admin/course-builder/BlockRenderer.tsx
  - Implement action toolbar with edit, duplicate, preview, delete buttons
  - Add hover effect to show/hide toolbar
  - Create renderBlockContent function to route to specific block components
  - Style with proper spacing and borders
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 9. Create basic block components
  - [x] 9.1 Create TextBlock component
    - Create src/components/admin/course-builder/blocks/TextBlock.tsx
    - Render HTML content safely
    - Display truncated preview in canvas
    - _Requirements: 2.2_

  - [x] 9.2 Create VideoBlock component
    - Create src/components/admin/course-builder/blocks/VideoBlock.tsx
    - Support YouTube, Vimeo, and S3 video sources
    - Display video player or thumbnail
    - _Requirements: 2.2_

  - [x] 9.3 Create ImageBlock component
    - Create src/components/admin/course-builder/blocks/ImageBlock.tsx
    - Display image with caption
    - Show alt text in preview
    - _Requirements: 2.2_

  - [x] 9.4 Create CodeBlock component
    - Create src/components/admin/course-builder/blocks/CodeBlock.tsx
    - Use Prism.js or Highlight.js for syntax highlighting
    - Display language badge
    - _Requirements: 2.2_

  - [x] 9.5 Create ListBlock component
    - Create src/components/admin/course-builder/blocks/ListBlock.tsx
    - Support bullet, numbered, and checkbox lists
    - Render items with proper styling
    - _Requirements: 2.2_

  - [x] 9.6 Create DividerBlock component
    - Create src/components/admin/course-builder/blocks/DividerBlock.tsx
    - Render horizontal divider with styling
    - _Requirements: 2.2_

- [x] 10. Create configuration modals for basic blocks
  - [x] 10.1 Create TextBlockModal
    - Create src/components/admin/course-builder/modals/TextBlockModal.tsx
    - Integrate TipTap or Lexical rich text editor
    - Add React Hook Form with textBlockSchema validation
    - Implement save handler
    - _Requirements: 2.2, 4.1, 4.2, 4.3_

  - [x] 10.2 Create VideoBlockModal
    - Create src/components/admin/course-builder/modals/VideoBlockModal.tsx
    - Add radio buttons for upload vs embed
    - Add URL input for embed option
    - Add file input for upload option with progress indicator
    - Add React Hook Form with videoBlockSchema validation
    - Implement upload to S3 on save
    - _Requirements: 2.2, 4.1, 4.2, 4.3, 4.4, 9.1, 9.2, 9.3, 9.4_

  - [x] 10.3 Create ImageBlockModal
    - Create src/components/admin/course-builder/modals/ImageBlockModal.tsx
    - Add file input for image upload
    - Add caption and alt text fields
    - Add React Hook Form with imageBlockSchema validation
    - Implement upload to S3 on save
    - _Requirements: 2.2, 4.1, 4.2, 4.3, 4.4, 9.1, 9.2, 9.3, 9.4_

  - [x] 10.4 Create CodeBlockModal
    - Create src/components/admin/course-builder/modals/CodeBlockModal.tsx
    - Add textarea for code input
    - Add select dropdown for language
    - Add React Hook Form with codeBlockSchema validation
    - _Requirements: 2.2, 4.1, 4.2, 4.3_

  - [x] 10.5 Create ListBlockModal
    - Create src/components/admin/course-builder/modals/ListBlockModal.tsx
    - Add radio buttons for list type
    - Add dynamic item inputs with add/remove buttons
    - Add React Hook Form with listBlockSchema validation
    - _Requirements: 2.2, 4.1, 4.2, 4.3_

  - [x] 10.6 Create DividerBlockModal
    - Create src/components/admin/course-builder/modals/DividerBlockModal.tsx
    - Add minimal configuration (style options)
    - Add React Hook Form with basic validation
    - _Requirements: 2.2, 4.1, 4.2_

- [x] 11. Create configuration modals for interactive blocks
  - [x] 11.1 Create ReflectionBlockModal
    - Create src/components/admin/course-builder/modals/ReflectionBlockModal.tsx
    - Add question/prompt textarea
    - Add minLength number input
    - Add placeholder text input
    - Add React Hook Form with reflectionBlockSchema validation
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3_

  - [x] 11.2 Create PollBlockModal
    - Create src/components/admin/course-builder/modals/PollBlockModal.tsx
    - Add question input
    - Add dynamic option inputs
    - Add React Hook Form with validation
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3_

  - [x] 11.3 Create WordCloudBlockModal
    - Create src/components/admin/course-builder/modals/WordCloudBlockModal.tsx
    - Add prompt input
    - Add configuration options
    - Add React Hook Form with validation
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3_

  - [x] 11.4 Create AIGeneratorBlockModal
    - Create src/components/admin/course-builder/modals/AIGeneratorBlockModal.tsx
    - Add generator type selection
    - Add title and description inputs
    - Add placeholder and options configuration
    - Add React Hook Form with validation
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3_

  - [x] 11.5 Create modals for remaining interactive blocks
    - Create ChoiceComparisonBlockModal.tsx
    - Create DesignFixerBlockModal.tsx
    - Create PlayerTypeSimulatorBlockModal.tsx
    - Create RewardScheduleDesignerBlockModal.tsx
    - Create FlowChannelEvaluatorBlockModal.tsx
    - Create PitchAnalysisGeneratorBlockModal.tsx
    - Create NarrativeGeneratorBlockModal.tsx
    - Create DarkPatternRedesignerBlockModal.tsx
    - Create ROEDashboardBlockModal.tsx
    - Create JourneyTimelineBlockModal.tsx
    - Create CertificateGeneratorBlockModal.tsx
    - Create FinalAssessmentBlockModal.tsx
    - Add React Hook Form with validation for each
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3_

- [x] 12. Integrate block rendering in student view
  - Update src/pages/ModuleContent.tsx to support blocks array
  - Add conditional rendering: use blocks if present, otherwise use legacy fields
  - Map blocks to appropriate student-facing components
  - Ensure interactive elements render with full functionality
  - Test backward compatibility with existing courses
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 13. Add preview mode
  - Add preview state toggle in CourseBuilderPage
  - Create PreviewModal component to display lesson in student view
  - Render all blocks using student-facing components
  - Add exit preview button
  - Maintain lesson context when entering/exiting preview
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 14. Implement modal management system
  - Create useBlockModal hook to manage modal state
  - Track currently editing block
  - Handle modal open/close
  - Pass block data to appropriate modal
  - Handle save callback to update blocks array
  - _Requirements: 4.1, 4.2_

- [x] 15. Add loading and error states
  - Add loading spinner while fetching course data
  - Add error boundary for component errors
  - Display error messages for failed operations
  - Add retry buttons for failed uploads
  - Show validation errors inline in forms
  - _Requirements: 4.7_

- [x] 16. Implement file upload progress
  - Add upload progress state
  - Display progress bar during file upload
  - Show upload percentage
  - Handle upload cancellation
  - _Requirements: 9.4_

- [x] 17. Add responsive design
  - Make three-panel layout responsive for tablet and desktop
  - Collapse sidebars on smaller screens
  - Add mobile warning message
  - Test on various screen sizes
  - _Requirements: 1.5_

- [ ] 18. Create migration script
  - Create server/src/scripts/migrateToBlocks.ts
  - Implement function to convert interactiveElements to blocks
  - Add order field based on original array index
  - Generate UUIDs for each block
  - Preserve all existing configuration
  - Add CLI command to run migration
  - _Requirements: 12.3_

- [ ] 19. Add comprehensive testing
  - [ ] 19.1 Write unit tests for block components
    - Test TextBlock, VideoBlock, ImageBlock rendering
    - Test CodeBlock, ListBlock, DividerBlock rendering
    - Test block validation schemas
    - _Requirements: All block-related requirements_

  - [ ] 19.2 Write integration tests for workflows
    - Test block addition workflow
    - Test block editing workflow
    - Test drag-and-drop reordering
    - Test auto-save functionality
    - Test file upload flow
    - _Requirements: 2.1, 4.1, 5.1, 7.1, 9.1_

  - [ ] 19.3 Write E2E tests for critical flows
    - Test creating new lesson with multiple blocks
    - Test editing existing block configuration
    - Test reordering blocks via drag-and-drop
    - Test uploading video and image files
    - Test preview mode
    - Test auto-save recovery
    - _Requirements: All requirements_

- [ ] 20. Performance optimization
  - Add lazy loading for modals
  - Add lazy loading for rich text editor
  - Memoize BlockRenderer components
  - Optimize re-renders with React.memo
  - Add selective field loading in API
  - _Requirements: Performance considerations from design_

- [ ] 21. Accessibility improvements
  - Add ARIA labels to all interactive elements
  - Add keyboard navigation support
  - Ensure sufficient color contrast
  - Add focus indicators
  - Test with screen readers
  - _Requirements: Accessibility requirements from design_

- [ ] 22. Documentation
  - Create user guide for course builder
  - Document block types and their configurations
  - Add inline help text and tooltips
  - Create video tutorial
  - _Requirements: User experience requirements_
