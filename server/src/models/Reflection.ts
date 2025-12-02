import mongoose, { Document, Schema } from 'mongoose';

export interface IReflection extends Document {
    userId: mongoose.Types.ObjectId;
    courseId: string;
    moduleId: string;
    question: string;
    answer: string;
    isPublic: boolean;
    createdAt: Date;
}

const ReflectionSchema = new Schema<IReflection>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: String, required: true },
    moduleId: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Index for efficient querying by question
ReflectionSchema.index({ question: 1, createdAt: -1 });

export default mongoose.model<IReflection>('Reflection', ReflectionSchema);
