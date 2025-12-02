# Integration Guide for Admin Page Builder

This guide explains how to integrate the Admin Page Builder components into your existing React application.

## Prerequisites

- React 18+
- React Router v6+
- TypeScript 4.5+
- Backend API running (see backend implementation in Task 2)

## Installation Steps

### 1. Copy Files to Your Project

Copy the `client/src` directory contents to your React project:

```bash
# From the root of this repository
cp -r client/src/* /path/to/your/react-app/src/
```

### 2. Install Dependencies

Ensure you have the required dependencies:

```bash
npm install react-router-dom
# or
yarn add react-router-dom
# or
pnpm add react-router-dom
```

### 3. Import Styles

Import the CSS file in your main app component or index file:

```tsx
// In your App.tsx or index.tsx
import './components/admin/PageEditor/PageEditor.css';
```

### 4. Configure Routes

Add the admin routes to your main router configuration:

```tsx
// In your App.tsx or main router file
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPageRoutes from './routes/adminRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Your existing routes */}
        <Route path="/admin/*" element={<AdminPageRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 5. Configure API Base URL

If your backend API is not on the same origin, configure a proxy or update the fetch calls:

**Option A: Vite Proxy (Development)**

```js
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
}
```

**Option B: Environment Variable**

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:3000
```

Then update the fetch calls to use:

```tsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

fetch(`${API_BASE_URL}/api/admin/pages/${id}/edit`, {
  // ...
});
```

### 6. Authentication Setup

The components expect an authentication token in localStorage. Ensure your auth system stores the token:

```tsx
// After successful login
localStorage.setItem('token', authToken);
```

If you use a different auth mechanism (cookies, context, etc.), update the fetch calls in:
- `PageEditorContainer.tsx`
- `PageMetadataForm.tsx`

Example with custom auth hook:

```tsx
// In PageEditorContainer.tsx
import { useAuth } from '../../../hooks/useAuth';

const PageEditorContainer: React.FC<PageEditorContainerProps> = ({ isNewPage }) => {
  const { token } = useAuth();

  // Update fetch calls to use token from hook
  const response = await fetch(`/api/admin/pages/${id}/edit`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  // ...
};
```

## Usage Examples

### Creating a New Page

```tsx
import { PageEditorContainer } from './components/admin/PageEditor';

function NewPageRoute() {
  return <PageEditorContainer isNewPage={true} />;
}
```

### Editing an Existing Page

```tsx
import { PageEditorContainer } from './components/admin/PageEditor';

function EditPageRoute() {
  return <PageEditorContainer isNewPage={false} />;
}
```

### Using Navigation Guard Separately

```tsx
import NavigationGuard from './components/common/NavigationGuard';
import MyComponent from './MyComponent';

function ProtectedRoute() {
  return (
    <NavigationGuard>
      <MyComponent />
    </NavigationGuard>
  );
}
```

## Customization

### Styling

The components use CSS classes that can be customized. Override styles in your own CSS file:

```css
/* In your custom.css */
.page-editor-container {
  max-width: 1400px; /* Override default 1200px */
}

.btn-save {
  background-color: #your-brand-color;
}
```

### Auto-Save Timing

To change the auto-save interval, modify the debounce time in `PageEditorContainer.tsx`:

```tsx
// Change from 30000ms (30 seconds) to your preferred time
const debouncedSave = useCallback(
  debounce((pageData: Partial<IPage>, blocksData: IBlock[]) => {
    savePage(pageData, blocksData);
  }, 60000), // 60 seconds
  [savePage]
);
```

### Validation Rules

To customize slug validation, modify the regex in `PageMetadataForm.tsx`:

```tsx
// Current: lowercase letters, numbers, hyphens, underscores
const urlSafeRegex = /^[a-z0-9-_]*$/;

// Example: Allow uppercase
const urlSafeRegex = /^[a-zA-Z0-9-_]*$/;
```

## Admin Layout Integration

If you have an admin layout component, wrap the routes:

```tsx
// In your adminRoutes.tsx
import AdminLayout from '../layouts/AdminLayout';

const AdminPageRoutes: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/admin/pages/new" element={...} />
        <Route path="/admin/pages/:id/edit" element={...} />
      </Routes>
    </AdminLayout>
  );
};
```

## Error Handling

The components include basic error handling. For production, consider:

1. **Global Error Boundary**

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <AdminPageRoutes />
    </ErrorBoundary>
  );
}
```

2. **Toast Notifications**

Replace console.error with toast notifications:

```tsx
// Install react-hot-toast or similar
import toast from 'react-hot-toast';

// In PageEditorContainer.tsx
catch (error) {
  console.error('Error saving page:', error);
  toast.error('Failed to save page');
  setSaveState('error');
}
```

## Testing

### Unit Tests Example

```tsx
// PageMetadataForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import PageMetadataForm from './PageMetadataForm';

describe('PageMetadataForm', () => {
  it('auto-generates slug from title', () => {
    const mockPage = {
      title: '',
      slug: '',
      type: 'page',
      isPublished: false,
      content: { blocks: [], version: '1.0' }
    };

    const onChange = jest.fn();

    render(<PageMetadataForm page={mockPage} onChange={onChange} />);

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'My New Page' } });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'My New Page',
        slug: 'my-new-page'
      })
    );
  });
});
```

## Troubleshooting

### Issue: "Failed to fetch page"

**Solution:** Ensure backend API is running and accessible. Check CORS configuration.

### Issue: "Slug validation not working"

**Solution:** Verify the `/api/admin/pages/validate-slug` endpoint is implemented and accessible.

### Issue: "Auto-save not triggering"

**Solution:** Check browser console for errors. Ensure `isDirty` state is being set correctly.

### Issue: "Navigation guard not showing"

**Solution:** Verify `(window as any).__hasUnsavedChanges` is being set in PageEditorContainer.

### Issue: "TypeScript errors"

**Solution:** Ensure all type definitions are imported correctly. Check `tsconfig.json` includes the `src` directory.

## Performance Optimization

For large pages with many blocks (to be implemented in later tasks):

1. **Virtualization**: Use `react-window` or `react-virtual` for block lists
2. **Lazy Loading**: Lazy load block editor components
3. **Memoization**: Use `React.memo` for block components
4. **Debouncing**: Already implemented for auto-save

## Security Considerations

1. **XSS Prevention**: Sanitize HTML content in text blocks (use DOMPurify)
2. **CSRF Protection**: Implement CSRF tokens for state-changing operations
3. **Authorization**: Verify admin role on backend for all endpoints
4. **Input Validation**: Validate all inputs on both client and server

## Next Steps

After integration:

1. Test all functionality in your environment
2. Customize styling to match your brand
3. Add analytics tracking for page editor usage
4. Implement remaining tasks (Block Palette, Canvas, etc.)
5. Add comprehensive error logging
6. Set up monitoring for auto-save failures

## Support

For issues or questions:
1. Check the README.md for component documentation
2. Review the IMPLEMENTATION_SUMMARY.md for feature details
3. Consult the design document in `.kiro/specs/admin-page-builder/design.md`
4. Check the requirements in `.kiro/specs/admin-page-builder/requirements.md`
