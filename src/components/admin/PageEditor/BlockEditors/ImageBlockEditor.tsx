import React, { useState } from 'react';
import { IBlock } from '@/types/page';
import './BlockEditors.css';

interface ImageBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
}

const ImageBlockEditor: React.FC<ImageBlockEditorProps> = ({ block, onChange }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('Invalid file type. Please upload JPEG, PNG, or GIF images.');
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

    return (
        <div className="image-block-editor">
            <div className="form-group">
                <label htmlFor="imageUpload">Upload Image</label>
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
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

            <div className="form-group">
                <label htmlFor="altText">Alt Text (for accessibility)</label>
                <input
                    type="text"
                    id="altText"
                    value={block.content.altText || ''}
                    onChange={handleAltTextChange}
                    placeholder="Describe the image for screen readers"
                    className="form-control"
                />
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
