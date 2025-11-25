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
import { Checkbox } from '@/components/ui/checkbox';
import { pollBlockSchema, type PollBlock } from '@/lib/validation/blockSchemas';
import { Plus, Trash2 } from 'lucide-react';

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
                options: initialData?.content?.options || [
                    { text: '', votes: 0 },
                    { text: '', votes: 0 },
                ],
            },
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'content.options',
    });

    const onSubmit = (data: PollBlock) => {
        onSave(data);
        onClose();
    };

    const addOption = () => {
        if (fields.length < 10) {
            append({ text: '', votes: 0 });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Poll Block' : 'Add Poll Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title (Optional)</Label>
                        <Input
                            id="title"
                            placeholder="Poll title"
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
                        <Input
                            id="question"
                            placeholder="What question do you want to ask?"
                            {...register('content.question')}
                        />
                        {errors.content?.question && (
                            <p className="text-sm text-destructive">
                                {errors.content.question.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The poll question (5-500 characters)
                        </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                        <Label>Options *</Label>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <Input
                                        placeholder={`Option ${index + 1}`}
                                        {...register(`content.options.${index}.text`)}
                                    />
                                    {fields.length > 2 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            title="Remove option"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.content?.options && (
                            <p className="text-sm text-destructive">
                                {errors.content.options.message ||
                                    errors.content.options.root?.message}
                            </p>
                        )}
                        {fields.length < 10 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addOption}
                                className="w-full"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Option
                            </Button>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Add 2-10 options for the poll
                        </p>
                    </div>

                    {/* Allow Multiple */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="allowMultiple"
                            {...register('content.allowMultiple')}
                        />
                        <Label htmlFor="allowMultiple" className="cursor-pointer">
                            Allow multiple selections
                        </Label>
                    </div>

                    {/* Show Results */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="showResults"
                            defaultChecked={true}
                            {...register('content.showResults')}
                        />
                        <Label htmlFor="showResults" className="cursor-pointer">
                            Show results after voting
                        </Label>
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
