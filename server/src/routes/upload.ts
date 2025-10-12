import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { uploadToS3, deleteFromS3, getSignedUrlForUpload } from "../config/s3";

const router = Router();

router.post("/image", authenticate, upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = await uploadToS3(req.file, "images");
    res.json({ fileUrl });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
});

router.post("/video", authenticate, upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = await uploadToS3(req.file, "videos");
    res.json({ fileUrl });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
});

router.post("/document", authenticate, upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = await uploadToS3(req.file, "documents");
    res.json({ fileUrl });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
});

router.post("/signed-url", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { fileName, fileType, folder } = req.body;

    if (!fileName || !fileType || !folder) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { signedUrl, fileUrl } = await getSignedUrlForUpload(fileName, fileType, folder);
    res.json({ signedUrl, fileUrl });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate signed URL" });
  }
});

router.delete("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: "File URL required" });
    }

    await deleteFromS3(fileUrl);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
