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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Title (Optional)
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., Reflect on Your Teaching Practice"
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
                        <p id="title-hint" className="text-xs text-muted-foreground">
                            Optional title displayed above the reflection question
                        </p>
                    </div>

                    {/* Question */}
                    <div className="space-y-2">
                        <Label htmlFor="question" className="text-sm font-medium">
                            Reflection Question <span className="text-destructive" aria-label="required">*</span>
                        </Label>
                        <Textarea
                            id="question"
                            placeholder="e.g., How have you used gamification in your classroom? What worked well and what didn't?"
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
                            The main question students will reflect on (10-1000 characters)
                        </p>
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                        <Label htmlFor="prompt" className="text-sm font-medium">
                            Additional Context (Optional)
                        </Label>
                        <Textarea
                            id="prompt"
                            placeholder="e.g., Think about specific examples from your experience. Consider both successes and challenges."
                            rows={3}
                            {...register('content.prompt')}
                            aria-describedby="prompt-hint"
                        />
                        {errors.content?.prompt && (
                            <p className="text-sm text-destructive" role="alert">
                                {errors.content.prompt.message}
                            </p>
                        )}
                        <p id="prompt-hint" className="text-xs text-muted-foreground">
                            Additional guidance or context to help students write meaningful reflections (max 2000 characters)
                        </p>
                    </div>

                    {/* Minimum Length */}
                    <div className="space-y-2">
                        <Label htmlFor="minLength" className="text-sm font-medium">
                            Minimum Character Count
                        </Label>
                        <Input
                            id="minLength"
                            type="number"
                            min="0"
                            max="5000"
                            placeholder="50"
                            {...register('content.minLength', { valueAsNumber: true })}
                            aria-describedby="minLength-hint"
                        />
                        {errors.content?.minLength && (
                            <p className="text-sm text-destructive" role="alert">
                                {errors.content.minLength.message}
                            </p>
                        )}
                        <p id="minLength-hint" className="text-xs text-muted-foreground">
                            Minimum number of characters required for submission (0-5000). Default is 50 characters.
                        </p>
                        <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-2">
                            <strong>💡 Tip:</strong> For thoughtful reflections, aim for 100-300 characters minimum.
                            Too low may result in superficial responses, too high may discourage participation.
                        </div>
                    </div>

                    {/* Placeholder */}
                    <div className="space-y-2">
                        <Label htmlFor="placeholder" className="text-sm font-medium">
                            Placeholder Text (Optional)
                        </Label>
                        <Input
                            id="placeholder"
                            placeholder="e.g., Share your thoughts and experiences here..."
                            {...register('content.placeholder')}
                            aria-describedby="placeholder-hint"
                        />
                        {errors.content?.placeholder && (
                            <p className="text-sm text-destructive" role="alert">
                                {errors.content.placeholder.message}
                            </p>
                        )}
                        <p id="placeholder-hint" className="text-xs text-muted-foreground">
                            Hint text displayed in the empty text area (max 200 characters)
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
