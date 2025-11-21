import mongoose, { Document, Schema } from "mongoose";

// Interactive Element Type Enum
export type InteractiveElementType =
  | 'reflection'
  | 'playerTypeSimulator'
  | 'rewardScheduleDesigner'
  | 'flowChannelEvaluator'
  | 'pitchAnalysisGenerator'
  | 'narrativeGenerator'
  | 'darkPatternRedesigner'
  | 'roeDashboard'
  | 'certificateGenerator'
  | 'poll'
  | 'designFixer'
  | 'wordCloud'
  | 'aiGenerator'
  | 'choiceComparison'
  | 'journeyTimeline'
  | 'finalAssessment';

// Interactive Element Interface
export interface IInteractiveElement {
  type: InteractiveElementType;
  promptTemplate?: string;
  config?: any;
  question?: string;
  options?: any;
  badSlideUrl?: string;
  prompt?: string;
  title?: string;
  generatorType?: string;
  simulatedResult?: any;
  goodSlideUrl?: string;
  placeholder?: string;
  description?: string;
  explanation?: string;
  passingScore?: number;
  hotspots?: any;
  minLength?: number;
  dataKey?: string;
  buttonText?: string;
  totalQuestions?: number;
  inputLabel?: string;
  quizDataKey?: string;
}

interface ILesson {
  title: string;
  description: string;
  videoUrl?: string;
  duration: number;
  order: number;
  objective?: string;
  content?: any;
  interactive?: any;
  interactiveElements?: IInteractiveElement[];
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
  interactiveElements: [{
    type: {
      type: String,
      enum: [
        'reflection',
        'playerTypeSimulator',
        'rewardScheduleDesigner',
        'flowChannelEvaluator',
        'pitchAnalysisGenerator',
        'narrativeGenerator',
        'darkPatternRedesigner',
        'roeDashboard',
        'certificateGenerator',
        'poll',
        'designFixer',
        'wordCloud',
        'aiGenerator',
        'choiceComparison',
        'journeyTimeline',
        'finalAssessment'
      ],
      required: true
    },
    promptTemplate: { type: String },
    config: { type: Schema.Types.Mixed },
    question: { type: String },
    options: { type: Schema.Types.Mixed },
    badSlideUrl: { type: String },
    prompt: { type: String },
    title: { type: String },
    generatorType: { type: String },
    simulatedResult: { type: Schema.Types.Mixed },
    goodSlideUrl: { type: String },
    placeholder: { type: String },
    description: { type: String },
    explanation: { type: String },
    passingScore: { type: Number },
    hotspots: { type: Schema.Types.Mixed },
    minLength: { type: Number },
    dataKey: { type: String },
    buttonText: { type: String },
    totalQuestions: { type: Number },
    inputLabel: { type: String },
    quizDataKey: { type: String }
  }],
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
