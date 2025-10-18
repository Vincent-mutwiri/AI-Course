# Render Deployment Fix

## Problem
Server crashes on Render with "ELIFECYCLE Command failed" error.

## Root Causes

1. **Environment Variable Loading**: Server was trying to load `.env.local` from a hardcoded path that doesn't exist in production
2. **Missing Error Handling**: No proper error handling for startup failures

## Fixes Applied

### 1. Fixed Environment Variable Loading (`server/src/config/env.ts`)

**Before:**
```typescript
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
```

**After:**
```typescript
// In production, env vars come from platform (Render, Vercel, etc.)
// In development, load from .env.local
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}
```

### 2. Added Error Handling (`server/src/index.ts`)

Added proper error handling for:
- Database connection failures
- Unhandled promise rejections
- Uncaught exceptions

## Deployment Checklist

### On Render Dashboard

Ensure these environment variables are set:

1. **Required:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `NODE_ENV` - Set to `production`
   - `PORT` - Set to `10000`

2. **Optional (for AI features):**
   - `INFLECTION_API_KEY` - Your Inflection AI API key
   - `INFLECTION_API_URL` - Default: `https://api.inflection.ai/external/api/inference`

3. **Optional (for file uploads):**
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_S3_BUCKET`

### Deploy Steps

```bash
# 1. Commit the fixes
git add server/src/config/env.ts server/src/index.ts
git commit -m "fix: resolve production environment loading and add error handling"

# 2. Push to trigger Render deployment
git push origin main
```

### Verify Deployment

After deployment, check:

1. **Render Logs** - Should see:
   ```
   MongoDB connected successfully
   Server running on port 10000
   Environment: production
   ```

2. **Health Check** - Visit:
   ```
   https://ai-course-api.onrender.com/health
   ```
   Should return:
   ```json
   {
     "status": "healthy",
     "timestamp": "2024-..."
   }
   ```

3. **API Root** - Visit:
   ```
   https://ai-course-api.onrender.com/
   ```
   Should return:
   ```json
   {
     "status": "ok",
     "message": "AI Course API is running"
   }
   ```

## Common Issues

### Issue: "MONGODB_URI is not defined"
**Solution:** Add `MONGODB_URI` environment variable in Render dashboard

### Issue: Server starts but crashes immediately
**Solution:** Check Render logs for specific error. Usually missing required env vars.

### Issue: CORS errors from frontend
**Solution:** Verify frontend URL is in the CORS allowlist in `server/src/index.ts`

### Issue: AI features not working
**Solution:** Add `INFLECTION_API_KEY` environment variable (optional, will show warning but won't crash)

## Testing Locally

To test the production build locally:

```bash
# 1. Set NODE_ENV to production
export NODE_ENV=production

# 2. Build the server
cd server
npm run build

# 3. Start the server
npm start

# 4. Check if it runs without errors
```

## Rollback Plan

If issues persist, you can temporarily:

1. Check Render logs for specific errors
2. Verify all environment variables are set correctly
3. Test the build locally with production settings
4. Contact Render support if platform-specific issues

## Next Steps

After successful deployment:
1. Monitor Render logs for any warnings
2. Test all API endpoints from frontend
3. Verify interactive elements load correctly
4. Check database connections are stable
