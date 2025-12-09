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
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContextBuilder } from '@/services/courseContextBuilder';

interface AIGeneratorBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: AIGeneratorBlock) => void;
    initialData?: Partial<AIGeneratorBlock>;
    courseId?: string;
    moduleId?: string;
    lessonId?: string;
}

const GENERATOR_TYPES = [
    {
        value: 'studyBuddy',
        label: 'Study Buddy',
        description: 'Text summarization and concept explanation'
    },
    {
        value: 'writingPartner',
        label: 'Writing Partner',
        description: 'Writing feedback and improvement suggestions'
    },
    {
        value: 'codeDebugger',
        label: 'Code Debugger',
        description: 'Code analysis and debugging assistance'
    },
    {
        value: 'lessonPlanner',
        label: 'Lesson Planner',
        description: 'Lesson plan generation for educators'
    },
    {
        value: 'rubricBuilder',
        label: 'Rubric Builder',
        description: 'Assessment rubric creation'
    },
    {
        value: 'policyDrafter',
        label: 'Policy Drafter',
        description: 'AI usage policy drafting'
    },
    {
        value: 'buildABot',
        label: 'Build-A-Bot',
        description: 'Custom AI personality builder'
    },
    {
        value: 'activityBuilder',
        label: 'Activity Builder',
        description: 'Active learning activity generator'
    },
    {
        value: 'quizGenerator',
        label: 'Quiz Generator',
        description: 'Quiz and assessment question generator'
    },
    {
        value: 'general',
        label: 'General AI Assistant',
        description: 'General-purpose AI assistance'
    },
];

export function AIGeneratorBlockModal({ open, onClose, onSave, initialData, courseId, moduleId, lessonId }: AIGeneratorBlockModalProps) {
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
                generatorType: initialData?.content?.generatorType || '',
                title: initialData?.content?.title || '',
                description: initialData?.content?.description || '',
                prompt: initialData?.content?.prompt || '',
                placeholder: initialData?.content?.placeholder || '',
                config: initialData?.content?.config || {},
            },
        },
    });

    const generatorType = watch('content.generatorType');
    const title = watch('content.title');
    const description = watch('content.description');

    // Handle AI-generated content
    const handleContentGenerated = (content: any) => {
        if (typeof content === 'string') {
            setValue('content.description', content, { shouldValidate: true });
        } else {
            if (content.title) {
                setValue('content.title', content.title, { shouldValidate: true });
            }
            if (content.description || content.instructions) {
                setValue('content.description', content.description || content.instructions, { shouldValidate: true });
            }
            if (content.prompt || content.systemPrompt) {
                setValue('content.prompt', content.prompt || content.systemPrompt, { shouldValidate: true });
            }
            if (content.placeholder) {
                setValue('content.placeholder', content.placeholder, { shouldValidate: true });
            }
        }
    };

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
                    {/* AI Content Assistant */}
                    <div className="mb-4">
                        <AIAssistantPanel
                            blockType="aiGenerator"
                            courseContext={CourseContextBuilder.buildContext({ courseId, moduleId, lessonId })}
                            onContentGenerated={handleContentGenerated}
                            currentContent={{ generatorType, title, description }}
                            placeholder="Describe the AI generator you want to create (e.g., 'Create a study buddy that helps students summarize complex topics' or 'Build a code debugger for Python beginners')"
                        />
                    </div>

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
                            <SelectContent className="max-h-[300px]">
                                {GENERATOR_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{type.label}</span>
                                            <span className="text-xs text-muted-foreground">{type.description}</span>
                                        </div>
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
                            Choose the type of AI assistance this generator will provide
                        </p>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Display Title *</Label>
                        <Input
                            id="title"
                            placeholder="e.g., AI Study Buddy, Writing Assistant, Code Helper"
                            {...register('content.title')}
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive">
                                {errors.content.title.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The heading students will see for this AI tool (max 200 characters)
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Instructions for Students (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="e.g., Paste your text here to get an AI-powered summary, or ask questions about concepts you want to understand better."
                            rows={3}
                            {...register('content.description')}
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive">
                                {errors.content.description.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Help text explaining how students should use this tool (max 1000 characters)
                        </p>
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                        <Label htmlFor="prompt">Custom System Prompt (Advanced, Optional)</Label>
                        <Textarea
                            id="prompt"
                            placeholder="Leave blank to use the default prompt for the selected generator type. Only customize if you need specific AI behavior."
                            rows={4}
                            {...register('content.prompt')}
                        />
                        {errors.content?.prompt && (
                            <p className="text-sm text-destructive">
                                {errors.content.prompt.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Override the default AI system prompt. Each generator type has a pre-configured prompt that works well for most cases. (max 2000 characters)
                        </p>
                    </div>

                    {/* Placeholder */}
                    <div className="space-y-2">
                        <Label htmlFor="placeholder">Input Field Placeholder (Optional)</Label>
                        <Input
                            id="placeholder"
                            placeholder="e.g., Paste your text here, Enter your code, Describe your lesson topic..."
                            {...register('content.placeholder')}
                        />
                        {errors.content?.placeholder && (
                            <p className="text-sm text-destructive">
                                {errors.content.placeholder.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Placeholder text shown in the student's input field before they type
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
