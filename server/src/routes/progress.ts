import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import Progress from "../models/Progress";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";

const router = Router();

// Get progress for a course
router.get("/:courseId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    // Check if enrollment exists, create if not (auto-enrollment)
    let enrollment = await Enrollment.findOne({ userId, courseId });

    if (!enrollment) {
      console.log(`[Progress] Auto-enrolling user ${userId} in course ${courseId}`);
      const course = await Course.findById(courseId);

      if (course) {
        const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
        enrollment = await Enrollment.create({
          userId,
          courseId,
          totalLessons,
        });
        console.log(`[Progress] Enrollment created successfully`);
      }
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        moduleProgress: [],
        overallProgress: 0,
      });
      await progress.save();
    }

    res.json({ progress });
  } catch (error: any) {
    console.error('[Progress] Error:', error);
    res.status(500).json({ message: "Failed to get progress", error: error.message });
  }
});

// Update lesson progress
router.post("/:courseId/lesson", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const { moduleId, lessonIndex, completed, quizScore } = req.body;
    const userId = req.userId;

    // Ensure enrollment exists (auto-enrollment)
    let enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      console.log(`[Progress] Auto-enrolling user ${userId} in course ${courseId} (lesson update)`);
      const course = await Course.findById(courseId);
      if (course) {
        const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
        enrollment = await Enrollment.create({
          userId,
          courseId,
          totalLessons,
        });
      }
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({ userId, courseId, moduleProgress: [] });
    }

    let moduleProgress = progress.moduleProgress.find(m => m.moduleId === moduleId);

    if (!moduleProgress) {
      moduleProgress = {
        moduleId,
        currentLesson: lessonIndex,
        completedLessons: [],
        lessons: [],
      };
      progress.moduleProgress.push(moduleProgress);
    }

    let lessonProgress = moduleProgress.lessons.find(l => l.lessonIndex === lessonIndex);

    if (!lessonProgress) {
      lessonProgress = {
        lessonIndex,
        completed: false,
        lastAccessedAt: new Date(),
      };
      moduleProgress.lessons.push(lessonProgress);
    }

    lessonProgress.completed = completed ?? lessonProgress.completed;
    lessonProgress.lastAccessedAt = new Date();

    if (quizScore !== undefined) {
      lessonProgress.quizScore = quizScore;
      lessonProgress.quizAttempts = (lessonProgress.quizAttempts || 0) + 1;
    }

    if (completed && !moduleProgress.completedLessons.includes(lessonIndex)) {
      moduleProgress.completedLessons.push(lessonIndex);
    }

    moduleProgress.currentLesson = lessonIndex;

    // Calculate overall progress
    const course = await Course.findById(courseId);
    if (course) {
      const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      const completedLessons = progress.moduleProgress.reduce(
        (sum, m) => sum + m.completedLessons.length,
        0
      );
      progress.overallProgress = Math.round((completedLessons / totalLessons) * 100);
    }

    progress.lastAccessedAt = new Date();
    await progress.save();

    res.json({ progress });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update progress", error: error.message });
  }
});

// Mark lesson as accessed (for resume functionality)
router.post("/:courseId/access", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const { moduleId, lessonIndex } = req.body;
    const userId = req.userId;

    // Ensure enrollment exists (auto-enrollment)
    let enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      console.log(`[Progress] Auto-enrolling user ${userId} in course ${courseId} (access)`);
      const course = await Course.findById(courseId);
      if (course) {
        const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
        enrollment = await Enrollment.create({
          userId,
          courseId,
          totalLessons,
        });
      }
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({ userId, courseId, moduleProgress: [] });
    }

    let moduleProgress = progress.moduleProgress.find(m => m.moduleId === moduleId);

    if (!moduleProgress) {
      moduleProgress = {
        moduleId,
        currentLesson: lessonIndex,
        completedLessons: [],
        lessons: [],
      };
      progress.moduleProgress.push(moduleProgress);
    }

    moduleProgress.currentLesson = lessonIndex;
    progress.lastAccessedAt = new Date();
    await progress.save();

    res.json({ progress });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update access", error: error.message });
  }
});

// Track interactive element interaction
router.post("/:courseId/interaction", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const { elementType, data } = req.body;
    const userId = req.userId;

    if (!elementType) {
      return res.status(400).json({ message: "elementType is required" });
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        moduleProgress: [],
        interactionHistory: []
      });
    }

    // Add interaction to history
    progress.interactionHistory.push({
      elementType,
      timestamp: new Date(),
      data: data || {}
    });

    progress.lastAccessedAt = new Date();
    await progress.save();

    res.json({
      message: "Interaction tracked successfully",
      progress
    });
  } catch (error: any) {
    console.error('[Progress] Error tracking interaction:', error);
    res.status(500).json({ message: "Failed to track interaction", error: error.message });
  }
});

// Mark module as completed
router.post("/:courseId/module", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const { moduleNumber } = req.body;
    const userId = req.userId;

    if (moduleNumber === undefined) {
      return res.status(400).json({ message: "moduleNumber is required" });
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        moduleProgress: [],
        completedModules: []
      });
    }

    // Add module to completed list if not already there
    if (!progress.completedModules.includes(moduleNumber)) {
      progress.completedModules.push(moduleNumber);
    }

    // Check if all modules are completed
    const course = await Course.findById(courseId);
    if (course) {
      const totalModules = course.modules.length;
      const allModulesCompleted = progress.completedModules.length === totalModules;

      // Update overall progress
      progress.overallProgress = Math.round((progress.completedModules.length / totalModules) * 100);

      progress.lastAccessedAt = new Date();
      await progress.save();

      res.json({
        message: "Module marked as completed",
        progress,
        allModulesCompleted
      });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error: any) {
    console.error('[Progress] Error marking module complete:', error);
    res.status(500).json({ message: "Failed to mark module as completed", error: error.message });
  }
});

// Generate certificate (only if all modules completed)
router.post("/:courseId/certificate", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(400).json({
        message: "No progress found for this course",
        canGenerate: false
      });
    }

    // Check if all modules are completed
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const totalModules = course.modules.length;
    const allModulesCompleted = progress.completedModules.length === totalModules;

    if (!allModulesCompleted) {
      return res.status(403).json({
        message: "Cannot generate certificate. All modules must be completed first.",
        canGenerate: false,
        completedModules: progress.completedModules.length,
        totalModules
      });
    }

    // Mark certificate as generated
    progress.certificateGenerated = true;
    progress.certificateDate = new Date();
    await progress.save();

    res.json({
      message: "Certificate generated successfully",
      canGenerate: true,
      certificateDate: progress.certificateDate,
      progress
    });
  } catch (error: any) {
    console.error('[Progress] Error generating certificate:', error);
    res.status(500).json({ message: "Failed to generate certificate", error: error.message });
  }
});

// Check if user can generate certificate
router.get("/:courseId/certificate/check", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const progress = await Progress.findOne({ userId, courseId });
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!progress) {
      return res.json({
        canGenerate: false,
        completedModules: 0,
        totalModules: course.modules.length,
        certificateGenerated: false
      });
    }

    const totalModules = course.modules.length;
    const allModulesCompleted = progress.completedModules.length === totalModules;

    res.json({
      canGenerate: allModulesCompleted,
      completedModules: progress.completedModules.length,
      totalModules,
      certificateGenerated: progress.certificateGenerated,
      certificateDate: progress.certificateDate
    });
  } catch (error: any) {
    console.error('[Progress] Error checking certificate eligibility:', error);
    res.status(500).json({ message: "Failed to check certificate eligibility", error: error.message });
  }
});

export default router;
