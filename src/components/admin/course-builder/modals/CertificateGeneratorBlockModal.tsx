import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { certificateGeneratorBlockSchema, type CertificateGeneratorBlock } from '@/lib/validation/blockSchemas';
import { AlertCircle, Award, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContextBuilder } from '@/services/courseContextBuilder';

interface CertificateGeneratorBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: CertificateGeneratorBlock) => void;
    initialData?: Partial<CertificateGeneratorBlock>;
    courseId?: string;
    moduleId?: string;
    lessonId?: string;
}

export function CertificateGeneratorBlockModal({ open, onClose, onSave, initialData, courseId, moduleId, lessonId }: CertificateGeneratorBlockModalProps) {
    const [logoUrl, setLogoUrl] = useState(initialData?.content?.config?.logoUrl || '');
    const [backgroundUrl, setBackgroundUrl] = useState(initialData?.content?.config?.backgroundUrl || '');
    const [signatureUrl, setSignatureUrl] = useState(initialData?.content?.config?.signatureUrl || '');
    const [uploading, setUploading] = useState(false);
    const logoInputRef = React.useRef<HTMLInputElement>(null);
    const bgInputRef = React.useRef<HTMLInputElement>(null);
    const sigInputRef = React.useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CertificateGeneratorBlock>({
        resolver: zodResolver(certificateGeneratorBlockSchema),
        defaultValues: {
            type: 'certificateGenerator',
            content: {
                title: initialData?.content?.title || '',
                description: initialData?.content?.description || '',
                certificateTitle: initialData?.content?.certificateTitle || '',
                config: initialData?.content?.config || {},
            },
        },
    });

    const handleContentGenerated = (content: any) => {
        if (typeof content === 'string') {
            setValue('content.description', content, { shouldValidate: true });
        } else {
            if (content.title) setValue('content.title', content.title, { shouldValidate: true });
            if (content.description || content.instructions || content.text) {
                setValue('content.description', content.description || content.instructions || content.text, { shouldValidate: true });
            }
            if (content.certificateTitle) setValue('content.certificateTitle', content.certificateTitle, { shouldValidate: true });
        }
    };

    const handleFileUpload = async (file: File, type: 'logo' | 'background' | 'signature') => {
        if (!file || file.size === 0) {
            console.log('No file selected or file is empty');
            return;
        }

        console.log(`Uploading ${type}:`, file.name, file.size, file.type);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            console.log('Sending upload request to /admin/upload');
            const response = await api.post('/admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Upload response:', response.data);
            const url = response.data.url;

            if (type === 'logo') setLogoUrl(url);
            else if (type === 'background') setBackgroundUrl(url);
            else setSignatureUrl(url);

            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`);
        } catch (error: any) {
            console.error(`Failed to upload ${type}:`, error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            toast.error(`Failed to upload ${type}: ${errorMessage}`);
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = (data: CertificateGeneratorBlock) => {
        const finalData = {
            ...data,
            content: {
                ...data.content,
                config: {
                    ...data.content.config,
                    logoUrl,
                    backgroundUrl,
                    signatureUrl,
                },
            },
        };
        onSave(finalData);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        {initialData ? 'Edit Certificate Generator Block' : 'Add Certificate Generator Block'}
                    </DialogTitle>
                    <DialogDescription>
                        Create a certificate that students can generate upon completing the course or module
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="mb-4">
                        <AIAssistantPanel
                            blockType="certificateGenerator"
                            courseContext={CourseContextBuilder.buildContext({ courseId, moduleId, lessonId })}
                            onContentGenerated={handleContentGenerated}
                            currentContent=""
                            placeholder="Describe the certificate content you want to generate..."
                        />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Block Title <span className="text-destructive" aria-label="required">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., Generate Your Certificate, Claim Your Achievement"
                            {...register('content.title')}
                            aria-describedby="title-hint"
                            aria-required="true"
                            aria-invalid={!!errors.content?.title}
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert" aria-live="assertive">
                                <AlertCircle className="w-3 h-3" />
                                {errors.content.title.message}
                            </p>
                        )}
                        <p id="title-hint" className="text-xs text-muted-foreground">
                            The heading students will see for this certificate generator (max 200 characters)
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Instructions for Students <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="e.g., Congratulations on completing this course! Click the button below to generate your personalized certificate of completion."
                            rows={3}
                            {...register('content.description')}
                            aria-describedby="description-hint"
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <AlertCircle className="w-3 h-3" />
                                {errors.content.description.message}
                            </p>
                        )}
                        <p id="description-hint" className="text-xs text-muted-foreground">
                            Explain what students need to do to generate their certificate (max 1000 characters)
                        </p>
                    </div>

                    {/* Certificate Title */}
                    <div className="space-y-2">
                        <Label htmlFor="certificateTitle" className="text-sm font-medium">
                            Certificate Title <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Input
                            id="certificateTitle"
                            placeholder="e.g., Certificate of Completion, Achievement Award"
                            {...register('content.certificateTitle')}
                            aria-describedby="certificateTitle-hint"
                        />
                        {errors.content?.certificateTitle && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <AlertCircle className="w-3 h-3" />
                                {errors.content.certificateTitle.message}
                            </p>
                        )}
                        <p id="certificateTitle-hint" className="text-xs text-muted-foreground">
                            The title that will appear on the generated certificate (max 200 characters)
                        </p>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Certificate Logo <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={(e) => {
                                        console.log('Logo file input changed', e.target.files);
                                        if (!e.target.files || e.target.files.length === 0) {
                                            console.log('No files selected');
                                            return;
                                        }
                                        const file = e.target.files[0];
                                        console.log('Selected logo file:', file);
                                        handleFileUpload(file, 'logo');
                                    }}
                                    disabled={uploading}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50"
                                />
                            </div>
                            {logoUrl && (
                                <Button type="button" variant="ghost" size="icon" onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setLogoUrl('');
                                    if (logoInputRef.current) logoInputRef.current.value = '';
                                }} title="Remove logo">
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {logoUrl && (
                            <div className="border rounded p-2 bg-muted/30">
                                <img src={logoUrl} alt="Logo preview" className="h-16 object-contain mx-auto" />
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Upload a logo image (JPEG, PNG, GIF, or WebP, max 5MB)
                        </p>
                    </div>

                    {/* Background Upload */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Background Image <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <input
                                    ref={bgInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={(e) => {
                                        console.log('Background file input changed', e.target.files);
                                        if (!e.target.files || e.target.files.length === 0) {
                                            console.log('No files selected');
                                            return;
                                        }
                                        const file = e.target.files[0];
                                        console.log('Selected background file:', file);
                                        handleFileUpload(file, 'background');
                                    }}
                                    disabled={uploading}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50"
                                />
                            </div>
                            {backgroundUrl && (
                                <Button type="button" variant="ghost" size="icon" onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setBackgroundUrl('');
                                    if (bgInputRef.current) bgInputRef.current.value = '';
                                }} title="Remove background">
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {backgroundUrl && (
                            <div className="border rounded p-2 bg-muted/30">
                                <img src={backgroundUrl} alt="Background preview" className="h-24 w-full object-cover rounded" />
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Upload a background image (JPEG, PNG, GIF, or WebP, max 5MB)
                        </p>
                    </div>

                    {/* Signature Upload */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Instructor Signature <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <input
                                    ref={sigInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={(e) => {
                                        console.log('Signature file input changed', e.target.files);
                                        if (!e.target.files || e.target.files.length === 0) {
                                            console.log('No files selected');
                                            return;
                                        }
                                        const file = e.target.files[0];
                                        console.log('Selected signature file:', file);
                                        handleFileUpload(file, 'signature');
                                    }}
                                    disabled={uploading}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50"
                                />
                            </div>
                            {signatureUrl && (
                                <Button type="button" variant="ghost" size="icon" onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSignatureUrl('');
                                    if (sigInputRef.current) sigInputRef.current.value = '';
                                }} title="Remove signature">
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {signatureUrl && (
                            <div className="border rounded p-2 bg-muted/30">
                                <img src={signatureUrl} alt="Signature preview" className="h-16 object-contain mx-auto" />
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Upload a signature image (JPEG, PNG, GIF, or WebP, max 5MB)
                        </p>
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
                            disabled={isSubmitting}
                            aria-label={isSubmitting ? 'Saving certificate generator' : 'Save certificate generator'}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
