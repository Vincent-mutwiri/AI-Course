import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
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
import { RadioGroup } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import {
    videoBlockSchema,
    type VideoBlock,
    FILE_SIZE_LIMITS,
    ALLOWED_FILE_TYPES,
    validateFileSize,
    validateFileType,
} from '@/lib/validation/blockSchemas';
import { Upload, Link as LinkIcon, RefreshCw, X } from 'lucide-react';

interface VideoBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: VideoBlock) => void;
    initialData?: Partial<VideoBlock>;
}

export function VideoBlockModal({ open, onClose, onSave, initialData }: VideoBlockModalProps) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [lastFile, setLastFile] = useState<File | null>(null);
    const [uploadController, setUploadController] = useState<AbortController | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<VideoBlock>({
        resolver: zodResolver(videoBlockSchema),
        defaultValues: {
            type: 'video',
            content: {
                videoUrl: initialData?.content?.videoUrl || '',
                videoSource: initialData?.content?.videoSource || 'embed',
                videoProvider: initialData?.content?.videoProvider,
                title: initialData?.content?.title || '',
                description: initialData?.content?.description || '',
            },
        },
    });

    const videoSource = watch('content.videoSource');

    const uploadFile = async (file: File) => {
        setUploadError(null);
        setIsUploading(true);
        setUploadProgress(0);

        // Create new AbortController for this upload
        const controller = new AbortController();
        setUploadController(controller);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/admin/upload', formData, {
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

            setValue('content.videoUrl', response.data.url, { shouldValidate: true });
            setValue('content.videoProvider', 's3');
            setLastFile(null);
            setUploadController(null);
        } catch (error: any) {
            if (axios.isCancel(error)) {
                console.log('Upload cancelled by user');
                setUploadError('Upload cancelled');
            } else {
                console.error('Upload error:', error);
                const errorMessage = error.response?.data?.message || 'Failed to upload video. Please try again.';
                setUploadError(errorMessage);
            }
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
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadError(null);

        // Validate file type
        if (!validateFileType(file, ALLOWED_FILE_TYPES.VIDEO)) {
            setUploadError('Invalid file type. Please upload a video file (MP4, WebM, OGG, or MOV).');
            return;
        }

        // Validate file size
        if (!validateFileSize(file, FILE_SIZE_LIMITS.VIDEO_MAX_SIZE)) {
            setUploadError('File size exceeds 100MB limit.');
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

    const onSubmit = (data: VideoBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Video Block' : 'Add Video Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Video Source Selection */}
                    <div className="space-y-2">
                        <Label>Video Source</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="embed"
                                    {...register('content.videoSource')}
                                    className="w-4 h-4"
                                />
                                <LinkIcon className="h-4 w-4" />
                                <span>Embed URL</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="upload"
                                    {...register('content.videoSource')}
                                    className="w-4 h-4"
                                />
                                <Upload className="h-4 w-4" />
                                <span>Upload File</span>
                            </label>
                        </div>
                    </div>

                    {/* Embed URL Input */}
                    {videoSource === 'embed' && (
                        <div className="space-y-2">
                            <Label htmlFor="videoUrl">Video URL</Label>
                            <Input
                                id="videoUrl"
                                placeholder="https://www.youtube.com/watch?v=..."
                                {...register('content.videoUrl')}
                            />
                            {errors.content?.videoUrl && (
                                <p className="text-sm text-destructive">
                                    {errors.content.videoUrl.message}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Supports YouTube, Vimeo, and direct video URLs
                            </p>
                        </div>
                    )}

                    {/* File Upload Input */}
                    {videoSource === 'upload' && (
                        <div className="space-y-2">
                            <Label htmlFor="videoFile">Upload Video</Label>
                            <Input
                                id="videoFile"
                                type="file"
                                accept={ALLOWED_FILE_TYPES.VIDEO.join(',')}
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
                            {errors.content?.videoUrl && (
                                <p className="text-sm text-destructive">
                                    {errors.content.videoUrl.message}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Maximum file size: 100MB. Supported formats: MP4, WebM, OGG, MOV
                            </p>
                        </div>
                    )}

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title (Optional)</Label>
                        <Input
                            id="title"
                            placeholder="Video title"
                            {...register('content.title')}
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive">
                                {errors.content.title.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Video description"
                            rows={3}
                            {...register('content.description')}
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive">
                                {errors.content.description.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || isUploading}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
