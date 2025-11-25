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
import { choiceComparisonBlockSchema, type ChoiceComparisonBlock } from '@/lib/validation/blockSchemas';
import { Plus, Trash2 } from 'lucide-react';

interface ChoiceComparisonBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ChoiceComparisonBlock) => void;
    initialData?: Partial<ChoiceComparisonBlock>;
}

export function ChoiceComparisonBlockModal({ open, onClose, onSave, initialData }: ChoiceComparisonBlockModalProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ChoiceComparisonBlock>({
        resolver: zodResolver(choiceComparisonBlockSchema),
        defaultValues: {
            type: 'choiceComparison',
            content: {
                question: initialData?.content?.question || '',
                title: initialData?.content?.title || '',
                choices: initialData?.content?.choices || [
                    { label: '', description: '' },
                    { label: '', description: '' },
                ],
                config: initialData?.content?.config || {},
            },
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'content.choices',
    });

    const onSubmit = (data: ChoiceComparisonBlock) => {
        onSave(data);
        onClose();
    };

    const addChoice = () => {
        if (fields.length < 6) {
            append({ label: '', description: '' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Choice Comparison Block' : 'Add Choice Comparison Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title (Optional)</Label>
                        <Input
                            id="title"
                            placeholder="Choice comparison title"
                            {...register('content.title')}
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive">
                                {errors.content.title.message}
                            </p>
                        )}
                    </div>

                    {/* Question */}
                    <div className="space-y-2">
                        <Label htmlFor="question">Question *</Label>
                        <Textarea
                            id="question"
                            placeholder="What choices do you want students to compare?"
                            rows={2}
                            {...register('content.question')}
                        />
                        {errors.content?.question && (
                            <p className="text-sm text-destructive">
                                {errors.content.question.message}
                            </p>
                        )}
                    </div>

                    {/* Choices */}
                    <div className="space-y-2">
                        <Label>Choices * (2-6)</Label>
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-3 border rounded-md space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Choice {index + 1}</span>
                                        {fields.length > 2 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => remove(index)}
                                                title="Remove choice"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="Choice label"
                                        {...register(`content.choices.${index}.label`)}
                                    />
                                    <Textarea
                                        placeholder="Choice description (optional)"
                                        rows={2}
                                        {...register(`content.choices.${index}.description`)}
                                    />
                                </div>
                            ))}
                        </div>
                        {errors.content?.choices && (
                            <p className="text-sm text-destructive">
                                {errors.content.choices.message ||
                                    errors.content.choices.root?.message}
                            </p>
                        )}
                        {fields.length < 6 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addChoice}
                                className="w-full"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Choice
                            </Button>
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
