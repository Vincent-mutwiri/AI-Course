import { Router, Response } from "express";
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import multer from "multer";

const router = Router();

// Validate AWS credentials
const AWS_REGION = process.env.AWS_REGION || process.env.AWS_S3_REGION || "eu-north-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !BUCKET_NAME) {
  console.error('[Media] AWS credentials not configured properly:');
  console.error('[Media] - AWS_ACCESS_KEY_ID:', AWS_ACCESS_KEY_ID ? 'Set' : 'Missing');
  console.error('[Media] - AWS_SECRET_ACCESS_KEY:', AWS_SECRET_ACCESS_KEY ? 'Set' : 'Missing');
  console.error('[Media] - AWS_S3_BUCKET_NAME:', BUCKET_NAME || 'Missing');
  console.error('[Media] - AWS_REGION:', AWS_REGION);
} else {
  console.log('[Media] AWS S3 configured with region:', AWS_REGION, 'bucket:', BUCKET_NAME);
}

// Configure S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: false, // Use virtual-hosted-style URLs
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    console.log('[Media] File filter - mimetype:', file.mimetype, 'originalname:', file.originalname);
    // Accept all video types
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      console.log('[Media] File rejected - invalid mimetype:', file.mimetype);
      cb(new Error(`Invalid file type: ${file.mimetype}. Only video and image files are allowed.`));
    }
  },
});

// Multer error handling middleware
const handleMulterError = (err: any, req: any, res: Response, next: any) => {
  if (err instanceof multer.MulterError) {
    console.error('[Media] Multer error:', err.code, err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large',
        details: 'Maximum file size is 100MB'
      });
    }
    return res.status(400).json({ 
      message: 'File upload error',
      details: err.message
    });
  } else if (err) {
    console.error('[Media] Upload error:', err.message);
    return res.status(400).json({ 
      message: 'File upload failed',
      details: err.message
    });
  }
  next();
};

// Health check for AWS credentials
router.get("/health", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const credentialsStatus = {
      awsAccessKeyId: AWS_ACCESS_KEY_ID ? 'Configured' : 'Missing',
      awsSecretAccessKey: AWS_SECRET_ACCESS_KEY ? 'Configured' : 'Missing',
      bucketName: BUCKET_NAME || 'Missing',
      region: AWS_REGION,
    };
    
    console.log('[Media] Health check:', credentialsStatus);
    
    res.json({
      status: 'ok',
      credentials: credentialsStatus,
      allConfigured: !!(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && BUCKET_NAME)
    });
  } catch (error) {
    console.error('[Media] Health check error:', error);
    res.status(500).json({ message: 'Health check failed' });
  }
});

// Get pre-signed URL for viewing media (authenticated users)
router.get("/url", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.query;

    if (!key || typeof key !== "string") {
      return res.status(400).json({ message: "S3 key is required" });
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    // Generate pre-signed URL valid for 1 hour
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.json({ url });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res.status(500).json({ message: "Failed to generate media URL" });
  }
});

// Upload video (admin only)
router.post(
  "/upload/video",
  authenticate,
  requireAdmin,
  upload.single("video"),
  handleMulterError,
  async (req: AuthRequest, res: Response) => {
    try {
      console.log('[Media] Video upload request from user:', req.userId);
      
      if (!BUCKET_NAME || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
        console.error('[Media] AWS credentials not configured');
        return res.status(500).json({ 
          message: "Server configuration error: AWS credentials not set",
          details: "Please contact the administrator"
        });
      }
      
      if (!req.file) {
        console.log('[Media] No file in request');
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log('[Media] File details:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      const { folder = "videos" } = req.body;
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}_${req.file.originalname}`;

      console.log('[Media] Uploading to S3:', fileName);

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3Client.send(command);

      console.log('[Media] Video uploaded successfully:', fileName);

      res.status(201).json({
        message: "Video uploaded successfully",
        s3Key: fileName,
        url: `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`,
      });
    } catch (error) {
      console.error('[Media] Error uploading video:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        message: "Failed to upload video",
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      });
    }
  }
);

// Upload image (admin only)
router.post(
  "/upload/image",
  authenticate,
  requireAdmin,
  upload.single("image"),
  handleMulterError,
  async (req: AuthRequest, res: Response) => {
    try {
      console.log('[Media] Image upload request from user:', req.userId);
      
      if (!BUCKET_NAME || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
        console.error('[Media] AWS credentials not configured');
        return res.status(500).json({ 
          message: "Server configuration error: AWS credentials not set",
          details: "Please contact the administrator"
        });
      }
      
      if (!req.file) {
        console.log('[Media] No file in request');
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log('[Media] File details:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      const { folder = "images" } = req.body;
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}_${req.file.originalname}`;

      console.log('[Media] Uploading to S3:', fileName);

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3Client.send(command);

      console.log('[Media] Image uploaded successfully:', fileName);

      // Generate public URL
      const publicUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;

      res.status(201).json({
        message: "Image uploaded successfully",
        s3Key: fileName,
        url: publicUrl,
      });
    } catch (error) {
      console.error('[Media] Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        message: "Failed to upload image",
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      });
    }
  }
);

// Delete media (admin only)
router.delete("/delete", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.body;

    if (!key || typeof key !== "string") {
      return res.status(400).json({ message: "S3 key is required" });
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ message: "Failed to delete media" });
  }
});

export default router;
