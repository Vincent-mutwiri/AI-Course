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
import { Plus, Trash2, X, AlertCircle } from 'lucide-react';

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
                    <p className="text-sm text-muted-foreground">
                        Create a comprehensive assessment with multiple question types to evaluate student learning
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Assessment Title <span className="text-destructive" aria-label="required">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., Final Course Assessment, Module Quiz"
                            {...register('content.title')}
                            aria-describedby="title-hint"
                            aria-required="true"
                            aria-invalid={!!errors.content?.title}
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert" aria-live="assertive">
                                <AlertCircle className="w-3 h-3" />
                                {errors.content.title.message}
                            </p>
                        )}
                        <p id="title-hint" className="text-xs text-muted-foreground">
                            The title students will see for this assessment (max 200 characters)
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Instructions <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="e.g., This assessment covers all topics from the course. You have unlimited time to complete it. Good luck!"
                            rows={3}
                            {...register('content.description')}
                            aria-describedby="description-hint"
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <AlertCircle className="w-3 h-3" />
                                {errors.content.description.message}
                            </p>
                        )}
                        <p id="description-hint" className="text-xs text-muted-foreground">
                            Provide instructions or context for students taking the assessment (max 1000 characters)
                        </p>
                    </div>

                    {/* Passing Score */}
                    <div className="space-y-2">
                        <Label htmlFor="passingScore" className="text-sm font-medium">
                            Passing Score (%) <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Input
                            id="passingScore"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="70"
                            {...register('content.passingScore', { valueAsNumber: true })}
                            aria-describedby="passingScore-hint"
                        />
                        {errors.content?.passingScore && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <AlertCircle className="w-3 h-3" />
                                {errors.content.passingScore.message}
                            </p>
                        )}
                        <p id="passingScore-hint" className="text-xs text-muted-foreground">
                            Minimum percentage required to pass (0-100). Default is 70%
                        </p>
                    </div>

                    {/* Questions */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">
                            Assessment Questions <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Add questions to your assessment. Supports multiple choice, short answer, and essay questions.
                        </p>
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
                                            <Label htmlFor={`question-${index}`} className="text-xs font-medium">
                                                Question Text <span className="text-destructive">*</span>
                                            </Label>
                                            <Textarea
                                                id={`question-${index}`}
                                                placeholder="Enter your question..."
                                                rows={2}
                                                {...register(`content.questions.${index}.question`)}
                                                aria-required="true"
                                            />
                                            {errors.content?.questions?.[index]?.question && (
                                                <p className="text-xs text-destructive flex items-center gap-1" role="alert">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.content.questions[index]?.question?.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Question Type */}
                                        <div className="space-y-1">
                                            <Label htmlFor={`type-${index}`} className="text-xs font-medium">
                                                Question Type <span className="text-destructive">*</span>
                                            </Label>
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
                                                    <SelectItem value="multiple-choice">Multiple Choice (auto-graded)</SelectItem>
                                                    <SelectItem value="short-answer">Short Answer (manual grading)</SelectItem>
                                                    <SelectItem value="essay">Essay (manual grading)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-muted-foreground">
                                                {questionType === 'multiple-choice' && 'Students select one correct answer from multiple options'}
                                                {questionType === 'short-answer' && 'Students provide a brief written response'}
                                                {questionType === 'essay' && 'Students provide a detailed written response'}
                                            </p>
                                        </div>

                                        {/* Multiple Choice Options */}
                                        {questionType === 'multiple-choice' && (
                                            <div className="space-y-2">
                                                <Label className="text-xs font-medium">
                                                    Answer Options <span className="text-destructive">*</span>
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Check the box next to the correct answer
                                                </p>
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
                                            </div>
                                        )}

                                        {/* Short Answer / Essay - Sample Answer */}
                                        {(questionType === 'short-answer' || questionType === 'essay') && (
                                            <div className="space-y-1">
                                                <Label htmlFor={`answer-${index}`} className="text-xs font-medium">
                                                    Sample Answer / Grading Rubric <span className="text-muted-foreground">(Optional)</span>
                                                </Label>
                                                <Textarea
                                                    id={`answer-${index}`}
                                                    placeholder="Provide a sample answer or grading criteria to help with manual grading..."
                                                    rows={questionType === 'essay' ? 4 : 2}
                                                    {...register(`content.questions.${index}.correctAnswer`)}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    This reference will help instructors grade student responses consistently
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
                            aria-label="Add another question"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                        </Button>
                    </div>

                    <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                        <strong>💡 Best Practice:</strong> Mix question types to assess different levels of understanding.
                        Multiple choice for quick knowledge checks, short answer for application, and essay for deeper analysis.
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
                            aria-label={isSubmitting ? 'Saving assessment' : 'Save assessment'}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
