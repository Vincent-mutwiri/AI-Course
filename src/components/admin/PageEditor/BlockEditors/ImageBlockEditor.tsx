import React, { useState } from 'react';
import { IBlock } from '@/types/page';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContext, CourseContextBuilder } from '@/services/courseContextBuilder';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import './BlockEditors.css';

interface ImageBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
    courseContext?: CourseContext;
    existingBlocks?: IBlock[];
}

const ImageBlockEditor: React.FC<ImageBlockEditorProps> = ({
    block,
    onChange,
    courseContext,
    existingBlocks
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showAIAssistant, setShowAIAssistant] = useState(false);

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ imageUrl: e.target.value });
    };

    const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ caption: e.target.value });
    };

    const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ altText: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size exceeds 5MB limit');
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const progress = (e.loaded / e.total) * 100;
                    setUploadProgress(progress);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    onChange({ imageUrl: response.url });
                    setUploading(false);
                    setUploadProgress(0);
                } else {
                    const errorResponse = JSON.parse(xhr.responseText);
                    alert(errorResponse.message || 'Upload failed. Please try again.');
                    setUploading(false);
                    setUploadProgress(0);
                }
            });

            xhr.addEventListener('error', () => {
                alert('Upload failed. Please check your connection and try again.');
                setUploading(false);
                setUploadProgress(0);
            });

            xhr.open('POST', '/api/admin/upload');
            xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
            xhr.send(formData);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Upload failed. Please try again.');
            setUploading(false);
            setUploadProgress(0);
        }
    };

    /**
     * Build course context for AI generation
     * Includes surrounding text from existing blocks for better context
     */
    const buildCourseContext = (): CourseContext => {
        const baseContext = courseContext || CourseContextBuilder.buildContext({
            existingBlocks: existingBlocks
        });

        // Add existing blocks for context analysis
        return {
            ...baseContext,
            existingBlocks: existingBlocks || baseContext.existingBlocks
        };
    };

    /**
     * Extract surrounding text from existing blocks
     * Used to provide context for alt text generation
     */
    const getSurroundingText = (): string => {
        if (!existingBlocks || existingBlocks.length === 0) {
            return '';
        }

        // Get text from text blocks before and after current image
        const textBlocks = existingBlocks
            .filter(b => b.type === 'text' && b.content.text)
            .map(b => {
                // Strip HTML tags and get plain text
                const text = (b.content.text || '').replace(/<[^>]*>/g, '').trim();
                return text.substring(0, 300); // Limit to 300 chars per block
            })
            .filter(text => text.length > 0);

        return textBlocks.join(' ');
    };

    /**
     * Handle AI-generated alt text and caption
     * Populates the alt text and caption fields
     */
    const handleContentGenerated = (content: any) => {
        const updates: Partial<IBlock['content']> = {};

        if (typeof content === 'string') {
            // If content is a plain string, use it as alt text
            updates.altText = content.substring(0, 125);
        } else if (content.altText || content.caption) {
            // If content has structured alt text and caption
            if (content.altText) {
                // Ensure alt text is under 125 characters
                updates.altText = content.altText.substring(0, 125);
            }
            if (content.caption) {
                updates.caption = content.caption;
            }
        } else {
            // Fallback: try to parse the content
            const text = JSON.stringify(content);
            updates.altText = text.substring(0, 125);
        }

        // Apply updates
        onChange(updates);
    };

    /**
     * Toggle AI Assistant panel
     */
    const toggleAIAssistant = () => {
        setShowAIAssistant(!showAIAssistant);
    };

    return (
        <div className="image-block-editor">
            <div className="form-group">
                <label htmlFor="imageUpload">Upload Image</label>
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="form-control"
                />
                {uploading && (
                    <div className="upload-progress">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <span className="progress-text">{Math.round(uploadProgress)}%</span>
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                    type="text"
                    id="imageUrl"
                    value={block.content.imageUrl || ''}
                    onChange={handleImageUrlChange}
                    placeholder="Or enter image URL directly"
                    className="form-control"
                />
            </div>

            {/* AI Assistant for Alt Text Generation */}
            {block.content.imageUrl && (
                <div className="form-group">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Accessibility
                        </label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={toggleAIAssistant}
                            className="flex items-center gap-1"
                        >
                            <Sparkles className="h-3 w-3" />
                            {showAIAssistant ? 'Hide' : 'Generate'} Alt Text
                        </Button>
                    </div>

                    {showAIAssistant && (
                        <div className="mb-4">
                            <AIAssistantPanel
                                blockType="image"
                                courseContext={buildCourseContext()}
                                onContentGenerated={handleContentGenerated}
                                currentContent={{
                                    imageUrl: block.content.imageUrl,
                                    altText: block.content.altText,
                                    caption: block.content.caption,
                                    surroundingText: getSurroundingText()
                                }}
                                placeholder="Describe the image purpose and what it shows (e.g., 'A diagram showing the water cycle with arrows indicating evaporation and precipitation')"
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="altText">
                    Alt Text (for accessibility)
                    <span className="text-xs text-gray-500 ml-2">
                        {block.content.altText?.length || 0}/125 characters
                    </span>
                </label>
                <input
                    type="text"
                    id="altText"
                    value={block.content.altText || ''}
                    onChange={handleAltTextChange}
                    placeholder="Describe the image for screen readers"
                    className="form-control"
                    maxLength={125}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Describe what the image shows and its purpose in the lesson. Keep it concise and under 125 characters.
                </p>
            </div>

            <div className="form-group">
                <label htmlFor="caption">Caption (optional)</label>
                <input
                    type="text"
                    id="caption"
                    value={block.content.caption || ''}
                    onChange={handleCaptionChange}
                    placeholder="Add a caption for the image"
                    className="form-control"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Provide additional context or explanation about the image.
                </p>
            </div>

            {block.content.imageUrl && (
                <div className="image-preview">
                    <label>Preview</label>
                    <div className="preview-container">
                        <img
                            src={block.content.imageUrl}
                            alt={block.content.altText || 'Preview'}
                            className="preview-image"
                        />
                        {block.content.caption && (
                            <p className="preview-caption">{block.content.caption}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageBlockEditor;
