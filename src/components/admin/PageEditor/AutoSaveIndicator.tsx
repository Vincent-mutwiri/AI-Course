import React from 'react';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveIndicatorProps {
    saveState: SaveState;
    lastSavedAt: Date | null;
    saveError: string | null;
    retryCount: number;
    maxRetries: number;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
    saveState,
    lastSavedAt,
    saveError,
    retryCount,
    maxRetries
}) => {
    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="auto-save-indicator">
            {saveState === 'saving' && (
                <span className="saving">
                    <span className="spinner-small"></span>
                    Saving...
                </span>
            )}
            {saveState === 'saved' && lastSavedAt && (
                <span className="saved">
                    <svg className="icon-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Saved at {formatTime(lastSavedAt)}
                </span>
            )}
            {saveState === 'error' && (
                <span className="error">
                    <svg className="icon-error" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 4V8M8 10V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {saveError || 'Error saving'}
                    {retryCount > 0 && retryCount < maxRetries && (
                        <span className="retry-info"> (Retrying {retryCount}/{maxRetries})</span>
                    )}
                    {retryCount >= maxRetries && (
                        <span className="retry-failed"> (Max retries reached)</span>
                    )}
                </span>
            )}
        </div>
    );
};

export default AutoSaveIndicator;
