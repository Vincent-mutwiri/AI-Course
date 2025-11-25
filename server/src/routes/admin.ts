import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import { upload } from "../middleware/upload";
import { uploadToS3 } from "../config/s3";
import Course from "../models/Course";
import Quiz from "../models/Quiz";
import User from "../models/User";
import Enrollment from "../models/Enrollment";

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get("/stats", async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });

    res.json({
      stats: {
        totalUsers,
        totalCourses,
        publishedCourses,
        totalEnrollments,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/courses", async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ course });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/courses/:id", async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/courses/:id", async (req: AuthRequest, res: Response) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/quizzes", async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ quiz });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/quizzes/:id", async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/quizzes/:id", async (req: AuthRequest, res: Response) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Course Builder API Routes

// Get course for editing in builder
router.get("/courses/:id/edit", async (req: AuthRequest, res: Response) => {
  try {
    // Selective field loading for better performance
    // Only load fields needed for the course builder interface
    const course = await Course.findById(req.params.id)
      .select("title modules.title modules.description modules.order modules.lessons.title modules.lessons.duration modules.lessons.blocks modules._id modules.lessons._id")
      .lean(); // Use lean() for better performance when we don't need Mongoose document methods

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ course });
  } catch (error) {
    console.error("[Admin] Error fetching course for edit:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Save lesson blocks
router.put("/courses/:courseId/modules/:moduleId/lessons/:lessonId/blocks", async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;
    const { blocks } = req.body;

    // Validate blocks array
    if (!Array.isArray(blocks)) {
      return res.status(400).json({ message: "Blocks must be an array" });
    }

    // Validate each block has required fields
    for (const block of blocks) {
      if (!block.id || !block.type || block.order === undefined) {
        return res.status(400).json({
          message: "Each block must have id, type, and order fields"
        });
      }
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const module = course.modules.find((m: any) => m._id.toString() === moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const lesson = module.lessons.find((l: any) => l._id.toString() === lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Update blocks
    lesson.blocks = blocks;
    await course.save();

    res.json({
      lesson: {
        _id: (lesson as any)._id,
        title: lesson.title,
        blocks: lesson.blocks
      }
    });
  } catch (error) {
    console.error("[Admin] Error saving lesson blocks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload media files
router.post("/upload", upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Validate file type
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const allowedVideoTypes = ["video/mp4", "video/webm"];
    const isImage = allowedImageTypes.includes(req.file.mimetype);
    const isVideo = allowedVideoTypes.includes(req.file.mimetype);

    if (!isImage && !isVideo) {
      return res.status(400).json({
        message: "Invalid file type. Only images (JPEG, PNG, GIF) and videos (MP4, WebM) are allowed"
      });
    }

    // Validate file size
    const maxImageSize = 5 * 1024 * 1024; // 5MB
    const maxVideoSize = 100 * 1024 * 1024; // 100MB

    if (isImage && req.file.size > maxImageSize) {
      return res.status(400).json({
        message: "Image file size exceeds 5MB limit"
      });
    }

    if (isVideo && req.file.size > maxVideoSize) {
      return res.status(400).json({
        message: "Video file size exceeds 100MB limit"
      });
    }

    // Determine folder based on file type
    const folder = isImage ? "course-images" : "course-videos";

    // Upload to S3
    const fileUrl = await uploadToS3(req.file, folder);

    res.json({
      url: fileUrl,
      metadata: {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        type: isImage ? "image" : "video"
      }
    });
  } catch (error) {
    console.error("[Admin] Error uploading file:", error);
    res.status(500).json({ message: "Server error during file upload" });
  }
});

// Reorder blocks
router.patch("/courses/:courseId/lessons/:lessonId/blocks/reorder", async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, lessonId } = req.params;
    const { blockIds } = req.body;

    // Validate blockIds array
    if (!Array.isArray(blockIds)) {
      return res.status(400).json({ message: "blockIds must be an array" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find the lesson across all modules
    let targetLesson: any = null;
    for (const module of course.modules) {
      const lesson = module.lessons.find((l: any) => l._id.toString() === lessonId);
      if (lesson) {
        targetLesson = lesson;
        break;
      }
    }

    if (!targetLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (!targetLesson.blocks || targetLesson.blocks.length === 0) {
      return res.status(400).json({ message: "Lesson has no blocks to reorder" });
    }

    // Validate all blockIds exist
    const existingBlockIds = targetLesson.blocks.map((b: any) => b.id);
    const allIdsValid = blockIds.every((id: string) => existingBlockIds.includes(id));

    if (!allIdsValid || blockIds.length !== existingBlockIds.length) {
      return res.status(400).json({ message: "Invalid blockIds provided" });
    }

    // Reorder blocks based on blockIds array
    const reorderedBlocks = blockIds.map((id: string, index: number) => {
      const block = targetLesson.blocks.find((b: any) => b.id === id);
      return {
        ...block.toObject(),
        order: index
      };
    });

    targetLesson.blocks = reorderedBlocks;
    await course.save();

    res.json({ blocks: targetLesson.blocks });
  } catch (error) {
    console.error("[Admin] Error reordering blocks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Duplicate block
router.post("/courses/:courseId/lessons/:lessonId/blocks/:blockId/duplicate", async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, lessonId, blockId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find the lesson across all modules
    let targetLesson: any = null;
    for (const module of course.modules) {
      const lesson = module.lessons.find((l: any) => l._id.toString() === lessonId);
      if (lesson) {
        targetLesson = lesson;
        break;
      }
    }

    if (!targetLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (!targetLesson.blocks || targetLesson.blocks.length === 0) {
      return res.status(404).json({ message: "Lesson has no blocks" });
    }

    // Find the block to duplicate
    const blockIndex = targetLesson.blocks.findIndex((b: any) => b.id === blockId);
    if (blockIndex === -1) {
      return res.status(404).json({ message: "Block not found" });
    }

    const originalBlock = targetLesson.blocks[blockIndex];

    // Create duplicated block with new UUID
    const duplicatedBlock = {
      ...originalBlock.toObject(),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert duplicated block after original
    targetLesson.blocks.splice(blockIndex + 1, 0, duplicatedBlock);

    // Update order for all blocks after insertion
    targetLesson.blocks = targetLesson.blocks.map((block: any, index: number) => ({
      ...block,
      order: index
    }));

    await course.save();

    res.json({ block: duplicatedBlock });
  } catch (error) {
    console.error("[Admin] Error duplicating block:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
