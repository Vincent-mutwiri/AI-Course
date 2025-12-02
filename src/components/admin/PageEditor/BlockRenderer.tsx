import React from 'react';
import { IBlock } from '@/types/page';

interface BlockRendererProps {
    block: IBlock;
    isPreview?: boolean;
}

/**
 * BlockRenderer component renders individual blocks for frontend display
 * This component is used in preview mode and will be reused for public page rendering
 */
const BlockRenderer: React.FC<BlockRendererProps> = ({ block, isPreview = false }) => {
    const { type, content } = block;

    switch (type) {
        case 'text':
            return (
                <div className="block-text">
                    {content.text ? (
                        <div dangerouslySetInnerHTML={{ __html: content.text }} />
                    ) : (
                        <p className="empty-block">Empty text block</p>
                    )}
                </div>
            );

        case 'video':
            return (
                <div className="block-video">
                    {content.videoUrl ? (
                        renderVideo(content)
                    ) : (
                        <p className="empty-block">No video URL provided</p>
                    )}
                </div>
            );

        case 'image':
            return (
                <div className="block-image">
                    {content.imageUrl ? (
                        <figure>
                            <img
                                src={content.imageUrl}
                                alt={content.altText || ''}
                                loading="lazy"
                            />
                            {content.caption && <figcaption>{content.caption}</figcaption>}
                        </figure>
                    ) : (
                        <p className="empty-block">No image provided</p>
                    )}
                </div>
            );

        case 'code':
            return (
                <div className="block-code">
                    {content.code ? (
                        <pre>
                            <code className={content.language ? `language-${content.language}` : ''}>
                                {content.code}
                            </code>
                        </pre>
                    ) : (
                        <p className="empty-block">Empty code block</p>
                    )}
                </div>
            );

        case 'list':
            return (
                <div className="block-list">
                    {content.items && content.items.length > 0 ? (
                        renderList(content)
                    ) : (
                        <p className="empty-block">Empty list</p>
                    )}
                </div>
            );

        case 'divider':
            return <hr className="block-divider" />;

        case 'reflection':
            return (
                <div className="block-interactive block-reflection">
                    {content.question && <h3>{content.question}</h3>}
                    {content.prompt && <p className="prompt">{content.prompt}</p>}
                    {isPreview && (
                        <textarea
                            placeholder="Enter your reflection..."
                            rows={6}
                            minLength={content.meta?.minLength}
                            className="reflection-input"
                        />
                    )}
                </div>
            );

        case 'poll':
            return (
                <div className="block-interactive block-poll">
                    {content.question && <h3>{content.question}</h3>}
                    {isPreview && content.options && Array.isArray(content.options) && (
                        <div className="poll-options">
                            {content.options.map((option: any, index: number) => (
                                <label key={index} className="poll-option">
                                    <input type="radio" name={`poll-${block.id}`} value={option} />
                                    <span>{typeof option === 'string' ? option : option.text || option.label}</span>
                                </label>
                            ))}
                            <button className="poll-submit">Submit Vote</button>
                        </div>
                    )}
                </div>
            );

        case 'wordCloud':
            return (
                <div className="block-interactive block-wordcloud">
                    {content.question && <h3>{content.question}</h3>}
                    {isPreview && (
                        <div className="wordcloud-container">
                            <input
                                type="text"
                                placeholder="Enter a word or phrase..."
                                className="wordcloud-input"
                            />
                            <button className="wordcloud-submit">Add Word</button>
                            <div className="wordcloud-display">
                                <p className="empty-block">Word cloud will appear here</p>
                            </div>
                        </div>
                    )}
                </div>
            );

        case 'aiGenerator':
            return (
                <div className="block-interactive block-ai-generator">
                    {content.title && <h3>{content.title}</h3>}
                    {content.prompt && <p className="prompt">{content.prompt}</p>}
                    {isPreview && (
                        <div className="ai-generator-controls">
                            <textarea
                                placeholder="Enter your input..."
                                rows={4}
                                className="ai-input"
                            />
                            <button className="ai-generate">Generate</button>
                            <div className="ai-output">
                                <p className="empty-block">Generated content will appear here</p>
                            </div>
                        </div>
                    )}
                </div>
            );

        // Generic handler for other interactive blocks
        default:
            if (isInteractiveBlock(type)) {
                return (
                    <div className={`block-interactive block-${type}`}>
                        {content.title && <h3>{content.title}</h3>}
                        {content.question && <h3>{content.question}</h3>}
                        {content.description && <p>{content.description}</p>}
                        {content.prompt && <p className="prompt">{content.prompt}</p>}
                        {isPreview && (
                            <div className="interactive-placeholder">
                                <p>Interactive {type} block</p>
                                <p className="empty-block">Full functionality coming soon</p>
                            </div>
                        )}
                    </div>
                );
            }

            return (
                <div className="block-unknown">
                    <p className="empty-block">Unknown block type: {type}</p>
                </div>
            );
    }
};

// Helper function to render video based on provider
const renderVideo = (content: any) => {
    const { videoUrl, videoProvider, videoSource } = content;

    if (videoProvider === 'youtube') {
        const videoId = extractYouTubeId(videoUrl);
        if (videoId) {
            return (
                <div className="video-embed">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }
    } else if (videoProvider === 'vimeo') {
        const videoId = extractVimeoId(videoUrl);
        if (videoId) {
            return (
                <div className="video-embed">
                    <iframe
                        src={`https://player.vimeo.com/video/${videoId}`}
                        title="Vimeo video"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }
    }

    // Default to HTML5 video for S3 or direct URLs
    return (
        <video controls className="video-player">
            <source src={videoUrl} />
            Your browser does not support the video tag.
        </video>
    );
};

// Helper function to render list based on type
const renderList = (content: any) => {
    const { items, listType } = content;

    if (listType === 'numbered') {
        return (
            <ol>
                {items.map((item: any, index: number) => (
                    <li key={index}>{item.text || item}</li>
                ))}
            </ol>
        );
    } else if (listType === 'checkbox') {
        return (
            <ul className="checklist">
                {items.map((item: any, index: number) => (
                    <li key={index}>
                        <input
                            type="checkbox"
                            checked={item.checked || false}
                            readOnly
                        />
                        <span>{item.text || item}</span>
                    </li>
                ))}
            </ul>
        );
    } else {
        // Default to bullet list
        return (
            <ul>
                {items.map((item: any, index: number) => (
                    <li key={index}>{item.text || item}</li>
                ))}
            </ul>
        );
    }
};

// Helper to extract YouTube video ID
const extractYouTubeId = (url: string): string | null => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
};

// Helper to extract Vimeo video ID
const extractVimeoId = (url: string): string | null => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
};

// Helper to check if block type is interactive
const isInteractiveBlock = (type: string): boolean => {
    const interactiveTypes = [
        'reflection', 'poll', 'wordCloud', 'aiGenerator',
        'choiceComparison', 'certificateGenerator', 'finalAssessment',
        'playerTypeSimulator', 'rewardScheduleDesigner', 'flowChannelEvaluator',
        'pitchAnalysisGenerator', 'narrativeGenerator', 'darkPatternRedesigner',
        'roeDashboard', 'designFixer', 'journeyTimeline', 'simulation',
        'aiJourney', 'buildABot', 'conceptMap', 'dataDashboard',
        'ethicalDilemmaSolver', 'gamificationConceptMap', 'identifyPersonalization',
        'playerTypeAnalyzer', 'presentationCoach', 'sentenceBuilder', 'visualTokens'
    ];
    return interactiveTypes.includes(type);
};

export default BlockRenderer;
