import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { choiceComparisonBlockSchema, type ChoiceComparisonBlock } from '@/lib/validation/blockSchemas';
import { Plus, Trash2, AlertCircle, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChoiceComparisonBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ChoiceComparisonBlock) => void;
    initialData?: Partial<ChoiceComparisonBlock>;
}

interface ChoiceEntry {
    label: string;
    description?: string;
}

export function ChoiceComparisonBlockModal({ open, onClose, onSave, initialData }: ChoiceComparisonBlockModalProps) {
    const [choices, setChoices] = useState<ChoiceEntry[]>([
        { label: '' },
        { label: '' },
    ]);

    // Reset choices when modal opens or initialData changes
    React.useEffect(() => {
        if (open) {
            console.log('[ChoiceComparisonModal] Modal opened with initialData:', initialData);

            const initialChoices: ChoiceEntry[] = initialData?.content?.choices || [
                { label: '' },
                { label: '' },
            ];

            console.log('[ChoiceComparisonModal] Setting initial choices:', initialChoices);
            setChoices(initialChoices);
        }
    }, [open, initialData]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChoiceComparisonBlock>({
        defaultValues: {
            type: 'choiceComparison',
            content: {
                question: '',
                title: '',
            },
        },
    });

    // Reset form when modal opens with initialData
    React.useEffect(() => {
        if (open) {
            reset({
                type: 'choiceComparison',
                content: {
                    question: initialData?.content?.question || '',
                    title: initialData?.content?.title || '',
                },
            });
        }
    }, [open, initialData, reset]);

    const addChoice = () => {
        if (choices.length < 6) {
            setChoices([...choices, { label: '', description: '' }]);
        }
    };

    const removeChoice = (index: number) => {
        if (choices.length > 2) {
            setChoices(choices.filter((_, i) => i !== index));
        }
    };

    const updateChoice = (index: number, field: keyof ChoiceEntry, value: string) => {
        const newChoices = [...choices];
        newChoices[index] = { ...newChoices[index], [field]: value };
        setChoices(newChoices);
    };

    const onSubmit = (data: any) => {
        const choicesArray = choices
            .filter(c => c.label.trim())
            .map(c => ({
                label: c.label.trim(),
                description: c.description?.trim() || '',
            }));

        const finalData = {
            type: 'choiceComparison' as const,
            content: {
                title: data.content.title || '',
                question: data.content.question || '',
                choices: choicesArray,
                config: {},
            },
        };

        console.log('onSubmit - finalData:', JSON.stringify(finalData, null, 2));
        onSave(finalData);
        onClose();
    };

    const handleSaveClick = () => {
        console.log('handleSaveClick - choices state:', choices);
        const formData = {
            content: {
                title: (document.getElementById('title') as HTMLInputElement)?.value || '',
                question: (document.getElementById('question') as HTMLTextAreaElement)?.value || '',
            }
        };
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Choice Comparison Block' : 'Add Choice Comparison Block'}
                    </DialogTitle>
                    <DialogDescription>
                        Create an interactive activity where students compare different options or approaches
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Title <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., Compare Teaching Strategies"
                            {...register('content.title')}
                            aria-describedby="title-hint"
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <AlertCircle className="w-3 h-3" />
                                {errors.content.title.message}
                            </p>
                        )}
                        <p id="title-hint" className="text-xs text-muted-foreground">
                            Optional heading displayed above the comparison activity (max 200 characters)
                        </p>
                    </div>

                    {/* Question */}
                    <div className="space-y-2">
                        <Label htmlFor="question" className="text-sm font-medium">
                            Comparison Question <span className="text-destructive" aria-label="required">*</span>
                        </Label>
                        <Textarea
                            id="question"
                            placeholder="e.g., Which approach would work best for engaging reluctant learners?"
                            rows={2}
                            {...register('content.question')}
                            aria-describedby="question-hint"
                            aria-required="true"
                            aria-invalid={!!errors.content?.question}
                        />
                        {errors.content?.question && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert" aria-live="assertive">
                                <AlertCircle className="w-3 h-3" />
                                {errors.content.question.message}
                            </p>
                        )}
                        <p id="question-hint" className="text-xs text-muted-foreground">
                            The question or prompt that frames the comparison (5-500 characters)
                        </p>
                    </div>

                    {/* Choices */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium">
                                Choices to Compare <span className="text-destructive" aria-label="required">*</span>
                            </Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p>Add 2-6 options for students to compare. Each choice should have a clear label and optional description explaining the approach.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-3">
                            {choices.map((choice, index) => (
                                <div key={index} className="p-3 border rounded-lg space-y-2 bg-muted/30">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold">Choice {index + 1}</span>
                                        {choices.length > 2 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeChoice(index)}
                                                title="Remove choice"
                                                aria-label={`Remove choice ${index + 1}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`choice-label-${index}`} className="text-xs">
                                            Choice Label *
                                        </Label>
                                        <Input
                                            id={`choice-label-${index}`}
                                            placeholder="e.g., Gamification, Project-Based Learning"
                                            value={choice.label}
                                            onChange={(e) => updateChoice(index, 'label', e.target.value)}
                                            aria-required="true"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`choice-desc-${index}`} className="text-xs">
                                            Description <span className="text-muted-foreground">(Optional)</span>
                                        </Label>
                                        <Textarea
                                            id={`choice-desc-${index}`}
                                            placeholder="Provide additional context about this choice..."
                                            rows={2}
                                            value={choice.description}
                                            onChange={(e) => updateChoice(index, 'description', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Minimum 2 choices required, maximum 6 choices allowed. Add at least one choice with a label.
                        </p>
                        {choices.length < 6 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addChoice}
                                className="w-full"
                                aria-label="Add another choice"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Choice {choices.length >= 6 && '(Maximum reached)'}
                            </Button>
                        )}
                    </div>

                    <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                        <strong>💡 Best Practice:</strong> Provide choices that represent meaningfully different approaches.
                        Students will analyze and compare the pros and cons of each option.
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
                            type="button"
                            onClick={handleSaveClick}
                            disabled={isSubmitting}
                            aria-label={isSubmitting ? 'Saving choice comparison' : 'Save choice comparison'}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
