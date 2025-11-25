import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { certificateGeneratorBlockSchema, type CertificateGeneratorBlock } from '@/lib/validation/blockSchemas';

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
                    <DialogTitle>
                        {initialData ? 'Edit Certificate Generator Block' : 'Add Certificate Generator Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="Certificate generator title"
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
                            placeholder="Describe the certificate generator..."
                            rows={3}
                            {...register('content.description')}
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive">
                                {errors.content.description.message}
                            </p>
                        )}
                    </div>

                    {/* Certificate Title */}
                    <div className="space-y-2">
                        <Label htmlFor="certificateTitle">Certificate Title (Optional)</Label>
                        <Input
                            id="certificateTitle"
                            placeholder="Certificate of Completion"
                            {...register('content.certificateTitle')}
                        />
                        {errors.content?.certificateTitle && (
                            <p className="text-sm text-destructive">
                                {errors.content.certificateTitle.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The title that will appear on the certificate
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
