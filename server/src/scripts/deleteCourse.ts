import mongoose from "mongoose";
import Course from "../models/Course";
import { MONGODB_URI } from "../config/env";

async function deleteCourse() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    const result = await Course.deleteOne({ 
      instructor: "Manus AI"
    });

    if (result.deletedCount > 0) {
      console.log("✅ Course deleted successfully!");
    } else {
      console.log("❌ Course not found");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    process.exit(1);
  }
}

deleteCourse();
