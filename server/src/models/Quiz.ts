import mongoose, { Document, Schema } from "mongoose";

interface IOption {
  text: string;
  isCorrect: boolean;
}

interface IQuestion {
  question: string;
  options: IOption[];
  explanation?: string;
}

export interface IQuiz extends Document {
  courseId: mongoose.Types.ObjectId;
  lessonId: string;
  title: string;
  questions: IQuestion[];
  passingScore: number;
}

const optionSchema = new Schema<IOption>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const questionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: [optionSchema],
  explanation: { type: String },
});

const quizSchema = new Schema<IQuiz>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: String, required: true },
    title: { type: String, required: true },
    questions: [questionSchema],
    passingScore: { type: Number, default: 70 },
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", quizSchema);
