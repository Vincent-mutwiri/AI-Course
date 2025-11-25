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
import { roeDashboardBlockSchema, type ROEDashboardBlock } from '@/lib/validation/blockSchemas';

interface ROEDashboardBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ROEDashboardBlock) => void;
    initialData?: Partial<ROEDashboardBlock>;
}

export function ROEDashboardBlockModal({ open, onClose, onSave, initialData }: ROEDashboardBlockModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ROEDashboardBlock>({
        resolver: zodResolver(roeDashboardBlockSchema),
        defaultValues: {
            type: 'roeDashboard',
            content: {
                title: initialData?.content?.title || '',
                description: initialData?.content?.description || '',
                config: initialData?.content?.config || {},
            },
        },
    });

    const onSubmit = (data: ROEDashboardBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit ROE Dashboard Block' : 'Add ROE Dashboard Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="ROE dashboard title"
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
                            placeholder="Describe the ROE dashboard..."
                            rows={3}
                            {...register('content.description')}
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive">
                                {errors.content.description.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Instructions or context for the Return on Engagement dashboard
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
