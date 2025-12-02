# Implementation Plan

- [x] 1. Update Page model to support block-based content structure
  - Modify the Page schema to change content field from Schema.Types.Mixed to a structured format with blocks array and version field
  - Add migration script to convert existing pages with unstructured content to block-based format
  - Export IBlock interface from Course model for reuse in Page model
  - _Requirements: 1.3, 2.5_

- [x] 2. Implement backend API routes for page block management
  - [x] 2.1 Create GET /api/admin/pages/:id/edit endpoint to fetch page with blocks for editing
    - Return page data with blocks array
    - Include error handling for page not found
    - _Requirements: 1.1_
  
  - [x] 2.2 Create PUT /api/admin/pages/:id/blocks endpoint to save page blocks
    - Validate blocks array structure (id, type, order required)
    - Update page content with new blocks
    - Return updated page data
    - _Requirements: 1.3, 1.4_
  
  - [x] 2.3 Create PATCH /api/admin/pages/:id/blocks/reorder endpoint for drag-and-drop reordering
    - Accept array of block IDs in new order
    - Update order property of all blocks
    - Validate all block IDs exist
    - _Requirements: 4.1, 4.2, 4.4_
  
  - [x] 2.4 Create POST /api/admin/pages/:id/blocks/:blockId/duplicate endpoint
    - Find block by ID
    - Create duplicate with new unique ID
    - Insert after original block
    - Update order values for subsequent blocks
    - _Requirements: 5.1, 5.3_
  
  - [x] 2.5 Create DELETE /api/admin/pages/:id/blocks/:blockId endpoint
    - Remove block from blocks array
    - Update order values for remaining blocks
    - Handle deletion of last block
    - _Requirements: 5.2, 5.4_
  
  - [x] 2.6 Create GET /api/admin/pages/validate-slug endpoint for slug uniqueness validation
    - Check if slug exists in database
    - Exclude current page ID from check (for edits)
    - Return boolean indicating uniqueness
    - _Requirements: 7.2_

- [x] 3. Create page editor UI container and routing
  - [x] 3.1 Create PageEditorContainer component with data fetching and state management
    - Fetch page data on mount (or initialize empty page for new pages)
    - Manage blocks state array
    - Implement auto-save logic with 30-second debounce
    - Handle save success/error states
    - _Requirements: 1.1, 10.1, 10.2_
  
  - [x] 3.2 Add routing for page editor in admin section
    - Add route for /admin/pages/new (create new page)
    - Add route for /admin/pages/:id/edit (edit existing page)
    - Implement navigation guards for unsaved changes
    - _Requirements: 1.1, 10.4_
  
  - [x] 3.3 Create PageMetadataForm component for title, slug, type, and publish status
    - Input fields for title, slug, type dropdown, isPublished checkbox
    - Auto-generate slug from title if not manually set
    - Validate slug uniqueness on blur
    - Display validation errors inline
    - _Requirements: 7.1, 7.2, 7.5, 1.5_

- [x] 4. Build block palette and canvas components
  - [x] 4.1 Create BlockPalette component displaying available block types
    - Categorize blocks (Content, Interactive, Advanced)
    - Display block type icons and names
    - Implement search/filter functionality
    - Handle click to add block at end of canvas
    - Support drag-and-drop to add block at specific position
    - _Requirements: 1.1, 1.2, 2.1, 2.2_
  
  - [x] 4.2 Create BlockCanvas component for main editing area
    - Render blocks array in order
    - Implement drag-and-drop reordering using react-beautiful-dnd or @dnd-kit
    - Display empty state when no blocks exist
    - Show visual feedback during drag operations (drag handles, drop zones)
    - Call reorder API when blocks are rearranged
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 4.3 Create BlockToolbar component with duplicate and delete actions
    - Display toolbar on block hover or selection
    - Duplicate button calls duplicate API
    - Delete button calls delete API with confirmation
    - Drag handle for reordering
    - _Requirements: 5.1, 5.2_

- [-] 5. Implement block editor components for content blocks
  - [x] 5.1 Create TextBlockEditor component with rich text editing
    - Integrate rich text editor (TinyMCE, Quill, or similar)
    - Support formatting: bold, italic, headings, links, lists
    - Update block content.text on change
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 5.2 Create VideoBlockEditor component
    - Input field for videoUrl
    - Dropdown for videoSource (upload/embed)
    - Dropdown for videoProvider (youtube/vimeo/s3)
    - Upload button for video files
    - Video preview
    - _Requirements: 3.1, 3.2, 3.4_
  
  - [x] 5.3 Create ImageBlockEditor component
    - Input field for imageUrl
    - Upload button for image files
    - Input fields for caption and altText
    - Image preview with responsive sizing
    - _Requirements: 3.1, 3.2, 3.5, 8.1, 8.2, 8.3_
  
  - [x] 5.4 Create CodeBlockEditor component
    - Textarea for code input with monospace font
    - Dropdown for language selection
    - Syntax highlighting preview
    - _Requirements: 3.1, 3.2_
  
  - [x] 5.5 Create ListBlockEditor component
    - Input fields for list items (add/remove/reorder)
    - Dropdown for listType (bullet/numbered/checkbox)
    - Checkbox for checked state (if checkbox type)
    - _Requirements: 3.1, 3.2_
  
  - [x] 5.6 Create DividerBlockEditor component
    - No input fields needed (divider has no configurable content)
    - Display visual representation of divider
    - _Requirements: 3.1, 3.2_

- [ ] 6. Implement block editor components for interactive blocks
  - [ ] 6.1 Create ReflectionBlockEditor component
    - Input field for question
    - Input field for prompt
    - Input field for minLength
    - _Requirements: 3.1, 3.2, 2.2_
  
  - [ ] 6.2 Create PollBlockEditor component
    - Input field for question
    - Dynamic list of options (add/remove)
    - _Requirements: 3.1, 3.2, 2.2_
  
  - [ ] 6.3 Create WordCloudBlockEditor component
    - Input field for question
    - Configuration for word list (if pre-populated)
    - _Requirements: 3.1, 3.2, 2.2_
  
  - [ ] 6.4 Create AIGeneratorBlockEditor component
    - Input field for prompt
    - Dropdown for generatorType
    - Configuration options based on generator type
    - _Requirements: 3.1, 3.2, 2.2_
  
  - [ ] 6.5 Create generic InteractiveBlockEditor component for remaining interactive blocks
    - Dynamically render input fields based on block type
    - Support common fields: question, prompt, config, options, title, description
    - Reuse existing Course Builder interactive block editor logic
    - _Requirements: 3.1, 3.2, 2.2, 2.3_

- [ ] 7. Implement media upload functionality
  - [ ] 7.1 Integrate existing upload service in block editors
    - Reuse /api/admin/upload endpoint from Course Builder
    - Add file selection dialog with type filtering
    - Display upload progress indicator
    - Handle upload success (populate URL field)
    - Handle upload errors (file size, type validation)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 8. Create auto-save functionality
  - [ ] 8.1 Implement debounced save in PageEditorContainer
    - Trigger save 30 seconds after last change
    - Cancel pending save if new changes occur
    - Track save state (idle, saving, saved, error)
    - _Requirements: 10.1_
  
  - [ ] 8.2 Create AutoSaveIndicator component
    - Display "Saving..." during save operation
    - Display "Saved at HH:MM" after successful save
    - Display error message if save fails
    - Implement retry logic for failed saves (max 3 attempts with 10-second delay)
    - _Requirements: 10.2, 10.3_
  
  - [ ] 8.3 Implement unsaved changes warning
    - Track dirty state (has unsaved changes)
    - Show browser confirmation dialog on navigation/close
    - Clear dirty state after successful save
    - _Requirements: 10.4_

- [ ] 9. Build page preview functionality
  - [ ] 9.1 Create PagePreview component
    - Toggle between edit and preview modes
    - Render blocks using frontend rendering logic
    - Enable interactive blocks in preview mode
    - Display clear visual indicator for preview mode
    - Preserve unsaved changes when exiting preview
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10. Create frontend page renderer for end users
  - [ ] 10.1 Create PageRenderer component
    - Fetch page data by slug
    - Iterate through blocks array
    - Render each block using BlockRenderer component
    - Handle page not found errors
    - Handle unpublished pages (show only to admins)
    - _Requirements: 2.4, 7.3, 7.4_
  
  - [ ] 10.2 Create BlockRenderer component
    - Map block type to appropriate rendering component
    - Reuse existing Course Builder block rendering components
    - Apply consistent styling across all block types
    - Handle interactive block state management
    - _Requirements: 2.4, 2.3_
  
  - [ ] 10.3 Add public route for page rendering
    - Add route for /:slug to render published pages
    - Check isPublished status before rendering
    - Return 404 for non-existent or unpublished pages (unless admin)
    - _Requirements: 7.3, 7.4_

- [ ] 11. Build pages management list interface
  - [ ] 11.1 Create PagesListContainer component
    - Fetch all pages from /api/admin/pages
    - Display table with columns: title, slug, type, isPublished, updatedAt
    - Implement sorting by updatedAt (descending by default)
    - Handle click on row to navigate to editor
    - _Requirements: 9.1, 9.2, 9.5_
  
  - [ ] 11.2 Add filter and search functionality
    - Filter dropdown for published/unpublished/all
    - Search input for title and slug
    - Update table based on filters
    - _Requirements: 9.3, 9.4_
  
  - [ ] 11.3 Add create new page button
    - Button to navigate to /admin/pages/new
    - Display prominently at top of list
    - _Requirements: 1.1_

- [ ] 12. Implement validation and error handling
  - [ ] 12.1 Add client-side validation for page metadata
    - Validate title is not empty
    - Validate slug is URL-safe (alphanumeric, hyphens, underscores)
    - Validate slug uniqueness via API call
    - Display inline error messages
    - Prevent save when validation fails
    - _Requirements: 1.5, 7.2_
  
  - [ ] 12.2 Add client-side validation for block content
    - Validate required fields for each block type
    - Display inline errors in block editors
    - Highlight invalid blocks in canvas
    - _Requirements: 1.4_
  
  - [ ] 12.3 Implement error handling for network failures
    - Display error notifications for failed API calls
    - Implement retry logic for transient failures
    - Store changes locally if connection lost
    - _Requirements: 10.3_

- [ ] 13. Add comprehensive testing
  - [ ] 13.1 Write unit tests for backend API routes
    - Test page block CRUD operations
    - Test validation logic
    - Test error conditions
    - _Requirements: All_
  
  - [ ] 13.2 Write unit tests for frontend components
    - Test block editors in isolation
    - Test block palette and canvas
    - Test auto-save logic
    - Test validation
    - _Requirements: All_
  
  - [ ] 13.3 Write integration tests for page workflows
    - Test complete page creation flow
    - Test page editing with block operations
    - Test media upload integration
    - Test publishing workflow
    - _Requirements: All_
  
  - [ ] 13.4 Write end-to-end tests for admin and user flows
    - Test admin creating and publishing page
    - Test end user viewing published page
    - Test interactive blocks functionality
    - _Requirements: All_

- [ ] 14. Polish and optimize
  - [ ] 14.1 Optimize page editor performance
    - Implement virtualization for large block lists
    - Lazy load block editor components
    - Optimize re-renders with React.memo
    - _Requirements: All_
  
  - [ ] 14.2 Add keyboard shortcuts for common actions
    - Ctrl/Cmd+S for manual save
    - Ctrl/Cmd+Z for undo
    - Ctrl/Cmd+Shift+Z for redo
    - Delete key for deleting selected block
    - _Requirements: All_
  
  - [ ] 14.3 Improve accessibility
    - Add ARIA labels to all interactive elements
    - Ensure keyboard navigation works throughout editor
    - Test with screen readers
    - Add focus indicators
    - _Requirements: All_
  
  - [ ] 14.4 Add loading states and skeleton screens
    - Show skeleton while loading page data
    - Show loading spinner during save operations
    - Show progress indicator during media uploads
    - _Requirements: All_
