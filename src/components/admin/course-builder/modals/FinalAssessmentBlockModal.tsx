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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { finalAssessmentBlockSchema, type FinalAssessmentBlock } from '@/lib/validation/blockSchemas';
import { Plus, Trash2 } from 'lucide-react';

interface FinalAssessmentBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: FinalAssessmentBlock) => void;
    initialData?: Partial<FinalAssessmentBlock>;
}

export function FinalAssessmentBlockModal({ open, onClose, onSave, initialData }: FinalAssessmentBlockModalProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FinalAssessmentBlock>({
        resolver: zodResolver(finalAssessmentBlockSchema),
        defaultValues: {
            type: 'finalAssessment',
            content: {
                title: initialData?.content?.title || '',
                description: initialData?.content?.description || '',
                questions: initialData?.content?.questions || [],
                passingScore: initialData?.content?.passingScore || 70,
                config: initialData?.content?.config || {},
            },
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'content.questions',
    });

    const onSubmit = (data: FinalAssessmentBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Final Assessment Block' : 'Add Final Assessment Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="Final assessment title"
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
                            placeholder="Describe the final assessment..."
                            rows={3}
                            {...register('content.description')}
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive">
                                {errors.content.description.message}
                            </p>
                        )}
                    </div>

                    {/* Passing Score */}
                    <div className="space-y-2">
                        <Label htmlFor="passingScore">Passing Score (%) (Optional)</Label>
                        <Input
                            id="passingScore"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="70"
                            {...register('content.passingScore', { valueAsNumber: true })}
                        />
                        {errors.content?.passingScore && (
                            <p className="text-sm text-destructive">
                                {errors.content.passingScore.message}
                            </p>
                        )}
                    </div>

                    {/* Questions */}
                    <div className="space-y-2">
                        <Label>Questions (Optional)</Label>
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-3 border rounded-md space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Question {index + 1}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => remove(index)}
                                            title="Remove question"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Textarea
                                        placeholder="Question text"
                                        rows={2}
                                        {...register(`content.questions.${index}.question`)}
                                    />
                                    <Select
                                        value={watch(`content.questions.${index}.type`) || 'multiple-choice'}
                                        onValueChange={(value) =>
                                            setValue(`content.questions.${index}.type`, value as any)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Question type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                            <SelectItem value="short-answer">Short Answer</SelectItem>
                                            <SelectItem value="essay">Essay</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        placeholder="Correct answer (optional)"
                                        {...register(`content.questions.${index}.correctAnswer`)}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ question: '', type: 'multiple-choice' })}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
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
