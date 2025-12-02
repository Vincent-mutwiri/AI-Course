import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationGuardProps {
    children: React.ReactNode;
}

/**
 * NavigationGuard component that warns users about unsaved changes
 * when attempting to navigate away from the page editor
 */
const NavigationGuard: React.FC<NavigationGuardProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showWarning, setShowWarning] = useState(false);
    const [nextLocation, setNextLocation] = useState<string | null>(null);

    // Check if there are unsaved changes
    // This will be managed by the PageEditorContainer component
    const hasUnsavedChanges = () => {
        // Access the isDirty state from PageEditorContainer via context or props
        // For now, we'll use a simple check via window property
        return (window as any).__hasUnsavedChanges || false;
    };

    useEffect(() => {
        // Handle browser back/forward navigation
        const handlePopState = (e: PopStateEvent) => {
            if (hasUnsavedChanges()) {
                e.preventDefault();
                const confirmLeave = window.confirm(
                    'You have unsaved changes. Are you sure you want to leave?'
                );
                if (!confirmLeave) {
                    // Push the current location back to history
                    window.history.pushState(null, '', location.pathname);
                }
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [location]);

    // Intercept navigation attempts
    const handleNavigation = (to: string) => {
        if (hasUnsavedChanges()) {
            setNextLocation(to);
            setShowWarning(true);
            return false;
        }
        return true;
    };

    const confirmNavigation = () => {
        if (nextLocation) {
            (window as any).__hasUnsavedChanges = false;
            navigate(nextLocation);
            setShowWarning(false);
            setNextLocation(null);
        }
    };

    const cancelNavigation = () => {
        setShowWarning(false);
        setNextLocation(null);
    };

    return (
        <>
            {children}

            {showWarning && (
                <div className="navigation-warning-modal">
                    <div className="modal-overlay" onClick={cancelNavigation}></div>
                    <div className="modal-content">
                        <h2>Unsaved Changes</h2>
                        <p>You have unsaved changes. Are you sure you want to leave?</p>
                        <div className="modal-actions">
                            <button onClick={cancelNavigation} className="btn-cancel">
                                Stay on Page
                            </button>
                            <button onClick={confirmNavigation} className="btn-confirm">
                                Leave Without Saving
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavigationGuard;
