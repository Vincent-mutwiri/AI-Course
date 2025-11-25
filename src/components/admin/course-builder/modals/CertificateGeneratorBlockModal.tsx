import React from 'react';
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
import { AlertCircle, Award } from 'lucide-react';

interface CertificateGeneratorBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: CertificateGeneratorBlock) => void;
    initialData?: Partial<CertificateGeneratorBlock>;
}

export function CertificateGeneratorBlockModal({ open, onClose, onSave, initialData }: CertificateGeneratorBlockModalProps) {
    const {
        register,
        handleSubmit,
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

    const onSubmit = (data: CertificateGeneratorBlock) => {
        onSave(data);
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

                    <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                        <strong>💡 Tip:</strong> The certificate will automatically include the student's name,
                        course title, completion date, and a unique certificate ID. You only need to configure
                        the display title and instructions.
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
