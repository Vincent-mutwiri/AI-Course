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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { aiGeneratorBlockSchema, type AIGeneratorBlock } from '@/lib/validation/blockSchemas';

interface AIGeneratorBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: AIGeneratorBlock) => void;
    initialData?: Partial<AIGeneratorBlock>;
}

const GENERATOR_TYPES = [
    { value: 'gameMaster', label: 'Game Master Generator' },
    { value: 'narrative', label: 'Narrative Generator' },
    { value: 'pitchAnalysis', label: 'Pitch Analysis Generator' },
    { value: 'general', label: 'General AI Generator' },
];

export function AIGeneratorBlockModal({ open, onClose, onSave, initialData }: AIGeneratorBlockModalProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AIGeneratorBlock>({
        resolver: zodResolver(aiGeneratorBlockSchema),
        defaultValues: {
            type: 'aiGenerator',
            content: {
                generatorType: initialData?.content?.generatorType || 'general',
                title: initialData?.content?.title || '',
                description: initialData?.content?.description || '',
                prompt: initialData?.content?.prompt || '',
                placeholder: initialData?.content?.placeholder || '',
                config: initialData?.content?.config || {},
            },
        },
    });

    const generatorType = watch('content.generatorType');

    const onSubmit = (data: AIGeneratorBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit AI Generator Block' : 'Add AI Generator Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Generator Type */}
                    <div className="space-y-2">
                        <Label htmlFor="generatorType">Generator Type *</Label>
                        <Select
                            value={generatorType}
                            onValueChange={(value) => setValue('content.generatorType', value, { shouldValidate: true })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select generator type" />
                            </SelectTrigger>
                            <SelectContent>
                                {GENERATOR_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.content?.generatorType && (
                            <p className="text-sm text-destructive">
                                {errors.content.generatorType.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The type of AI generator to use
                        </p>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="AI Generator title"
                            {...register('content.title')}
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive">
                                {errors.content.title.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The title displayed to students (max 200 characters)
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe what this AI generator does..."
                            rows={3}
                            {...register('content.description')}
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive">
                                {errors.content.description.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Instructions or context for students (max 1000 characters)
                        </p>
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                        <Label htmlFor="prompt">System Prompt (Optional)</Label>
                        <Textarea
                            id="prompt"
                            placeholder="Enter the system prompt for the AI..."
                            rows={4}
                            {...register('content.prompt')}
                        />
                        {errors.content?.prompt && (
                            <p className="text-sm text-destructive">
                                {errors.content.prompt.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The system prompt that guides the AI's behavior (max 2000 characters)
                        </p>
                    </div>

                    {/* Placeholder */}
                    <div className="space-y-2">
                        <Label htmlFor="placeholder">Input Placeholder (Optional)</Label>
                        <Input
                            id="placeholder"
                            placeholder="Enter your input..."
                            {...register('content.placeholder')}
                        />
                        {errors.content?.placeholder && (
                            <p className="text-sm text-destructive">
                                {errors.content.placeholder.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Placeholder text for the student input field
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
