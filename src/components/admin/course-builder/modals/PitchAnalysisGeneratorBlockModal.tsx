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
import { pitchAnalysisGeneratorBlockSchema, type PitchAnalysisGeneratorBlock } from '@/lib/validation/blockSchemas';

interface PitchAnalysisGeneratorBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: PitchAnalysisGeneratorBlock) => void;
    initialData?: Partial<PitchAnalysisGeneratorBlock>;
}

export function PitchAnalysisGeneratorBlockModal({ open, onClose, onSave, initialData }: PitchAnalysisGeneratorBlockModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PitchAnalysisGeneratorBlock>({
        resolver: zodResolver(pitchAnalysisGeneratorBlockSchema),
        defaultValues: {
            type: 'pitchAnalysisGenerator',
            content: {
                title: initialData?.content?.title || '',
                description: initialData?.content?.description || '',
                prompt: initialData?.content?.prompt || '',
                placeholder: initialData?.content?.placeholder || '',
                config: initialData?.content?.config || {},
            },
        },
    });

    const onSubmit = (data: PitchAnalysisGeneratorBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Pitch Analysis Generator Block' : 'Add Pitch Analysis Generator Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="Pitch analysis generator title"
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
                            placeholder="Describe the pitch analysis generator..."
                            rows={3}
                            {...register('content.description')}
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive">
                                {errors.content.description.message}
                            </p>
                        )}
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                        <Label htmlFor="prompt">System Prompt (Optional)</Label>
                        <Textarea
                            id="prompt"
                            placeholder="Enter the system prompt for pitch analysis..."
                            rows={4}
                            {...register('content.prompt')}
                        />
                        {errors.content?.prompt && (
                            <p className="text-sm text-destructive">
                                {errors.content.prompt.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The system prompt that guides the AI's pitch analysis (max 2000 characters)
                        </p>
                    </div>

                    {/* Placeholder */}
                    <div className="space-y-2">
                        <Label htmlFor="placeholder">Input Placeholder (Optional)</Label>
                        <Input
                            id="placeholder"
                            placeholder="Paste your pitch script here..."
                            {...register('content.placeholder')}
                        />
                        {errors.content?.placeholder && (
                            <p className="text-sm text-destructive">
                                {errors.content.placeholder.message}
                            </p>
                        )}
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
