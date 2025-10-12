import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
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

export default router;
