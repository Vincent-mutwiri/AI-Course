# Design Document: Page Editor Integration

## Overview

This design outlines the integration of the existing block-based page editor from `server/client/src` into the main React application at `src/`. The integration involves copying components, updating routing, configuring API communication, and ensuring seamless operation with the existing backend. The goal is to replace the simple CRUD interface with a sophisticated visual editor while maintaining backward compatibility and proper error handling.

## Architecture

### High-Level Architecture

The page editor integration follows a component migration pattern where pre-built components are copied into the main application and wired into the existing routing and state management infrastructure. The architecture maintains separation between the page list view (existing) and the page editor view (integrated).

```
Main React App (src/)
├── pages/admin/
│   ├── PageBuilder.tsx (List View - Updated)
│   └── PageEditorPage.tsx (Editor View - New)
├── components/admin/PageEditor/ (Copied from server/client)
│   ├── PageEditorContainer.tsx
│   ├── BlockCanvas.tsx
│   ├── BlockPalette.tsx
│   ├── BlockEditorPanel.tsx
│   ├── BlockEditors/
│   │   ├── TextBlockEditor.tsx
│   │   ├── VideoBlockEditor.tsx
│   │   └── ... (all block editors)
│   └── ... (all supporting components)
└── services/
    └── api.ts (Updated with page editor endpoints)
```

### Technology Stack

**Frontend:**
- React 19 with TypeScript (existing)
- Vite dev server with API proxy
- Existing UI component library (shadcn/ui)
- Existing API service layer (axios)

**Integration Points:**
- React Router for navigation
- Existing authentication context
- Existing API service with admin endpoints
- Existing toast notification system (sonner)

## Components and Interfaces

### 1. PageEditorPage Component (New)

Main page component that wraps PageEditorContainer and handles routing parameters.

**Location:** `src/pages/admin/PageEditorPage.tsx`

**Responsibilities:**
- Extract page ID from route params
- Fetch page data on mount for edit mode
- Pass page data to PageEditorContainer
- Handle navigation back to page list
- Display loading and error states

**Props:**
```typescript
// No props - uses useParams() hook
```

**State:**
```typescript
{
  pageId: string | undefined;
  pageData: IPage | null;
  isLoading: boolean;
  error: string | null;
}
```

### 2. PageEditorContainer Component (Copied)

Main container for the page editor interface. This component already exists in `server/client/src` and will be copied as-is.

**Location:** `src/components/admin/PageEditor/PageEditorContainer.tsx`

**Key Features:**
- Three-panel layout (palette, canvas, editor)
- Block state management
- Auto-save functionality
- Drag-and-drop coordination

### 3. Updated PageBuilder Component

The existing page list component will be updated to add navigation to the editor.

**Location:** `src/pages/admin/PageBuilder.tsx`

**Changes:**
- Update "Create Page" button to navigate to `/admin/pages/new`
- Update edit button to navigate to `/admin/pages/:id/edit`
- Remove the inline create/edit dialog
- Keep the table view and delete functionality

### 4. Block Editor Components (Copied)

All block editor components from `server/client/src/components/admin/PageEditor/BlockEditors/` will be copied to `src/components/admin/PageEditor/BlockEditors/`.

**Components to Copy:**
- TextBlockEditor.tsx
- VideoBlockEditor.tsx
- ImageBlockEditor.tsx
- CodeBlockEditor.tsx
- ListBlockEditor.tsx
- DividerBlockEditor.tsx
- InteractiveBlockEditor.tsx
- PollBlockEditor.tsx
- ReflectionBlockEditor.tsx
- WordCloudBlockEditor.tsx
- AIGeneratorBlockEditor.tsx
- BlockEditors.css
- index.ts

### 5. Supporting Components (Copied)

All supporting components will be copied:
- AutoSaveIndicator.tsx
- BlockCanvas.tsx
- BlockPalette.tsx
- BlockRenderer.tsx
- BlockToolbar.tsx
- SortableBlockItem.tsx
- PageMetadataForm.tsx
- PagePreview.tsx
- BlockEditor.css
- PageEditor.css

## Data Models

### Page Type Definition

```typescript
export interface IPage {
  _id: string;
  title: string;
  slug: string;
  type: 'page' | 'blog' | 'home';
  content: {
    version: string;
    blocks: IBlock[];
  };
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlock {
  id: string;
  type: BlockType;
  order: number;
  content: BlockContent;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BlockType = 
  | 'text' | 'video' | 'image' | 'code' | 'list' | 'divider'
  | 'reflection' | 'poll' | 'wordCloud' | 'aiGenerator'
  | 'interactive';

export interface BlockContent {
  text?: string;
  videoUrl?: string;
  videoSource?: 'upload' | 'embed';
  imageUrl?: string;
  caption?: string;
  altText?: string;
  code?: string;
  language?: string;
  items?: Array<{ text: string; checked?: boolean }>;
  listType?: 'bullet' | 'numbered' | 'checkbox';
  config?: any;
  [key: string]: any;
}
```

## API Integration

### API Endpoints

The page editor will use the following existing backend endpoints:

1. **GET /api/admin/pages/:id**
   - Fetch page data for editing
   - Returns IPage object

2. **POST /api/admin/pages**
   - Create new page
   - Body: { title, slug, type, content, isPublished }
   - Returns created IPage

3. **PUT /api/admin/pages/:id**
   - Update existing page
   - Body: { title, slug, type, content, isPublished }
   - Returns updated IPage

4. **POST /api/admin/upload**
   - Upload media files
   - Body: FormData with file
   - Returns { url: string }

### API Service Updates

Update `src/services/api.ts` to include page editor specific methods:

```typescript
export const pageEditorApi = {
  getPage: (id: string) => api.get<IPage>(`/admin/pages/${id}`),
  createPage: (data: Partial<IPage>) => api.post<IPage>('/admin/pages', data),
  updatePage: (id: string, data: Partial<IPage>) => api.put<IPage>(`/admin/pages/${id}`, data),
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ url: string }>('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
```

### Vite Proxy Configuration

The existing `vite.config.ts` needs to be updated to proxy API requests:

```typescript
export default defineConfig({
  // ... existing config
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
```

## Routing Configuration

### Updated App.tsx Routes

```typescript
<Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<UserManagement />} />
  <Route path="courses" element={<CourseAnalytics />} />
  <Route path="pages" element={<PageBuilder />} />
  <Route path="pages/new" element={<PageEditorPage />} />
  <Route path="pages/:id/edit" element={<PageEditorPage />} />
  <Route path="courses/:id/builder" element={<CourseBuilderPage />} />
</Route>
```

## Error Handling

### Frontend Error Handling

1. **Component-Level Errors:**
   - Wrap PageEditorPage in ErrorBoundary
   - Display user-friendly error messages
   - Provide retry actions

2. **API Errors:**
   - Handle 404 for invalid page IDs
   - Handle 401/403 for authentication issues
   - Handle 500 for server errors
   - Display toast notifications for errors

3. **Validation Errors:**
   - Display inline validation errors in forms
   - Prevent save with invalid data
   - Highlight problematic fields

4. **Upload Errors:**
   - Handle file size limit errors
   - Handle unsupported file type errors
   - Display progress and allow cancellation

### Auto-Save Error Handling

- Retry failed auto-saves up to 3 times
- Display persistent error notification if all retries fail
- Preserve unsaved changes in component state
- Allow manual save retry

## State Management

### PageEditorPage State

```typescript
const [pageData, setPageData] = useState<IPage | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### PageEditorContainer State (Existing)

The copied component already manages:
- blocks: IBlock[]
- selectedBlockId: string | null
- isSaving: boolean
- hasUnsavedChanges: boolean

## File Organization

### Directory Structure After Integration

```
src/
├── components/
│   └── admin/
│       └── PageEditor/
│           ├── PageEditorContainer.tsx
│           ├── BlockCanvas.tsx
│           ├── BlockPalette.tsx
│           ├── BlockEditorPanel.tsx
│           ├── BlockRenderer.tsx
│           ├── BlockToolbar.tsx
│           ├── SortableBlockItem.tsx
│           ├── AutoSaveIndicator.tsx
│           ├── PageMetadataForm.tsx
│           ├── PagePreview.tsx
│           ├── BlockEditor.css
│           ├── PageEditor.css
│           ├── index.ts
│           └── BlockEditors/
│               ├── TextBlockEditor.tsx
│               ├── VideoBlockEditor.tsx
│               ├── ImageBlockEditor.tsx
│               ├── CodeBlockEditor.tsx
│               ├── ListBlockEditor.tsx
│               ├── DividerBlockEditor.tsx
│               ├── InteractiveBlockEditor.tsx
│               ├── PollBlockEditor.tsx
│               ├── ReflectionBlockEditor.tsx
│               ├── WordCloudBlockEditor.tsx
│               ├── AIGeneratorBlockEditor.tsx
│               ├── BlockEditors.css
│               └── index.ts
├── pages/
│   └── admin/
│       ├── PageBuilder.tsx (Updated)
│       └── PageEditorPage.tsx (New)
├── types/
│   └── page.ts (New or updated)
└── services/
    └── api.ts (Updated)
```

## Migration Steps

### Phase 1: Copy Components
1. Copy all files from `server/client/src/components/admin/PageEditor/` to `src/components/admin/PageEditor/`
2. Copy any utility files or hooks used by the page editor
3. Copy type definitions if they exist separately

### Phase 2: Update Imports
1. Update import paths in copied components to use `@/` alias
2. Ensure all imports resolve correctly
3. Fix any missing dependencies

### Phase 3: Create Integration Layer
1. Create PageEditorPage.tsx wrapper component
2. Update PageBuilder.tsx for navigation
3. Update App.tsx with new routes

### Phase 4: Configure API
1. Update vite.config.ts with proxy
2. Update api.ts with page editor methods
3. Test API connectivity

### Phase 5: Test and Validate
1. Test creating new pages
2. Test editing existing pages
3. Test all block types
4. Test file uploads
5. Test auto-save functionality

## Type Safety

### Type Definition Location

Create or update `src/types/page.ts` with all page and block type definitions. Ensure consistency with backend types.

### Import Strategy

```typescript
// In components
import type { IPage, IBlock, BlockType, BlockContent } from '@/types/page';
```

## Performance Considerations

### Lazy Loading

The page editor components are already built and don't require additional lazy loading, but consider:
- Lazy load the PageEditorPage route
- Lazy load heavy dependencies (rich text editor, syntax highlighter)

### Optimization

- Memoize block renderer components
- Debounce auto-save (already implemented in copied components)
- Optimize re-renders with React.memo

## Security Considerations

### Authentication

- All page editor routes protected by AdminRoute
- API calls include authentication token
- Handle token expiration gracefully

### Input Validation

- Validate file types and sizes before upload
- Sanitize HTML content in text blocks
- Validate URLs for video and image embeds

### CSRF Protection

- Use existing CSRF token mechanism
- Include CSRF token in state-changing requests

## Accessibility

The copied components should already include accessibility features, but verify:
- Keyboard navigation works in editor
- ARIA labels are present
- Focus management is correct
- Color contrast meets WCAG standards

## Testing Strategy

### Unit Tests
- Test PageEditorPage component rendering
- Test navigation logic
- Test API integration methods
- Test error handling

### Integration Tests
- Test full create page workflow
- Test full edit page workflow
- Test block addition and editing
- Test file upload workflow

### Manual Testing Checklist
- [ ] Navigate to /admin/pages/new
- [ ] Create a new page with multiple block types
- [ ] Save the page
- [ ] Navigate back to page list
- [ ] Edit an existing page
- [ ] Add, edit, reorder, and delete blocks
- [ ] Upload an image
- [ ] Upload a video
- [ ] Test auto-save
- [ ] Test unsaved changes warning
- [ ] Test on different screen sizes

## Rollback Plan

If integration fails:
1. Keep the existing PageBuilder.tsx functional
2. Remove new routes from App.tsx
3. Remove copied components
4. Revert vite.config.ts changes

The existing simple CRUD interface remains functional throughout integration.

## Future Enhancements

1. **Real-time Collaboration:** Multiple admins editing simultaneously
2. **Version History:** Track and restore previous versions
3. **Block Templates:** Pre-configured block combinations
4. **Advanced Blocks:** Tables, accordions, tabs
5. **AI Assistance:** Content generation and suggestions

## Conclusion

This design provides a clear path for integrating the existing page editor components into the main React application. The integration is low-risk because the components are already built and tested. The main work involves copying files, updating imports, and wiring up routing and API calls. The existing simple CRUD interface remains as a fallback during integration.
