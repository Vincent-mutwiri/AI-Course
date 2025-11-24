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
import { codeBlockSchema, type CodeBlock } from '@/lib/validation/blockSchemas';

interface CodeBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: CodeBlock) => void;
    initialData?: Partial<CodeBlock>;
}

const PROGRAMMING_LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'php', label: 'PHP' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'scss', label: 'SCSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'xml', label: 'XML' },
    { value: 'plaintext', label: 'Plain Text' },
];

export function CodeBlockModal({ open, onClose, onSave, initialData }: CodeBlockModalProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CodeBlock>({
        resolver: zodResolver(codeBlockSchema),
        defaultValues: {
            type: 'code',
            content: {
                code: initialData?.content?.code || '',
                language: initialData?.content?.language || 'javascript',
                title: initialData?.content?.title || '',
            },
        },
    });

    const language = watch('content.language');

    const onSubmit = (data: CodeBlock) => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Code Block' : 'Add Code Block'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title (Optional)</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Example: User Authentication"
                            {...register('content.title')}
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive">
                                {errors.content.title.message}
                            </p>
                        )}
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="language">
                            Programming Language <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={language}
                            onValueChange={(value) => setValue('content.language', value, { shouldValidate: true })}
                        >
                            <SelectTrigger id="language">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                                {PROGRAMMING_LANGUAGES.map((lang) => (
                                    <SelectItem key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.content?.language && (
                            <p className="text-sm text-destructive">
                                {errors.content.language.message}
                            </p>
                        )}
                    </div>

                    {/* Code Input */}
                    <div className="space-y-2">
                        <Label htmlFor="code">
                            Code <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="code"
                            placeholder="Paste your code here..."
                            rows={15}
                            className="font-mono text-sm"
                            {...register('content.code')}
                        />
                        {errors.content?.code && (
                            <p className="text-sm text-destructive">
                                {errors.content.code.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Maximum 10,000 characters
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
