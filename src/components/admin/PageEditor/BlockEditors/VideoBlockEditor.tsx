import React, { useState } from 'react';
import { IBlock } from '@/types/page';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContextBuilder, CourseContext } from '@/services/courseContextBuilder';
import './BlockEditors.css';

interface VideoBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
    courseContext?: CourseContext;
}

const VideoBlockEditor: React.FC<VideoBlockEditorProps> = ({ block, onChange, courseContext }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [generatedScript, setGeneratedScript] = useState<string>('');

    // Build course context if not provided
    const context: CourseContext = courseContext || CourseContextBuilder.buildContext({});

    const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ videoUrl: e.target.value });
    };

    const handleVideoSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ videoSource: e.target.value as 'upload' | 'embed' });
    };

    const handleVideoProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ videoProvider: e.target.value as 'youtube' | 'vimeo' | 's3' });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (100MB limit)
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size exceeds 100MB limit');
            return;
        }

        // Validate file type
        const validTypes = ['video/mp4', 'video/webm'];
        if (!validTypes.includes(file.type)) {
            alert('Invalid file type. Please upload MP4 or WebM video files.');
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
                    onChange({
                        videoUrl: response.url,
                        videoSource: 'upload',
                        videoProvider: 's3'
                    });
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
            console.error('Error uploading video:', error);
            alert('Upload failed. Please try again.');
            setUploading(false);
            setUploadProgress(0);
        }
    };

    /**
     * Handle AI-generated video content
     * Expected format: { title, description, script, keyPoints }
     */
    const handleContentGenerated = (content: any) => {
        // Parse the generated content
        let parsedContent = content;

        // If content is a string, try to parse it as JSON
        if (typeof content === 'string') {
            try {
                parsedContent = JSON.parse(content);
            } catch {
                // If not JSON, treat as script text
                parsedContent = { script: content };
            }
        }

        // Update block content with generated data
        const updates: Partial<IBlock['content']> = {};

        if (parsedContent.title) {
            updates.title = parsedContent.title;
        }

        if (parsedContent.description) {
            updates.description = parsedContent.description;
        }

        // Store the generated script separately for display
        if (parsedContent.script) {
            setGeneratedScript(parsedContent.script);
        }

        // Apply updates to the block
        if (Object.keys(updates).length > 0) {
            onChange(updates);
        }
    };

    const renderVideoPreview = () => {
        if (!block.content.videoUrl) return null;

        const { videoUrl, videoProvider } = block.content;

        if (videoProvider === 'youtube') {
            const videoId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
            if (videoId) {
                return (
                    <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                );
            }
        } else if (videoProvider === 'vimeo') {
            const videoId = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
            if (videoId) {
                return (
                    <iframe
                        width="100%"
                        height="315"
                        src={`https://player.vimeo.com/video/${videoId}`}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    />
                );
            }
        } else if (videoProvider === 's3' || !videoProvider) {
            return (
                <video width="100%" height="315" controls>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        }

        return <p className="preview-error">Unable to preview video</p>;
    };

    return (
        <div className="video-block-editor">
            {/* AI Content Assistant */}
            <div className="mb-4">
                <AIAssistantPanel
                    blockType="video"
                    courseContext={context}
                    onContentGenerated={handleContentGenerated}
                    currentContent={block.content}
                    placeholder="Describe the video topic and duration (e.g., 'Create a 5-minute video script about gamification principles including introduction, main concepts, examples, and conclusion')"
                />
            </div>

            {/* Video Title */}
            <div className="form-group">
                <label htmlFor="videoTitle">Video Title</label>
                <input
                    type="text"
                    id="videoTitle"
                    value={block.content.title || ''}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="Enter video title"
                    className="form-control"
                />
            </div>

            {/* Video Description */}
            <div className="form-group">
                <label htmlFor="videoDescription">Video Description</label>
                <textarea
                    id="videoDescription"
                    value={block.content.description || ''}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder="Enter video description for accessibility"
                    className="form-control"
                    rows={3}
                />
            </div>

            <div className="form-group">
                <label htmlFor="videoSource">Video Source</label>
                <select
                    id="videoSource"
                    value={block.content.videoSource || 'embed'}
                    onChange={handleVideoSourceChange}
                    className="form-control"
                >
                    <option value="embed">Embed (URL)</option>
                    <option value="upload">Upload</option>
                </select>
            </div>

            {block.content.videoSource === 'upload' ? (
                <div className="form-group">
                    <label htmlFor="videoUpload">Upload Video</label>
                    <input
                        type="file"
                        id="videoUpload"
                        accept="video/mp4,video/webm"
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
            ) : (
                <>
                    <div className="form-group">
                        <label htmlFor="videoProvider">Video Provider</label>
                        <select
                            id="videoProvider"
                            value={block.content.videoProvider || 'youtube'}
                            onChange={handleVideoProviderChange}
                            className="form-control"
                        >
                            <option value="youtube">YouTube</option>
                            <option value="vimeo">Vimeo</option>
                            <option value="s3">Direct URL</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="videoUrl">Video URL</label>
                        <input
                            type="text"
                            id="videoUrl"
                            value={block.content.videoUrl || ''}
                            onChange={handleVideoUrlChange}
                            placeholder="Enter video URL"
                            className="form-control"
                        />
                    </div>
                </>
            )}

            {block.content.videoUrl && (
                <div className="video-preview">
                    <label>Preview</label>
                    {renderVideoPreview()}
                </div>
            )}

            {/* Generated Script Display */}
            {generatedScript && (
                <div className="form-group mt-4">
                    <label>Generated Video Script</label>
                    <div className="generated-script-container p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                        <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-sans">
                            {generatedScript}
                        </pre>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Use this script as a guide when recording your video. The title and description have been populated above.
                    </p>
                </div>
            )}
        </div>
    );
};

export default VideoBlockEditor;
