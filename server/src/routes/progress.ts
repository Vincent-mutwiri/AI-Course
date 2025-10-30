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

export default router;
