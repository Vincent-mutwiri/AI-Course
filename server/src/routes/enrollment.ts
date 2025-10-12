import { Router, Response } from "express";
import Enrollment from "../models/Enrollment";
import Course from "../models/Course";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/my-courses", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.userId })
      .populate("courseId")
      .sort({ enrolledAt: -1 });
    res.json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:courseId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const enrollment = await Enrollment.findOne({
      userId: req.userId,
      courseId: req.params.courseId,
    }).populate("courseId");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({ enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:courseId/progress", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId, completed } = req.body;

    const enrollment = await Enrollment.findOne({
      userId: req.userId,
      courseId: req.params.courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const lessonProgress = enrollment.progress.find((p) => p.lessonId === lessonId);

    if (lessonProgress) {
      lessonProgress.completed = completed;
      if (completed) lessonProgress.completedAt = new Date();
    } else {
      enrollment.progress.push({
        lessonId,
        completed,
        completedAt: completed ? new Date() : undefined,
      });
    }

    enrollment.completedLessons = enrollment.progress.filter((p) => p.completed).length;
    enrollment.progressPercentage = Math.round(
      (enrollment.completedLessons / enrollment.totalLessons) * 100
    );

    if (enrollment.completedLessons === enrollment.totalLessons) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    res.json({ enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/stats/overview", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.userId });
    const completed = enrollments.filter((e) => e.isCompleted).length;
    const inProgress = enrollments.length - completed;
    const totalProgress = enrollments.reduce((acc, e) => acc + e.progressPercentage, 0);
    const avgProgress = enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;

    res.json({
      stats: {
        totalEnrolled: enrollments.length,
        completed,
        inProgress,
        avgProgress,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
