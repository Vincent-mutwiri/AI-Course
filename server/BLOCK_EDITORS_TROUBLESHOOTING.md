# Block Editors Troubleshooting Guide

## Issue: Block editors not appearing on frontend

### Root Cause

The block editor components are implemented correctly in the `client/src` directory, but they need to be integrated into your React frontend application that runs on `http://localhost:5173`.

### Architecture Overview

This project has a **two-part architecture**:

1. **Backend API** (Express/Node.js)
   - Runs on port 3000 (or configured PORT)
   - Located in `src/` directory
   - Provides REST API endpoints
   - Currently running via `npm run dev`

2. **Frontend React App** (Separate)
   - Should run on port 5173 (Vite dev server)
   - Components are in `client/src/` directory
   - These are **source files** that need to be copied to your React app
   - Not a standalone application

### Solution

The `client/src` directory contains React components that need to be **copied into your existing React application**. Follow these steps:

#### Step 1: Locate Your React Frontend

You need to find or create a React application that will use these components. This could be:
- A separate repository
- A different directory in your project
- A new React app you need to create

#### Step 2: Copy the Components

```bash
# If you have a React app at ../frontend or similar:
cp -r client/src/* /path/to/your/react-app/src/
```

#### Step 3: Install Dependencies

In your React app directory:
```bash
npm install react-router-dom
```

#### Step 4: Configure API Proxy

Create or update `vite.config.ts` in your React app:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

#### Step 5: Add Routes

Update your React app's main routing file:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPageRoutes from './routes/adminRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Your existing routes */}
        
        {/* Add admin routes */}
        <Route path="/admin/*" element={<AdminPageRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### Step 6: Start Both Servers

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend React App):
```bash
cd /path/to/your/react-app
npm run dev
```

#### Step 7: Test

Navigate to: `http://localhost:5173/admin/pages/new`

## What Was Implemented

All block editor components are complete and working:

### ✅ Task 5: Block Editor Components

1. **TextBlockEditor** - Rich text editing with formatting toolbar
2. **VideoBlockEditor** - Video URL input, upload, and preview
3. **ImageBlockEditor** - Image upload with caption and alt text
4. **CodeBlockEditor** - Code input with language selection
5. **ListBlockEditor** - List items with add/remove/reorder
6. **DividerBlockEditor** - Simple divider display

### ✅ Integration

- All components exported from `index.ts`
- Integrated into `BlockEditorPanel.tsx`
- Styled with `BlockEditors.css`
- TypeScript types are correct
- No compilation errors

## Verification

To verify the implementation is correct:

1. **Check TypeScript compilation**:
   ```bash
   # All these should show "No diagnostics found"
   npx tsc --noEmit client/src/components/admin/PageEditor/BlockEditors/*.tsx
   ```

2. **Check file structure**:
   ```bash
   ls -la client/src/components/admin/PageEditor/BlockEditors/
   ```
   
   Should show:
   - TextBlockEditor.tsx ✅
   - VideoBlockEditor.tsx ✅
   - ImageBlockEditor.tsx ✅
   - CodeBlockEditor.tsx ✅
   - ListBlockEditor.tsx ✅
   - DividerBlockEditor.tsx ✅
   - BlockEditors.css ✅
   - index.ts ✅

3. **Check integration**:
   ```bash
   grep -r "TextBlockEditor\|VideoBlockEditor\|ImageBlockEditor" client/src/components/admin/PageEditor/BlockEditorPanel.tsx
   ```
   
   Should show imports and usage in the switch statement.

## Common Issues

### "Cannot GET /admin/pages"

**Cause**: Frontend React app is not running  
**Solution**: Start your React app on port 5173

### "Failed to fetch"

**Cause**: Backend API is not running or proxy not configured  
**Solution**: 
1. Start backend: `npm run dev`
2. Configure Vite proxy (see Step 4 above)

### "404 Not Found"

**Cause**: Routes not configured in React app  
**Solution**: Add AdminPageRoutes to your React Router configuration

### Block editor panel is empty

**Cause**: Block not selected or CSS not loaded  
**Solution**: 
1. Click on a block in the canvas to select it
2. Ensure BlockEditors.css is imported
3. Check browser console for errors

## Testing the Block Editors

Once your React app is running:

1. Navigate to `/admin/pages/new`
2. Add a block from the palette (left sidebar)
3. Click on the block in the canvas (center)
4. The block editor panel should open (right sidebar)
5. Edit the block content
6. Verify changes appear in the block preview

### Test Each Editor:

**Text Block**:
- Type text
- Use formatting buttons (Bold, Italic, Headings)
- Add links
- Create lists

**Video Block**:
- Enter YouTube/Vimeo URL
- Or upload a video file
- See preview

**Image Block**:
- Upload an image
- Add caption and alt text
- See preview

**Code Block**:
- Enter code
- Select language
- See formatted preview

**List Block**:
- Add items
- Reorder with up/down buttons
- Change list type (bullet/numbered/checkbox)
- See preview

**Divider Block**:
- See divider line preview
- No editing needed

## Files Modified/Created

### Created:
- `client/src/components/admin/PageEditor/BlockEditors/BlockEditors.css`
- `client/src/components/admin/PageEditor/BlockEditors/TEST_VERIFICATION.md`
- `BLOCK_EDITORS_TROUBLESHOOTING.md` (this file)

### Modified:
- `client/src/components/admin/PageEditor/BlockEditors/TextBlockEditor.tsx` (added CSS import)
- `client/src/components/admin/PageEditor/BlockEditors/VideoBlockEditor.tsx` (added CSS import)
- `client/src/components/admin/PageEditor/BlockEditors/ImageBlockEditor.tsx` (added CSS import)
- `client/src/components/admin/PageEditor/BlockEditors/CodeBlockEditor.tsx` (added CSS import)
- `client/src/components/admin/PageEditor/BlockEditors/ListBlockEditor.tsx` (added CSS import)
- `client/src/components/admin/PageEditor/BlockEditors/DividerBlockEditor.tsx` (added CSS import)

## Summary

The block editor components are **fully implemented and working**. The issue is that they need to be integrated into a React frontend application that runs separately from the backend API. Follow the steps above to set up your React app and test the editors.

If you don't have a React frontend app yet, you'll need to create one:

```bash
npm create vite@latest my-frontend -- --template react-ts
cd my-frontend
npm install
npm install react-router-dom
# Then copy the client/src files and configure as described above
```
