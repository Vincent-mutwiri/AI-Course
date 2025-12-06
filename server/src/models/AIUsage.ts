import mongoose, { Document, Schema } from 'mongoose';

export interface IAIUsage extends Document {
    userId: string;
    courseId: string;
    blockType: string;
    generationType: 'generate' | 'refine' | 'outline' | 'alt-text';
    promptLength: number;
    responseLength: number;
    tokensUsed?: number;
    cached: boolean;
    timestamp: Date;
}

const aiUsageSchema = new Schema<IAIUsage>({
    userId: { type: String, required: true, index: true },
    courseId: { type: String, required: true, index: true },
    blockType: { type: String, required: true },
    generationType: {
        type: String,
        enum: ['generate', 'refine', 'outline', 'alt-text'],
        required: true
    },
    promptLength: { type: Number, required: true },
    responseLength: { type: Number, required: true },
    tokensUsed: { type: Number },
    cached: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now, index: true }
});

// Compound index for efficient querying by user and course over time
aiUsageSchema.index({ userId: 1, courseId: 1, timestamp: -1 });

// Index for querying by course and timestamp
aiUsageSchema.index({ courseId: 1, timestamp: -1 });

export default mongoose.model<IAIUsage>('AIUsage', aiUsageSchema);
