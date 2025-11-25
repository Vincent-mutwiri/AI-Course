import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Checkbox } from '@/components/ui/checkbox';
import { pollBlockSchema, type PollBlock } from '@/lib/validation/blockSchemas';
import { Plus, Trash2, GripVertical, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface PollBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: PollBlock) => void;
    initialData?: Partial<PollBlock>;
}

export function PollBlockModal({ open, onClose, onSave, initialData }: PollBlockModalProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<PollBlock>({
        resolver: zodResolver(pollBlockSchema),
        defaultValues: {
            type: 'poll',
            content: {
                question: initialData?.content?.question || '',
                title: initialData?.content?.title || '',
                allowMultiple: initialData?.content?.allowMultiple || false,
                showResults: initialData?.content?.showResults !== false,
                options: initialData?.content?.options && initialData.content.options.length > 0
                    ? initialData.content.options.map(opt => ({
                        id: opt.id || uuidv4(),
                        text: opt.text || '',
                        votes: 0, // Always start with 0 votes for clean state
                    }))
                    : [
                        { id: uuidv4(), text: '', votes: 0 },
                        { id: uuidv4(), text: '', votes: 0 },
                    ],
            },
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'content.options',
    });

    const allowMultiple = watch('content.allowMultiple');
    const options = watch('content.options');

    // Validate that at least 2 options have text
    const validOptionsCount = options?.filter(opt => opt.text?.trim().length > 0).length || 0;
    const hasMinimumOptions = validOptionsCount >= 2;

    const onSubmit = (data: PollBlock) => {
        // Ensure all options have IDs and reset votes to 0
        const cleanedData = {
            ...data,
            content: {
                ...data.content,
                options: data.content.options.map(opt => ({
                    id: opt.id || uuidv4(),
                    text: opt.text.trim(),
                    votes: 0, // Always start with 0 votes
                })),
            },
        };
        onSave(cleanedData);
        onClose();
    };

    const addOption = () => {
        if (fields.length < 10) {
            append({ id: uuidv4(), text: '', votes: 0 });
        }
    };

    const handleRemove = (index: number) => {
        if (fields.length > 2) {
            remove(index);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData?.content?.question ? 'Edit Poll Block' : 'Add Poll Block'}
                    </DialogTitle>
                    <DialogDescription>
                        Create an interactive poll to gather learner opinions and feedback
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Title <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., Quick Check-In"
                            {...register('content.title')}
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.content.title.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            An optional heading displayed above the poll question
                        </p>
                    </div>

                    {/* Question */}
                    <div className="space-y-2">
                        <Label htmlFor="question">
                            Poll Question <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="question"
                            placeholder="e.g., What's your biggest challenge with gamification?"
                            {...register('content.question')}
                        />
                        {errors.content?.question && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.content.question.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The main question learners will respond to (5-500 characters)
                        </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                        <Label>
                            Answer Options <span className="text-destructive">*</span>
                        </Label>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-start">
                                    <div className="flex items-center pt-2">
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            placeholder={`Option ${index + 1}`}
                                            {...register(`content.options.${index}.text`)}
                                        />
                                        {errors.content?.options?.[index]?.text && (
                                            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.content.options[index]?.text?.message}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemove(index)}
                                        disabled={fields.length <= 2}
                                        title={fields.length <= 2 ? "Minimum 2 options required" : "Remove option"}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* General options error */}
                        {errors.content?.options && typeof errors.content.options === 'object' && 'message' in errors.content.options && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.content.options.message}
                            </p>
                        )}

                        {/* Validation feedback */}
                        {!hasMinimumOptions && validOptionsCount > 0 && (
                            <p className="text-sm text-amber-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Add at least {2 - validOptionsCount} more option{2 - validOptionsCount > 1 ? 's' : ''} with text
                            </p>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addOption}
                            disabled={fields.length >= 10}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option {fields.length >= 10 && '(Maximum reached)'}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Polls require 2-10 answer options. Each option should be 1-200 characters.
                        </p>
                    </div>

                    {/* Settings */}
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium">Poll Settings</h4>

                        {/* Allow Multiple */}
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="allowMultiple"
                                checked={allowMultiple}
                                onCheckedChange={(checked) =>
                                    setValue('content.allowMultiple', checked as boolean)
                                }
                            />
                            <div className="space-y-1">
                                <Label htmlFor="allowMultiple" className="cursor-pointer font-normal">
                                    Allow multiple selections
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Let learners select more than one option
                                </p>
                            </div>
                        </div>

                        {/* Show Results */}
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="showResults"
                                defaultChecked={true}
                                {...register('content.showResults')}
                            />
                            <div className="space-y-1">
                                <Label htmlFor="showResults" className="cursor-pointer font-normal">
                                    Show results after voting
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Display vote percentages and totals after submission
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !hasMinimumOptions}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Poll'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
