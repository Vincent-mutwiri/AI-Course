/**
 * GenerationHistory Component
 * 
 * Displays a list of previous AI content generations for the current course.
 * Features:
 * - Display prompt, block type, date, and content preview
 * - Organize by block type and date
 * - Copy to clipboard, reuse, and delete actions
 * - Clear all history
 * - localStorage-based persistence per course
 */

import React, { useState, useEffect } from 'react';
import { BlockType } from '@/types/page';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { History, Copy, RotateCcw, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const HISTORY_KEY_PREFIX = 'ai_generation_history_';
const MAX_HISTORY_ENTRIES = 100;

export interface GenerationHistoryEntry {
    id: string;
    blockType: BlockType;
    prompt: string;
    content: any;
    timestamp: number;
    courseId: string;
}

export interface GenerationHistoryProps {
    courseId: string;
    onReuse?: (entry: GenerationHistoryEntry) => void;
    className?: string;
}

/**
 * Get history key for a specific course
 */
function getHistoryKey(courseId: string): string {
    return `${HISTORY_KEY_PREFIX}${courseId}`;
}

/**
 * Load history from localStorage for a specific course
 */
function loadHistory(courseId: string): GenerationHistoryEntry[] {
    try {
        const key = getHistoryKey(courseId);
        const data = localStorage.getItem(key);

        if (!data) {
            return [];
        }

        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Failed to load generation history:', error);
        return [];
    }
}

/**
 * Save history to localStorage for a specific course
 */
function saveHistory(courseId: string, history: GenerationHistoryEntry[]): void {
    try {
        const key = getHistoryKey(courseId);

        // Limit to max entries
        const limitedHistory = history.slice(0, MAX_HISTORY_ENTRIES);

        localStorage.setItem(key, JSON.stringify(limitedHistory));
    } catch (error) {
        console.error('Failed to save generation history:', error);
    }
}

/**
 * Add entry to history
 */
export function addToHistory(
    courseId: string,
    blockType: BlockType,
    prompt: string,
    content: any
): void {
    const history = loadHistory(courseId);

    const entry: GenerationHistoryEntry = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        blockType,
        prompt,
        content,
        timestamp: Date.now(),
        courseId,
    };

    // Add to beginning of array (most recent first)
    history.unshift(entry);

    saveHistory(courseId, history);
}

/**
 * Format timestamp to readable date
 */
function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString();
    }
}

/**
 * Get block type display name
 */
function getBlockTypeLabel(blockType: BlockType): string {
    const labels: Record<BlockType, string> = {
        text: 'Text',
        video: 'Video',
        code: 'Code',
        reflection: 'Reflection',
        poll: 'Poll',
        quiz: 'Quiz',
        list: 'List',
        image: 'Image',
        divider: 'Divider',
        interactive: 'Interactive',
    };

    return labels[blockType] || blockType;
}

/**
 * Get block type color
 */
function getBlockTypeColor(blockType: BlockType): string {
    const colors: Record<BlockType, string> = {
        text: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        video: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        code: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        reflection: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        poll: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
        quiz: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        list: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        image: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
        divider: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        interactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return colors[blockType] || 'bg-gray-100 text-gray-800';
}

/**
 * Truncate text for preview
 */
function truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength) + '...';
}

/**
 * Get content preview text
 */
function getContentPreview(content: any): string {
    if (typeof content === 'string') {
        return content;
    }

    if (typeof content === 'object' && content !== null) {
        // Try to extract meaningful text from object
        if (content.text) {
            return content.text;
        }
        if (content.content) {
            return content.content;
        }
        if (content.question) {
            return content.question;
        }
        if (content.prompt) {
            return content.prompt;
        }

        // Fallback to JSON string
        return JSON.stringify(content);
    }

    return String(content);
}

/**
 * GenerationHistory Component
 */
export const GenerationHistory: React.FC<GenerationHistoryProps> = ({
    courseId,
    onReuse,
    className,
}) => {
    const [history, setHistory] = useState<GenerationHistoryEntry[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBlockType, setSelectedBlockType] = useState<BlockType | 'all'>('all');

    /**
     * Load history on mount and when courseId changes
     */
    useEffect(() => {
        const loadedHistory = loadHistory(courseId);
        setHistory(loadedHistory);
    }, [courseId, isOpen]);

    /**
     * Handle copy to clipboard
     */
    const handleCopy = async (entry: GenerationHistoryEntry) => {
        try {
            const contentText = getContentPreview(entry.content);
            await navigator.clipboard.writeText(contentText);

            // Could add a toast notification here
            console.log('Content copied to clipboard');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };

    /**
     * Handle reuse content
     */
    const handleReuse = (entry: GenerationHistoryEntry) => {
        if (onReuse) {
            onReuse(entry);
        }
        setIsOpen(false);
    };

    /**
     * Handle delete entry
     */
    const handleDelete = (entryId: string) => {
        const updatedHistory = history.filter(entry => entry.id !== entryId);
        setHistory(updatedHistory);
        saveHistory(courseId, updatedHistory);
    };

    /**
     * Handle clear all history
     */
    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all generation history? This action cannot be undone.')) {
            setHistory([]);
            saveHistory(courseId, []);
        }
    };

    /**
     * Filter history by block type
     */
    const filteredHistory = selectedBlockType === 'all'
        ? history
        : history.filter(entry => entry.blockType === selectedBlockType);

    /**
     * Get unique block types in history
     */
    const blockTypesInHistory = Array.from(
        new Set(history.map(entry => entry.blockType))
    );

    /**
     * Group history by date
     */
    const groupedHistory: Record<string, GenerationHistoryEntry[]> = {};

    filteredHistory.forEach(entry => {
        const date = new Date(entry.timestamp);
        const dateKey = date.toLocaleDateString();

        if (!groupedHistory[dateKey]) {
            groupedHistory[dateKey] = [];
        }

        groupedHistory[dateKey].push(entry);
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn('gap-2', className)}
                >
                    <History className="h-4 w-4" />
                    History
                    {history.length > 0 && (
                        <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                            {history.length}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Generation History</DialogTitle>
                </DialogHeader>

                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            No generation history yet
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            Generated content will appear here for easy reuse
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Filter Controls */}
                        <div className="flex items-center justify-between gap-4 pb-4 border-b">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                    variant={selectedBlockType === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedBlockType('all')}
                                >
                                    All ({history.length})
                                </Button>
                                {blockTypesInHistory.map(blockType => {
                                    const count = history.filter(e => e.blockType === blockType).length;
                                    return (
                                        <Button
                                            key={blockType}
                                            variant={selectedBlockType === blockType ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setSelectedBlockType(blockType)}
                                        >
                                            {getBlockTypeLabel(blockType)} ({count})
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleClearAll}
                            >
                                Clear All
                            </Button>
                        </div>

                        {/* History List */}
                        <ScrollArea className="flex-1 pr-4">
                            {filteredHistory.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No {selectedBlockType !== 'all' ? getBlockTypeLabel(selectedBlockType) : ''} generations found
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(groupedHistory).map(([dateKey, entries]) => (
                                        <div key={dateKey}>
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                {dateKey}
                                            </h3>
                                            <div className="space-y-3">
                                                {entries.map(entry => (
                                                    <div
                                                        key={entry.id}
                                                        className="border rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                                                    >
                                                        {/* Entry Header */}
                                                        <div className="flex items-start justify-between gap-4 mb-3">
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <Badge
                                                                    className={cn(
                                                                        'text-xs font-medium',
                                                                        getBlockTypeColor(entry.blockType)
                                                                    )}
                                                                >
                                                                    {getBlockTypeLabel(entry.blockType)}
                                                                </Badge>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {formatDate(entry.timestamp)}
                                                                </span>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleCopy(entry)}
                                                                    title="Copy to clipboard"
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Copy className="h-4 w-4" />
                                                                </Button>
                                                                {onReuse && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleReuse(entry)}
                                                                        title="Reuse content"
                                                                        className="h-8 w-8 p-0"
                                                                    >
                                                                        <RotateCcw className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(entry.id)}
                                                                    title="Delete entry"
                                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Prompt */}
                                                        <div className="mb-2">
                                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                Prompt:
                                                            </p>
                                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                                {truncateText(entry.prompt, 200)}
                                                            </p>
                                                        </div>

                                                        {/* Content Preview */}
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                Content Preview:
                                                            </p>
                                                            <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded p-3 font-mono text-xs">
                                                                {truncateText(getContentPreview(entry.content), 300)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default GenerationHistory;
