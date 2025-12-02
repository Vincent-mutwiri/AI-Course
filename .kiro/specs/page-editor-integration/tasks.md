# Implementation Plan

- [x] 1. Set up type definitions and API configuration
  - Create or update src/types/page.ts with IPage, IBlock, BlockType, and BlockContent interfaces
  - Update src/services/api.ts to add pageEditorApi methods (getPage, createPage, updatePage, uploadFile)
  - Update vite.config.ts to add proxy configuration for /api routes to localhost:3000
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 9.1, 9.2, 9.3, 9.4_

- [x] 2. Copy page editor components to main React app
  - [x] 2.1 Copy main page editor components
    - Copy PageEditorContainer.tsx from server/client/src/components/admin/PageEditor/ to src/components/admin/PageEditor/
    - Copy BlockCanvas.tsx, BlockPalette.tsx, BlockEditorPanel.tsx, BlockRenderer.tsx, BlockToolbar.tsx
    - Copy SortableBlockItem.tsx, AutoSaveIndicator.tsx, PageMetadataForm.tsx, PagePreview.tsx
    - Copy BlockEditor.css and PageEditor.css
    - Copy index.ts
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 2.2 Copy block editor components
    - Copy entire BlockEditors directory from server/client/src/components/admin/PageEditor/BlockEditors/ to src/components/admin/PageEditor/BlockEditors/
    - Ensure all block editor files are copied: TextBlockEditor.tsx, VideoBlockEditor.tsx, ImageBlockEditor.tsx, CodeBlockEditor.tsx, ListBlockEditor.tsx, DividerBlockEditor.tsx
    - Copy interactive block editors: InteractiveBlockEditor.tsx, PollBlockEditor.tsx, ReflectionBlockEditor.tsx, WordCloudBlockEditor.tsx, AIGeneratorBlockEditor.tsx
    - Copy BlockEditors.css and index.ts
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 2.3 Update import paths in copied components
    - Update all import statements to use @/ alias for src directory
    - Fix imports for UI components from @/components/ui
    - Fix imports for services from @/services
    - Fix imports for types from @/types
    - Ensure all relative imports within PageEditor directory are correct
    - _Requirements: 2.1, 2.2, 9.1, 9.2, 9.3_

- [ ] 3. Create PageEditorPage wrapper component
  - Create src/pages/admin/PageEditorPage.tsx
  - Implement useParams hook to extract page ID from route
  - Add state for pageData, isLoading, and error
  - Implement useEffect to fetch page data on mount for edit mode
  - Add loading spinner while fetching data
  - Add error display for failed data fetch
  - Pass pageData to PageEditorContainer component
  - Add navigation back to /admin/pages on save
  - Wrap component in ErrorBoundary
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.4, 5.1, 5.2, 6.6_

- [ ] 4. Update PageBuilder component for navigation
  - Update "Create Page" button to navigate to /admin/pages/new instead of opening dialog
  - Update edit button in table to navigate to /admin/pages/:id/edit
  - Remove the Dialog component and form for creating/editing pages
  - Keep the table view and delete functionality unchanged
  - Ensure page list refreshes when navigating back from editor
  - _Requirements: 1.5, 4.1, 4.2, 4.5_

- [ ] 5. Update routing configuration
  - Add route /admin/pages/new with PageEditorPage component in App.tsx
  - Add route /admin/pages/:id/edit with PageEditorPage component
  - Ensure both routes are protected by AdminRoute
  - Maintain existing /admin/pages route for page list
  - Test navigation between routes
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 6. Integrate auto-save functionality
  - Verify PageEditorContainer has auto-save logic with 2-second debounce
  - Ensure auto-save calls the correct API endpoint (PUT /api/admin/pages/:id)
  - Add AutoSaveIndicator component to display save status
  - Implement success toast notification on successful save
  - Implement error toast notification on failed save with retry option
  - Add retry logic for failed auto-saves (up to 3 attempts)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 7. Implement file upload integration
  - Verify VideoBlockEditor and ImageBlockEditor use the upload API
  - Update upload handlers to call /api/admin/upload endpoint
  - Add file type validation (images: jpg, png, gif, webp; videos: mp4, webm)
  - Add file size validation (images: 5MB max; videos: 100MB max)
  - Display upload progress bar during file transfer
  - Handle upload errors with user-friendly messages
  - Insert uploaded file URL into block content on success
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 8. Add unsaved changes warning
  - Track hasUnsavedChanges state in PageEditorContainer
  - Add beforeunload event listener to warn on page close
  - Show confirmation dialog when clicking back/cancel with unsaved changes
  - Clear unsaved changes flag after successful save
  - _Requirements: 4.3_

- [ ] 9. Test page creation workflow
  - Navigate to /admin/pages/new
  - Add page title and metadata
  - Add multiple blocks of different types (text, image, video, code, list)
  - Configure each block with content
  - Save the page
  - Verify page appears in page list
  - Verify page data is correctly saved in database
  - _Requirements: 1.1, 1.4, 5.1, 5.2, 5.3, 5.4_

- [ ] 10. Test page editing workflow
  - Navigate to /admin/pages and click edit on an existing page
  - Verify page data loads correctly in editor
  - Edit existing blocks
  - Add new blocks
  - Reorder blocks using drag-and-drop
  - Delete blocks
  - Save changes
  - Verify changes are persisted
  - _Requirements: 1.2, 1.3, 4.5, 5.1, 5.2_

- [ ] 11. Test block operations
  - Test adding each block type from the palette
  - Test editing each block type's configuration
  - Test drag-and-drop reordering of blocks
  - Test duplicating blocks
  - Test deleting blocks with confirmation
  - Test preview mode for blocks
  - _Requirements: 1.4_

- [ ] 12. Test file upload functionality
  - Test uploading an image in ImageBlock
  - Test uploading a video in VideoBlock
  - Test file size validation (reject files over limit)
  - Test file type validation (reject unsupported types)
  - Test upload progress display
  - Test upload error handling
  - Verify uploaded files are accessible via returned URLs
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 13. Test auto-save functionality
  - Make changes to blocks and wait 2 seconds
  - Verify auto-save indicator appears
  - Verify success notification after save
  - Test auto-save with network error (disconnect and reconnect)
  - Verify retry logic works for failed saves
  - Verify unsaved changes are preserved on failure
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 14. Test navigation and state management
  - Test navigating from page list to new page editor
  - Test navigating from page list to edit existing page
  - Test back button navigation with unsaved changes
  - Test browser back button with unsaved changes warning
  - Test page list state preservation after returning from editor
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 15. Test error handling
  - Test loading page with invalid ID (should show 404 error)
  - Test saving page with network error (should show error and allow retry)
  - Test uploading file with network error (should show error)
  - Test validation errors in block configuration (should show inline errors)
  - Test authentication error (should redirect to login)
  - _Requirements: 3.5, 5.5, 6.6_

- [ ] 16. Test responsive design
  - Test page editor on desktop screen (1920x1080)
  - Test page editor on laptop screen (1366x768)
  - Test page editor on tablet screen (768x1024)
  - Test page editor on mobile screen (should show warning or adapt layout)
  - Verify all editor functions work on supported screen sizes
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 17. Verify TypeScript compilation
  - Run TypeScript compiler to check for errors
  - Fix any type errors in copied components
  - Ensure all imports resolve correctly
  - Verify type safety for API calls
  - Ensure consistent type definitions across components
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 18. Add documentation
  - Update README with page editor usage instructions
  - Document how to add new block types
  - Document API endpoints used by page editor
  - Add inline comments for complex logic
  - Create troubleshooting guide for common issues
  - _Requirements: All requirements_

- [ ] 19. Performance optimization
  - Add React.memo to block renderer components to prevent unnecessary re-renders
  - Verify debounce is working for auto-save (2 seconds)
  - Test editor performance with 20+ blocks
  - Optimize any slow operations identified during testing
  - _Requirements: 7.5_

- [ ] 20. Final integration testing
  - Test complete workflow: create page → add blocks → save → edit → modify → save
  - Test with different admin users
  - Test concurrent editing (if applicable)
  - Verify no console errors or warnings
  - Verify all features from requirements are working
  - _Requirements: All requirements_
