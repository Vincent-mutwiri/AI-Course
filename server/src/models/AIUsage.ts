import mongoose, { Document, Schema } from "mongoose";

export interface IAIUsage extends Document {
    userId: mongoose.Types.ObjectId;
    courseId?: string;
    blockType: string;
    generationType: 'generate' | 'refine' | 'outline';
    promptLength: number;
    responseLength: number;
    tokensUsed?: number;
    cached: boolean;
    timestamp: Date;
}

const aiUsageSchema = new Schema<IAIUsage>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        courseId: { type: String, index: true },
        blockType: { type: String, required: true },
        generationType: {
            type: String,
            enum: ['generate', 'refine', 'outline'],
            required: true
        },
        promptLength: { type: Number, required: true },
        responseLength: { type: Number, required: true },
        tokensUsed: { type: Number },
        cached: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now, index: true }
    },
    { timestamps: true }
);

// Compound indexes for efficient querying
aiUsageSchema.index({ userId: 1, timestamp: -1 });
aiUsageSchema.index({ courseId: 1, timestamp: -1 });
aiUsageSchema.index({ userId: 1, courseId: 1, timestamp: -1 });

export default mongoose.model<IAIUsage>("AIUsage", aiUsageSchema);
