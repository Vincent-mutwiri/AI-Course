import React, { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Sparkles } from 'lucide-react';

interface AILoadingProgressProps {
    isLoading: boolean;
    estimatedDuration?: number; // in milliseconds
    message?: string;
}

/**
 * AILoadingProgress Component
 * 
 * Displays a progress indicator for AI content generation with
 * estimated time remaining and encouraging messages.
 */
export const AILoadingProgress: React.FC<AILoadingProgressProps> = ({
    isLoading,
    estimatedDuration = 10000,
    message = 'Generating content...'
}) => {
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState(message);

    const progressMessages = [
        'Analyzing your prompt...',
        'Building context...',
        'Generating content...',
        'Refining output...',
        'Almost done...'
    ];

    useEffect(() => {
        if (!isLoading) {
            setProgress(0);
            setCurrentMessage(message);
            return;
        }

        setProgress(0);
        const startTime = Date.now();
        const interval = 100; // Update every 100ms

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / estimatedDuration) * 100, 95);
            setProgress(newProgress);

            // Update message based on progress
            const messageIndex = Math.floor((newProgress / 100) * progressMessages.length);
            if (messageIndex < progressMessages.length) {
                setCurrentMessage(progressMessages[messageIndex]);
            }

            // Stop at 95% to avoid reaching 100% before actual completion
            if (newProgress >= 95) {
                clearInterval(timer);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [isLoading, estimatedDuration, message]);

    if (!isLoading) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
            {/* Animated Icon */}
            <div className="relative">
                <Spinner size="lg" className="text-purple-600" />
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-400 animate-pulse" />
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Message */}
            <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentMessage}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {progress < 95 ? `${Math.round(progress)}%` : 'Finalizing...'}
                </p>
            </div>

            {/* Tip */}
            {progress > 50 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs animate-fade-in">
                    💡 Tip: You can refine the generated content after it's ready
                </div>
            )}
        </div>
    );
};

export default AILoadingProgress;
