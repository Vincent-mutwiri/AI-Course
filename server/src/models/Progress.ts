import mongoose, { Document, Schema } from "mongoose";

interface ILessonProgress {
  lessonIndex: number;
  completed: boolean;
  quizScore?: number;
  quizAttempts?: number;
  lastAccessedAt: Date;
}

interface IModuleProgress {
  moduleId: string;
  currentLesson: number;
  completedLessons: number[];
  lessons: ILessonProgress[];
}

export interface IProgress extends Document {
  userId: string;
  courseId: string;
  moduleProgress: IModuleProgress[];
  overallProgress: number;
  lastAccessedAt: Date;
}

const lessonProgressSchema = new Schema<ILessonProgress>({
  lessonIndex: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  quizScore: { type: Number },
  quizAttempts: { type: Number, default: 0 },
  lastAccessedAt: { type: Date, default: Date.now },
});

const moduleProgressSchema = new Schema<IModuleProgress>({
  moduleId: { type: String, required: true },
  currentLesson: { type: Number, default: 0 },
  completedLessons: [{ type: Number }],
  lessons: [lessonProgressSchema],
});

const progressSchema = new Schema<IProgress>(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    moduleProgress: [moduleProgressSchema],
    overallProgress: { type: Number, default: 0 },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<IProgress>("Progress", progressSchema);
