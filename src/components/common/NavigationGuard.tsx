import React, { useEffect, useRef } from 'react';
import { useLocation, UNSAFE_NavigationContext } from 'react-router-dom';

interface NavigationGuardProps {
    when: boolean;
    message?: string;
}

/**
 * NavigationGuard component that warns users about unsaved changes
 * when attempting to navigate away from the page editor
 * 
 * Note: This uses UNSAFE_NavigationContext as a workaround for BrowserRouter
 * which doesn't support the newer useBlocker hook.
 */
const NavigationGuard: React.FC<NavigationGuardProps> = ({
    when,
    message = 'You have unsaved changes. Are you sure you want to leave?'
}) => {
    const location = useLocation();
    const { navigator } = React.useContext(UNSAFE_NavigationContext);
    const unblockRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!when) {
            return;
        }

        // Store the original push and replace methods
        const originalPush = navigator.push;
        const originalReplace = navigator.replace;

        // Override push method
        navigator.push = (...args: Parameters<typeof originalPush>) => {
            const confirmLeave = window.confirm(message);
            if (confirmLeave) {
                originalPush(...args);
            }
        };

        // Override replace method
        navigator.replace = (...args: Parameters<typeof originalReplace>) => {
            const confirmLeave = window.confirm(message);
            if (confirmLeave) {
                originalReplace(...args);
            }
        };

        // Store cleanup function
        unblockRef.current = () => {
            navigator.push = originalPush;
            navigator.replace = originalReplace;
        };

        // Cleanup on unmount or when 'when' changes
        return () => {
            if (unblockRef.current) {
                unblockRef.current();
                unblockRef.current = null;
            }
        };
    }, [when, message, navigator, location]);

    // This component doesn't render anything
    return null;
};

export default NavigationGuard;
