# Quick Start Guide - Admin Page Builder

Get the Admin Page Builder up and running in 5 minutes.

## Prerequisites

✅ Backend API running (from Task 2)  
✅ React 18+ application  
✅ React Router v6+  
✅ TypeScript configured  

## Step 1: Copy Files (30 seconds)

```bash
# Copy all client files to your React project
cp -r client/src/* /path/to/your/react-app/src/
```

## Step 2: Install Dependencies (1 minute)

```bash
npm install react-router-dom
# or
pnpm add react-router-dom
```

## Step 3: Add Routes (1 minute)

Update your main App component:

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPageRoutes from './routes/adminRoutes';
import './components/admin/PageEditor/PageEditor.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Your existing routes */}
        <Route path="/" element={<Home />} />
        
        {/* Add admin routes */}
        <Route path="/admin/*" element={<AdminPageRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## Step 4: Configure API Proxy (1 minute)

If using Vite, add to `vite.config.js`:

```js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

If using Create React App, add to `package.json`:

```json
{
  "proxy": "http://localhost:3000"
}
```

## Step 5: Test It! (2 minutes)

1. Start your backend server:
```bash
cd server
npm run dev
```

2. Start your React app:
```bash
npm run dev
```

3. Navigate to: `http://localhost:5173/admin/pages/new`

4. You should see the page editor!

## What You Can Do Now

✅ Create new pages at `/admin/pages/new`  
✅ Edit existing pages at `/admin/pages/:id/edit`  
✅ Enter page title and see slug auto-generate  
✅ Change page type (page, blog, home)  
✅ Toggle publish status  
✅ Auto-save works after 30 seconds  
✅ Navigation guard warns about unsaved changes  

## Common Issues

### "Cannot find module 'react-router-dom'"
**Fix:** Run `npm install react-router-dom`

### "Failed to fetch page"
**Fix:** Ensure backend is running on port 3000 and proxy is configured

### "401 Unauthorized"
**Fix:** Ensure you're logged in and token is in localStorage:
```js
localStorage.setItem('token', 'your-auth-token');
```

### TypeScript errors
**Fix:** Ensure `tsconfig.json` includes:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "node"
  },
  "include": ["src"]
}
```

## Next Steps

1. ✅ **Task 3 Complete** - Page editor UI and routing
2. 🔜 **Task 4** - Block palette and canvas (drag-and-drop)
3. 🔜 **Task 5** - Content block editors (text, video, image, etc.)
4. 🔜 **Task 6** - Interactive block editors (polls, reflections, etc.)
5. 🔜 **Task 7** - Media upload functionality
6. 🔜 **Task 8** - Enhanced auto-save
7. 🔜 **Task 9** - Page preview mode
8. 🔜 **Task 10** - Frontend page renderer
9. 🔜 **Task 11** - Pages management list

## File Structure

```
client/src/
├── components/
│   ├── admin/
│   │   └── PageEditor/
│   │       ├── PageEditorContainer.tsx    ← Main container
│   │       ├── PageMetadataForm.tsx       ← Metadata form
│   │       ├── PageEditor.css             ← Styles
│   │       └── index.ts                   ← Exports
│   └── common/
│       └── NavigationGuard.tsx            ← Unsaved changes guard
├── routes/
│   └── adminRoutes.tsx                    ← Route configuration
├── types/
│   └── page.ts                            ← TypeScript types
└── utils/
    └── debounce.ts                        ← Utility functions
```

## Key Features Working

✅ **Auto-Save**: Changes save automatically after 30 seconds  
✅ **Validation**: Title and slug validation with error messages  
✅ **Slug Generation**: Auto-generates URL-friendly slug from title  
✅ **Uniqueness Check**: Validates slug is unique via API  
✅ **Navigation Guard**: Warns before leaving with unsaved changes  
✅ **Save Status**: Shows "Saving...", "Saved at HH:MM", or error  
✅ **Retry Logic**: Automatically retries failed saves (max 3 times)  
✅ **Responsive**: Works on desktop, tablet, and mobile  

## Testing Checklist

- [ ] Navigate to `/admin/pages/new`
- [ ] Enter a page title
- [ ] Verify slug auto-generates
- [ ] Change page type dropdown
- [ ] Toggle publish checkbox
- [ ] Wait 30 seconds and verify "Saved at..." appears
- [ ] Try to navigate away and verify warning modal
- [ ] Click "Save Now" button manually
- [ ] Enter duplicate slug and verify error message
- [ ] Enter invalid slug characters and verify error

## Need Help?

📖 **Full Documentation**: See `client/README.md`  
🔧 **Integration Guide**: See `client/INTEGRATION_GUIDE.md`  
📋 **Implementation Details**: See `client/IMPLEMENTATION_SUMMARY.md`  
📝 **Requirements**: See `.kiro/specs/admin-page-builder/requirements.md`  
🎨 **Design**: See `.kiro/specs/admin-page-builder/design.md`  

## Congratulations! 🎉

You now have a working page editor with:
- Auto-save functionality
- Validation and error handling
- Navigation protection
- Responsive design

Ready to add block editing? Move on to **Task 4: Block Palette and Canvas**!
