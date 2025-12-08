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
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContextBuilder } from '@/services/courseContextBuilder';

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
    const [generatedScript, setGeneratedScript] = useState<string>('');

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
    const titleContent = watch('content.title');
    const descriptionContent = watch('content.description');

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

        // Update form fields with generated data
        if (parsedContent.title) {
            setValue('content.title', parsedContent.title, { shouldValidate: true });
        }

        if (parsedContent.description) {
            setValue('content.description', parsedContent.description, { shouldValidate: true });
        }

        // Store the generated script separately for display
        if (parsedContent.script) {
            setGeneratedScript(parsedContent.script);
        }
    };

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
                    <p className="text-sm text-muted-foreground">
                        Add video content by embedding a URL or uploading a file
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* AI Content Assistant */}
                    <div className="mb-4">
                        <AIAssistantPanel
                            blockType="video"
                            courseContext={{
                                courseId: 'course-builder',
                                courseTitle: 'Course Content',
                            }}
                            onContentGenerated={handleContentGenerated}
                            currentContent={{ title: titleContent, description: descriptionContent }}
                            placeholder="Describe the video topic and duration (e.g., 'Create a 5-minute video script about gamification principles including introduction, main concepts, examples, and conclusion')"
                        />
                    </div>

                    {/* Video Source Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Video Source <span className="text-destructive" aria-label="required">*</span></Label>
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
                            <Label htmlFor="videoUrl" className="text-sm font-medium">
                                Video URL <span className="text-destructive" aria-label="required">*</span>
                            </Label>
                            <Input
                                id="videoUrl"
                                placeholder="https://www.youtube.com/watch?v=..."
                                {...register('content.videoUrl')}
                                aria-describedby="videoUrl-hint"
                                aria-required="true"
                                aria-invalid={!!errors.content?.videoUrl}
                            />
                            {errors.content?.videoUrl && (
                                <p className="text-sm text-destructive flex items-center gap-1" role="alert" aria-live="assertive">
                                    <span>⚠️</span>
                                    {errors.content.videoUrl.message}
                                </p>
                            )}
                            <p id="videoUrl-hint" className="text-xs text-muted-foreground">
                                Paste a YouTube, Vimeo, or direct video URL. The video will be embedded in the lesson.
                            </p>
                        </div>
                    )}

                    {/* File Upload Input */}
                    {videoSource === 'upload' && (
                        <div className="space-y-2">
                            <Label htmlFor="videoFile" className="text-sm font-medium">
                                Upload Video <span className="text-destructive" aria-label="required">*</span>
                            </Label>
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
                        <Label htmlFor="title" className="text-sm font-medium">
                            Title <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., Introduction to Gamification"
                            {...register('content.title')}
                            aria-describedby="title-hint"
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <span>⚠️</span>
                                {errors.content.title.message}
                            </p>
                        )}
                        <p id="title-hint" className="text-xs text-muted-foreground">
                            Optional title displayed above the video player
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Description <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="e.g., In this video, we'll explore the key principles of gamification..."
                            rows={3}
                            {...register('content.description')}
                            aria-describedby="description-hint"
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <span>⚠️</span>
                                {errors.content.description.message}
                            </p>
                        )}
                        <p id="description-hint" className="text-xs text-muted-foreground">
                            Optional description or context for the video content
                        </p>
                    </div>

                    {/* Generated Video Script Display */}
                    {generatedScript && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Generated Video Script
                            </Label>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                                <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-sans">
                                    {generatedScript}
                                </pre>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Use this script as a guide when recording your video. The title and description have been populated above.
                            </p>
                        </div>
                    )}

                    <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                        <strong>💡 Tip:</strong> For best performance, use YouTube or Vimeo for longer videos.
                        Upload directly only for short clips or when embedding isn't possible.
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
                            aria-label={isSubmitting ? 'Saving video block' : 'Save video block'}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
