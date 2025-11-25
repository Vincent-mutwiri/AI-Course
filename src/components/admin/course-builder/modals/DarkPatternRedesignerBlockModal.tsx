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
import { darkPatternRedesignerBlockSchema, type DarkPatternRedesignerBlock } from '@/lib/validation/blockSchemas';

interface DarkPatternRedesignerBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: DarkPatternRedesignerBlock) => void;
    initialData?: Partial<DarkPatternRedesignerBlock>;
}

export function DarkPatternRedesignerBlockModal({ open, onClose, onSave, initialData }: DarkPatternRedesignerBlockModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<DarkPatternRedesignerBlock>({
        resolver: zodResolver(darkPatternRedesignerBlockSchema),
        defaultValues: {
            type: 'darkPatternRedesigner',
            content: {
                title: initialData?.content?.title || '',
                description: initialData?.content?.description || '',
                pattern: initialData?.content?.pattern || '',
                prompt: initialData?.content?.prompt || '',
                config: initialData?.content?.config || {},
            },
        },
    });

    const onSubmit = (data: DarkPatternRedesignerBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Dark Pattern Redesigner Block' : 'Add Dark Pattern Redesigner Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="Dark pattern redesigner title"
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
                            placeholder="Describe the dark pattern redesigner..."
                            rows={3}
                            {...register('content.description')}
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive">
                                {errors.content.description.message}
                            </p>
                        )}
                    </div>

                    {/* Pattern */}
                    <div className="space-y-2">
                        <Label htmlFor="pattern">Dark Pattern Description (Optional)</Label>
                        <Textarea
                            id="pattern"
                            placeholder="Describe the dark pattern to redesign..."
                            rows={4}
                            {...register('content.pattern')}
                        />
                        {errors.content?.pattern && (
                            <p className="text-sm text-destructive">
                                {errors.content.pattern.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Description of the dark pattern (max 2000 characters)
                        </p>
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                        <Label htmlFor="prompt">System Prompt (Optional)</Label>
                        <Textarea
                            id="prompt"
                            placeholder="Enter the system prompt for redesign guidance..."
                            rows={4}
                            {...register('content.prompt')}
                        />
                        {errors.content?.prompt && (
                            <p className="text-sm text-destructive">
                                {errors.content.prompt.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The system prompt that guides the AI's redesign suggestions (max 2000 characters)
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
