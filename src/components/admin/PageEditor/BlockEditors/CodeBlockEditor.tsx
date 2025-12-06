import React, { useState } from 'react';
import { IBlock } from '@/types/page';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { CourseContextBuilder, CourseContext } from '@/services/courseContextBuilder';
import './BlockEditors.css';

interface CodeBlockEditorProps {
    block: IBlock;
    onChange: (content: Partial<IBlock['content']>) => void;
    courseContext?: CourseContext;
    existingBlocks?: IBlock[];
}

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
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
    { value: 'plaintext', label: 'Plain Text' },
];

const CodeBlockEditor: React.FC<CodeBlockEditorProps> = ({
    block,
    onChange,
    courseContext,
    existingBlocks
}) => {
    const [generatedExplanation, setGeneratedExplanation] = useState<string>('');

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ code: e.target.value });
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ language: e.target.value });
    };

    /**
     * Build course context for AI generation
     * Uses provided context or creates a minimal context
     */
    const buildCourseContext = (): CourseContext => {
        if (courseContext) {
            // Use provided context and add existing blocks
            return {
                ...courseContext,
                existingBlocks: existingBlocks || courseContext.existingBlocks
            };
        }

        // Create minimal context if none provided
        return CourseContextBuilder.buildContext({
            existingBlocks: existingBlocks
        });
    };

    /**
     * Auto-detect programming language from code content
     * Uses simple heuristics to identify common languages
     */
    const detectLanguage = (code: string): string => {
        const trimmedCode = code.trim();

        // Check for common language patterns
        if (trimmedCode.includes('def ') || trimmedCode.includes('import ') && trimmedCode.includes(':')) {
            return 'python';
        }
        if (trimmedCode.includes('function ') || trimmedCode.includes('const ') || trimmedCode.includes('let ') || trimmedCode.includes('=>')) {
            return 'javascript';
        }
        if (trimmedCode.includes('interface ') || trimmedCode.includes(': string') || trimmedCode.includes(': number')) {
            return 'typescript';
        }
        if (trimmedCode.includes('public class ') || trimmedCode.includes('public static void main')) {
            return 'java';
        }
        if (trimmedCode.includes('using System') || trimmedCode.includes('namespace ')) {
            return 'csharp';
        }
        if (trimmedCode.includes('#include') || trimmedCode.includes('std::')) {
            return 'cpp';
        }
        if (trimmedCode.includes('package main') || trimmedCode.includes('func ')) {
            return 'go';
        }
        if (trimmedCode.includes('fn ') || trimmedCode.includes('let mut ')) {
            return 'rust';
        }
        if (trimmedCode.includes('<?php')) {
            return 'php';
        }
        if (trimmedCode.includes('SELECT ') || trimmedCode.includes('FROM ') || trimmedCode.includes('WHERE ')) {
            return 'sql';
        }
        if (trimmedCode.includes('<!DOCTYPE') || trimmedCode.includes('<html')) {
            return 'html';
        }
        if (trimmedCode.includes('{') && (trimmedCode.includes('color:') || trimmedCode.includes('margin:'))) {
            return 'css';
        }
        if (trimmedCode.startsWith('#!/bin/bash') || trimmedCode.includes('echo ')) {
            return 'bash';
        }

        // Default to current language or javascript
        return block.content.language || 'javascript';
    };

    /**
     * Handle AI-generated code content
     * Expected format: { code, explanation, language? }
     */
    const handleContentGenerated = (content: any) => {
        // Parse the generated content
        let parsedContent = content;

        // If content is a string, try to parse it as JSON
        if (typeof content === 'string') {
            try {
                parsedContent = JSON.parse(content);
            } catch {
                // If not JSON, treat as code text
                parsedContent = { code: content };
            }
        }

        // Update block content with generated data
        const updates: Partial<IBlock['content']> = {};

        if (parsedContent.code) {
            updates.code = parsedContent.code;

            // Auto-detect language from generated code
            const detectedLanguage = detectLanguage(parsedContent.code);
            updates.language = parsedContent.language || detectedLanguage;
        }

        // Store the generated explanation separately for display
        if (parsedContent.explanation) {
            setGeneratedExplanation(parsedContent.explanation);
        }

        // Apply updates to the block
        if (Object.keys(updates).length > 0) {
            onChange(updates);
        }
    };

    return (
        <div className="code-block-editor">
            {/* AI Content Assistant */}
            <div className="mb-4">
                <AIAssistantPanel
                    blockType="code"
                    courseContext={buildCourseContext()}
                    onContentGenerated={handleContentGenerated}
                    currentContent={block.content}
                    placeholder="Describe the code example you want to generate (e.g., 'Create a Python function that sorts a list using quicksort with inline comments explaining each step' or 'Generate a React component for a login form with validation')"
                />
            </div>

            <div className="form-group">
                <label htmlFor="language">Programming Language</label>
                <select
                    id="language"
                    value={block.content.language || 'javascript'}
                    onChange={handleLanguageChange}
                    className="form-control"
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="code">Code</label>
                <textarea
                    id="code"
                    value={block.content.code || ''}
                    onChange={handleCodeChange}
                    placeholder="Enter your code here..."
                    className="form-control code-textarea"
                    rows={15}
                    spellCheck={false}
                />
            </div>

            {block.content.code && (
                <div className="code-preview">
                    <label>Preview</label>
                    <div className="preview-container">
                        <div className="preview-header">
                            <span className="language-badge">
                                {LANGUAGES.find(l => l.value === block.content.language)?.label || 'Code'}
                            </span>
                        </div>
                        <pre className="preview-code">
                            <code>{block.content.code}</code>
                        </pre>
                    </div>
                </div>
            )}

            {/* Generated Explanation Display */}
            {generatedExplanation && (
                <div className="form-group mt-4">
                    <label>Code Explanation</label>
                    <div className="generated-explanation-container p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                        <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {generatedExplanation}
                        </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        This explanation describes what the code does and how it works. You can use it as reference material for learners.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CodeBlockEditor;
