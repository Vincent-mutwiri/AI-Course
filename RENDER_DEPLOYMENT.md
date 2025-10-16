# Deploy to Render - Step by Step

## Part 1: Setup MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account → Create cluster (M0 Free tier)
3. Database Access → Add user (username + password)
4. Network Access → Add IP: `0.0.0.0/0` (allow all)
5. Connect → Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ai-course?retryWrites=true&w=majority
   ```

## Part 2: Deploy Backend API

### Option A: Using Render Dashboard (Easier)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Configure:
     - **Name**: `ai-course-api`
     - **Region**: Choose closest to you
     - **Branch**: `main`
     - **Root Directory**: `server`
     - **Runtime**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Add Environment Variables**
   Click "Environment" tab and add:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://...  (from Atlas)
   JWT_SECRET=your-super-secret-key-min-32-chars
   INFLECTION_API_KEY=your-inflection-api-key
   INFLECTION_API_URL=https://api.inflection.ai/external/api/inference
   AWS_ACCESS_KEY_ID=your-aws-key (if using S3)
   AWS_SECRET_ACCESS_KEY=your-aws-secret (if using S3)
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-bucket-name
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for build
   - Your API will be at: `https://ai-course.onrender.com`

### Option B: Using render.yaml (Automated)

1. Push code with `render.yaml` to GitHub
2. Render Dashboard → "New +" → "Blueprint"
3. Connect repo → Render auto-detects `render.yaml`
4. Add environment variables in dashboard
5. Deploy

## Part 3: Deploy Frontend

### Option A: Static Site on Render

1. **Update Frontend API URL**
   Create `.env.production`:
   ```bash
   VITE_API_URL=https://ai-course-api.onrender.com
   ```

2. **Create Static Site**
   - Render Dashboard → "New +" → "Static Site"
   - Connect GitHub repo
   - Configure:
     - **Name**: `ai-course-frontend`
     - **Branch**: `main`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
   - Add environment variable:
     ```
     VITE_API_URL=https://ai-course-api.onrender.com
     ```

3. **Deploy**
   - Frontend will be at: `https://ai-course-frontend.onrender.com`

### Option B: Vercel (Recommended for Frontend)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Add environment variable in Vercel dashboard:
   ```
   VITE_API_URL=https://ai-course-api.onrender.com
   ```

## Part 4: Seed Database

After backend is deployed:

```bash
# Install dependencies locally
cd server
npm install

# Set environment variable
export MONGODB_URI="mongodb+srv://..."

# Run seed script
npm run seed
```

Or create a one-time job on Render:
- Dashboard → Your service → "Shell"
- Run: `npm run seed`

## Part 5: Update CORS

Update `server/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ai-course-frontend.onrender.com',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Frontend can't connect to API
- Check CORS settings
- Verify `VITE_API_URL` is correct
- Check browser console for errors

### Database connection fails
- Verify MongoDB URI format
- Check username/password (no special chars or URL encode them)
- Ensure network access is configured

### Free tier limitations
- Backend sleeps after 15 min inactivity (cold start ~30s)
- 750 hours/month free
- Upgrade to paid for always-on service

## Custom Domain (Optional)

1. Buy domain (Namecheap, Google Domains)
2. Render Dashboard → Service → Settings → Custom Domain
3. Add domain and configure DNS:
   ```
   Type: CNAME
   Name: @
   Value: your-app.onrender.com
   ```

## Monitoring

- Render Dashboard shows:
  - Deployment logs
  - Runtime logs
  - Metrics (CPU, memory)
  - Health checks

## Cost Estimate

**Free Tier:**
- Backend: Free (with sleep)
- Frontend: Free
- MongoDB: Free (512MB)
- Total: $0/month

**Paid (No Sleep):**
- Backend: $7/month
- Frontend: Free
- MongoDB: Free
- Total: $7/month

## Quick Deploy Commands

```bash
# 1. Commit changes
git add .
git commit -m "Deploy to Render"
git push

# 2. Render auto-deploys on push (if configured)

# 3. Or manual deploy via CLI
npm i -g render-cli
render deploy
```

## Environment Variables Checklist

Backend:
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] INFLECTION_API_KEY
- [ ] INFLECTION_API_URL
- [ ] AWS credentials (if using S3)
- [ ] PORT (auto-set by Render)
- [ ] NODE_ENV=production

Frontend:
- [ ] VITE_API_URL

## Next Steps

1. Set up CI/CD (auto-deploy on git push)
2. Add health check endpoint
3. Configure custom domain
4. Set up monitoring/alerts
5. Add SSL certificate (auto with Render)
