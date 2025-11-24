import React from 'react';
import DOMPurify from 'dompurify';

interface TextBlockProps {
    content: {
        text?: string;
    };
    isPreview?: boolean;
}

export const TextBlock: React.FC<TextBlockProps> = ({ content, isPreview = false }) => {
    const { text = '' } = content;

    // Sanitize HTML content to prevent XSS attacks
    const sanitizedHTML = DOMPurify.sanitize(text);

    // Truncate text for canvas preview
    const getTruncatedText = (html: string, maxLength: number = 150): string => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';

        if (textContent.length <= maxLength) {
            return html;
        }

        return textContent.substring(0, maxLength) + '...';
    };

    const displayContent = isPreview ? getTruncatedText(sanitizedHTML) : sanitizedHTML;

    if (!text) {
        return (
            <div className="text-gray-400 italic p-4 border border-dashed border-gray-300 rounded">
                Empty text block. Click edit to add content.
            </div>
        );
    }

    return (
        <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: displayContent }}
        />
    );
};
