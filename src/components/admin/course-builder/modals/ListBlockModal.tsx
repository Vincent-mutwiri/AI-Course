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
import { listBlockSchema, type ListBlock } from '@/lib/validation/blockSchemas';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface ListBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ListBlock) => void;
    initialData?: Partial<ListBlock>;
}

export function ListBlockModal({ open, onClose, onSave, initialData }: ListBlockModalProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ListBlock>({
        resolver: zodResolver(listBlockSchema),
        defaultValues: {
            type: 'list',
            content: {
                listType: initialData?.content?.listType || 'bullet',
                items: initialData?.content?.items || [{ text: '', checked: false }],
            },
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'content.items',
    });

    const listType = watch('content.listType');

    const onSubmit = (data: ListBlock) => {
        onSave(data);
        onClose();
    };

    const addItem = () => {
        append({ text: '', checked: false });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit List Block' : 'Add List Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* List Type Selection */}
                    <div className="space-y-2">
                        <Label>List Type</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="bullet"
                                    {...register('content.listType')}
                                    className="w-4 h-4"
                                />
                                <span>Bullet List</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="numbered"
                                    {...register('content.listType')}
                                    className="w-4 h-4"
                                />
                                <span>Numbered List</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="checkbox"
                                    {...register('content.listType')}
                                    className="w-4 h-4"
                                />
                                <span>Checkbox List</span>
                            </label>
                        </div>
                        {errors.content?.listType && (
                            <p className="text-sm text-destructive">
                                {errors.content.listType.message}
                            </p>
                        )}
                    </div>

                    {/* List Items */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>
                                List Items <span className="text-destructive">*</span>
                            </Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Item
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-start gap-2">
                                    <div className="flex items-center pt-2">
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>

                                    <div className="flex-1">
                                        <Input
                                            placeholder={`Item ${index + 1}`}
                                            {...register(`content.items.${index}.text`)}
                                        />
                                        {errors.content?.items?.[index]?.text && (
                                            <p className="text-xs text-destructive mt-1">
                                                {errors.content.items[index]?.text?.message}
                                            </p>
                                        )}
                                    </div>

                                    {listType === 'checkbox' && (
                                        <div className="flex items-center pt-2">
                                            <input
                                                type="checkbox"
                                                {...register(`content.items.${index}.checked`)}
                                                className="w-4 h-4"
                                            />
                                        </div>
                                    )}

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                        className="mt-1"
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {errors.content?.items && typeof errors.content.items === 'object' && 'message' in errors.content.items && (
                            <p className="text-sm text-destructive">
                                {errors.content.items.message as string}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Add at least one item. Maximum 100 items.
                        </p>
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
