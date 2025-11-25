import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { journeyTimelineBlockSchema, type JourneyTimelineBlock } from '@/lib/validation/blockSchemas';
import { Plus, Trash2 } from 'lucide-react';

interface JourneyTimelineBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: JourneyTimelineBlock) => void;
    initialData?: Partial<JourneyTimelineBlock>;
}

export function JourneyTimelineBlockModal({ open, onClose, onSave, initialData }: JourneyTimelineBlockModalProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<JourneyTimelineBlock>({
        resolver: zodResolver(journeyTimelineBlockSchema),
        defaultValues: {
            type: 'journeyTimeline',
            content: {
                title: initialData?.content?.title || '',
                description: initialData?.content?.description || '',
                milestones: initialData?.content?.milestones || [],
                config: initialData?.content?.config || {},
            },
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'content.milestones',
    });

    const onSubmit = (data: JourneyTimelineBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Journey Timeline Block' : 'Add Journey Timeline Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="Journey timeline title"
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
                            placeholder="Describe the journey timeline..."
                            rows={3}
                            {...register('content.description')}
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive">
                                {errors.content.description.message}
                            </p>
                        )}
                    </div>

                    {/* Milestones */}
                    <div className="space-y-2">
                        <Label>Milestones (Optional)</Label>
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-3 border rounded-md space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Milestone {index + 1}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => remove(index)}
                                            title="Remove milestone"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Input
                                        placeholder="Milestone title"
                                        {...register(`content.milestones.${index}.title`)}
                                    />
                                    <Textarea
                                        placeholder="Description (optional)"
                                        rows={2}
                                        {...register(`content.milestones.${index}.description`)}
                                    />
                                    <Input
                                        placeholder="Date (optional)"
                                        {...register(`content.milestones.${index}.date`)}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ title: '', description: '', date: '' })}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Milestone
                        </Button>
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
