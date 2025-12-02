export type BlockType =
    | 'text' | 'video' | 'image' | 'code' | 'list' | 'divider'
    | 'reflection' | 'poll' | 'wordCloud' | 'aiGenerator'
    | 'choiceComparison' | 'certificateGenerator' | 'finalAssessment'
    | 'playerTypeSimulator' | 'rewardScheduleDesigner' | 'flowChannelEvaluator'
    | 'pitchAnalysisGenerator' | 'narrativeGenerator' | 'darkPatternRedesigner'
    | 'roeDashboard' | 'designFixer' | 'journeyTimeline' | 'simulation'
    | 'aiJourney' | 'buildABot' | 'conceptMap' | 'dataDashboard'
    | 'ethicalDilemmaSolver' | 'gamificationConceptMap' | 'identifyPersonalization'
    | 'playerTypeAnalyzer' | 'presentationCoach' | 'sentenceBuilder' | 'visualTokens';

export interface IBlockContent {
    // Content block fields
    text?: string;
    videoUrl?: string;
    videoSource?: 'upload' | 'embed';
    videoProvider?: 'youtube' | 'vimeo' | 's3';
    imageUrl?: string;
    caption?: string;
    altText?: string;
    code?: string;
    language?: string;
    items?: Array<{
        text: string;
        checked?: boolean;
    }>;
    listType?: 'bullet' | 'numbered' | 'checkbox';

    // Interactive block fields
    config?: any;
    question?: string;
    options?: any;
    prompt?: string;
    title?: string;
    description?: string;
    meta?: Record<string, any>;
    generatorType?: string;
    badSlideUrl?: string;
    goodSlideUrl?: string;
    explanation?: string;
}

export interface IBlock {
    id: string;
    type: BlockType;
    order: number;
    content: IBlockContent;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IPageContent {
    blocks: IBlock[];
    version: string;
}

export interface IPage {
    _id?: string;
    title: string;
    slug: string;
    content: IPageContent;
    isPublished: boolean;
    type: 'blog' | 'page' | 'home';
    createdAt?: Date;
    updatedAt?: Date;
}

// Alias for backward compatibility
export type BlockContent = IBlockContent;
