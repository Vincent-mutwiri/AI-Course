import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import api from '@/services/api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
    imageBlockSchema,
    type ImageBlock,
    FILE_SIZE_LIMITS,
    ALLOWED_FILE_TYPES,
    validateFileSize,
    validateFileType,
} from '@/lib/validation/blockSchemas';
import { ImageIcon, RefreshCw, X } from 'lucide-react';

interface ImageBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ImageBlock) => void;
    initialData?: Partial<ImageBlock>;
}

export function ImageBlockModal({ open, onClose, onSave, initialData }: ImageBlockModalProps) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        initialData?.content?.imageUrl || null
    );
    const [lastFile, setLastFile] = useState<File | null>(null);
    const [uploadController, setUploadController] = useState<AbortController | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ImageBlock>({
        resolver: zodResolver(imageBlockSchema),
        defaultValues: {
            type: 'image',
            content: {
                imageUrl: initialData?.content?.imageUrl || '',
                altText: initialData?.content?.altText || '',
                caption: initialData?.content?.caption || '',
            },
        },
    });

    const uploadFile = async (file: File) => {
        setUploadError(null);
        setIsUploading(true);
        setUploadProgress(0);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Create new AbortController for this upload
        const controller = new AbortController();
        setUploadController(controller);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                signal: controller.signal,
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    setUploadProgress(progress);
                },
            });

            setValue('content.imageUrl', response.data.url, { shouldValidate: true });
            setPreviewUrl(response.data.url);
            setLastFile(null);
            setUploadController(null);
        } catch (error: any) {
            if (axios.isCancel(error)) {
                console.log('Upload cancelled by user');
                setUploadError('Upload cancelled');
            } else {
                console.error('Upload error:', error);
                const errorMessage = error.response?.data?.message || 'Failed to upload image. Please try again.';
                setUploadError(errorMessage);
            }
            setPreviewUrl(null);
            setUploadController(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancelUpload = () => {
        if (uploadController) {
            uploadController.abort();
            setUploadController(null);
            setIsUploading(false);
            setUploadProgress(0);
            setPreviewUrl(initialData?.content?.imageUrl || null);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadError(null);

        // Validate file type
        if (!validateFileType(file, ALLOWED_FILE_TYPES.IMAGE)) {
            setUploadError('Invalid file type. Please upload an image file (JPEG, PNG, GIF, or WebP).');
            return;
        }

        // Validate file size
        if (!validateFileSize(file, FILE_SIZE_LIMITS.IMAGE_MAX_SIZE)) {
            setUploadError('File size exceeds 5MB limit.');
            return;
        }

        setLastFile(file);
        await uploadFile(file);
    };

    const handleRetryUpload = () => {
        if (lastFile) {
            uploadFile(lastFile);
        }
    };

    const onSubmit = (data: ImageBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Image Block' : 'Add Image Block'}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Add images to enhance your lesson content with visual elements
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="imageFile" className="text-sm font-medium">
                            Upload Image <span className="text-destructive" aria-label="required">*</span>
                        </Label>
                        <Input
                            id="imageFile"
                            type="file"
                            accept={ALLOWED_FILE_TYPES.IMAGE.join(',')}
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        {isUploading && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Progress value={uploadProgress} className="flex-1" />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCancelUpload}
                                        className="h-8 w-8 p-0"
                                        title="Cancel upload"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Uploading... {uploadProgress}%
                                </p>
                            </div>
                        )}
                        {uploadError && (
                            <div className="space-y-2">
                                <p className="text-sm text-destructive">{uploadError}</p>
                                {lastFile && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRetryUpload}
                                        className="gap-2"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        Retry Upload
                                    </Button>
                                )}
                            </div>
                        )}
                        {errors.content?.imageUrl && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <span>⚠️</span>
                                {errors.content.imageUrl.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP. For best results, use images at least 800px wide.
                        </p>
                    </div>

                    {/* Image Preview */}
                    {previewUrl && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Preview</Label>
                            <div className="border rounded-md p-4 bg-muted/50">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-w-full h-auto max-h-64 mx-auto rounded"
                                />
                            </div>
                        </div>
                    )}

                    {/* Alt Text (Required) */}
                    <div className="space-y-2">
                        <Label htmlFor="altText" className="text-sm font-medium">
                            Alt Text <span className="text-destructive" aria-label="required">*</span>
                        </Label>
                        <Input
                            id="altText"
                            placeholder="e.g., Diagram showing the flow of a gamified learning experience"
                            {...register('content.altText')}
                            aria-describedby="altText-hint"
                            aria-required="true"
                            aria-invalid={!!errors.content?.altText}
                        />
                        {errors.content?.altText && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert" aria-live="assertive">
                                <span>⚠️</span>
                                {errors.content.altText.message}
                            </p>
                        )}
                        <p id="altText-hint" className="text-xs text-muted-foreground">
                            <strong>Required for accessibility.</strong> Describe what the image shows so screen reader users understand the content (max 250 characters)
                        </p>
                    </div>

                    {/* Caption (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="caption" className="text-sm font-medium">
                            Caption <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Textarea
                            id="caption"
                            placeholder="e.g., Figure 1: The gamification feedback loop"
                            rows={2}
                            {...register('content.caption')}
                            aria-describedby="caption-hint"
                        />
                        {errors.content?.caption && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <span>⚠️</span>
                                {errors.content.caption.message}
                            </p>
                        )}
                        <p id="caption-hint" className="text-xs text-muted-foreground">
                            Optional caption displayed below the image (max 500 characters)
                        </p>
                    </div>

                    <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                        <strong>💡 Accessibility Tip:</strong> Alt text should describe the content and function of the image.
                        For decorative images, use brief alt text. For complex diagrams, provide detailed descriptions.
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            aria-label="Cancel and close dialog"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            aria-label={isSubmitting ? 'Saving image block' : 'Save image block'}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
