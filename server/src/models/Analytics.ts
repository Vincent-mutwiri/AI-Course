import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  userId: string;
  courseId: string;
  eventType: 'lesson_complete' | 'quiz_attempt' | 'ai_request' | 'certificate_earned';
  moduleId?: string;
  lessonIndex?: number;
  metadata?: any;
  timestamp: Date;
}

const analyticsSchema = new Schema<IAnalytics>({
  userId: { type: String, required: true, index: true },
  courseId: { type: String, required: true, index: true },
  eventType: { type: String, required: true, index: true },
  moduleId: { type: String },
  lessonIndex: { type: Number },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, index: true }
});

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema);
