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
import { designFixerBlockSchema, type DesignFixerBlock } from '@/lib/validation/blockSchemas';
import { Plus, Trash2 } from 'lucide-react';

interface DesignFixerBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: DesignFixerBlock) => void;
    initialData?: Partial<DesignFixerBlock>;
}

export function DesignFixerBlockModal({ open, onClose, onSave, initialData }: DesignFixerBlockModalProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<DesignFixerBlock>({
        resolver: zodResolver(designFixerBlockSchema),
        defaultValues: {
            type: 'designFixer',
            content: {
                scenario: initialData?.content?.scenario || '',
                title: initialData?.content?.title || '',
                issues: initialData?.content?.issues || [],
                config: initialData?.content?.config || {},
            },
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'content.issues',
    });

    const onSubmit = (data: DesignFixerBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Design Fixer Block' : 'Add Design Fixer Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title (Optional)</Label>
                        <Input
                            id="title"
                            placeholder="Design fixer title"
                            {...register('content.title')}
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive">
                                {errors.content.title.message}
                            </p>
                        )}
                    </div>

                    {/* Scenario */}
                    <div className="space-y-2">
                        <Label htmlFor="scenario">Scenario *</Label>
                        <Textarea
                            id="scenario"
                            placeholder="Describe the design scenario that needs fixing..."
                            rows={4}
                            {...register('content.scenario')}
                        />
                        {errors.content?.scenario && (
                            <p className="text-sm text-destructive">
                                {errors.content.scenario.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The design scenario (10-2000 characters)
                        </p>
                    </div>

                    {/* Issues */}
                    <div className="space-y-2">
                        <Label>Design Issues (Optional)</Label>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            placeholder="Issue description"
                                            {...register(`content.issues.${index}.description`)}
                                        />
                                        <Input
                                            placeholder="Category (optional)"
                                            {...register(`content.issues.${index}.category`)}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        title="Remove issue"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ description: '', category: '' })}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Issue
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
