# Requirements Document

## Introduction

The Page Editor Integration project integrates the fully-built block-based page editor from `server/client/src` into the main React application at `src/`. The existing page editor components provide a sophisticated WYSIWYG interface with drag-and-drop block management, but they currently exist in isolation. This integration will replace the simple CRUD interface in `src/pages/admin/PageBuilder.tsx` with the complete block editor system, enabling administrators to create rich, interactive pages using the visual editor.

## Glossary

- **Page Editor System**: The complete block-based visual editor located in `server/client/src/components/admin/PageEditor/`
- **Main React App**: The primary application located in `src/` that runs on port 5173
- **Block Editor Components**: The individual editor components for each block type (text, video, image, code, list, divider, interactive elements)
- **PageEditorContainer**: The main container component that orchestrates the page editing experience
- **Block Canvas**: The central editing area where blocks are arranged and manipulated
- **Block Palette**: The sidebar component displaying available block types
- **API Proxy**: The Vite configuration that routes API requests to the backend server

## Requirements

### Requirement 1

**User Story:** As an admin, I want to access the visual page editor when creating or editing pages, so that I can use the block-based interface instead of the simple form

#### Acceptance Criteria

1. WHEN an admin navigates to /admin/pages/new, THE Main React App SHALL display the PageEditorContainer component
2. WHEN an admin clicks edit on an existing page, THE Main React App SHALL navigate to /admin/pages/:id/edit and display the PageEditorContainer
3. THE Main React App SHALL load the page data including all blocks when editing an existing page
4. THE Main React App SHALL display the three-panel layout with block palette, canvas, and editor panel
5. THE Main React App SHALL maintain the existing page list view at /admin/pages

### Requirement 2

**User Story:** As a developer, I want all page editor components copied to the main React app, so that they are available for use in the application

#### Acceptance Criteria

1. THE Main React App SHALL include all components from `server/client/src/components/admin/PageEditor/` in `src/components/admin/PageEditor/`
2. THE Main React App SHALL include all block editor components from the BlockEditors subdirectory
3. THE Main React App SHALL include all CSS files for the page editor
4. THE Main React App SHALL include all utility files and hooks used by the page editor
5. THE Main React App SHALL preserve the directory structure from the source components

### Requirement 3

**User Story:** As a developer, I want the API routes properly configured, so that the page editor can communicate with the backend

#### Acceptance Criteria

1. THE Main React App SHALL proxy API requests to the backend server running on port 3000
2. THE Main React App SHALL handle /api/admin/pages routes for CRUD operations
3. THE Main React App SHALL handle /api/admin/upload routes for file uploads
4. THE Main React App SHALL maintain authentication headers in API requests
5. THE Main React App SHALL handle API errors gracefully with user-friendly messages

### Requirement 4

**User Story:** As an admin, I want to navigate between the page list and editor, so that I can manage multiple pages efficiently

#### Acceptance Criteria

1. WHEN an admin clicks "Create Page" in the page list, THE Main React App SHALL navigate to /admin/pages/new
2. WHEN an admin saves a page in the editor, THE Main React App SHALL navigate back to /admin/pages
3. WHEN an admin clicks "Cancel" in the editor, THE Main React App SHALL prompt for confirmation if there are unsaved changes
4. THE Main React App SHALL display a back button in the editor to return to the page list
5. THE Main React App SHALL preserve the page list state when navigating back from the editor

### Requirement 5

**User Story:** As an admin, I want the page editor to work with the existing backend API, so that pages are saved correctly

#### Acceptance Criteria

1. WHEN an admin saves a page, THE Main React App SHALL send the blocks array in the correct format to the backend
2. THE Main React App SHALL handle both new page creation and existing page updates
3. THE Main React App SHALL validate required fields before saving
4. WHEN save succeeds, THE Main React App SHALL display a success notification
5. WHEN save fails, THE Main React App SHALL display an error message and retain unsaved changes

### Requirement 6

**User Story:** As a developer, I want to update the routing configuration, so that the page editor routes are properly defined

#### Acceptance Criteria

1. THE Main React App SHALL define route /admin/pages/new for creating new pages
2. THE Main React App SHALL define route /admin/pages/:id/edit for editing existing pages
3. THE Main React App SHALL maintain the existing /admin/pages route for the page list
4. THE Main React App SHALL apply AdminRoute protection to all page editor routes
5. THE Main React App SHALL handle invalid page IDs with appropriate error messages

### Requirement 7

**User Story:** As an admin, I want the page editor to auto-save my changes, so that I don't lose work

#### Acceptance Criteria

1. WHEN an admin makes changes to blocks, THE Main React App SHALL automatically save after 2 seconds of inactivity
2. THE Main React App SHALL display a visual indicator when auto-save is in progress
3. WHEN auto-save completes, THE Main React App SHALL display a success indicator
4. WHEN auto-save fails, THE Main React App SHALL display an error notification
5. THE Main React App SHALL debounce save operations to prevent excessive API calls

### Requirement 8

**User Story:** As an admin, I want to upload images and videos in the page editor, so that I can include media in my pages

#### Acceptance Criteria

1. WHEN an admin uploads a file, THE Main React App SHALL validate file type and size
2. THE Main React App SHALL upload files to the backend /api/admin/upload endpoint
3. THE Main React App SHALL display upload progress during file transfer
4. WHEN upload completes, THE Main React App SHALL insert the file URL into the block
5. WHEN upload fails, THE Main React App SHALL display an error message with the failure reason

### Requirement 9

**User Story:** As a developer, I want to ensure type compatibility, so that TypeScript compilation succeeds

#### Acceptance Criteria

1. THE Main React App SHALL define or import all required TypeScript types for blocks and pages
2. THE Main React App SHALL resolve any type conflicts between the page editor components and existing types
3. THE Main React App SHALL compile without TypeScript errors
4. THE Main React App SHALL maintain type safety for all API calls
5. THE Main React App SHALL use consistent type definitions across all page editor components

### Requirement 10

**User Story:** As an admin, I want the page editor to be responsive, so that I can use it on different screen sizes

#### Acceptance Criteria

1. THE Main React App SHALL display the page editor layout responsively for desktop screens (1280px and above)
2. THE Main React App SHALL display the page editor layout responsively for tablet screens (768px to 1279px)
3. THE Main React App SHALL display a warning message on mobile screens (below 768px)
4. THE Main React App SHALL collapse sidebars appropriately on smaller screens
5. THE Main React App SHALL maintain usability of all editor functions across supported screen sizes
