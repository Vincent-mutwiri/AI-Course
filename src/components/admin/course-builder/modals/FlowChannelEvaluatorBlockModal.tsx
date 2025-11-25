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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { flowChannelEvaluatorBlockSchema, type FlowChannelEvaluatorBlock } from '@/lib/validation/blockSchemas';

interface FlowChannelEvaluatorBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: FlowChannelEvaluatorBlock) => void;
    initialData?: Partial<FlowChannelEvaluatorBlock>;
}

export function FlowChannelEvaluatorBlockModal({ open, onClose, onSave, initialData }: FlowChannelEvaluatorBlockModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FlowChannelEvaluatorBlock>({
        resolver: zodResolver(flowChannelEvaluatorBlockSchema),
        defaultValues: {
            type: 'flowChannelEvaluator',
            content: {
                title: initialData?.content?.title || '',
                description: initialData?.content?.description || '',
                scenario: initialData?.content?.scenario || '',
                config: initialData?.content?.config || {},
            },
        },
    });

    const onSubmit = (data: FlowChannelEvaluatorBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Flow Channel Evaluator Block' : 'Add Flow Channel Evaluator Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="Flow channel evaluator title"
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
                            placeholder="Describe the flow channel evaluator..."
                            rows={3}
                            {...register('content.description')}
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive">
                                {errors.content.description.message}
                            </p>
                        )}
                    </div>

                    {/* Scenario */}
                    <div className="space-y-2">
                        <Label htmlFor="scenario">Scenario (Optional)</Label>
                        <Textarea
                            id="scenario"
                            placeholder="Describe the scenario to evaluate..."
                            rows={4}
                            {...register('content.scenario')}
                        />
                        {errors.content?.scenario && (
                            <p className="text-sm text-destructive">
                                {errors.content.scenario.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The scenario for flow channel evaluation (max 2000 characters)
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
