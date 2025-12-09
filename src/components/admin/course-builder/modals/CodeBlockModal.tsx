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
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContextBuilder } from '@/services/courseContextBuilder';

interface CodeBlockModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: CodeBlock) => void;
    initialData?: Partial<CodeBlock>;
    courseId?: string;
    moduleId?: string;
    lessonId?: string;
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

export function CodeBlockModal({ open, onClose, onSave, initialData, courseId, moduleId, lessonId }: CodeBlockModalProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CodeBlock>({
        resolver: zodResolver(codeBlockSchema) as any,
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
    const code = watch('content.code');

    // Auto-detect programming language from code content
    const detectLanguage = (codeContent: string): string => {
        const trimmed = codeContent.trim();
        if (!trimmed) return 'javascript';

        // Python detection
        if (/^(def|class|import|from|if __name__|print\()/m.test(trimmed)) return 'python';
        
        // Java detection
        if (/^(public|private|protected)\s+(class|interface|enum)/m.test(trimmed)) return 'java';
        
        // C# detection
        if (/^(using|namespace|public class|private class)/m.test(trimmed)) return 'csharp';
        
        // HTML detection
        if (/^<!DOCTYPE html>|^<html|^<div|^<body/i.test(trimmed)) return 'html';
        
        // CSS detection
        if (/^[.#]?[a-zA-Z][\w-]*\s*\{|^@media|^@import/m.test(trimmed)) return 'css';
        
        // SQL detection
        if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s+/i.test(trimmed)) return 'sql';
        
        // TypeScript detection (has type annotations)
        if (/:\s*(string|number|boolean|any|void|Promise|Array)/m.test(trimmed)) return 'typescript';
        
        // Default to JavaScript
        return 'javascript';
    };

    // Handle AI-generated content
    const handleContentGenerated = (content: any) => {
        if (typeof content === 'string') {
            // Plain string - treat as code
            setValue('content.code', content, { shouldValidate: true });
            const detectedLang = detectLanguage(content);
            setValue('content.language', detectedLang, { shouldValidate: true });
        } else {
            // Structured content
            if (content.code) {
                setValue('content.code', content.code, { shouldValidate: true });
                
                // Auto-detect language if not provided
                const lang = content.language || detectLanguage(content.code);
                setValue('content.language', lang, { shouldValidate: true });
            }
            
            if (content.explanation || content.title) {
                setValue('content.title', content.explanation || content.title, { shouldValidate: true });
            }
        }
    };

    const onSubmit = (data: any) => {
        onSave(data as CodeBlock);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Code Block' : 'Add Code Block'}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Add code snippets with syntax highlighting to your lesson
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* AI Content Assistant */}
                    <div className="mb-4">
                        <AIAssistantPanel
                            blockType="code"
                            courseContext={CourseContextBuilder.buildContext({ courseId, moduleId, lessonId })}
                            onContentGenerated={handleContentGenerated}
                            currentContent={{ code, language }}
                            placeholder="Describe the code example you want to generate (e.g., 'Create a Python function to calculate fibonacci numbers' or 'Show a React component with useState hook')"
                        />
                    </div>

                    {/* Title (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Title <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., Example: User Authentication Function"
                            {...register('content.title')}
                            aria-describedby="title-hint"
                        />
                        {errors.content?.title && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <span>⚠️</span>
                                {errors.content.title.message}
                            </p>
                        )}
                        <p id="title-hint" className="text-xs text-muted-foreground">
                            Optional title displayed above the code block (max 200 characters)
                        </p>
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="language" className="text-sm font-medium">
                            Programming Language <span className="text-destructive" aria-label="required">*</span>
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
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                                <span>⚠️</span>
                                {errors.content.language.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Select the language for proper syntax highlighting
                        </p>
                    </div>

                    {/* Code Input */}
                    <div className="space-y-2">
                        <Label htmlFor="code" className="text-sm font-medium">
                            Code <span className="text-destructive" aria-label="required">*</span>
                        </Label>
                        <Textarea
                            id="code"
                            placeholder="Paste your code here..."
                            rows={15}
                            className="font-mono text-sm"
                            {...register('content.code')}
                            aria-describedby="code-hint"
                            aria-required="true"
                            aria-invalid={!!errors.content?.code}
                        />
                        {errors.content?.code && (
                            <p className="text-sm text-destructive flex items-center gap-1" role="alert" aria-live="assertive">
                                <span>⚠️</span>
                                {errors.content.code.message}
                            </p>
                        )}
                        <p id="code-hint" className="text-xs text-muted-foreground">
                            Paste or type your code snippet (max 10,000 characters). The code will be displayed with syntax highlighting.
                        </p>
                    </div>

                    <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                        <strong>💡 Best Practice:</strong> Keep code examples concise and focused on the concept you're teaching.
                        Add comments to explain key parts of the code.
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
                            aria-label={isSubmitting ? 'Saving code block' : 'Save code block'}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
