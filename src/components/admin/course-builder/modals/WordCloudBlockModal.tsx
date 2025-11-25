import React, { useState } from 'react';
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
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { wordCloudBlockSchema, type WordCloudBlock } from '@/lib/validation/blockSchemas';

interface WordCloudBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: WordCloudBlock) => void;
    initialData?: Partial<WordCloudBlock>;
}

interface WordEntry {
    text: string;
    value: number;
    mapping: string;
}

export function WordCloudBlockModal({ open, onClose, onSave, initialData }: WordCloudBlockModalProps) {
    const [words, setWords] = useState<WordEntry[]>([{ text: '', value: 50, mapping: '' }]);

    // Reset words when modal opens or initialData changes
    React.useEffect(() => {
        if (open) {
            console.log('[WordCloudModal] Modal opened with initialData:', initialData);

            const initialWords: WordEntry[] = initialData?.content?.words?.map((w: any) => ({
                text: w.text || '',
                value: w.value || 50,
                mapping: initialData?.content?.mappings?.[w.text] || ''
            })) || [{ text: '', value: 50, mapping: '' }];

            console.log('[WordCloudModal] Setting initial words:', initialWords);
            setWords(initialWords);
        }
    }, [open, initialData]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<WordCloudBlock>({
        defaultValues: {
            type: 'wordCloud',
            content: {
                title: '',
                description: '',
                instructionText: '',
                summaryText: '',
            },
        },
    });

    // Reset form when modal opens with initialData
    React.useEffect(() => {
        if (open) {
            reset({
                type: 'wordCloud',
                content: {
                    title: initialData?.content?.title || '',
                    description: initialData?.content?.description || '',
                    instructionText: initialData?.content?.instructionText || '',
                    summaryText: initialData?.content?.summaryText || '',
                },
            });
        }
    }, [open, initialData, reset]);

    const addWord = () => {
        setWords([...words, { text: '', value: 50, mapping: '' }]);
    };

    const removeWord = (index: number) => {
        setWords(words.filter((_, i) => i !== index));
    };

    const updateWord = (index: number, field: keyof WordEntry, value: string | number) => {
        const newWords = [...words];
        newWords[index] = { ...newWords[index], [field]: value };
        setWords(newWords);
    };

    const onSubmit = (data: any) => {
        const wordsArray = words
            .filter(w => w.text.trim())
            .map(w => ({ text: w.text.trim(), value: w.value }));

        const mappingsObject = words
            .filter(w => w.text.trim() && w.mapping.trim())
            .reduce((acc, w) => {
                acc[w.text.trim()] = w.mapping.trim();
                return acc;
            }, {} as Record<string, string>);

        const finalData = {
            type: 'wordCloud',
            content: {
                title: data.content.title || '',
                description: data.content.description || '',
                instructionText: data.content.instructionText || '',
                summaryText: data.content.summaryText || '',
                words: wordsArray,
                mappings: mappingsObject,
            },
        };

        console.log('onSubmit - finalData:', JSON.stringify(finalData, null, 2));
        onSave(finalData);
        onClose();
    };

    const handleSaveClick = () => {
        console.log('handleSaveClick - words state:', words);
        const formData = {
            content: {
                title: (document.getElementById('title') as HTMLInputElement)?.value || '',
                description: (document.getElementById('description') as HTMLTextAreaElement)?.value || '',
                instructionText: (document.getElementById('instructionText') as HTMLInputElement)?.value || '',
                summaryText: (document.getElementById('summaryText') as HTMLTextAreaElement)?.value || '',
            }
        };
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Word Cloud Block' : 'Add Word Cloud Block'}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Create an interactive word cloud where students can click words to see their connections
                    </p>
                </DialogHeader>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Community Insights"
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
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="e.g., Click on a word to see which motivation principle it connects to!"
                            rows={2}
                            {...register('content.description')}
                        />
                        {errors.content?.description && (
                            <p className="text-sm text-destructive">
                                {errors.content.description.message}
                            </p>
                        )}
                    </div>

                    {/* Words Configuration */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Label>Words & Mappings *</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p>Add words with their importance values (1-100) and what concept they map to. Higher values = larger text.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addWord}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Word
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                            {words.map((word, index) => (
                                <div key={index} className="flex gap-2 items-start p-2 bg-muted/50 rounded">
                                    <div className="flex-1 grid grid-cols-3 gap-2">
                                        <Input
                                            placeholder="Word"
                                            value={word.text}
                                            onChange={(e) => updateWord(index, 'text', e.target.value)}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Value (1-100)"
                                            min="1"
                                            max="100"
                                            value={word.value}
                                            onChange={(e) => updateWord(index, 'value', parseInt(e.target.value) || 50)}
                                        />
                                        <Input
                                            placeholder="Maps to..."
                                            value={word.mapping}
                                            onChange={(e) => updateWord(index, 'mapping', e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeWord(index)}
                                        disabled={words.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Add at least one word. Each word needs a text, value (size), and what it maps to.
                        </p>
                    </div>

                    {/* Instruction Text */}
                    <div className="space-y-2">
                        <Label htmlFor="instructionText">Instruction Text (Optional)</Label>
                        <Input
                            id="instructionText"
                            placeholder="e.g., 👆 Click on any word above to discover its connection"
                            {...register('content.instructionText')}
                        />
                        <p className="text-xs text-muted-foreground">
                            Text shown before a word is clicked
                        </p>
                    </div>

                    {/* Summary Text */}
                    <div className="space-y-2">
                        <Label htmlFor="summaryText">Summary Text (Optional)</Label>
                        <Textarea
                            id="summaryText"
                            placeholder="e.g., These are the most common responses from educators..."
                            rows={2}
                            {...register('content.summaryText')}
                        />
                        <p className="text-xs text-muted-foreground">
                            Summary text shown at the bottom of the word cloud
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSaveClick} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
