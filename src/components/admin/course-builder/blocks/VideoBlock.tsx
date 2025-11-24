import React from 'react';
import { Play } from 'lucide-react';

interface VideoBlockProps {
    content: {
        videoUrl?: string;
        videoSource?: 'upload' | 'embed';
        videoProvider?: 'youtube' | 'vimeo' | 's3';
        title?: string;
    };
    isPreview?: boolean;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({ content, isPreview = false }) => {
    const { videoUrl, videoSource = 'embed', videoProvider, title } = content;

    if (!videoUrl) {
        return (
            <div className="flex items-center justify-center p-8 border border-dashed border-gray-300 rounded bg-gray-50">
                <div className="text-center">
                    <Play className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-400 italic">No video configured. Click edit to add a video.</p>
                </div>
            </div>
        );
    }

    // Extract video ID and create embed URL for YouTube
    const getYouTubeEmbedUrl = (url: string): string => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = match && match[2].length === 11 ? match[2] : null;
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    // Extract video ID and create embed URL for Vimeo
    const getVimeoEmbedUrl = (url: string): string => {
        const regExp = /vimeo\.com\/(\d+)/;
        const match = url.match(regExp);
        const videoId = match ? match[1] : null;
        return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    };

    const renderVideo = () => {
        if (videoProvider === 'youtube') {
            const embedUrl = getYouTubeEmbedUrl(videoUrl);
            return (
                <iframe
                    className="w-full aspect-video rounded"
                    src={embedUrl}
                    title={title || 'YouTube video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            );
        }

        if (videoProvider === 'vimeo') {
            const embedUrl = getVimeoEmbedUrl(videoUrl);
            return (
                <iframe
                    className="w-full aspect-video rounded"
                    src={embedUrl}
                    title={title || 'Vimeo video'}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                />
            );
        }

        // S3 or direct video URL
        return (
            <video
                className="w-full aspect-video rounded"
                controls
                src={videoUrl}
            >
                Your browser does not support the video tag.
            </video>
        );
    };

    // Show thumbnail in preview mode
    if (isPreview) {
        return (
            <div className="relative w-full aspect-video bg-gray-900 rounded flex items-center justify-center">
                <Play className="w-16 h-16 text-white opacity-80" />
                {title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm">
                        {title}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {renderVideo()}
            {title && <p className="text-sm text-gray-600">{title}</p>}
        </div>
    );
};
