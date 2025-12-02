# Pages List Component

This component provides a management interface for viewing and managing all pages in the admin panel.

## Features

### 1. Pages Table Display
- Shows all pages in a sortable table format
- Columns: Title, Slug, Type, Status, Last Updated
- Default sorting: Most recently updated pages first
- Click on any row to navigate to the page editor

### 2. Search Functionality
- Real-time search by page title or slug
- Case-insensitive search
- Updates table results instantly

### 3. Filter Controls
- Filter by publish status:
  - All Pages (default)
  - Published only
  - Unpublished (drafts) only
- Combines with search for refined results

### 4. Create New Page Button
- Prominently displayed at the top of the page
- Navigates to `/admin/pages/new` to create a new page
- Also shown in empty state when no pages exist

### 5. Responsive Design
- Mobile-friendly layout
- Adapts to different screen sizes
- Horizontal scroll for table on small screens

## Usage

The component is automatically rendered when navigating to `/admin/pages` in the admin panel.

```typescript
import { PagesListContainer } from '../components/admin/PagesList';

// In your routes:
<Route path="/admin/pages" element={<PagesListContainer />} />
```

## API Integration

The component fetches pages from the backend API:
- **Endpoint**: `GET /api/admin/pages`
- **Authentication**: Requires admin token in Authorization header
- **Response**: `{ pages: IPage[] }`

## State Management

- `pages`: Array of all pages fetched from the API
- `loading`: Loading state during initial fetch
- `error`: Error message if fetch fails
- `filter`: Current filter selection (all/published/unpublished)
- `searchQuery`: Current search query string

## Styling

Styles are defined in `PagesList.css` and include:
- Clean, modern table design
- Color-coded badges for page type and status
- Hover effects for interactive elements
- Responsive breakpoints for mobile devices

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **Requirement 9.1**: Display table with title, slug, type, isPublished, updatedAt
- **Requirement 9.2**: Navigate to editor on row click
- **Requirement 9.3**: Filter by published/unpublished status
- **Requirement 9.4**: Search by title or slug
- **Requirement 9.5**: Sort by updatedAt descending by default
- **Requirement 1.1**: Create new page button
