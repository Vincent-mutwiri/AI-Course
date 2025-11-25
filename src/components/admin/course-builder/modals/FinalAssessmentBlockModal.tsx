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
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { finalAssessmentBlockSchema, type FinalAssessmentBlock } from '@/lib/validation/blockSchemas';
import { Plus, Trash2, X } from 'lucide-react';

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
                        <Label>Questions</Label>
                        <div className="space-y-4">
                            {fields.map((field, index) => {
                                const questionType = watch(`content.questions.${index}.type`) || 'multiple-choice';
                                const options = watch(`content.questions.${index}.options`) || [];

                                return (
                                    <div key={field.id} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold">Question {index + 1}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                                title="Remove question"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Question Text */}
                                        <div className="space-y-1">
                                            <Label htmlFor={`question-${index}`}>Question Text *</Label>
                                            <Textarea
                                                id={`question-${index}`}
                                                placeholder="Enter your question..."
                                                rows={2}
                                                {...register(`content.questions.${index}.question`)}
                                            />
                                            {errors.content?.questions?.[index]?.question && (
                                                <p className="text-sm text-destructive">
                                                    {errors.content.questions[index]?.question?.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Question Type */}
                                        <div className="space-y-1">
                                            <Label htmlFor={`type-${index}`}>Question Type *</Label>
                                            <Select
                                                value={questionType}
                                                onValueChange={(value) => {
                                                    setValue(`content.questions.${index}.type`, value as any);
                                                    // Reset options and correct answer when changing type
                                                    if (value !== 'multiple-choice') {
                                                        setValue(`content.questions.${index}.options`, []);
                                                        setValue(`content.questions.${index}.correctAnswer`, '');
                                                    } else {
                                                        setValue(`content.questions.${index}.options`, ['', '', '', '']);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger id={`type-${index}`}>
                                                    <SelectValue placeholder="Select question type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                                    <SelectItem value="short-answer">Short Answer</SelectItem>
                                                    <SelectItem value="essay">Essay</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Multiple Choice Options */}
                                        {questionType === 'multiple-choice' && (
                                            <div className="space-y-2">
                                                <Label>Answer Options *</Label>
                                                <div className="space-y-2">
                                                    {options.map((_, optionIndex) => (
                                                        <div key={optionIndex} className="flex items-center gap-2">
                                                            <Checkbox
                                                                checked={watch(`content.questions.${index}.correctAnswer`) === options[optionIndex]}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        setValue(`content.questions.${index}.correctAnswer`, options[optionIndex]);
                                                                    }
                                                                }}
                                                                title="Mark as correct answer"
                                                            />
                                                            <Input
                                                                placeholder={`Option ${optionIndex + 1}`}
                                                                value={options[optionIndex] || ''}
                                                                onChange={(e) => {
                                                                    const newOptions = [...options];
                                                                    const oldValue = newOptions[optionIndex];
                                                                    newOptions[optionIndex] = e.target.value;
                                                                    setValue(`content.questions.${index}.options`, newOptions);

                                                                    // Update correct answer if this option was marked as correct
                                                                    if (watch(`content.questions.${index}.correctAnswer`) === oldValue) {
                                                                        setValue(`content.questions.${index}.correctAnswer`, e.target.value);
                                                                    }
                                                                }}
                                                                className="flex-1"
                                                            />
                                                            {options.length > 2 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        const newOptions = options.filter((_, i) => i !== optionIndex);
                                                                        setValue(`content.questions.${index}.options`, newOptions);
                                                                        // Clear correct answer if removed option was correct
                                                                        if (watch(`content.questions.${index}.correctAnswer`) === options[optionIndex]) {
                                                                            setValue(`content.questions.${index}.correctAnswer`, '');
                                                                        }
                                                                    }}
                                                                    title="Remove option"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setValue(`content.questions.${index}.options`, [...options, '']);
                                                    }}
                                                    className="w-full"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Option
                                                </Button>
                                                <p className="text-xs text-muted-foreground">
                                                    Check the box next to the correct answer
                                                </p>
                                            </div>
                                        )}

                                        {/* Short Answer / Essay - Sample Answer */}
                                        {(questionType === 'short-answer' || questionType === 'essay') && (
                                            <div className="space-y-1">
                                                <Label htmlFor={`answer-${index}`}>
                                                    Sample Answer <span className="text-muted-foreground text-xs">(Optional)</span>
                                                </Label>
                                                <Textarea
                                                    id={`answer-${index}`}
                                                    placeholder="Provide a sample answer or grading rubric..."
                                                    rows={questionType === 'essay' ? 4 : 2}
                                                    {...register(`content.questions.${index}.correctAnswer`)}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    This will be used as a reference for grading
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({
                                question: '',
                                type: 'multiple-choice',
                                options: ['', '', '', ''],
                                correctAnswer: ''
                            })}
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
