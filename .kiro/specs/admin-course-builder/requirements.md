# Requirements Document

## Introduction

The Admin Course Builder V2 is a comprehensive block-based course creation system that enables administrators to create rich, interactive learning experiences through a visual drag-and-drop interface. The system extends the existing MERN stack application (React 19, TypeScript, Vite, Express, MongoDB) and integrates with 16 existing interactive element types while adding 6 new basic content blocks. The builder provides a three-panel WYSIWYG interface consisting of a course structure sidebar, a central canvas for block composition, and a block library sidebar.

## Glossary

- **Admin System**: The administrative interface component of the learning management system
- **Block**: A discrete content unit that can be added to a lesson (text, video, interactive element, etc.)
- **Canvas**: The central editing area where blocks are arranged and configured
- **Course Structure**: The hierarchical organization of modules, lessons, and blocks within a course
- **Block Library**: The collection of available block types that can be added to lessons
- **Interactive Element**: A specialized block type that requires user interaction (polls, quizzes, reflections, etc.)
- **WYSIWYG Editor**: What You See Is What You Get - a visual editing interface
- **Student View**: The learner-facing interface that displays course content
- **Block Configuration**: The settings and content specific to each block type
- **Auto-Save System**: The mechanism that automatically persists changes without manual save actions

## Requirements

### Requirement 1

**User Story:** As an admin, I want to access a visual course builder interface, so that I can create and edit courses without manually editing JSON files

#### Acceptance Criteria

1. WHEN an admin navigates to /admin/courses/:id/builder, THE Admin System SHALL display a three-panel layout with course structure, canvas, and block library
2. THE Admin System SHALL load the existing course data including all modules, lessons, and blocks
3. THE Admin System SHALL display the course structure in an expandable accordion format in the left sidebar
4. THE Admin System SHALL highlight the currently selected lesson in the course structure
5. THE Admin System SHALL render the layout responsively for tablet and desktop screen sizes

### Requirement 2

**User Story:** As an admin, I want to add basic content blocks to lessons, so that I can create text, video, image, code, and list content

#### Acceptance Criteria

1. WHEN an admin clicks on a basic block type in the Block Library, THE Admin System SHALL add the block to the current lesson canvas
2. THE Admin System SHALL support text blocks with rich text editing capabilities including headings, paragraphs, lists, and formatting
3. THE Admin System SHALL support video blocks with both file upload to S3 and URL embedding for YouTube and Vimeo
4. THE Admin System SHALL support image blocks with file upload, caption, and alt text fields
5. THE Admin System SHALL support code blocks with syntax highlighting
6. THE Admin System SHALL support list blocks with bullet points, numbered lists, and checkboxes
7. THE Admin System SHALL support divider blocks as visual separators

### Requirement 3

**User Story:** As an admin, I want to add interactive blocks to lessons, so that I can create engaging learning experiences with polls, quizzes, reflections, and specialized tools

#### Acceptance Criteria

1. WHEN an admin clicks on an interactive block type in the Block Library, THE Admin System SHALL add the interactive block to the current lesson canvas
2. THE Admin System SHALL support the following interactive element types: Reflection, Poll, Word Cloud, AI Generator, Choice Comparison, Certificate Generator, Final Assessment, AI Journey, Build A Bot, Concept Map, Data Dashboard, Ethical Dilemma Solver, Gamification Concept Map, Identify Personalization, Player Type Analyzer, Presentation Coach, Sentence Builder, and Visual Tokens
3. THE Admin System SHALL NOT include the following deprecated interactive types: Design Fixer, Player Type Simulator, Reward Schedule Designer, Flow Channel Evaluator, Pitch Analysis Generator, Narrative Generator, Dark Pattern Redesigner, ROE Dashboard, and Journey Timeline
4. THE Admin System SHALL display interactive blocks with their configured settings in the canvas
5. THE Admin System SHALL preserve all existing interactive element configurations when migrating to the block system
6. THE Admin System SHALL render interactive blocks in the student view using existing rendering logic

### Requirement 4

**User Story:** As an admin, I want to configure each block's settings, so that I can customize content, behavior, and appearance

#### Acceptance Criteria

1. WHEN an admin clicks the edit action on a block, THE Admin System SHALL open a configuration modal specific to that block type
2. THE Admin System SHALL display all configurable fields for the selected block type in the modal
3. WHEN an admin saves block configuration, THE Admin System SHALL validate all required fields before saving
4. THE Admin System SHALL enforce file size limits of 100MB for videos and 5MB for images
5. THE Admin System SHALL validate URL formats for video and image embeds
6. THE Admin System SHALL validate minimum and maximum length constraints for text inputs
7. WHEN validation fails, THE Admin System SHALL display clear error messages indicating which fields require correction

### Requirement 5

**User Story:** As an admin, I want to reorder blocks using drag and drop, so that I can organize lesson content in the optimal sequence

#### Acceptance Criteria

1. WHEN an admin drags a block in the canvas, THE Admin System SHALL display a visual indicator of the drop position
2. WHEN an admin drops a block in a new position, THE Admin System SHALL update the block order immediately
3. THE Admin System SHALL persist the new block order to the database
4. THE Admin System SHALL maintain block order consistency across page refreshes
5. THE Admin System SHALL prevent blocks from being dropped outside valid drop zones

### Requirement 6

**User Story:** As an admin, I want to perform common block operations, so that I can efficiently manage course content

#### Acceptance Criteria

1. WHEN an admin clicks the duplicate action on a block, THE Admin System SHALL create a copy of the block with a new unique identifier
2. WHEN an admin clicks the delete action on a block, THE Admin System SHALL display a confirmation dialog before deletion
3. WHEN an admin confirms deletion, THE Admin System SHALL remove the block from the lesson and update the canvas immediately
4. WHEN an admin deletes a block, THE Admin System SHALL persist the deletion to the database via auto-save
5. THE Admin System SHALL provide a preview action that displays the block in student view format
6. THE Admin System SHALL support keyboard shortcuts for undo (Cmd+Z/Ctrl+Z), duplicate (Cmd+D/Ctrl+D), and delete (Delete/Backspace) operations
7. THE Admin System SHALL allow deletion of any block type including basic content blocks and interactive elements

### Requirement 7

**User Story:** As an admin, I want changes to auto-save, so that I don't lose work if I forget to manually save

#### Acceptance Criteria

1. WHEN an admin makes changes to blocks, THE Admin System SHALL automatically save changes after 2 seconds of inactivity
2. THE Admin System SHALL display a visual indicator when auto-save is in progress
3. WHEN auto-save completes successfully, THE Admin System SHALL display a success notification
4. WHEN auto-save fails, THE Admin System SHALL display an error notification and retain unsaved changes
5. THE Admin System SHALL debounce save operations to prevent excessive API calls during rapid editing

### Requirement 8

**User Story:** As an admin, I want to navigate between modules and lessons, so that I can edit different parts of the course

#### Acceptance Criteria

1. WHEN an admin clicks on a lesson in the course structure, THE Admin System SHALL load that lesson's blocks into the canvas
2. THE Admin System SHALL preserve unsaved changes when switching between lessons by prompting for confirmation
3. WHEN an admin clicks "Add Module", THE Admin System SHALL create a new module in the course structure
4. THE Admin System SHALL expand and collapse modules in the course structure accordion
5. THE Admin System SHALL maintain the selected lesson state when navigating between modules

### Requirement 9

**User Story:** As an admin, I want to upload media files, so that I can include videos and images in course content

#### Acceptance Criteria

1. WHEN an admin selects a file for upload, THE Admin System SHALL validate the file type and size before uploading
2. THE Admin System SHALL upload files to AWS S3 using the existing upload infrastructure
3. WHEN upload completes, THE Admin System SHALL return the S3 URL for the uploaded file
4. THE Admin System SHALL display upload progress during file transfer
5. WHEN upload fails, THE Admin System SHALL display an error message with the failure reason

### Requirement 10

**User Story:** As an admin, I want to search and filter blocks in the library, so that I can quickly find the block type I need

#### Acceptance Criteria

1. WHEN an admin types in the block library search field, THE Admin System SHALL filter blocks by name and description
2. THE Admin System SHALL organize blocks into "Basic" and "Interactive" tabs
3. THE Admin System SHALL display block cards with icon, title, and description
4. THE Admin System SHALL highlight matching search terms in block names and descriptions
5. WHEN no blocks match the search, THE Admin System SHALL display an empty state message

### Requirement 11

**User Story:** As an admin, I want to preview lessons in student view, so that I can verify how content will appear to learners

#### Acceptance Criteria

1. WHEN an admin clicks the preview button, THE Admin System SHALL display the lesson in student view format
2. THE Admin System SHALL render all blocks using the same components as the student-facing interface
3. THE Admin System SHALL display interactive elements in their functional state during preview
4. THE Admin System SHALL provide a way to exit preview mode and return to editing
5. THE Admin System SHALL maintain the current lesson context when entering and exiting preview mode

### Requirement 12

**User Story:** As a student, I want to view courses created with the block builder, so that I can access learning content seamlessly

#### Acceptance Criteria

1. WHEN a student accesses a lesson, THE Admin System SHALL render blocks in the correct order
2. THE Admin System SHALL render each block type using the appropriate student-facing component
3. THE Admin System SHALL maintain backward compatibility with existing courses that use the legacy interactiveElements structure
4. THE Admin System SHALL display interactive elements with full functionality in student view
5. THE Admin System SHALL track student progress through block-based lessons using existing progress tracking mechanisms

### Requirement 13

**User Story:** As an admin, I want to remove deprecated interactive block types from the system, so that the course builder only shows well-functioning interactive elements

#### Acceptance Criteria

1. THE Admin System SHALL remove the following deprecated interactive block types from the Block Library: Design Fixer, Player Type Simulator, Reward Schedule Designer, Flow Channel Evaluator, Pitch Analysis Generator, Narrative Generator, Dark Pattern Redesigner, ROE Dashboard, and Journey Timeline
2. THE Admin System SHALL remove the corresponding TypeScript type definitions for deprecated block types from the BlockType enum
3. THE Admin System SHALL remove configuration modals for deprecated block types
4. THE Admin System SHALL remove the deprecated interactive component files from the codebase
5. THE Admin System SHALL update the InteractiveElementRouter to exclude deprecated block types
6. WHEN existing courses contain deprecated block types, THE Admin System SHALL display a warning message in the canvas indicating the block type is no longer supported
7. THE Admin System SHALL allow admins to delete deprecated blocks from existing courses using the standard delete operation
