# Admin Video Management Guide

## Overview
Admins can now upload, replace, and delete videos directly from the lesson pages. The video player component automatically detects admin users and displays management controls.

## How to Access Video Controls

### Step 1: Navigate to a Lesson with Video Content
1. Go to the Courses page: `http://localhost:5173/courses`
2. Click on "The Learning Science Playbook for Educators"
3. Click on "Module 1: The 'Why' & 'How' of Learning"
4. You'll see "Lesson 1.1: The 'Spark'" which has video content

### Step 2: Admin Controls Visibility
**Important**: You must be logged in as an admin user to see the upload/delete buttons.

- **If you see the video player with NO buttons** → You're not logged in as admin
- **If you see "Upload Video" or "Replace Video" buttons** → You're logged in as admin ✓

## Admin Video Controls

### When NO Video Exists
If a lesson has a video section but no video uploaded yet, admins will see:
```
┌─────────────────────────────────────┐
│  📹 No video uploaded yet           │
│                                     │
│  [Upload Video]                     │
└─────────────────────────────────────┘
```

**To Upload:**
1. Click "Upload Video" button
2. A dialog opens
3. Click "Choose File" and select your video (max 100MB)
4. Video automatically uploads to AWS S3
5. Page refreshes and video appears

### When Video EXISTS
If a video is already uploaded, admins will see:
```
┌─────────────────────────────────────┐
│  [Video Player with controls]       │
│                                     │
│  [Replace Video]  [Delete Video]    │
└─────────────────────────────────────┘
```

**To Replace:**
1. Click "Replace Video" button
2. Select new video file
3. Old video is replaced in S3
4. New video displays immediately

**To Delete:**
1. Click "Delete Video" button
2. Confirm deletion
3. Video removed from S3 and database
4. "Upload Video" button appears

## Technical Details

### File Requirements
- **Format**: MP4, WebM, OGG (any HTML5 video format)
- **Max Size**: 100MB
- **Storage**: AWS S3 with pre-signed URLs

### How It Works
1. Admin uploads video → Stored in S3 bucket under `videos/` folder
2. S3 key saved to MongoDB lesson content
3. When students view lesson → Pre-signed URL generated (valid 1 hour)
4. Video streams from S3

### Database Structure
Videos are stored in the lesson's `content` array:
```json
{
  "content": [
    {
      "type": "video",
      "s3Key": "videos/1234567890_my-video.mp4",
      "title": "The 'Forgotten Lesson' Hook",
      "duration": "2 min"
    }
  ]
}
```

## Troubleshooting

### "I don't see the Upload/Delete buttons"
**Solution**: Verify you're logged in as an admin user
- Check your user role in the database
- User document should have `role: "admin"`
- Log out and log back in if needed

### "Upload button doesn't appear"
**Solution**: Check if the lesson has video content configured
- The lesson must have a video object in its `content` array
- Run the script: `tsx server/src/scripts/addModule1Content.ts`

### "Video upload fails"
**Possible causes**:
1. **File too large** → Compress video or use smaller file
2. **AWS credentials missing** → Check `.env` file has:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_BUCKET_NAME`
   - `AWS_REGION`
3. **Network error** → Check internet connection

### "Video doesn't play"
**Solutions**:
1. **Pre-signed URL expired** → Refresh the page (generates new URL)
2. **S3 permissions** → Verify bucket allows GetObject
3. **CORS issues** → Check S3 bucket CORS configuration

## Current Video Locations

### Module 1, Lesson 1.1: "The Spark"
- **Current S3 Key**: `videos/lesson_1_1_hook.mp4` (placeholder)
- **Expected Content**: 2-minute hook video about forgotten lessons
- **Status**: ⚠️ Needs actual video upload

### Future Lessons
You can add video sections to any lesson by updating the lesson's `content` array in MongoDB.

## Admin Workflow Example

### First Time Setup
1. ✅ Log in as admin
2. ✅ Navigate to Lesson 1.1
3. ✅ Click "Upload Video"
4. ✅ Select your prepared 2-minute hook video
5. ✅ Wait for upload (progress shown)
6. ✅ Video appears and plays

### Updating a Video
1. ✅ Navigate to lesson with existing video
2. ✅ Click "Replace Video"
3. ✅ Select new video file
4. ✅ Old video automatically deleted from S3
5. ✅ New video appears

### Removing a Video
1. ✅ Navigate to lesson with video
2. ✅ Click "Delete Video"
3. ✅ Confirm deletion
4. ✅ Video removed, "Upload Video" button appears

## Security Notes

- ✅ Only admin users can upload/delete videos
- ✅ Pre-signed URLs expire after 1 hour
- ✅ S3 bucket not publicly accessible
- ✅ All uploads validated (type and size)
- ✅ Database updates require admin authentication

## Next Steps

1. **Upload actual videos** for Lesson 1.1
2. **Upload slide images** for Design Fixer (Lesson 1.2)
3. **Test video playback** on different devices
4. **Monitor S3 storage** usage

## Support

If you encounter issues:
1. Check browser console for errors
2. Check server logs for API errors
3. Verify AWS credentials are correct
4. Ensure you're logged in as admin
