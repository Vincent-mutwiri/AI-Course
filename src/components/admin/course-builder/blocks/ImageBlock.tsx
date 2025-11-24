import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageBlockProps {
    content: {
        imageUrl?: string;
        caption?: string;
        altText?: string;
    };
    isPreview?: boolean;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ content, isPreview = false }) => {
    const { imageUrl, caption, altText = 'Image' } = content;

    if (!imageUrl) {
        return (
            <div className="flex items-center justify-center p-8 border border-dashed border-gray-300 rounded bg-gray-50">
                <div className="text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-400 italic">No image configured. Click edit to add an image.</p>
                </div>
            </div>
        );
    }

    return (
        <figure className="space-y-2">
            <img
                src={imageUrl}
                alt={altText}
                className="w-full rounded shadow-sm"
                loading="lazy"
            />
            {caption && (
                <figcaption className="text-sm text-gray-600 text-center italic">
                    {caption}
                </figcaption>
            )}
            {isPreview && altText && (
                <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                    <span className="font-semibold">Alt text:</span> {altText}
                </div>
            )}
        </figure>
    );
};
