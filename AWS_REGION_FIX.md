# AWS S3 Region Configuration Fix

## Problem
The video upload was failing with a `PermanentRedirect` error because the S3 bucket is in the `eu-north-1` region, but the code was defaulting to `us-east-1`.

## Solution
Updated the S3 client configuration to use the correct region.

## Changes Made

### 1. Updated `/server/src/routes/media.ts`
- Changed default region from `us-east-1` to `eu-north-1`
- Added fallback to check both `AWS_REGION` and `AWS_S3_REGION` environment variables
- Fixed S3 URL generation to include the region
- Added `forcePathStyle: false` to use virtual-hosted-style URLs

### 2. Updated `/server/src/config/s3.ts`
- Changed default region to `eu-north-1`
- Fixed all S3 URL generation to use the correct region
- Added logging for S3 configuration

## Environment Variables on Render

Make sure these environment variables are set in your Render dashboard:

```
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
AWS_S3_BUCKET_NAME=vincent-bucket2025
```

## To Deploy

Since your Render deployment auto-deploys from Git:

```bash
git add .
git commit -m "Fix AWS S3 region configuration for eu-north-1"
git push origin main
```

Render will automatically detect the push and redeploy your backend.

## Verification

After deployment, the video upload should work correctly. Check the Render logs to see:
```
[Media] AWS S3 configured with region: eu-north-1 bucket: vincent-bucket2025
```

This confirms the correct region is being used.
