import { Router, Response } from "express";
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import multer from "multer";

const router = Router();

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

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
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { folder = "videos" } = req.body;
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}_${req.file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3Client.send(command);

      res.status(201).json({
        message: "Video uploaded successfully",
        s3Key: fileName,
        url: `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ message: "Failed to upload video" });
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
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { folder = "images" } = req.body;
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}_${req.file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3Client.send(command);

      // Generate public URL
      const publicUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

      res.status(201).json({
        message: "Image uploaded successfully",
        s3Key: fileName,
        url: publicUrl,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
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
