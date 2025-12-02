import React, { useState } from 'react';
import { IBlock } from '../../../../types/page';
import './BlockEditors.css';

interface VideoBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
}

const VideoBlockEditor: React.FC<VideoBlockEditorProps> = ({ block, onChange }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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
        </div>
    );
};

export default VideoBlockEditor;
