import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BlockType } from '@/types/page';
import { CourseContext } from '@/services/courseContextBuilder';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown, ChevronUp, Sparkles, WifiOff, AlertTriangle, Save, Trash2, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllTemplatesForBlockType, ContentTemplate, saveCustomTemplate, deleteCustomTemplate } from '@/config/contentTemplates';
import { aiContentCache, GenerationOptions } from '@/utils/aiContentCache';
import { addToHistory } from '@/components/admin/GenerationHistory';
import { loadAISettings } from '@/components/admin/AISettings';
import { AILoadingProgress } from '@/components/admin/AILoadingProgress';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { classifyError, getErrorMessageWithSuggestions, retryWithBackoff, AIError } from '@/utils/aiErrorHandler';
import { toast } from '@/components/ui/toast';
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
    const [error, setError] = useState<AIError | null>(null);
    const [lastPrompt, setLastPrompt] = useState<string>(''); // Preserve prompt on error
    const [retryCount, setRetryCount] = useState(0);

    // Online status
    const isOnline = useOnlineStatus();

    // Template state
    const [templates, setTemplates] = useState<ContentTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
    const [customPrompt, setCustomPrompt] = useState<string>('');

    // Generation options state - load from saved settings
    const [generationOptions, setGenerationOptions] = useState<GenerationOptions>(() => {
        const savedSettings = loadAISettings();
        return {
            tone: savedSettings.tone,
            readingLevel: savedSettings.readingLevel,
            length: savedSettings.length
        };
    });

    // Generated content state
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [refinementHistory, setRefinementHistory] = useState<any[]>([]);

    // Custom template saving state
    const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [newTemplateDescription, setNewTemplateDescription] = useState('');

    // Keyboard shortcuts state
    const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
    const [showRefinementMenu, setShowRefinementMenu] = useState(false);

    // Ref to track if component is mounted
    const isMountedRef = useRef(true);

    /**
     * Load templates for the current block type
     */
    useEffect(() => {
        const availableTemplates = getAllTemplatesForBlockType(blockType);
        setTemplates(availableTemplates);
    }, [blockType]);

    /**
     * Reload templates (useful after saving/deleting custom templates)
     */
    const reloadTemplates = () => {
        const availableTemplates = getAllTemplatesForBlockType(blockType);
        setTemplates(availableTemplates);
    };

    /**
     * Keyboard shortcut handler
     */
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Check if Cmd (Mac) or Ctrl (Windows/Linux) is pressed
        const isCmdOrCtrl = event.metaKey || event.ctrlKey;

        // Escape key: Close refinement menu or keyboard shortcuts dialog
        if (event.key === 'Escape') {
            if (showRefinementMenu) {
                event.preventDefault();
                setShowRefinementMenu(false);
                return;
            }
            if (showKeyboardShortcuts) {
                event.preventDefault();
                setShowKeyboardShortcuts(false);
                return;
            }
        }

        if (!isCmdOrCtrl) return;

        // Cmd/Ctrl+G: Toggle AI assistant panel
        if (event.key === 'g' && !event.shiftKey) {
            event.preventDefault();
            setIsExpanded(prev => !prev);
            toast.success(isExpanded ? 'AI Assistant closed' : 'AI Assistant opened', {
                description: 'Press Cmd/Ctrl+G to toggle'
            });
            return;
        }

        // Cmd/Ctrl+Shift+G: Generate with current prompt
        if (event.key === 'G' && event.shiftKey) {
            event.preventDefault();
            if (!isExpanded) {
                setIsExpanded(true);
            }
            if (customPrompt.trim() && !isLoading && !generatedContent) {
                handleGenerate(false);
            } else if (!customPrompt.trim()) {
                toast.error('No prompt entered', {
                    description: 'Enter a prompt or select a template first'
                });
            }
            return;
        }

        // Cmd/Ctrl+R: Regenerate content
        if (event.key === 'r' && !event.shiftKey) {
            event.preventDefault();
            if (generatedContent && !isLoading) {
                handleRegenerate();
            } else if (!generatedContent && customPrompt.trim()) {
                handleGenerate(false);
            }
            return;
        }

        // Cmd/Ctrl+Shift+R: Show refinement menu
        if (event.key === 'R' && event.shiftKey) {
            event.preventDefault();
            if (generatedContent && !isLoading) {
                setShowRefinementMenu(prev => !prev);
                toast.success('Refinement options', {
                    description: 'Choose a refinement option or press Esc to close'
                });
            } else if (!generatedContent) {
                toast.error('No content to refine', {
                    description: 'Generate content first'
                });
            }
            return;
        }
    }, [isExpanded, customPrompt, isLoading, generatedContent, showRefinementMenu, showKeyboardShortcuts]);

    /**
     * Set up keyboard shortcuts
     */
    useEffect(() => {
        isMountedRef.current = true;
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            isMountedRef.current = false;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

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
     * Generate content using AI with comprehensive error handling
     */
    const handleGenerate = async (isRetry: boolean = false) => {
        if (!customPrompt.trim()) {
            const validationError: AIError = {
                type: 'validation' as any,
                message: 'Empty prompt',
                userMessage: 'Please enter a prompt or select a template',
                retryable: false
            };
            setError(validationError);
            toast.error('Please enter a prompt or select a template');
            return;
        }

        // Check online status
        if (!isOnline) {
            const offlineError: AIError = {
                type: 'offline' as any,
                message: 'No internet connection',
                userMessage: 'You appear to be offline. Please check your internet connection.',
                retryable: true
            };
            setError(offlineError);
            toast.error('No internet connection', {
                description: 'Please check your connection and try again.',
                action: {
                    label: 'Retry',
                    onClick: () => handleGenerate(true)
                }
            });
            return;
        }

        setIsLoading(true);
        setError(null);
        setLastPrompt(customPrompt); // Preserve prompt for retry

        if (!isRetry) {
            setRetryCount(0);
        }

        try {
            // Check cache first (skip cache on retry)
            if (!isRetry) {
                const cached = aiContentCache.get(
                    blockType,
                    customPrompt,
                    courseContext,
                    generationOptions
                );

                if (cached) {
                    setGeneratedContent(cached);
                    setIsLoading(false);
                    toast.success('Content loaded from cache', {
                        description: 'Using previously generated content'
                    });
                    return;
                }
            }

            // Call API to generate content with retry logic
            const response = await retryWithBackoff(
                () => api.post('/ai/generate-content', {
                    blockType,
                    prompt: customPrompt,
                    context: courseContext,
                    options: generationOptions
                }),
                3, // max retries
                1000 // initial delay
            );

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

            // Success toast
            toast.success('Content generated successfully', {
                description: 'Review and refine the content as needed'
            });

            // Reset retry count on success
            setRetryCount(0);
        } catch (err: any) {
            console.error('Content generation failed:', err);

            // Classify the error
            const aiError = classifyError(err);
            setError(aiError);

            // Get detailed error information
            const errorDetails = getErrorMessageWithSuggestions(aiError);

            // Show error toast with retry option if retryable
            if (aiError.retryable) {
                toast.error(errorDetails.title, {
                    description: errorDetails.message,
                    duration: 6000,
                    action: {
                        label: 'Retry',
                        onClick: () => {
                            setRetryCount(prev => prev + 1);
                            handleGenerate(true);
                        }
                    },
                    cancel: {
                        label: 'Dismiss'
                    }
                });
            } else {
                toast.error(errorDetails.title, {
                    description: errorDetails.message,
                    duration: 5000
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Refine generated content with error handling
     */
    const handleRefine = async (refinementType: 'shorter' | 'longer' | 'simplify' | 'add-examples' | 'change-tone') => {
        if (!generatedContent) return;

        // Check online status
        if (!isOnline) {
            toast.error('No internet connection', {
                description: 'Please check your connection and try again.'
            });
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Save current content to history before refining
            setRefinementHistory(prev => [...prev, generatedContent]);

            // Call API to refine content with retry logic
            const response = await retryWithBackoff(
                () => api.post('/ai/refine-content', {
                    content: generatedContent,
                    refinementType,
                    context: courseContext
                }),
                2, // fewer retries for refinement
                1000
            );

            const refinedContent = response.data.content;
            setGeneratedContent(refinedContent);

            toast.success('Content refined successfully', {
                description: `Applied: ${refinementType.replace('-', ' ')}`
            });
        } catch (err: any) {
            console.error('Content refinement failed:', err);

            // Classify the error
            const aiError = classifyError(err);
            setError(aiError);

            // Restore previous content on error
            if (refinementHistory.length > 0) {
                const previousContent = refinementHistory[refinementHistory.length - 1];
                setGeneratedContent(previousContent);
                setRefinementHistory(prev => prev.slice(0, -1));
            }

            // Get detailed error information
            const errorDetails = getErrorMessageWithSuggestions(aiError);

            // Show error toast
            toast.error(errorDetails.title, {
                description: 'Content was not modified. ' + errorDetails.message,
                duration: 5000
            });
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
        const promptToUse = customPrompt.trim() || lastPrompt.trim();
        if (!promptToUse) return;

        // Restore last prompt if current is empty
        if (!customPrompt.trim() && lastPrompt.trim()) {
            setCustomPrompt(lastPrompt);
        }

        // Clear cache for this prompt to force regeneration
        setGeneratedContent(null);
        setRefinementHistory([]);

        // Generate new content (force retry)
        await handleGenerate(true);
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

    /**
     * Save current prompt as a custom template
     */
    const handleSaveAsTemplate = () => {
        if (!customPrompt.trim()) {
            toast.error('Cannot save empty template');
            return;
        }

        setShowSaveTemplateDialog(true);
    };

    /**
     * Confirm saving custom template
     */
    const confirmSaveTemplate = () => {
        if (!newTemplateName.trim()) {
            toast.error('Please enter a template name');
            return;
        }

        try {
            const newTemplate = saveCustomTemplate({
                name: newTemplateName.trim(),
                description: newTemplateDescription.trim() || 'Custom template',
                blockTypes: [blockType],
                prompt: customPrompt.trim(),
                category: 'general'
            });

            toast.success('Template saved successfully', {
                description: `"${newTemplate.name}" is now available in your templates`
            });

            // Reset dialog state
            setShowSaveTemplateDialog(false);
            setNewTemplateName('');
            setNewTemplateDescription('');

            // Reload templates to include the new one
            reloadTemplates();
        } catch (error) {
            console.error('Failed to save template:', error);
            toast.error('Failed to save template', {
                description: 'Please try again'
            });
        }
    };

    /**
     * Cancel saving template
     */
    const cancelSaveTemplate = () => {
        setShowSaveTemplateDialog(false);
        setNewTemplateName('');
        setNewTemplateDescription('');
    };

    /**
     * Delete a custom template
     */
    const handleDeleteTemplate = (templateId: string) => {
        if (!templateId.startsWith('custom-')) {
            toast.error('Cannot delete built-in templates');
            return;
        }

        try {
            deleteCustomTemplate(templateId);
            toast.success('Template deleted');

            // If the deleted template was selected, clear selection
            if (selectedTemplateId === templateId) {
                setSelectedTemplateId('');
                setSelectedTemplate(null);
                setCustomPrompt('');
            }

            // Reload templates
            reloadTemplates();
        } catch (error) {
            console.error('Failed to delete template:', error);
            toast.error('Failed to delete template');
        }
    };

    return (
        <TooltipProvider>
            <div className="ai-assistant-panel border rounded-lg overflow-hidden bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                {/* Panel Header */}
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={togglePanel}
                        className={cn(
                            "flex-1 flex items-center justify-between p-3 text-left transition-colors",
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
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowKeyboardShortcuts(true);
                                }}
                                className="p-3 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                                aria-label="View keyboard shortcuts"
                            >
                                <Keyboard className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Keyboard Shortcuts</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Panel Content */}
                {isExpanded && (
                    <div
                        id="ai-assistant-content"
                        className="p-4 border-t bg-white dark:bg-gray-900"
                    >
                        {/* Offline Indicator */}
                        {!isOnline && (
                            <div
                                className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md"
                                role="alert"
                            >
                                <div className="flex items-center gap-2">
                                    <WifiOff className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                            You're offline
                                        </p>
                                        <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                                            AI generation requires an internet connection. You can still edit existing content.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div
                                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
                                role="alert"
                            >
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                            {getErrorMessageWithSuggestions(error).title}
                                        </p>
                                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                            {error.userMessage}
                                        </p>
                                        {/* Suggestions */}
                                        {getErrorMessageWithSuggestions(error).suggestions.length > 0 && (
                                            <ul className="text-xs text-red-600 dark:text-red-400 mt-2 space-y-1 list-disc list-inside">
                                                {getErrorMessageWithSuggestions(error).suggestions.map((suggestion, idx) => (
                                                    <li key={idx}>{suggestion}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {/* Retry button for retryable errors */}
                                        {error.retryable && lastPrompt && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRegenerate()}
                                                className="mt-3 text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/30"
                                            >
                                                Try Again {retryCount > 0 && `(Attempt ${retryCount + 1})`}
                                            </Button>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearError}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 flex-shrink-0"
                                        aria-label="Dismiss error"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Loading State with Progress */}
                        {isLoading && (
                            <AILoadingProgress
                                isLoading={isLoading}
                                estimatedDuration={generationOptions.length === 'detailed' ? 15000 : 10000}
                                message="Generating content..."
                            />
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
                                                    {template.id.startsWith('custom-') && ' (Custom)'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Template Description and Actions */}
                                    {selectedTemplate && (
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex-1">
                                                {selectedTemplate.description}
                                            </p>
                                            {selectedTemplate.id.startsWith('custom-') && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                                                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                                                    title="Delete custom template"
                                                    aria-label="Delete custom template"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
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
                                        <div className="flex items-center gap-2">
                                            {customPrompt.trim() && (
                                                <button
                                                    type="button"
                                                    onClick={handleSaveAsTemplate}
                                                    className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1"
                                                    title="Save as template"
                                                >
                                                    <Save className="h-3 w-3" />
                                                    Save as Template
                                                </button>
                                            )}
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {customPrompt.length} / 2000
                                            </span>
                                        </div>
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
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() => handleGenerate(false)}
                                            disabled={!customPrompt.trim() || !isOnline}
                                            className="w-full"
                                            title={!isOnline ? 'Internet connection required' : ''}
                                        >
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Generate Content
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Generate content (Cmd/Ctrl+Shift+G)</p>
                                    </TooltipContent>
                                </Tooltip>
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
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Refine Content
                                        </label>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowRefinementMenu(prev => !prev)}
                                                    className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1"
                                                >
                                                    <Keyboard className="h-3 w-3" />
                                                    {showRefinementMenu ? 'Hide' : 'Show'} Options
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Toggle refinement options (Cmd/Ctrl+Shift+R)</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    {showRefinementMenu && (
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    handleRefine('shorter');
                                                    setShowRefinementMenu(false);
                                                }}
                                            >
                                                Make Shorter
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    handleRefine('longer');
                                                    setShowRefinementMenu(false);
                                                }}
                                            >
                                                Make Longer
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    handleRefine('simplify');
                                                    setShowRefinementMenu(false);
                                                }}
                                            >
                                                Simplify
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    handleRefine('add-examples');
                                                    setShowRefinementMenu(false);
                                                }}
                                            >
                                                Add Examples
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    handleRefine('change-tone');
                                                    setShowRefinementMenu(false);
                                                }}
                                            >
                                                Change Tone
                                            </Button>
                                        </div>
                                    )}
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
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleRegenerate}
                                            >
                                                Regenerate
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Regenerate (Cmd/Ctrl+R)</p>
                                        </TooltipContent>
                                    </Tooltip>
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

                {/* Save Template Dialog */}
                <Dialog open={showSaveTemplateDialog} onOpenChange={setShowSaveTemplateDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Save as Template</DialogTitle>
                            <DialogDescription>
                                Save this prompt as a reusable template for future use.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="template-name">Template Name *</Label>
                                <Input
                                    id="template-name"
                                    value={newTemplateName}
                                    onChange={(e) => setNewTemplateName(e.target.value)}
                                    placeholder="e.g., My Custom Introduction"
                                    maxLength={100}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="template-description">Description</Label>
                                <Textarea
                                    id="template-description"
                                    value={newTemplateDescription}
                                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                                    placeholder="Brief description of when to use this template"
                                    maxLength={200}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Prompt Preview</Label>
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border text-sm max-h-32 overflow-y-auto">
                                    {customPrompt}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={cancelSaveTemplate}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={confirmSaveTemplate}
                                disabled={!newTemplateName.trim()}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Template
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Keyboard Shortcuts Dialog */}
                <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Keyboard className="h-5 w-5" />
                                Keyboard Shortcuts
                            </DialogTitle>
                            <DialogDescription>
                                Use these shortcuts to work faster with the AI Content Assistant
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">Toggle AI Assistant</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Open or close the AI assistant panel
                                        </p>
                                    </div>
                                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 whitespace-nowrap">
                                        Cmd/Ctrl+G
                                    </kbd>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">Generate Content</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Generate content with the current prompt
                                        </p>
                                    </div>
                                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 whitespace-nowrap">
                                        Cmd/Ctrl+Shift+G
                                    </kbd>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">Regenerate Content</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Generate new content with the same prompt
                                        </p>
                                    </div>
                                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 whitespace-nowrap">
                                        Cmd/Ctrl+R
                                    </kbd>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">Refine Content</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Show refinement options menu
                                        </p>
                                    </div>
                                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 whitespace-nowrap">
                                        Cmd/Ctrl+Shift+R
                                    </kbd>
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    <strong>Tip:</strong> These shortcuts work anywhere in the block editor when the AI assistant is available.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                onClick={() => setShowKeyboardShortcuts(false)}
                            >
                                Got it
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    );
};

export default AIAssistantPanel;
