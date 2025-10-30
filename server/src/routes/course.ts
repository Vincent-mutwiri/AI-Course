import { Router, Request, Response } from "express";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, level, search } = req.query;
    const filter: any = { isPublished: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.title = { $regex: search, $options: "i" };

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    
    // Calculate actual enrollment counts from Enrollment collection
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.countDocuments({ courseId: course._id });
        console.log(`Course ${course.title} (${course._id}): ${enrollmentCount} enrollments`);
        return {
          ...course.toObject(),
          enrolledCount: enrollmentCount
        };
      })
    );
    
    console.log(`Returning ${coursesWithCounts.length} courses with enrollment counts`);
    res.json({ courses: coursesWithCounts });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    // Calculate actual enrollment count from Enrollment collection
    const enrollmentCount = await Enrollment.countDocuments({ courseId: course._id });
    const courseWithCount = {
      ...course.toObject(),
      enrolledCount: enrollmentCount
    };
    
    res.json({ course: courseWithCount });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ course });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/enroll", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingEnrollment = await Enrollment.findOne({
      userId: req.userId,
      courseId: course._id,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

    const enrollment = await Enrollment.create({
      userId: req.userId,
      courseId: course._id,
      totalLessons,
    });

    // No need to manually increment enrolledCount - it's calculated dynamically from Enrollment collection

    res.status(201).json({ enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
