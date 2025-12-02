# Public Page Routes Integration Guide

This guide explains how to integrate the public page rendering routes into your main application.

## Overview

The public page routes allow end users to view published pages created with the Admin Page Builder. The routes handle:

- Rendering published pages by slug
- Showing unpublished pages only to admins
- Displaying 404 errors for non-existent pages
- Displaying 403 errors for unpublished pages accessed by non-admins

## Backend Setup

### 1. Route Registration

The public pages route is already registered in `src/index.ts`:

```typescript
import pagesRoutes from "./routes/pages";
app.use("/api/pages", pagesRoutes);
```

### 2. API Endpoint

**GET /api/pages/:slug**

Fetches a page by slug for public viewing.

**Response:**
```json
{
  "page": {
    "_id": "...",
    "title": "Page Title",
    "slug": "page-slug",
    "content": {
      "blocks": [...],
      "version": "1.0"
    },
    "isPublished": true,
    "type": "page",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "isAdmin": false
}
```

**Status Codes:**
- `200` - Page found and accessible
- `404` - Page not found
- `403` - Page is unpublished and user is not admin
- `500` - Server error

## Frontend Setup

### Option 1: Using Pre-built Route Component (Recommended)

Import and use the `PublicPageRoutes` component in your main router:

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminPageRoutes, PublicPageRoutes } from './routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminPageRoutes />} />
        
        {/* Other app routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        
        {/* Public page routes - should be last to act as catch-all */}
        <Route path="/*" element={<PublicPageRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Option 2: Using PageRenderer Component Directly

If you need more control over routing, use the `PageRenderer` component directly:

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageRenderer } from './components';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminPageRoutes />} />
        
        {/* Other app routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        
        {/* Custom page route */}
        <Route path="/pages/:slug" element={<PageRenderer />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Option 3: Nested Routes

For more complex routing structures:

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageRenderer } from './components';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Admin routes */}
          <Route path="admin/*" element={<AdminPageRoutes />} />
          
          {/* App routes */}
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="about" element={<AboutPage />} />
          
          {/* Page routes */}
          <Route path=":slug" element={<PageRenderer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## Route Priority

**Important:** The public page routes should be placed **last** in your route configuration to avoid conflicts with other routes. This is because the `/:slug` pattern will match any path.

### Correct Order:
```tsx
<Routes>
  <Route path="/admin/*" element={<AdminPageRoutes />} />
  <Route path="/courses" element={<CoursesPage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/:slug" element={<PageRenderer />} />  {/* Last */}
</Routes>
```

### Incorrect Order:
```tsx
<Routes>
  <Route path="/:slug" element={<PageRenderer />} />  {/* Will match everything! */}
  <Route path="/admin/*" element={<AdminPageRoutes />} />
  <Route path="/courses" element={<CoursesPage />} />
</Routes>
```

## Authentication

The PageRenderer component automatically includes the authentication token from localStorage when fetching pages:

```typescript
const response = await fetch(`/api/pages/${slug}`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});
```

This allows the backend to determine if the user is an admin and show unpublished pages accordingly.

## Styling

The PageRenderer component includes its own CSS file (`PageRenderer.css`). Make sure your build process includes CSS imports, or manually include the styles in your main stylesheet.

### Custom Styling

To customize the page renderer styles, you can:

1. **Override CSS classes:**
```css
/* In your main stylesheet */
.page-renderer-container {
  max-width: 1200px; /* Override default 900px */
}

.page-title {
  font-family: 'Your Custom Font', sans-serif;
}
```

2. **Use CSS modules:**
```tsx
import PageRenderer from './components/PageRenderer';
import styles from './CustomPageStyles.module.css';

// Wrap with custom styling
<div className={styles.customWrapper}>
  <PageRenderer />
</div>
```

3. **Use styled-components or emotion:**
```tsx
import styled from 'styled-components';
import PageRenderer from './components/PageRenderer';

const StyledPageWrapper = styled.div`
  .page-title {
    color: ${props => props.theme.primaryColor};
  }
`;

<StyledPageWrapper>
  <PageRenderer />
</StyledPageWrapper>
```

## Error Handling

The PageRenderer component handles three types of errors:

### 1. Page Not Found (404)
Displays a 404 error page with a "Go Back Home" button.

### 2. Unpublished Page (403)
Displays a message that the page is not published yet.

### 3. Server Error (500)
Displays a generic error message.

### Custom Error Pages

To use custom error pages, you can wrap the PageRenderer:

```tsx
import { PageRenderer } from './components';
import Custom404 from './components/Custom404';

function PageWithCustomErrors() {
  const [error, setError] = useState(null);
  
  if (error === 404) {
    return <Custom404 />;
  }
  
  return <PageRenderer onError={setError} />;
}
```

## Loading States

The PageRenderer includes a loading spinner while fetching page data. To customize the loading state:

```css
.page-loading {
  /* Your custom loading styles */
}

.loading-spinner {
  /* Your custom spinner styles */
}
```

## SEO Considerations

For better SEO, consider:

1. **Server-Side Rendering (SSR):**
   - Use Next.js or similar framework
   - Fetch page data on the server
   - Render HTML with content

2. **Meta Tags:**
   - Add meta tags based on page content
   - Use React Helmet or similar library

```tsx
import { Helmet } from 'react-helmet';

<Helmet>
  <title>{page.title}</title>
  <meta name="description" content={extractDescription(page)} />
</Helmet>
```

3. **Sitemap:**
   - Generate sitemap with all published pages
   - Update sitemap when pages are published

## Testing

### Unit Tests

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PageRenderer from './components/PageRenderer';

test('renders page content', async () => {
  render(
    <BrowserRouter>
      <PageRenderer />
    </BrowserRouter>
  );
  
  await waitFor(() => {
    expect(screen.getByText('Page Title')).toBeInTheDocument();
  });
});
```

### Integration Tests

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PageRenderer from './components/PageRenderer';

test('displays 404 for non-existent page', async () => {
  render(
    <MemoryRouter initialEntries={['/non-existent-page']}>
      <Routes>
        <Route path="/:slug" element={<PageRenderer />} />
      </Routes>
    </MemoryRouter>
  );
  
  await waitFor(() => {
    expect(screen.getByText('404')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### 1. Code Splitting

Use React.lazy to load PageRenderer only when needed:

```tsx
import React, { lazy, Suspense } from 'react';

const PageRenderer = lazy(() => import('./components/PageRenderer'));

<Suspense fallback={<LoadingSpinner />}>
  <PageRenderer />
</Suspense>
```

### 2. Caching

Implement caching for frequently accessed pages:

```tsx
const pageCache = new Map();

async function fetchPageWithCache(slug) {
  if (pageCache.has(slug)) {
    return pageCache.get(slug);
  }
  
  const response = await fetch(`/api/pages/${slug}`);
  const data = await response.json();
  
  pageCache.set(slug, data);
  return data;
}
```

### 3. Image Optimization

Optimize images in blocks:

```tsx
<img
  src={content.imageUrl}
  alt={content.altText}
  loading="lazy"
  srcSet={`${content.imageUrl}?w=400 400w, ${content.imageUrl}?w=800 800w`}
/>
```

## Troubleshooting

### Issue: Pages not loading

**Solution:** Check that:
1. Backend route is registered in `src/index.ts`
2. Frontend route is configured correctly
3. API endpoint is accessible (check CORS settings)
4. Token is stored in localStorage

### Issue: 404 for all pages

**Solution:** Check route order - page routes should be last

### Issue: Unpublished pages not showing for admins

**Solution:** Verify:
1. User has admin role in database
2. Token is valid and includes userId
3. Backend correctly checks admin status

### Issue: Styling not applied

**Solution:** Ensure CSS file is imported:
```tsx
import './PageRenderer.css';
```

## Example: Complete Integration

Here's a complete example of integrating public page routes:

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminPageRoutes, PublicPageRoutes } from './routes';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminPageRoutes />} />
          
          {/* App routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          
          {/* Public page routes - last */}
          <Route path="/*" element={<PublicPageRoutes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

## Next Steps

After integrating the public routes:

1. Test page rendering with various block types
2. Test authentication and admin access
3. Customize styling to match your app
4. Implement SEO optimizations
5. Add analytics tracking
6. Set up error monitoring

## Support

For issues or questions:
- Check the main README.md
- Review the design document
- Check the requirements document
- Review the implementation tasks

