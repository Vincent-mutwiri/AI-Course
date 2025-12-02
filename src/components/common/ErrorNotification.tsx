import React, { useEffect, useState } from 'react';
import './ErrorNotification.css';

export interface ErrorNotificationProps {
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
    autoHideDuration?: number;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
    message,
    onRetry,
    onDismiss,
    autoHideDuration,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoHideDuration && autoHideDuration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onDismiss) {
                    onDismiss();
                }
            }, autoHideDuration);

            return () => clearTimeout(timer);
        }
    }, [autoHideDuration, onDismiss]);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="error-notification">
            <div className="error-notification-content">
                <span className="error-icon">⚠️</span>
                <span className="error-message">{message}</span>
            </div>
            <div className="error-notification-actions">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="btn-retry"
                        type="button"
                    >
                        Retry
                    </button>
                )}
                {onDismiss && (
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            onDismiss();
                        }}
                        className="btn-dismiss"
                        type="button"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorNotification;
