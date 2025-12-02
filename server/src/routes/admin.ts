import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import { upload } from "../middleware/upload";
import { uploadToS3 } from "../config/s3";
import Course from "../models/Course";
import Quiz from "../models/Quiz";
import User from "../models/User";
import Enrollment from "../models/Enrollment";
import Page from "../models/Page";
import Progress from "../models/Progress";

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

router.patch("/users/:id/role", async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users/:id/progress", async (req: AuthRequest, res: Response) => {
  try {
    const progress = await Progress.find({ userId: req.params.id });
    const enrollments = await Enrollment.find({ userId: req.params.id }).populate("courseId", "title");
    res.json({ progress, enrollments });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/courses/stats", async (req: AuthRequest, res: Response) => {
  try {
    const courses = await Course.find().select("title category isPublished enrolledCount");
    const stats = await Promise.all(courses.map(async (course) => {
      const enrollments = await Enrollment.find({ courseId: course._id });
      const avgCompletion = enrollments.length > 0
        ? enrollments.reduce((acc, curr) => acc + curr.progressPercentage, 0) / enrollments.length
        : 0;
      return {
        ...course.toObject(),
        enrolledCount: enrollments.length, // Ensure accurate count
        avgCompletion: Math.round(avgCompletion),
      };
    }));
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Page Management Routes
router.get("/pages", async (req: AuthRequest, res: Response) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json({ pages });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/pages", async (req: AuthRequest, res: Response) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json({ page });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/pages/:id", async (req: AuthRequest, res: Response) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json({ page });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/pages/:id", async (req: AuthRequest, res: Response) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ message: "Page deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Page Block Management Routes

// Get page for editing (with blocks)
router.get("/pages/:id/edit", async (req: AuthRequest, res: Response) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json({ page });
  } catch (error) {
    console.error("[Admin] Error fetching page for edit:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Validate slug uniqueness
router.get("/pages/validate-slug", async (req: AuthRequest, res: Response) => {
  try {
    const { slug, excludeId } = req.query;

    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const query: any = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existingPage = await Page.findOne(query);
    const isUnique = !existingPage;

    res.json({ isUnique });
  } catch (error) {
    console.error("[Admin] Error validating slug:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Save page blocks
router.put("/pages/:id/blocks", async (req: AuthRequest, res: Response) => {
  try {
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

    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Update page content with new blocks
    page.content.blocks = blocks;
    await page.save();

    res.json({ page });
  } catch (error) {
    console.error("[Admin] Error saving page blocks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reorder page blocks
router.patch("/pages/:id/blocks/reorder", async (req: AuthRequest, res: Response) => {
  try {
    const { blockIds } = req.body;

    // Validate blockIds array
    if (!Array.isArray(blockIds)) {
      return res.status(400).json({ message: "blockIds must be an array" });
    }

    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (!page.content.blocks || page.content.blocks.length === 0) {
      return res.status(400).json({ message: "Page has no blocks to reorder" });
    }

    // Validate all blockIds exist
    const existingBlockIds = page.content.blocks.map((b: any) => b.id);
    const allIdsValid = blockIds.every((id: string) => existingBlockIds.includes(id));

    if (!allIdsValid || blockIds.length !== existingBlockIds.length) {
      return res.status(400).json({ message: "Invalid blockIds provided" });
    }

    // Reorder blocks based on blockIds array
    const reorderedBlocks = blockIds.map((id: string, index: number) => {
      const block = page.content.blocks.find((b: any) => b.id === id);
      return {
        ...block.toObject(),
        order: index
      };
    });

    page.content.blocks = reorderedBlocks;
    await page.save();

    res.json({ blocks: page.content.blocks });
  } catch (error) {
    console.error("[Admin] Error reordering page blocks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Duplicate page block
router.post("/pages/:id/blocks/:blockId/duplicate", async (req: AuthRequest, res: Response) => {
  try {
    const { id, blockId } = req.params;

    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (!page.content.blocks || page.content.blocks.length === 0) {
      return res.status(404).json({ message: "Page has no blocks" });
    }

    // Find the block to duplicate
    const blockIndex = page.content.blocks.findIndex((b: any) => b.id === blockId);
    if (blockIndex === -1) {
      return res.status(404).json({ message: "Block not found" });
    }

    const originalBlock = page.content.blocks[blockIndex];

    // Create duplicated block with new unique ID
    const duplicatedBlock = {
      ...originalBlock.toObject(),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert duplicated block after original
    page.content.blocks.splice(blockIndex + 1, 0, duplicatedBlock as any);

    // Update order for all blocks after insertion
    page.content.blocks = page.content.blocks.map((block: any, index: number) => ({
      ...block,
      order: index
    }));

    await page.save();

    res.json({ block: duplicatedBlock });
  } catch (error) {
    console.error("[Admin] Error duplicating page block:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete page block
router.delete("/pages/:id/blocks/:blockId", async (req: AuthRequest, res: Response) => {
  try {
    const { id, blockId } = req.params;

    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (!page.content.blocks || page.content.blocks.length === 0) {
      return res.status(404).json({ message: "Page has no blocks" });
    }

    // Find the block to delete
    const blockIndex = page.content.blocks.findIndex((b: any) => b.id === blockId);
    if (blockIndex === -1) {
      return res.status(404).json({ message: "Block not found" });
    }

    // Remove block from blocks array
    page.content.blocks.splice(blockIndex, 1);

    // Update order values for remaining blocks
    page.content.blocks = page.content.blocks.map((block: any, index: number) => ({
      ...block,
      order: index
    }));

    await page.save();

    res.json({ message: "Block deleted successfully" });
  } catch (error) {
    console.error("[Admin] Error deleting page block:", error);
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

// Create a new module
router.post("/courses/:courseId/modules", async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Module title is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create new module
    const newModule = {
      title,
      description: description || '',
      order: course.modules.length,
      lessons: []
    };

    course.modules.push(newModule as any);
    await course.save();

    // Get the created module with its ID
    const createdModule = course.modules[course.modules.length - 1];

    res.status(201).json({
      module: {
        _id: (createdModule as any)._id,
        title: createdModule.title,
        description: createdModule.description,
        order: createdModule.order,
        lessons: createdModule.lessons
      }
    });
  } catch (error) {
    console.error("[Admin] Error creating module:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new lesson in a module
router.post("/courses/:courseId/modules/:moduleId/lessons", async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, moduleId } = req.params;
    const { title, duration } = req.body;

    console.log('[Admin] Creating lesson:', { courseId, moduleId, title, duration });

    if (!title) {
      return res.status(400).json({ message: "Lesson title is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      console.log('[Admin] Course not found:', courseId);
      return res.status(404).json({ message: "Course not found" });
    }

    console.log('[Admin] Found course, modules:', course.modules.length);

    const module = course.modules.find((m: any) => m._id.toString() === moduleId);
    if (!module) {
      console.log('[Admin] Module not found:', moduleId);
      console.log('[Admin] Available modules:', course.modules.map((m: any) => m._id.toString()));
      return res.status(404).json({ message: "Module not found" });
    }

    console.log('[Admin] Found module:', module.title);

    // Create new lesson with all required fields
    const newLesson = {
      title,
      description: '', // Default empty description
      duration: duration || 15,
      order: module.lessons.length, // Set order based on current lesson count
      blocks: []
    };

    console.log('[Admin] Pushing new lesson to module');
    module.lessons.push(newLesson as any);

    console.log('[Admin] Saving course');
    await course.save();

    // Get the created lesson with its ID
    const createdLesson = module.lessons[module.lessons.length - 1];

    res.status(201).json({
      lesson: {
        _id: (createdLesson as any)._id,
        title: createdLesson.title,
        duration: createdLesson.duration,
        blocks: createdLesson.blocks
      }
    });
  } catch (error) {
    console.error("[Admin] Error creating lesson:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update module
router.put("/courses/:courseId/modules/:moduleId", async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, moduleId } = req.params;
    const { title, description } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const module = course.modules.find((m: any) => m._id.toString() === moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    if (title) module.title = title;
    if (description !== undefined) module.description = description;

    await course.save();

    res.json({
      module: {
        _id: (module as any)._id,
        title: module.title,
        description: module.description,
        order: module.order,
        lessons: module.lessons
      }
    });
  } catch (error) {
    console.error("[Admin] Error updating module:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update lesson
router.put("/courses/:courseId/modules/:moduleId/lessons/:lessonId", async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;
    const { title, duration } = req.body;

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

    if (title) lesson.title = title;
    if (duration !== undefined) lesson.duration = duration;

    await course.save();

    res.json({
      lesson: {
        _id: (lesson as any)._id,
        title: lesson.title,
        duration: lesson.duration,
        blocks: lesson.blocks
      }
    });
  } catch (error) {
    console.error("[Admin] Error updating lesson:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete module
router.delete("/courses/:courseId/modules/:moduleId", async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, moduleId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const moduleIndex = course.modules.findIndex((m: any) => m._id.toString() === moduleId);
    if (moduleIndex === -1) {
      return res.status(404).json({ message: "Module not found" });
    }

    course.modules.splice(moduleIndex, 1);

    // Reorder remaining modules
    course.modules.forEach((m: any, index: number) => {
      m.order = index;
    });

    await course.save();

    res.json({ message: "Module deleted successfully" });
  } catch (error) {
    console.error("[Admin] Error deleting module:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete lesson
router.delete("/courses/:courseId/modules/:moduleId/lessons/:lessonId", async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const module = course.modules.find((m: any) => m._id.toString() === moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const lessonIndex = module.lessons.findIndex((l: any) => l._id.toString() === lessonId);
    if (lessonIndex === -1) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    module.lessons.splice(lessonIndex, 1);
    await course.save();

    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("[Admin] Error deleting lesson:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
