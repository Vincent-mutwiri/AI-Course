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
import { Progress } from '@/components/ui/progress';
import {
    imageBlockSchema,
    type ImageBlock,
    FILE_SIZE_LIMITS,
    ALLOWED_FILE_TYPES,
    validateFileSize,
    validateFileType,
} from '@/lib/validation/blockSchemas';
import { ImageIcon, RefreshCw } from 'lucide-react';

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

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to upload image. Please try again.';
            setUploadError(errorMessage);
            setPreviewUrl(null);
        } finally {
            setIsUploading(false);
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
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="imageFile">Upload Image</Label>
                        <Input
                            id="imageFile"
                            type="file"
                            accept={ALLOWED_FILE_TYPES.IMAGE.join(',')}
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        {isUploading && (
                            <div className="space-y-2">
                                <Progress value={uploadProgress} />
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
                            <p className="text-sm text-destructive">
                                {errors.content.imageUrl.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP
                        </p>
                    </div>

                    {/* Image Preview */}
                    {previewUrl && (
                        <div className="space-y-2">
                            <Label>Preview</Label>
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
                        <Label htmlFor="altText">
                            Alt Text <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="altText"
                            placeholder="Describe the image for accessibility"
                            {...register('content.altText')}
                        />
                        {errors.content?.altText && (
                            <p className="text-sm text-destructive">
                                {errors.content.altText.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Required for accessibility. Describe what the image shows.
                        </p>
                    </div>

                    {/* Caption (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="caption">Caption (Optional)</Label>
                        <Textarea
                            id="caption"
                            placeholder="Add a caption for the image"
                            rows={2}
                            {...register('content.caption')}
                        />
                        {errors.content?.caption && (
                            <p className="text-sm text-destructive">
                                {errors.content.caption.message}
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
