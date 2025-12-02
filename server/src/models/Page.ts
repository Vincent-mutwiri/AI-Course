import mongoose, { Document, Schema } from "mongoose";
import { IBlock, BlockType } from "./Course";

export interface IPageContent {
    blocks: IBlock[];
    version: string;
}

export interface IPage extends Document {
    title: string;
    slug: string;
    content: IPageContent;
    isPublished: boolean;
    type: 'blog' | 'page' | 'home';
    createdAt: Date;
    updatedAt: Date;
}

const blockSchema = new Schema<IBlock>({
    id: { type: String, required: true },
    type: {
        type: String,
        enum: [
            'text', 'video', 'image', 'code', 'list', 'divider',
            'reflection', 'poll', 'wordCloud', 'aiGenerator',
            'choiceComparison', 'certificateGenerator', 'finalAssessment',
            'playerTypeSimulator', 'rewardScheduleDesigner', 'flowChannelEvaluator',
            'pitchAnalysisGenerator', 'narrativeGenerator', 'darkPatternRedesigner',
            'roeDashboard', 'designFixer', 'journeyTimeline', 'simulation',
            'aiJourney', 'buildABot', 'conceptMap', 'dataDashboard',
            'ethicalDilemmaSolver', 'gamificationConceptMap', 'identifyPersonalization',
            'playerTypeAnalyzer', 'presentationCoach', 'sentenceBuilder', 'visualTokens'
        ],
        required: true
    },
    order: { type: Number, required: true },
    content: {
        text: { type: String },
        videoUrl: { type: String },
        videoSource: { type: String, enum: ['upload', 'embed'] },
        videoProvider: { type: String, enum: ['youtube', 'vimeo', 's3'] },
        imageUrl: { type: String },
        caption: { type: String },
        altText: { type: String },
        code: { type: String },
        language: { type: String },
        items: [{
            text: { type: String },
            checked: { type: Boolean }
        }],
        listType: { type: String, enum: ['bullet', 'numbered', 'checkbox'] },
        words: [{
            text: { type: String },
            value: { type: Number }
        }],
        choices: [{
            label: { type: String },
            description: { type: String }
        }],
        mappings: { type: Schema.Types.Mixed },
        config: { type: Schema.Types.Mixed },
        question: { type: String },
        options: { type: Schema.Types.Mixed },
        prompt: { type: String },
        title: { type: String },
        description: { type: String },
        meta: { type: Schema.Types.Mixed }
    }
}, { timestamps: true });

const pageContentSchema = new Schema<IPageContent>({
    blocks: [blockSchema],
    version: { type: String, required: true, default: '1.0' }
}, { _id: false });

const pageSchema = new Schema<IPage>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: pageContentSchema, required: true },
        isPublished: { type: Boolean, default: false },
        type: { type: String, enum: ['blog', 'page', 'home'], default: 'page' },
    },
    { timestamps: true }
);

export default mongoose.model<IPage>("Page", pageSchema);
