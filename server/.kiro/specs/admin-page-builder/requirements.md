# Requirements Document

## Introduction

This document specifies the requirements for a Block-Based Page Builder feature that enables administrators to create and edit custom pages using a visual interface. The feature reuses existing UI blocks from the Course Builder module (text, video, image, code, list, divider, and interactive elements) to construct pages without requiring code changes. This provides admins with a flexible, intuitive way to manage website content while maintaining consistency with the existing course content structure.

## Glossary

- **Admin Page Builder**: A visual interface that allows administrators to construct custom pages using reusable UI blocks
- **UI Block**: A reusable content component with a specific type (text, video, image, etc.) and associated configuration
- **Page System**: The existing MongoDB-based page management system that stores page metadata and content
- **Course Builder**: The existing module that provides block-based content editing for course lessons
- **Block Schema**: The data structure defining block properties including id, type, order, and content fields
- **Content Block**: A basic block type (text, video, image, code, list, divider) used for static content presentation
- **Interactive Block**: An advanced block type (reflection, poll, wordCloud, etc.) that enables user interaction
- **Block Palette**: The UI component displaying available block types that can be added to a page
- **Block Editor**: The interface component for editing individual block properties and content
- **Page Editor Interface**: The complete admin interface for creating and editing pages with blocks

## Requirements

### Requirement 1

**User Story:** As an administrator, I want to create new pages using a block-based editor, so that I can build custom content pages without writing code

#### Acceptance Criteria

1. WHEN the administrator navigates to the page creation interface, THE Admin Page Builder SHALL display an empty canvas with a block palette containing all available block types
2. WHEN the administrator selects a block type from the palette, THE Admin Page Builder SHALL insert the selected block at the end of the page with default content values
3. WHEN the administrator saves the page, THE Page System SHALL store the blocks array in the content field using the existing Block Schema structure
4. WHERE the page contains at least one block, THE Admin Page Builder SHALL validate that each block has a unique id, valid type, and sequential order value before saving
5. IF the administrator attempts to save a page without a title or slug, THEN THE Admin Page Builder SHALL display validation errors and prevent the save operation

### Requirement 2

**User Story:** As an administrator, I want to reuse all existing Course Builder block types in the page editor, so that pages maintain visual consistency with course content

#### Acceptance Criteria

1. THE Admin Page Builder SHALL support all content block types defined in the Course Builder: text, video, image, code, list, and divider
2. THE Admin Page Builder SHALL support all interactive block types defined in the Course Builder: reflection, poll, wordCloud, aiGenerator, choiceComparison, certificateGenerator, finalAssessment, playerTypeSimulator, rewardScheduleDesigner, flowChannelEvaluator, pitchAnalysisGenerator, narrativeGenerator, darkPatternRedesigner, roeDashboard, designFixer, journeyTimeline, simulation, aiJourney, buildABot, conceptMap, dataDashboard, ethicalDilemmaSolver, gamificationConceptMap, identifyPersonalization, playerTypeAnalyzer, presentationCoach, sentenceBuilder, and visualTokens
3. WHEN rendering a block in the page editor, THE Admin Page Builder SHALL use the same input fields and validation rules as the Course Builder for that block type
4. WHEN rendering a page on the frontend, THE Page System SHALL apply the same rendering logic and styling as course lesson blocks
5. THE Admin Page Builder SHALL reuse the existing Block Schema without modifications to ensure compatibility with Course Builder blocks

### Requirement 3

**User Story:** As an administrator, I want to edit block content inline, so that I can quickly update page content without navigating between screens

#### Acceptance Criteria

1. WHEN the administrator clicks on a block in the page editor, THE Admin Page Builder SHALL display an inline editor with input fields specific to that block type
2. WHEN the administrator modifies block content, THE Admin Page Builder SHALL update the block's content object with the new values in real-time
3. WHILE editing a text block, THE Admin Page Builder SHALL provide a rich text editor supporting formatting options (bold, italic, headings, links)
4. WHILE editing a video block, THE Admin Page Builder SHALL provide input fields for videoUrl, videoSource (upload or embed), and videoProvider (youtube, vimeo, s3)
5. WHILE editing an image block, THE Admin Page Builder SHALL provide input fields for imageUrl, caption, and altText with file upload capability

### Requirement 4

**User Story:** As an administrator, I want to reorder blocks using drag-and-drop, so that I can organize page content intuitively

#### Acceptance Criteria

1. WHEN the administrator drags a block to a new position, THE Admin Page Builder SHALL update the order property of all affected blocks to reflect the new sequence
2. WHEN the administrator drops a block in a new position, THE Admin Page Builder SHALL save the updated block order to the Page System
3. THE Admin Page Builder SHALL display visual feedback (drag handle, drop zone indicators) during drag operations to indicate valid drop positions
4. WHEN blocks are reordered, THE Admin Page Builder SHALL maintain sequential order values starting from 0 with no gaps
5. THE Admin Page Builder SHALL prevent invalid drag operations (dragging outside the editor canvas)

### Requirement 5

**User Story:** As an administrator, I want to duplicate and delete blocks, so that I can efficiently manage page content

#### Acceptance Criteria

1. WHEN the administrator clicks the duplicate button on a block, THE Admin Page Builder SHALL create a new block with identical content and a unique id, inserted immediately after the original block
2. WHEN the administrator clicks the delete button on a block, THE Admin Page Builder SHALL remove the block from the page and update the order values of remaining blocks
3. WHEN a block is duplicated, THE Admin Page Builder SHALL update the order property of all subsequent blocks to maintain sequential ordering
4. IF the administrator attempts to delete the last remaining block on a page, THEN THE Admin Page Builder SHALL allow the deletion and display an empty canvas
5. THE Admin Page Builder SHALL provide undo capability for delete operations within the current editing session

### Requirement 6

**User Story:** As an administrator, I want to preview pages before publishing, so that I can verify content appears correctly to end users

#### Acceptance Criteria

1. WHEN the administrator clicks the preview button, THE Admin Page Builder SHALL render the page using the same frontend rendering logic as published pages
2. WHILE in preview mode, THE Admin Page Builder SHALL display all blocks with their configured content and styling exactly as end users will see them
3. WHILE in preview mode, THE Admin Page Builder SHALL enable interactive blocks (polls, reflections, etc.) to function as they would for end users
4. WHEN the administrator exits preview mode, THE Admin Page Builder SHALL return to the editing interface without losing unsaved changes
5. THE Admin Page Builder SHALL display a clear visual indicator when in preview mode to distinguish it from the editing interface

### Requirement 7

**User Story:** As an administrator, I want to manage page metadata (title, slug, type, publish status), so that I can control page visibility and organization

#### Acceptance Criteria

1. WHEN creating or editing a page, THE Admin Page Builder SHALL provide input fields for title, slug, type (blog, page, home), and isPublished status
2. WHEN the administrator changes the slug, THE Admin Page Builder SHALL validate that the slug is unique across all pages and display an error if a duplicate is detected
3. WHEN the administrator sets isPublished to true, THE Page System SHALL make the page accessible at the specified slug URL to all users
4. WHEN the administrator sets isPublished to false, THE Page System SHALL make the page accessible only to administrators
5. THE Admin Page Builder SHALL auto-generate a URL-friendly slug from the title if the administrator does not provide a custom slug

### Requirement 8

**User Story:** As an administrator, I want to upload media files directly from the page editor, so that I can add images and videos without using external tools

#### Acceptance Criteria

1. WHEN the administrator clicks the upload button in an image or video block, THE Admin Page Builder SHALL open a file selection dialog filtered to appropriate file types (images: JPEG, PNG, GIF; videos: MP4, WebM)
2. WHEN the administrator selects a file, THE Admin Page Builder SHALL upload the file to S3 storage using the existing upload service
3. WHEN the upload completes successfully, THE Admin Page Builder SHALL populate the block's imageUrl or videoUrl field with the S3 URL
4. IF the file size exceeds limits (5MB for images, 100MB for videos), THEN THE Admin Page Builder SHALL display an error message and prevent the upload
5. WHILE uploading, THE Admin Page Builder SHALL display a progress indicator showing upload percentage

### Requirement 9

**User Story:** As an administrator, I want to view a list of all pages with their status, so that I can manage existing pages efficiently

#### Acceptance Criteria

1. WHEN the administrator navigates to the pages management interface, THE Admin Page Builder SHALL display a table listing all pages with columns for title, slug, type, isPublished status, and last updated date
2. WHEN the administrator clicks on a page in the list, THE Admin Page Builder SHALL navigate to the page editor with that page's content loaded
3. THE Admin Page Builder SHALL provide filter controls to show only published pages, only unpublished pages, or all pages
4. THE Admin Page Builder SHALL provide a search input to filter pages by title or slug
5. THE Admin Page Builder SHALL display pages sorted by last updated date in descending order by default

### Requirement 10

**User Story:** As an administrator, I want the page editor to auto-save my changes, so that I do not lose work due to browser crashes or accidental navigation

#### Acceptance Criteria

1. WHILE the administrator is editing a page, THE Admin Page Builder SHALL automatically save changes to the Page System every 30 seconds
2. WHEN an auto-save operation completes, THE Admin Page Builder SHALL display a timestamp indicating when the page was last saved
3. IF an auto-save operation fails due to network issues, THEN THE Admin Page Builder SHALL display an error notification and retry the save operation after 10 seconds
4. WHEN the administrator navigates away from the page editor with unsaved changes, THE Admin Page Builder SHALL display a confirmation dialog warning about unsaved changes
5. THE Admin Page Builder SHALL store a draft version of the page separately from the published version until the administrator explicitly publishes
