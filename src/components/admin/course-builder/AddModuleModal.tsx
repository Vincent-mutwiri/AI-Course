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

const moduleSchema = z.object({
    title: z.string().min(1, 'Module title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

interface AddModuleModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ModuleFormData) => Promise<void>;
}

export function AddModuleModal({ open, onClose, onSave }: AddModuleModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ModuleFormData>({
        resolver: zodResolver(moduleSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    const onSubmit = async (data: ModuleFormData) => {
        try {
            setIsSubmitting(true);
            await onSave(data);
            reset();
            onClose();
        } catch (error) {
            console.error('Error saving module:', error);
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
                    <DialogTitle>Add New Module</DialogTitle>
                    <DialogDescription>
                        Create a new module to organize your course lessons.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="module-title">
                            Module Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="module-title"
                            placeholder="e.g., Introduction to Gamification"
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
                        <Label htmlFor="module-description">
                            Description <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Textarea
                            id="module-description"
                            placeholder="Brief description of what this module covers..."
                            rows={3}
                            {...register('description')}
                            aria-invalid={errors.description ? 'true' : 'false'}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive" role="alert">
                                {errors.description.message}
                            </p>
                        )}
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
                            {isSubmitting ? 'Creating...' : 'Create Module'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
