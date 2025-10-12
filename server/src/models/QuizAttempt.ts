import mongoose, { Document, Schema } from "mongoose";

interface IAnswer {
  questionIndex: number;
  selectedOption: number;
  isCorrect: boolean;
}

export interface IQuizAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  passed: boolean;
  completedAt: Date;
}

const answerSchema = new Schema<IAnswer>({
  questionIndex: { type: Number, required: true },
  selectedOption: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
});

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [answerSchema],
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IQuizAttempt>("QuizAttempt", quizAttemptSchema);
