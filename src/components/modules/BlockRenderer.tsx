import { lazy, Suspense, useEffect, useRef } from 'react';
import { InteractiveElementRouter } from '@/components/interactive/InteractiveElementRouter';
import { Skeleton } from '@/components/ui/skeleton';
import { Check } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Lazy load video player for performance
const VideoPlayer = lazy(() => import('@/components/shared/VideoPlayer').then(m => ({ default: m.VideoPlayer })));

// Code block component with syntax highlighting
const CodeBlock = ({ code, language }: { code: string; language: string }) => {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [code, language]);

    return (
        <div className="relative">
            {language && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-slate-700 text-white text-xs rounded z-10">
                    {language}
                </div>
            )}
            <pre className="rounded-lg">
                <code ref={codeRef} className={`language-${language}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
};

interface Block {
    id: string;
    type: string;
    order: number;
    content: {
        text?: string;
        videoUrl?: string;
        videoSource?: 'upload' | 'embed';
        videoProvider?: 'youtube' | 'vimeo' | 's3';
        imageUrl?: string;
        caption?: string;
        altText?: string;
        code?: string;
        language?: string;
        items?: Array<{ text: string; checked?: boolean }>;
        listType?: 'bullet' | 'numbered' | 'checkbox';
        config?: any;
        question?: string;
        options?: any;
        prompt?: string;
        title?: string;
        description?: string;
        meta?: Record<string, any>;
    };
}

interface BlockRendererProps {
    blocks: Block[];
    userName?: string;
    courseTitle?: string;
    courseId?: string;
    moduleId?: string;
    lessonIndex?: number;
}

export const BlockRenderer = ({ blocks, userName, courseTitle, courseId, moduleId, lessonIndex }: BlockRendererProps) => {
    const renderBlock = (block: Block) => {
        const { type, content } = block;

        switch (type) {
            case 'text':
                return (
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: content.text || '' }}
                    />
                );

            case 'video':
                if (content.videoSource === 'embed' && content.videoUrl) {
                    // Handle YouTube and Vimeo embeds
                    const getEmbedUrl = (url: string, provider?: string) => {
                        if (provider === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
                            const videoId = url.includes('youtu.be')
                                ? url.split('youtu.be/')[1]?.split('?')[0]
                                : url.split('v=')[1]?.split('&')[0];
                            return `https://www.youtube.com/embed/${videoId}`;
                        }
                        if (provider === 'vimeo' || url.includes('vimeo.com')) {
                            const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
                            return `https://player.vimeo.com/video/${videoId}`;
                        }
                        return url;
                    };

                    const embedUrl = getEmbedUrl(content.videoUrl, content.videoProvider);

                    return (
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                src={embedUrl}
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Video content"
                            />
                        </div>
                    );
                } else if (content.videoSource === 'upload' && content.videoUrl) {
                    // Handle S3 uploaded videos
                    return (
                        <Suspense fallback={<Skeleton className="w-full h-64" />}>
                            <VideoPlayer
                                s3Key={content.videoUrl}
                                title={content.title || 'Lesson Video'}
                                courseId={courseId}
                                moduleId={moduleId}
                                lessonId={lessonIndex?.toString()}
                            />
                        </Suspense>
                    );
                }
                return null;

            case 'image':
                return (
                    <figure className="space-y-2">
                        <img
                            src={content.imageUrl}
                            alt={content.altText || 'Image'}
                            className="w-full rounded-lg shadow-md"
                        />
                        {content.caption && (
                            <figcaption className="text-sm text-muted-foreground text-center">
                                {content.caption}
                            </figcaption>
                        )}
                    </figure>
                );

            case 'code':
                return <CodeBlock code={content.code || ''} language={content.language || 'javascript'} />;

            case 'list':
                const ListTag = content.listType === 'numbered' ? 'ol' : 'ul';
                const listClassName = content.listType === 'numbered'
                    ? 'list-decimal list-inside space-y-2'
                    : content.listType === 'checkbox'
                        ? 'space-y-2'
                        : 'list-disc list-inside space-y-2';

                return (
                    <ListTag className={listClassName}>
                        {content.items?.map((item, idx) => (
                            content.listType === 'checkbox' ? (
                                <li key={idx} className="flex items-start gap-2">
                                    <div className={`mt-1 flex-shrink-0 w-4 h-4 border rounded ${item.checked ? 'bg-primary border-primary' : 'border-muted-foreground'
                                        } flex items-center justify-center`}>
                                        {item.checked && <Check className="w-3 h-3 text-primary-foreground" />}
                                    </div>
                                    <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                                        {item.text}
                                    </span>
                                </li>
                            ) : (
                                <li key={idx}>{item.text}</li>
                            )
                        ))}
                    </ListTag>
                );

            case 'divider':
                return <hr className="my-8 border-t-2 border-muted" />;

            // Interactive block types - map to existing interactive components
            case 'reflection':
            case 'poll':
            case 'wordCloud':
            case 'aiGenerator':
            case 'choiceComparison':
            case 'designFixer':
            case 'playerTypeSimulator':
            case 'rewardScheduleDesigner':
            case 'flowChannelEvaluator':
            case 'pitchAnalysisGenerator':
            case 'narrativeGenerator':
            case 'darkPatternRedesigner':
            case 'roeDashboard':
            case 'journeyTimeline':
            case 'certificateGenerator':
            case 'finalAssessment':
                // Convert block to interactive element format
                const interactiveElement = {
                    type: type,
                    ...content,
                    config: content.config,
                };
                return <InteractiveElementRouter element={interactiveElement} userName={userName} courseTitle={courseTitle} courseId={courseId} />;

            default:
                console.warn('Unknown block type:', type);
                return (
                    <div className="p-4 border border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                        <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
                            Unknown block type: {type}
                        </p>
                    </div>
                );
        }
    };

    // Sort blocks by order
    const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-6">
            {sortedBlocks.map((block) => (
                <div key={block.id} className="block-container">
                    {renderBlock(block)}
                </div>
            ))}
        </div>
    );
};
