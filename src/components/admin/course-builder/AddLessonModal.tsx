import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const lessonSchema = z.object({
    title: z.string().min(1, 'Lesson title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    duration: z.number().min(0, 'Duration must be positive').max(999, 'Duration must be less than 999 minutes').optional(),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface AddLessonModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: LessonFormData) => Promise<void>;
    moduleName?: string;
}

export function AddLessonModal({ open, onClose, onSave, moduleName }: AddLessonModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LessonFormData>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: '',
            description: '',
            duration: 15,
        },
    });

    const onSubmit = async (data: LessonFormData) => {
        try {
            setIsSubmitting(true);
            await onSave(data);
            reset();
            onClose();
        } catch (error) {
            console.error('Error saving lesson:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Lesson</DialogTitle>
                    <DialogDescription>
                        {moduleName ? `Create a new lesson in "${moduleName}"` : 'Create a new lesson in this module'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="lesson-title">
                            Lesson Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="lesson-title"
                            placeholder="e.g., Introduction to Game Mechanics"
                            {...register('title')}
                            aria-invalid={errors.title ? 'true' : 'false'}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive" role="alert">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lesson-description">
                            Description <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Textarea
                            id="lesson-description"
                            placeholder="Brief description of what this lesson covers..."
                            rows={2}
                            {...register('description')}
                            aria-invalid={errors.description ? 'true' : 'false'}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive" role="alert">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lesson-duration">
                            Duration (minutes) <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Input
                            id="lesson-duration"
                            type="number"
                            min="0"
                            max="999"
                            placeholder="15"
                            {...register('duration', { valueAsNumber: true })}
                            aria-invalid={errors.duration ? 'true' : 'false'}
                        />
                        {errors.duration && (
                            <p className="text-sm text-destructive" role="alert">
                                {errors.duration.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Estimated time for students to complete this lesson
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Lesson'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
