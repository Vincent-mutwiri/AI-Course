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
import { reflectionBlockSchema, type ReflectionBlock } from '@/lib/validation/blockSchemas';

interface ReflectionBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ReflectionBlock) => void;
    initialData?: Partial<ReflectionBlock>;
}

export function ReflectionBlockModal({ open, onClose, onSave, initialData }: ReflectionBlockModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ReflectionBlock>({
        resolver: zodResolver(reflectionBlockSchema),
        defaultValues: {
            type: 'reflection',
            content: {
                question: initialData?.content?.question || '',
                prompt: initialData?.content?.prompt || '',
                minLength: initialData?.content?.minLength || 50,
                placeholder: initialData?.content?.placeholder || '',
                title: initialData?.content?.title || '',
            },
        },
    });

    const onSubmit = (data: ReflectionBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-2xl max-h-[90vh] overflow-y-auto"
                aria-describedby="reflection-block-description"
            >
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Reflection Block' : 'Add Reflection Block'}
                    </DialogTitle>
                    <p id="reflection-block-description" className="sr-only">
                        Configure a reflection question for students to answer
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title (Optional)</Label>
                        <Input
                            id="title"
                            placeholder="Reflection title"
                            {...register('content.title')}
                            aria-describedby="title-hint"
                        />
                        {errors.content?.title && (
                            <p
                                className="text-sm text-destructive"
                                role="alert"
                                aria-live="assertive"
                            >
                                {errors.content.title.message}
                            </p>
                        )}
                    </div>

                    {/* Question */}
                    <div className="space-y-2">
                        <Label htmlFor="question">
                            Question <span className="text-destructive" aria-label="required">*</span>
                        </Label>
                        <Textarea
                            id="question"
                            placeholder="What question do you want students to reflect on?"
                            rows={3}
                            {...register('content.question')}
                            aria-describedby="question-hint"
                            aria-required="true"
                            aria-invalid={!!errors.content?.question}
                        />
                        {errors.content?.question && (
                            <p
                                className="text-sm text-destructive"
                                role="alert"
                                aria-live="assertive"
                            >
                                {errors.content.question.message}
                            </p>
                        )}
                        <p id="question-hint" className="text-xs text-muted-foreground">
                            The main reflection question (10-1000 characters)
                        </p>
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                        <Label htmlFor="prompt">Additional Prompt (Optional)</Label>
                        <Textarea
                            id="prompt"
                            placeholder="Provide additional context or guidance for the reflection..."
                            rows={3}
                            {...register('content.prompt')}
                        />
                        {errors.content?.prompt && (
                            <p className="text-sm text-destructive">
                                {errors.content.prompt.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Additional instructions or context (max 2000 characters)
                        </p>
                    </div>

                    {/* Minimum Length */}
                    <div className="space-y-2">
                        <Label htmlFor="minLength">Minimum Response Length</Label>
                        <Input
                            id="minLength"
                            type="number"
                            min="0"
                            max="5000"
                            placeholder="50"
                            {...register('content.minLength', { valueAsNumber: true })}
                        />
                        {errors.content?.minLength && (
                            <p className="text-sm text-destructive">
                                {errors.content.minLength.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Minimum number of characters required (0-5000)
                        </p>
                    </div>

                    {/* Placeholder */}
                    <div className="space-y-2">
                        <Label htmlFor="placeholder">Placeholder Text (Optional)</Label>
                        <Input
                            id="placeholder"
                            placeholder="Start typing your reflection..."
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
                            aria-label={isSubmitting ? 'Saving reflection block' : 'Save reflection block'}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
