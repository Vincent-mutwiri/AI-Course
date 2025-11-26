import mongoose, { Document, Schema } from "mongoose";

export interface IPollResponse extends Document {
    userId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    pollId: string; // Unique identifier for the poll (block ID)
    selectedOptions: string[]; // Array of option IDs selected by the user
    submittedAt: Date;
}

const pollResponseSchema = new Schema<IPollResponse>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        pollId: { type: String, required: true },
        selectedOptions: [{ type: String, required: true }],
        submittedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

// Ensure one response per user per poll
pollResponseSchema.index({ userId: 1, courseId: 1, pollId: 1 }, { unique: true });

export default mongoose.model<IPollResponse>("PollResponse", pollResponseSchema);
