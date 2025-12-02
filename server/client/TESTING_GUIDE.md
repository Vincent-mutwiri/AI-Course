# Testing Guide for Task 10: Frontend Page Renderer

This guide provides step-by-step instructions for testing the frontend page renderer implementation.

## Prerequisites

1. Backend server running on port 3000 (or configured port)
2. Frontend development server running
3. At least one test page created in the database
4. Admin user account for testing unpublished pages

## Test Scenarios

### Scenario 1: View Published Page (Public User)

**Objective:** Verify that published pages are accessible to all users

**Steps:**
1. Log out or use incognito mode (no authentication)
2. Navigate to `http://localhost:5173/test-page` (replace with actual slug)
3. Verify page loads successfully
4. Verify page title is displayed
5. Verify all blocks render correctly
6. Verify no unpublished banner is shown

**Expected Result:**
- Page loads without errors
- All content is visible
- No authentication required

**API Call:**
```bash
curl http://localhost:3000/api/pages/test-page
```

**Expected Response:**
```json
{
  "page": {
    "_id": "...",
    "title": "Test Page",
    "slug": "test-page",
    "content": {
      "blocks": [...],
      "version": "1.0"
    },
    "isPublished": true,
    "type": "page"
  },
  "isAdmin": false
}
```

---

### Scenario 2: View Unpublished Page (Public User)

**Objective:** Verify that unpublished pages return 403 for non-admin users

**Steps:**
1. Log out or use incognito mode
2. Navigate to an unpublished page slug
3. Verify 403 error is displayed
4. Verify error message says "This page is not published yet"

**Expected Result:**
- 403 error page displayed
- Clear error message
- "Go Back Home" button visible

**API Call:**
```bash
curl http://localhost:3000/api/pages/unpublished-page
```

**Expected Response:**
```json
{
  "message": "This page is not published"
}
```

**Status Code:** 403

---

### Scenario 3: View Unpublished Page (Admin User)

**Objective:** Verify that admins can view unpublished pages

**Steps:**
1. Log in as admin user
2. Navigate to an unpublished page slug
3. Verify page loads successfully
4. Verify unpublished banner is displayed at top
5. Verify banner says "This page is unpublished and only visible to administrators"
6. Verify all blocks render correctly

**Expected Result:**
- Page loads successfully
- Yellow warning banner at top
- All content visible

**API Call:**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:3000/api/pages/unpublished-page
```

**Expected Response:**
```json
{
  "page": {
    "_id": "...",
    "title": "Unpublished Page",
    "slug": "unpublished-page",
    "content": {
      "blocks": [...],
      "version": "1.0"
    },
    "isPublished": false,
    "type": "page"
  },
  "isAdmin": true
}
```

---

### Scenario 4: View Non-Existent Page

**Objective:** Verify 404 handling for non-existent pages

**Steps:**
1. Navigate to a non-existent slug (e.g., `/this-page-does-not-exist`)
2. Verify 404 error page is displayed
3. Verify error shows "404" heading
4. Verify error message says "Page not found"
5. Verify "Go Back Home" button is visible
6. Click "Go Back Home" button
7. Verify navigation to home page

**Expected Result:**
- 404 error page displayed
- Clear error message
- Working navigation button

**API Call:**
```bash
curl http://localhost:3000/api/pages/non-existent-slug
```

**Expected Response:**
```json
{
  "message": "Page not found"
}
```

**Status Code:** 404

---

### Scenario 5: Test Block Rendering

**Objective:** Verify all block types render correctly

**Setup:**
Create a test page with the following blocks:
1. Text block with rich formatting
2. Video block (YouTube)
3. Image block with caption
4. Code block with syntax highlighting
5. List block (bullet, numbered, checkbox)
6. Divider block
7. Reflection block
8. Poll block
9. Word cloud block
10. AI generator block

**Steps:**
1. Navigate to the test page
2. Verify each block renders correctly:
   - Text: HTML formatting preserved
   - Video: Embedded player visible
   - Image: Image loads, caption displayed
   - Code: Monospace font, proper formatting
   - List: Correct list type, items displayed
   - Divider: Horizontal line visible
   - Reflection: Question and input field visible
   - Poll: Question and options visible
   - Word cloud: Question and input visible
   - AI generator: Prompt and controls visible

**Expected Result:**
- All blocks render without errors
- Styling is consistent
- Interactive blocks show UI elements

---

### Scenario 6: Test Loading State

**Objective:** Verify loading spinner displays while fetching

**Steps:**
1. Open browser DevTools Network tab
2. Throttle network to "Slow 3G"
3. Navigate to a page
4. Verify loading spinner is displayed
5. Verify "Loading page..." text is shown
6. Wait for page to load
7. Verify loading state disappears
8. Verify page content is displayed

**Expected Result:**
- Loading spinner visible during fetch
- Smooth transition to content
- No flash of error state

---

### Scenario 7: Test Error Handling

**Objective:** Verify error handling for network failures

**Steps:**
1. Stop the backend server
2. Navigate to a page
3. Verify error message is displayed
4. Verify error says "Failed to load page"
5. Start the backend server
6. Refresh the page
7. Verify page loads successfully

**Expected Result:**
- Clear error message on failure
- Page loads after server restart

---

### Scenario 8: Test Blog Post Display

**Objective:** Verify blog-type pages show date

**Steps:**
1. Create a page with `type: 'blog'`
2. Navigate to the page
3. Verify page title is displayed
4. Verify creation date is displayed below title
5. Verify date format is readable (e.g., "January 15, 2024")

**Expected Result:**
- Date displayed for blog posts
- Date not displayed for regular pages
- Date formatted correctly

---

### Scenario 9: Test Responsive Design

**Objective:** Verify page renders correctly on mobile

**Steps:**
1. Open browser DevTools
2. Toggle device toolbar (mobile view)
3. Select iPhone or Android device
4. Navigate to a page
5. Verify layout adapts to mobile
6. Verify text is readable
7. Verify images scale correctly
8. Verify interactive blocks are usable
9. Test on tablet size
10. Test on desktop size

**Expected Result:**
- Responsive layout on all screen sizes
- No horizontal scrolling
- Touch-friendly interactive elements

---

### Scenario 10: Test Interactive Blocks

**Objective:** Verify interactive blocks display correctly

**Steps:**
1. Navigate to page with reflection block
2. Verify question is displayed
3. Verify textarea is present
4. Type in textarea (note: saving may not work yet)
5. Navigate to page with poll block
6. Verify question and options are displayed
7. Select an option (note: voting may not work yet)
8. Verify UI responds to interaction

**Expected Result:**
- Interactive elements visible
- UI responds to user input
- Clear instructions/prompts

---

## Automated Testing

### Unit Tests

Create test file: `client/src/components/__tests__/PageRenderer.test.tsx`

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PageRenderer from '../PageRenderer';

// Mock fetch
global.fetch = jest.fn();

describe('PageRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    render(
      <BrowserRouter>
        <PageRenderer />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading page...')).toBeInTheDocument();
  });

  test('renders page content after loading', async () => {
    const mockPage = {
      page: {
        title: 'Test Page',
        slug: 'test-page',
        content: {
          blocks: [
            {
              id: '1',
              type: 'text',
              order: 0,
              content: { text: '<p>Test content</p>' }
            }
          ],
          version: '1.0'
        },
        isPublished: true,
        type: 'page'
      },
      isAdmin: false
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockPage
    });

    render(
      <BrowserRouter>
        <PageRenderer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Page')).toBeInTheDocument();
    });
  });

  test('displays 404 error for non-existent page', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Page not found' })
    });

    render(
      <BrowserRouter>
        <PageRenderer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('Page not found')).toBeInTheDocument();
    });
  });

  test('displays 403 error for unpublished page', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ message: 'This page is not published' })
    });

    render(
      <BrowserRouter>
        <PageRenderer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('This page is not published yet')).toBeInTheDocument();
    });
  });

  test('shows unpublished banner for admins', async () => {
    const mockPage = {
      page: {
        title: 'Unpublished Page',
        slug: 'unpublished',
        content: { blocks: [], version: '1.0' },
        isPublished: false,
        type: 'page'
      },
      isAdmin: true
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockPage
    });

    render(
      <BrowserRouter>
        <PageRenderer />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/unpublished and only visible to administrators/i))
        .toBeInTheDocument();
    });
  });
});
```

### Integration Tests

Create test file: `client/src/__tests__/integration/PageRoutes.test.tsx`

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PublicPageRoutes from '../../routes/publicRoutes';

describe('Public Page Routes Integration', () => {
  test('renders page at slug route', async () => {
    const mockPage = {
      page: {
        title: 'Integration Test Page',
        slug: 'integration-test',
        content: { blocks: [], version: '1.0' },
        isPublished: true,
        type: 'page'
      },
      isAdmin: false
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockPage
    });

    render(
      <MemoryRouter initialEntries={['/integration-test']}>
        <Routes>
          <Route path="/*" element={<PublicPageRoutes />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Integration Test Page')).toBeInTheDocument();
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test PageRenderer.test.tsx
```

---

## Performance Testing

### Load Time Testing

1. Open browser DevTools
2. Go to Network tab
3. Navigate to a page
4. Check "Finish" time
5. Verify page loads in < 2 seconds on good connection

### Memory Testing

1. Open browser DevTools
2. Go to Memory tab
3. Take heap snapshot before loading page
4. Navigate to page
5. Take heap snapshot after loading
6. Compare memory usage
7. Navigate away and back
8. Verify no memory leaks

---

## Accessibility Testing

### Keyboard Navigation

1. Navigate to a page
2. Press Tab key repeatedly
3. Verify focus moves through interactive elements
4. Verify focus is visible
5. Press Enter on "Go Back Home" button
6. Verify navigation works

### Screen Reader Testing

1. Enable screen reader (VoiceOver on Mac, NVDA on Windows)
2. Navigate to a page
3. Verify page title is announced
4. Verify content is readable
5. Verify images have alt text
6. Verify interactive elements are labeled

---

## Browser Compatibility Testing

Test in the following browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Checklist

Use this checklist to verify all functionality:

- [ ] Published pages load for all users
- [ ] Unpublished pages return 403 for non-admins
- [ ] Unpublished pages load for admins with banner
- [ ] Non-existent pages return 404
- [ ] Loading state displays during fetch
- [ ] Error states display correctly
- [ ] All block types render correctly
- [ ] Blog posts show date
- [ ] Regular pages don't show date
- [ ] Responsive design works on mobile
- [ ] Responsive design works on tablet
- [ ] Responsive design works on desktop
- [ ] Interactive blocks display correctly
- [ ] Images load with lazy loading
- [ ] Videos embed correctly
- [ ] Code blocks format correctly
- [ ] Lists render correctly
- [ ] Dividers display correctly
- [ ] Navigation button works
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No memory leaks

---

## Troubleshooting

### Issue: Page not loading

**Check:**
1. Backend server is running
2. Frontend can reach backend (check CORS)
3. Page exists in database
4. Slug is correct

**Debug:**
```bash
# Check if backend is running
curl http://localhost:3000/health

# Check if page exists
curl http://localhost:3000/api/pages/YOUR_SLUG

# Check browser console for errors
```

### Issue: 404 for all pages

**Check:**
1. Route is registered in main app
2. Route order (page routes should be last)
3. Backend route is registered

### Issue: Unpublished pages not showing for admin

**Check:**
1. User has admin role in database
2. Token is valid
3. Token is in localStorage
4. Backend correctly validates token

### Issue: Blocks not rendering

**Check:**
1. BlockRenderer component is imported
2. Block types are correct
3. Block content has required fields
4. No console errors

---

## Reporting Issues

When reporting issues, include:

1. Browser and version
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Console errors
6. Network tab screenshot
7. Page slug being tested

---

## Next Steps After Testing

1. Fix any bugs found during testing
2. Implement missing functionality
3. Optimize performance
4. Add more comprehensive tests
5. Document any limitations
6. Prepare for production deployment

