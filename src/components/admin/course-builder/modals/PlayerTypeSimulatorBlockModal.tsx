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
import { playerTypeSimulatorBlockSchema, type PlayerTypeSimulatorBlock } from '@/lib/validation/blockSchemas';
import { Plus, Trash2 } from 'lucide-react';

interface PlayerTypeSimulatorBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: PlayerTypeSimulatorBlock) => void;
    initialData?: Partial<PlayerTypeSimulatorBlock>;
}

export function PlayerTypeSimulatorBlockModal({ open, onClose, onSave, initialData }: PlayerTypeSimulatorBlockModalProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<PlayerTypeSimulatorBlock>({
        resolver: zodResolver(playerTypeSimulatorBlockSchema),
        defaultValues: {
            type: 'playerTypeSimulator',
            content: {
                title: initialData?.content?.title || '',
                description: initialData?.content?.description || '',
                playerTypes: initialData?.content?.playerTypes || [],
                config: initialData?.content?.config || {},
            },
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'content.playerTypes',
    });

    const onSubmit = (data: PlayerTypeSimulatorBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Player Type Simulator Block' : 'Add Player Type Simulator Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="Player type simulator title"
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
                            placeholder="Describe the player type simulator..."
                            rows={3}
                            {...register('content.description')}
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive">
                                {errors.content.description.message}
                            </p>
                        )}
                    </div>

                    {/* Player Types */}
                    <div className="space-y-2">
                        <Label>Player Types (Optional)</Label>
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-3 border rounded-md space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Player Type {index + 1}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => remove(index)}
                                            title="Remove player type"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Input
                                        placeholder="Player type name"
                                        {...register(`content.playerTypes.${index}.name`)}
                                    />
                                    <Textarea
                                        placeholder="Description (optional)"
                                        rows={2}
                                        {...register(`content.playerTypes.${index}.description`)}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ name: '', description: '' })}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Player Type
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
