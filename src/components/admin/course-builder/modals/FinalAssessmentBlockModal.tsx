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
import { Plus, Trash2, X, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContextBuilder } from '@/services/courseContextBuilder';

interface FinalAssessmentBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: FinalAssessmentBlock) => void;
    initialData?: Partial<FinalAssessmentBlock>;
}

export function FinalAssessmentBlockModal({ open, onClose, onSave, initialData }: FinalAssessmentBlockModalProps) {
    const [generatingRubric, setGeneratingRubric] = React.useState<number | null>(null);

    // Handle AI-generated questions
    const handleContentGenerated = (content: any) => {
        let questions: any[] = [];
        
        if (Array.isArray(content)) {
            questions = content;
        } else if (content.questions && Array.isArray(content.questions)) {
            questions = content.questions;
        } else if (content.question) {
            questions = [content];
        }
        
        const formattedQuestions = questions.map(q => {
            const questionType = q.type || (q.options && q.options.length > 0 ? 'multiple-choice' : 'short-answer');
            
            if (questionType === 'multiple-choice') {
                const options = (q.options || []).map((opt: any) => ({
                    text: typeof opt === 'string' ? opt : (opt.text || opt.option || ''),
                    feedback: typeof opt === 'object' ? (opt.feedback || opt.explanation || '') : ''
                }));
                
                let correctAnswer = '';
                if (typeof q.correctAnswer === 'number' && options[q.correctAnswer]) {
                    correctAnswer = options[q.correctAnswer].text;
                } else if (typeof q.correctAnswer === 'string') {
                    correctAnswer = q.correctAnswer;
                } else if (q.answer !== undefined) {
                    correctAnswer = typeof q.answer === 'number' ? options[q.answer]?.text || '' : q.answer;
                }
                
                return {
                    question: q.question || q.text || '',
                    type: 'multiple-choice',
                    options,
                    correctAnswer
                };
            } else {
                return {
                    question: q.question || q.text || '',
                    type: questionType,
                    maxScore: q.maxScore || q.points || 10,
                    rubric: q.rubric || q.gradingCriteria || '',
                    correctAnswer: q.correctAnswer || q.answer || q.sampleAnswer || ''
                };
            }
        }).filter(q => q.question);
        
        if (formattedQuestions.length > 0) {
            setValue('content.questions', formattedQuestions as any, { shouldValidate: true });
        }
        
        if (content.title) {
            setValue('content.title', content.title, { shouldValidate: true });
        }
        if (content.description || content.instructions) {
            setValue('content.description', content.description || content.instructions, { shouldValidate: true });
        }
    };

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

    const generateRubric = async (questionIndex: number) => {
        const question = watch(`content.questions.${questionIndex}.question`);
        const maxScore = watch(`content.questions.${questionIndex}.maxScore`) || 10;
        const questionType = watch(`content.questions.${questionIndex}.type`);

        if (!question) {
            toast.error('Please enter a question first');
            return;
        }

        setGeneratingRubric(questionIndex);
        try {
            const response = await api.post('/ai/chat', {
                message: `Create a detailed grading rubric for the following ${questionType} question. The rubric should help grade student responses on a scale of 0-${maxScore} points.

Question: ${question}

Generate a clear, structured rubric that includes:
1. Criteria for different score levels (e.g., 0-2, 3-5, 6-8, 9-${maxScore})
2. What to look for in excellent, good, fair, and poor responses
3. Key points that should be addressed
4. Common mistakes to watch for

Format the rubric in a clear, easy-to-read structure.`
            });

            const rubric = response.data.response;
            setValue(`content.questions.${questionIndex}.rubric`, rubric);
            toast.success('Rubric generated successfully!');
        } catch (error) {
            console.error('Failed to generate rubric:', error);
            toast.error('Failed to generate rubric. Please try again.');
        } finally {
            setGeneratingRubric(null);
        }
    };

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
                    {/* AI Content Assistant */}
                    <div className="mb-4">
                        <AIAssistantPanel
                            blockType="finalAssessment"
                            courseContext={CourseContextBuilder.buildContext({})}
                            onContentGenerated={handleContentGenerated}
                            currentContent={watch('content.questions')}
                            placeholder="Describe the quiz questions you want to generate (e.g., 'Generate 5 multiple choice questions about machine learning basics with varying difficulty' or 'Create 3 short answer questions about data structures')"
                        />
                    </div>

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
                            Note: Passing score is no longer enforced. All students who complete the assessment will receive their certificate.
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
                                                        setValue(`content.questions.${index}.options`, [
                                                            { text: '', feedback: '' },
                                                            { text: '', feedback: '' },
                                                            { text: '', feedback: '' },
                                                            { text: '', feedback: '' }
                                                        ] as any);
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
                                            <div className="space-y-3">
                                                <Label className="text-xs font-medium">
                                                    Answer Options <span className="text-destructive">*</span>
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Select the radio button next to the correct answer. Add feedback to explain why each option is right or wrong.
                                                </p>
                                                <div className="space-y-3">
                                                    {options.map((option: any, optionIndex) => {
                                                        const optionText = typeof option === 'string' ? option : option?.text || '';
                                                        const optionFeedback = typeof option === 'object' ? option?.feedback || '' : '';
                                                        const isCorrect = watch(`content.questions.${index}.correctAnswer`) === optionText;

                                                        return (
                                                            <div key={optionIndex} className="p-3 border rounded-lg space-y-2 bg-muted/20">
                                                                <div className="flex items-start gap-2">
                                                                    <input
                                                                        type="radio"
                                                                        name={`question-${index}-correct`}
                                                                        checked={isCorrect}
                                                                        onChange={() => {
                                                                            setValue(`content.questions.${index}.correctAnswer`, optionText);
                                                                        }}
                                                                        className="mt-3"
                                                                        title="Mark as correct answer"
                                                                    />
                                                                    <div className="flex-1 space-y-2">
                                                                        <Input
                                                                            placeholder={`Option ${optionIndex + 1}`}
                                                                            value={optionText}
                                                                            onChange={(e) => {
                                                                                const newOptions = [...options];
                                                                                const oldText = optionText;
                                                                                newOptions[optionIndex] = {
                                                                                    text: e.target.value,
                                                                                    feedback: optionFeedback
                                                                                };
                                                                                setValue(`content.questions.${index}.options`, newOptions);

                                                                                // Update correct answer if this option was marked as correct
                                                                                if (watch(`content.questions.${index}.correctAnswer`) === oldText) {
                                                                                    setValue(`content.questions.${index}.correctAnswer`, e.target.value);
                                                                                }
                                                                            }}
                                                                        />
                                                                        <Textarea
                                                                            placeholder="Feedback for this option (optional)"
                                                                            value={optionFeedback}
                                                                            onChange={(e) => {
                                                                                const newOptions = [...options];
                                                                                newOptions[optionIndex] = {
                                                                                    text: optionText,
                                                                                    feedback: e.target.value
                                                                                };
                                                                                setValue(`content.questions.${index}.options`, newOptions);
                                                                            }}
                                                                            rows={2}
                                                                            className="text-xs"
                                                                        />
                                                                    </div>
                                                                    {options.length > 2 && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const newOptions = options.filter((_: any, i: number) => i !== optionIndex);
                                                                                setValue(`content.questions.${index}.options`, newOptions);
                                                                                // Clear correct answer if removed option was correct
                                                                                if (watch(`content.questions.${index}.correctAnswer`) === optionText) {
                                                                                    setValue(`content.questions.${index}.correctAnswer`, '');
                                                                                }
                                                                            }}
                                                                            title="Remove option"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setValue(`content.questions.${index}.options`, [...options, { text: '', feedback: '' }]);
                                                    }}
                                                    className="w-full"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Option
                                                </Button>
                                            </div>
                                        )}

                                        {/* Short Answer / Essay - AI Grading */}
                                        {(questionType === 'short-answer' || questionType === 'essay') && (
                                            <div className="space-y-3">
                                                {/* Max Score */}
                                                <div className="space-y-1">
                                                    <Label htmlFor={`maxScore-${index}`} className="text-xs font-medium">
                                                        Maximum Score <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id={`maxScore-${index}`}
                                                        type="number"
                                                        min="1"
                                                        max="100"
                                                        placeholder="10"
                                                        {...register(`content.questions.${index}.maxScore`, { valueAsNumber: true })}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Points available for this question (used for AI grading)
                                                    </p>
                                                </div>

                                                {/* AI Rubric Generation */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor={`rubric-${index}`} className="text-xs font-medium">
                                                            Grading Rubric <span className="text-muted-foreground">(AI-Powered)</span>
                                                        </Label>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => generateRubric(index)}
                                                            disabled={generatingRubric === index}
                                                            className="h-7"
                                                        >
                                                            <Sparkles className="h-3 w-3 mr-1" />
                                                            {generatingRubric === index ? 'Generating...' : 'Generate with AI'}
                                                        </Button>
                                                    </div>
                                                    <Textarea
                                                        id={`rubric-${index}`}
                                                        placeholder="Click 'Generate with AI' to create a grading rubric, or write your own..."
                                                        rows={questionType === 'essay' ? 6 : 4}
                                                        {...register(`content.questions.${index}.rubric`)}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        This rubric will be used by AI to automatically grade student responses and provide feedback
                                                    </p>
                                                </div>

                                                {/* Sample Answer (Optional) */}
                                                <div className="space-y-1">
                                                    <Label htmlFor={`answer-${index}`} className="text-xs font-medium">
                                                        Sample Answer <span className="text-muted-foreground">(Optional)</span>
                                                    </Label>
                                                    <Textarea
                                                        id={`answer-${index}`}
                                                        placeholder="Provide an example of a good answer..."
                                                        rows={questionType === 'essay' ? 4 : 2}
                                                        {...register(`content.questions.${index}.correctAnswer`)}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Optional reference answer to help AI understand expected responses
                                                    </p>
                                                </div>
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
                                options: [
                                    { text: '', feedback: '' },
                                    { text: '', feedback: '' },
                                    { text: '', feedback: '' },
                                    { text: '', feedback: '' }
                                ],
                                correctAnswer: ''
                            } as any)}
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
