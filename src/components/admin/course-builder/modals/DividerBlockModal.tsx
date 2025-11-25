import React from 'react';
import { useForm } from 'react-hook-form';
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
import { dividerBlockSchema, type DividerBlock } from '@/lib/validation/blockSchemas';

interface DividerBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: DividerBlock) => void;
    initialData?: Partial<DividerBlock>;
}

export function DividerBlockModal({ open, onClose, onSave, initialData }: DividerBlockModalProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<DividerBlock>({
        resolver: zodResolver(dividerBlockSchema) as any,
        defaultValues: {
            type: 'divider',
            content: {
                style: initialData?.content?.style || 'solid',
                spacing: initialData?.content?.spacing || 'medium',
            },
        },
    });

    const style = watch('content.style');
    const spacing = watch('content.spacing');

    const onSubmit = (data: any) => {
        onSave(data as DividerBlock);
        onClose();
    };

    const getDividerStyle = () => {
        const styles = {
            solid: 'border-t-2 border-solid',
            dashed: 'border-t-2 border-dashed',
            dotted: 'border-t-2 border-dotted',
        };
        return styles[style as keyof typeof styles] || styles.solid;
    };

    const getSpacingClass = () => {
        const spacings = {
            small: 'my-2',
            medium: 'my-4',
            large: 'my-8',
        };
        return spacings[spacing as keyof typeof spacings] || spacings.medium;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Divider Block' : 'Add Divider Block'}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Add a visual separator to break up content sections
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Style Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Divider Style</Label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="solid"
                                    {...register('content.style')}
                                    className="w-4 h-4"
                                />
                                <span>Solid</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="dashed"
                                    {...register('content.style')}
                                    className="w-4 h-4"
                                />
                                <span>Dashed</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="dotted"
                                    {...register('content.style')}
                                    className="w-4 h-4"
                                />
                                <span>Dotted</span>
                            </label>
                        </div>
                        {errors.content?.style && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <span>⚠️</span>
                                {errors.content.style.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Choose the visual style of the divider line
                        </p>
                    </div>

                    {/* Spacing Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Spacing</Label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="small"
                                    {...register('content.spacing')}
                                    className="w-4 h-4"
                                />
                                <span>Small</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="medium"
                                    {...register('content.spacing')}
                                    className="w-4 h-4"
                                />
                                <span>Medium</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="large"
                                    {...register('content.spacing')}
                                    className="w-4 h-4"
                                />
                                <span>Large</span>
                            </label>
                        </div>
                        {errors.content?.spacing && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <span>⚠️</span>
                                {errors.content.spacing.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Control the vertical space above and below the divider
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Preview</Label>
                        <div className="border rounded-md p-4 bg-muted/50">
                            <div className={getSpacingClass()}>
                                <div className={getDividerStyle()} />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This is how the divider will appear in your lesson
                        </p>
                    </div>

                    <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                        <strong>💡 Tip:</strong> Use dividers to create visual breaks between major sections or topics.
                        Solid lines work well for strong separations, while dashed or dotted lines are more subtle.
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
                            aria-label={isSubmitting ? 'Saving divider block' : 'Save divider block'}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
