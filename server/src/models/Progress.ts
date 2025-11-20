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

interface IInteractionHistory {
  elementType: string;
  timestamp: Date;
  data?: any;
}

export interface IProgress extends Document {
  userId: string;
  courseId: string;
  moduleProgress: IModuleProgress[];
  overallProgress: number;
  lastAccessedAt: Date;
  completedModules: number[];
  interactionHistory: IInteractionHistory[];
  certificateGenerated: boolean;
  certificateDate?: Date;
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

const interactionHistorySchema = new Schema<IInteractionHistory>({
  elementType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  data: { type: Schema.Types.Mixed },
});

const progressSchema = new Schema<IProgress>(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    moduleProgress: [moduleProgressSchema],
    overallProgress: { type: Number, default: 0 },
    lastAccessedAt: { type: Date, default: Date.now },
    completedModules: [{ type: Number, default: [] }],
    interactionHistory: [interactionHistorySchema],
    certificateGenerated: { type: Boolean, default: false },
    certificateDate: { type: Date },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<IProgress>("Progress", progressSchema);
