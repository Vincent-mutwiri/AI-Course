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
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContextBuilder } from '@/services/courseContextBuilder';

interface ListBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ListBlock) => void;
    initialData?: Partial<ListBlock>;
    courseId?: string;
    moduleId?: string;
    lessonId?: string;
}

export function ListBlockModal({ open, onClose, onSave, initialData, courseId, moduleId, lessonId }: ListBlockModalProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ListBlock>({
        resolver: zodResolver(listBlockSchema) as any,
        defaultValues: {
            type: 'list',
            content: {
                listType: initialData?.content?.listType || 'bullet',
                items: initialData?.content?.items || [{ text: '', checked: false }],
            },
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'content.items',
    });

    const listType = watch('content.listType');
    const items = watch('content.items');

    // Auto-detect list type from content
    const detectListType = (content: any): 'bullet' | 'numbered' | 'checkbox' => {
        const text = JSON.stringify(content).toLowerCase();
        if (text.includes('step') || text.includes('first') || text.includes('second') || /\d+\./.test(text)) {
            return 'numbered';
        }
        if (text.includes('checklist') || text.includes('task') || text.includes('todo') || text.includes('complete')) {
            return 'checkbox';
        }
        return 'bullet';
    };

    // Handle AI-generated content
    const handleContentGenerated = (content: any) => {
        let parsedItems: string[] = [];
        
        if (typeof content === 'string') {
            parsedItems = content.split(/\n+/).map(item => item.replace(/^[•\-*\d+\.\[\]\s]+/, '').trim()).filter(text => text.length > 0);
        } else if (Array.isArray(content)) {
            parsedItems = content.map(item => typeof item === 'string' ? item : (item.text || item.item || '')).filter(text => text.trim().length > 0);
        } else if (content.items && Array.isArray(content.items)) {
            parsedItems = content.items.map((item: any) => typeof item === 'string' ? item : (item.text || item.item || '')).filter((text: string) => text.trim().length > 0);
        } else if (content.list && Array.isArray(content.list)) {
            parsedItems = content.list.map((item: any) => typeof item === 'string' ? item : (item.text || item.item || '')).filter((text: string) => text.trim().length > 0);
        }
        
        if (parsedItems.length > 0) {
            const detectedType = content.listType || content.type || detectListType(content);
            setValue('content.listType', detectedType, { shouldValidate: true });
            replace(parsedItems.slice(0, 100).map(text => ({ text, checked: false })));
        }
    };

    const onSubmit = (data: any) => {
        onSave(data as ListBlock);
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
                    <p className="text-sm text-muted-foreground">
                        Create bullet points, numbered lists, or checklists to organize information
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* AI Content Assistant */}
                    <div className="mb-4">
                        <AIAssistantPanel
                            blockType="list"
                            courseContext={CourseContextBuilder.buildContext({ courseId, moduleId, lessonId })}
                            onContentGenerated={handleContentGenerated}
                            currentContent={{ listType, items }}
                            placeholder="Describe the list you want to generate (e.g., 'Create 5 steps for implementing gamification' or 'Generate a checklist for course design best practices')"
                        />
                    </div>

                    {/* List Type Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            List Type <span className="text-destructive" aria-label="required">*</span>
                        </Label>
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
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <span>⚠️</span>
                                {errors.content.listType.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            • Bullet: Unordered list with bullet points<br />
                            • Numbered: Ordered list with sequential numbers<br />
                            • Checkbox: Interactive checklist for students
                        </p>
                    </div>

                    {/* List Items */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                                List Items <span className="text-destructive" aria-label="required">*</span>
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
                                            aria-label={`List item ${index + 1}`}
                                        />
                                        {errors.content?.items?.[index]?.text && (
                                            <p className="text-xs text-destructive mt-1 flex items-center gap-1" role="alert">
                                                <span>⚠️</span>
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
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <span>⚠️</span>
                                {errors.content.items.message as string}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Minimum 1 item required, maximum 100 items. Each item can be up to 1,000 characters.
                        </p>
                    </div>

                    <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                        <strong>💡 Tip:</strong> Use bullet lists for unordered information, numbered lists for sequential steps,
                        and checkbox lists for tasks or learning objectives students can track.
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
                            aria-label={isSubmitting ? 'Saving list block' : 'Save list block'}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
