import mongoose, { Document, Schema } from "mongoose";

interface ILesson {
  title: string;
  description: string;
  videoUrl?: string;
  duration: number;
  order: number;
  objective?: string;
  content?: any;
  interactive?: any;
  quiz?: any;
  codeSnippet?: any;
}

interface IModule {
  title: string;
  description: string;
  lessons: ILesson[];
  order: number;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: string;
  thumbnail?: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  modules: IModule[];
  totalDuration: number;
  enrolledCount: number;
  isPublished: boolean;
}

const lessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: Number, required: true },
  order: { type: Number, required: true },
  objective: { type: String },
  content: { type: Schema.Types.Mixed },
  interactive: { type: Schema.Types.Mixed },
  quiz: { type: Schema.Types.Mixed },
  codeSnippet: { type: Schema.Types.Mixed },
});

const moduleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  lessons: [lessonSchema],
  order: { type: Number, required: true },
});

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    thumbnail: { type: String },
    category: { type: String, required: true },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
    modules: [moduleSchema],
    totalDuration: { type: Number, default: 0 },
    enrolledCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>("Course", courseSchema);
