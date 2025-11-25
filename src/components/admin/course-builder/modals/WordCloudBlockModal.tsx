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
import { wordCloudBlockSchema, type WordCloudBlock } from '@/lib/validation/blockSchemas';

interface WordCloudBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: WordCloudBlock) => void;
    initialData?: Partial<WordCloudBlock>;
}

export function WordCloudBlockModal({ open, onClose, onSave, initialData }: WordCloudBlockModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WordCloudBlock>({
        resolver: zodResolver(wordCloudBlockSchema),
        defaultValues: {
            type: 'wordCloud',
            content: {
                prompt: initialData?.content?.prompt || '',
                title: initialData?.content?.title || '',
                maxWords: initialData?.content?.maxWords || 3,
                placeholder: initialData?.content?.placeholder || '',
            },
        },
    });

    const onSubmit = (data: WordCloudBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Word Cloud Block' : 'Add Word Cloud Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title (Optional)</Label>
                        <Input
                            id="title"
                            placeholder="Word cloud title"
                            {...register('content.title')}
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive">
                                {errors.content.title.message}
                            </p>
                        )}
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                        <Label htmlFor="prompt">Prompt *</Label>
                        <Textarea
                            id="prompt"
                            placeholder="What words or phrases should students contribute?"
                            rows={3}
                            {...register('content.prompt')}
                        />
                        {errors.content?.prompt && (
                            <p className="text-sm text-destructive">
                                {errors.content.prompt.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The prompt asking students to contribute words (5-500 characters)
                        </p>
                    </div>

                    {/* Max Words */}
                    <div className="space-y-2">
                        <Label htmlFor="maxWords">Maximum Words Per Student</Label>
                        <Input
                            id="maxWords"
                            type="number"
                            min="1"
                            max="10"
                            placeholder="3"
                            {...register('content.maxWords', { valueAsNumber: true })}
                        />
                        {errors.content?.maxWords && (
                            <p className="text-sm text-destructive">
                                {errors.content.maxWords.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            How many words each student can contribute (1-10)
                        </p>
                    </div>

                    {/* Placeholder */}
                    <div className="space-y-2">
                        <Label htmlFor="placeholder">Placeholder Text (Optional)</Label>
                        <Input
                            id="placeholder"
                            placeholder="Enter a word or phrase..."
                            {...register('content.placeholder')}
                        />
                        {errors.content?.placeholder && (
                            <p className="text-sm text-destructive">
                                {errors.content.placeholder.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Placeholder text shown in the input field
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
