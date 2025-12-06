import React, { useState, useEffect } from 'react';
import { BlockType } from '@/types/page';
import { CourseContext } from '@/services/courseContextBuilder';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllTemplatesForBlockType, ContentTemplate } from '@/config/contentTemplates';
import { aiContentCache, GenerationOptions } from '@/utils/aiContentCache';
import { addToHistory } from '@/components/admin/GenerationHistory';
import api from '@/services/api';

/**
 * Props for AIAssistantPanel component
 */
export interface AIAssistantPanelProps {
    blockType: BlockType;
    courseContext: CourseContext;
    onContentGenerated: (content: any) => void;
    currentContent?: any;
    placeholder?: string;
}

/**
 * AIAssistantPanel Component
 * 
 * Provides AI-powered content generation assistance within block editors.
 * Features:
 * - Collapsible panel UI
 * - Template selection
 * - Custom prompt input
 * - Content generation and refinement
 * - Loading and error states
 */
export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
    blockType,
    courseContext,
    onContentGenerated,
    currentContent,
    placeholder = 'Describe what content you want to generate...'
}) => {
    // Panel state
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Template state
    const [templates, setTemplates] = useState<ContentTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
    const [customPrompt, setCustomPrompt] = useState<string>('');

    // Generation options state
    const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
        tone: 'conversational',
        readingLevel: 'college',
        length: 'moderate'
    });

    // Generated content state
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [refinementHistory, setRefinementHistory] = useState<any[]>([]);

    /**
     * Load templates for the current block type
     */
    useEffect(() => {
        const availableTemplates = getAllTemplatesForBlockType(blockType);
        setTemplates(availableTemplates);
    }, [blockType]);

    /**
     * Handle template selection
     */
    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplateId(templateId);

        if (templateId === 'custom') {
            setSelectedTemplate(null);
            // Keep existing custom prompt
        } else {
            const template = templates.find(t => t.id === templateId);
            if (template) {
                setSelectedTemplate(template);
                // Pre-fill prompt with template
                setCustomPrompt(template.prompt);
            }
        }
    };

    /**
     * Handle prompt input change
     */
    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCustomPrompt(e.target.value);
    };

    /**
     * Handle generation option change
     */
    const handleOptionChange = (key: keyof GenerationOptions, value: any) => {
        setGenerationOptions(prev => ({
            ...prev,
            [key]: value
        }));
    };

    /**
     * Generate content using AI
     */
    const handleGenerate = async () => {
        if (!customPrompt.trim()) {
            setError('Please enter a prompt or select a template');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Check cache first
            const cached = aiContentCache.get(
                blockType,
                customPrompt,
                courseContext,
                generationOptions
            );

            if (cached) {
                setGeneratedContent(cached);
                setIsLoading(false);
                return;
            }

            // Call API to generate content
            const response = await api.post('/ai/generate-content', {
                blockType,
                prompt: customPrompt,
                context: courseContext,
                options: generationOptions
            });

            const content = response.data.content;
            setGeneratedContent(content);

            // Cache the generated content
            aiContentCache.set(
                blockType,
                customPrompt,
                courseContext,
                content,
                generationOptions
            );

            // Add to generation history
            addToHistory(
                courseContext.courseId,
                blockType,
                customPrompt,
                content
            );
        } catch (err: any) {
            console.error('Content generation failed:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to generate content';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Refine generated content
     */
    const handleRefine = async (refinementType: 'shorter' | 'longer' | 'simplify' | 'add-examples' | 'change-tone') => {
        if (!generatedContent) return;

        setIsLoading(true);
        setError(null);

        try {
            // Save current content to history before refining
            setRefinementHistory(prev => [...prev, generatedContent]);

            // Call API to refine content
            const response = await api.post('/ai/refine-content', {
                content: generatedContent,
                refinementType,
                context: courseContext
            });

            const refinedContent = response.data.content;
            setGeneratedContent(refinedContent);
        } catch (err: any) {
            console.error('Content refinement failed:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to refine content';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Undo last refinement
     */
    const handleUndoRefinement = () => {
        if (refinementHistory.length === 0) return;

        const previousContent = refinementHistory[refinementHistory.length - 1];
        setGeneratedContent(previousContent);
        setRefinementHistory(prev => prev.slice(0, -1));
    };

    /**
     * Accept generated content and insert into block editor
     */
    const handleAccept = () => {
        if (!generatedContent) return;

        onContentGenerated(generatedContent);

        // Reset state after accepting
        setGeneratedContent(null);
        setRefinementHistory([]);
        setCustomPrompt('');
        setSelectedTemplateId('');
        setSelectedTemplate(null);
    };

    /**
     * Regenerate content with the same prompt
     */
    const handleRegenerate = async () => {
        if (!customPrompt.trim()) return;

        // Clear cache for this prompt to force regeneration
        setGeneratedContent(null);
        setRefinementHistory([]);

        // Generate new content
        await handleGenerate();
    };

    /**
     * Discard generated content
     */
    const handleDiscard = () => {
        setGeneratedContent(null);
        setRefinementHistory([]);
    };

    /**
     * Edit generated content manually
     */
    const handleEdit = () => {
        // Convert content to editable format if needed
        const editableContent = typeof generatedContent === 'string'
            ? generatedContent
            : JSON.stringify(generatedContent, null, 2);

        setCustomPrompt(editableContent);
        setGeneratedContent(null);
        setRefinementHistory([]);
    };

    /**
     * Toggle panel expansion
     */
    const togglePanel = () => {
        setIsExpanded(!isExpanded);
    };

    /**
     * Clear error state
     */
    const clearError = () => {
        setError(null);
    };

    return (
        <div className="ai-assistant-panel border rounded-lg overflow-hidden bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            {/* Panel Header */}
            <button
                type="button"
                onClick={togglePanel}
                className={cn(
                    "w-full flex items-center justify-between p-3 text-left transition-colors",
                    "hover:bg-white/50 dark:hover:bg-black/20",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                )}
                aria-expanded={isExpanded}
                aria-controls="ai-assistant-content"
            >
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        AI Content Assistant
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {isLoading && <Spinner size="sm" className="text-purple-600" />}
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    )}
                </div>
            </button>

            {/* Panel Content */}
            {isExpanded && (
                <div
                    id="ai-assistant-content"
                    className="p-4 border-t bg-white dark:bg-gray-900"
                >
                    {/* Error Display */}
                    {error && (
                        <div
                            className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
                            role="alert"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                        Generation Error
                                    </p>
                                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                        {error}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={clearError}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                                    aria-label="Dismiss error"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-8 gap-3">
                            <Spinner size="lg" className="text-purple-600" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Generating content...
                            </p>
                        </div>
                    )}

                    {/* Template Selector and Prompt Input */}
                    {!isLoading && !generatedContent && (
                        <div className="space-y-4">
                            {/* Template Selector */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="template-select"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Content Template
                                </label>
                                <Select
                                    value={selectedTemplateId}
                                    onValueChange={handleTemplateSelect}
                                >
                                    <SelectTrigger id="template-select" className="w-full">
                                        <SelectValue placeholder="Choose a template or write custom prompt" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="custom">Custom Prompt</SelectItem>
                                        {templates.map(template => (
                                            <SelectItem key={template.id} value={template.id}>
                                                {template.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Template Description */}
                                {selectedTemplate && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {selectedTemplate.description}
                                    </p>
                                )}
                            </div>

                            {/* Prompt Input */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="prompt-input"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Prompt
                                    </label>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {customPrompt.length} / 2000
                                    </span>
                                </div>
                                <Textarea
                                    id="prompt-input"
                                    value={customPrompt}
                                    onChange={handlePromptChange}
                                    placeholder={placeholder}
                                    maxLength={2000}
                                    rows={6}
                                    className="resize-none"
                                />
                            </div>

                            {/* Generation Options */}
                            <div className="grid grid-cols-3 gap-3">
                                {/* Tone */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Tone
                                    </label>
                                    <Select
                                        value={generationOptions.tone}
                                        onValueChange={(value) => handleOptionChange('tone', value)}
                                    >
                                        <SelectTrigger className="h-9 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="formal">Formal</SelectItem>
                                            <SelectItem value="conversational">Conversational</SelectItem>
                                            <SelectItem value="encouraging">Encouraging</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Reading Level */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Level
                                    </label>
                                    <Select
                                        value={generationOptions.readingLevel}
                                        onValueChange={(value) => handleOptionChange('readingLevel', value)}
                                    >
                                        <SelectTrigger className="h-9 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="high-school">High School</SelectItem>
                                            <SelectItem value="college">College</SelectItem>
                                            <SelectItem value="professional">Professional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Length */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Length
                                    </label>
                                    <Select
                                        value={generationOptions.length}
                                        onValueChange={(value) => handleOptionChange('length', value)}
                                    >
                                        <SelectTrigger className="h-9 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="brief">Brief</SelectItem>
                                            <SelectItem value="moderate">Moderate</SelectItem>
                                            <SelectItem value="detailed">Detailed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Generate Button */}
                            <Button
                                onClick={handleGenerate}
                                disabled={!customPrompt.trim()}
                                className="w-full"
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Content
                            </Button>
                        </div>
                    )}

                    {/* Generated Content Preview */}
                    {!isLoading && generatedContent && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Generated Content
                                    </label>
                                    {refinementHistory.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleUndoRefinement}
                                            className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                                        >
                                            ← Undo ({refinementHistory.length})
                                        </button>
                                    )}
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                                    <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-sans">
                                        {typeof generatedContent === 'string'
                                            ? generatedContent
                                            : JSON.stringify(generatedContent, null, 2)}
                                    </pre>
                                </div>
                            </div>

                            {/* Refinement Controls */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Refine Content
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRefine('shorter')}
                                    >
                                        Make Shorter
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRefine('longer')}
                                    >
                                        Make Longer
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRefine('simplify')}
                                    >
                                        Simplify
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRefine('add-examples')}
                                    >
                                        Add Examples
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRefine('change-tone')}
                                    >
                                        Change Tone
                                    </Button>
                                </div>
                            </div>

                            {/* Content Actions */}
                            <div className="flex gap-2 pt-2 border-t">
                                <Button
                                    type="button"
                                    onClick={handleAccept}
                                    className="flex-1"
                                >
                                    Accept
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleRegenerate}
                                >
                                    Regenerate
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleDiscard}
                                >
                                    Discard
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIAssistantPanel;
