import mongoose, { Document, Schema } from "mongoose";

interface ILessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
}

export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  progress: ILessonProgress[];
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  enrolledAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
}

const lessonProgressSchema = new Schema<ILessonProgress>({
  lessonId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
});

const enrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    progress: [lessonProgressSchema],
    completedLessons: { type: Number, default: 0 },
    totalLessons: { type: Number, required: true },
    progressPercentage: { type: Number, default: 0 },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);
