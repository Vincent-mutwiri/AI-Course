# Admin Page Builder - Frontend Components

This directory contains the frontend React components for the Admin Page Builder feature.

## Overview

The Admin Page Builder allows administrators to create and edit custom pages using a visual block-based interface. This implementation includes:

- **PageEditorContainer**: Main container component with data fetching, state management, and auto-save functionality
- **PageMetadataForm**: Form component for managing page metadata (title, slug, type, publish status)
- **NavigationGuard**: Component that warns users about unsaved changes when navigating away
- **Admin Routes**: Routing configuration for page creation and editing

## Components

### PageEditorContainer

The main container component that manages the page editor state and functionality.

**Features:**
- Fetches page data on mount (or initializes empty page for new pages)
- Manages blocks state array
- Implements auto-save logic with 30-second debounce
- Handles save success/error states with retry logic (max 3 attempts)
- Displays save status indicator
- Integrates with NavigationGuard for unsaved changes warning

**Props:**
- `isNewPage` (boolean): Whether this is a new page or editing an existing one

**Usage:**
```tsx
import { PageEditorContainer } from './components/admin/PageEditor';

// For new page
<PageEditorContainer isNewPage={true} />

// For editing existing page
<PageEditorContainer isNewPage={false} />
```

### PageMetadataForm

Form component for managing page metadata.

**Features:**
- Input fields for title, slug, type dropdown, isPublished checkbox
- Auto-generates slug from title if not manually set
- Validates slug uniqueness on blur via API call
- Validates slug format (URL-safe characters only)
- Displays validation errors inline
- Real-time validation feedback

**Props:**
- `page` (IPage): The page object to edit
- `onChange` (function): Callback function when page metadata changes

**Usage:**
```tsx
import { PageMetadataForm } from './components/admin/PageEditor';

<PageMetadataForm
  page={page}
  onChange={(updates) => handlePageChange(updates)}
/>
```

### NavigationGuard

Component that warns users about unsaved changes when attempting to navigate away.

**Features:**
- Intercepts browser back/forward navigation
- Shows confirmation modal for unsaved changes
- Integrates with browser's beforeunload event
- Prevents accidental data loss

**Props:**
- `children` (ReactNode): The component to wrap with navigation guard

**Usage:**
```tsx
import NavigationGuard from './components/common/NavigationGuard';

<NavigationGuard>
  <PageEditorContainer />
</NavigationGuard>
```

## Routing

The admin routes are configured in `client/src/routes/adminRoutes.tsx`:

- `/admin/pages/new` - Create new page
- `/admin/pages/:id/edit` - Edit existing page
- `/admin/pages` - Pages list (to be implemented in task 11)

All routes are wrapped with NavigationGuard to prevent data loss.

## API Integration

The components integrate with the following backend API endpoints:

- `GET /api/admin/pages/:id/edit` - Fetch page for editing
- `POST /api/admin/pages` - Create new page
- `PUT /api/admin/pages/:id` - Update existing page
- `GET /api/admin/pages/validate-slug` - Validate slug uniqueness

## State Management

The PageEditorContainer manages the following state:

- `page`: The page object being edited
- `blocks`: Array of blocks in the page
- `loading`: Loading state for initial data fetch
- `saveState`: Current save state ('idle', 'saving', 'saved', 'error')
- `saveError`: Error message if save fails
- `lastSavedAt`: Timestamp of last successful save
- `isDirty`: Whether there are unsaved changes

## Auto-Save Functionality

The auto-save feature:
- Triggers 30 seconds after the last change
- Cancels pending saves if new changes occur
- Displays save status in the UI
- Implements retry logic for failed saves (max 3 attempts with 10-second delay)
- Stores changes locally if connection is lost (via browser's beforeunload event)

## Validation

### Title Validation
- Required field
- Cannot be empty

### Slug Validation
- Required field
- Must be URL-safe (lowercase letters, numbers, hyphens, underscores only)
- Must be unique across all pages
- Auto-generated from title if not manually set

## Styling

All styles are contained in `client/src/components/admin/PageEditor/PageEditor.css`.

The styling includes:
- Responsive design for mobile and tablet
- Loading states and spinners
- Error states and validation messages
- Modal dialogs for navigation warnings
- Form styling with focus states

## Type Definitions

Type definitions are located in `client/src/types/page.ts`:

- `IPage`: Page interface
- `IPageContent`: Page content structure
- `IBlock`: Block interface
- `IBlockContent`: Block content structure
- `BlockType`: Union type of all block types

## Utilities

### debounce

A utility function for debouncing function calls, used for auto-save functionality.

**Location:** `client/src/utils/debounce.ts`

**Usage:**
```tsx
const debouncedSave = debounce((data) => {
  savePage(data);
}, 30000);
```

## Integration with Backend

This frontend implementation assumes a backend API is running at the same origin. For development, you may need to configure a proxy in your build tool (Vite, Webpack, etc.).

Example Vite proxy configuration:
```js
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

## Next Steps

The following components will be implemented in subsequent tasks:

- **BlockPalette**: Component displaying available block types
- **BlockCanvas**: Main editing area with drag-and-drop
- **BlockEditor**: Individual block editor components
- **BlockToolbar**: Toolbar with duplicate and delete actions
- **PagePreview**: Preview mode component
- **AutoSaveIndicator**: Enhanced save status indicator

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **Requirement 1.1**: Create new pages using a block-based editor
- **Requirement 7.1**: Manage page metadata (title, slug, type, publish status)
- **Requirement 7.2**: Validate slug uniqueness
- **Requirement 7.5**: Auto-generate slug from title
- **Requirement 1.5**: Display validation errors
- **Requirement 10.1**: Auto-save changes every 30 seconds
- **Requirement 10.2**: Display save status timestamp
- **Requirement 10.4**: Warn about unsaved changes on navigation

## Testing

To test the components:

1. Start the backend server
2. Start the frontend development server
3. Navigate to `/admin/pages/new` to create a new page
4. Navigate to `/admin/pages/:id/edit` to edit an existing page
5. Test auto-save by making changes and waiting 30 seconds
6. Test navigation guard by attempting to leave with unsaved changes
7. Test slug validation by entering duplicate slugs

## Browser Compatibility

The components use modern JavaScript features and should work in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

For older browsers, you may need to add polyfills for:
- `fetch` API
- `Promise`
- `async/await`
