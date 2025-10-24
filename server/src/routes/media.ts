import { Router, Response } from "express";
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import multer from "multer";

const router = Router();

// Validate AWS credentials
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !BUCKET_NAME) {
  console.error('[Media] AWS credentials not configured properly:');
  console.error('[Media] - AWS_ACCESS_KEY_ID:', AWS_ACCESS_KEY_ID ? 'Set' : 'Missing');
  console.error('[Media] - AWS_SECRET_ACCESS_KEY:', AWS_SECRET_ACCESS_KEY ? 'Set' : 'Missing');
  console.error('[Media] - AWS_S3_BUCKET_NAME:', BUCKET_NAME || 'Missing');
  console.error('[Media] - AWS_REGION:', AWS_REGION);
}

// Configure S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
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
        url: `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
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
      const publicUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

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
