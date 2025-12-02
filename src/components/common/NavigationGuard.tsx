import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useBlocker } from 'react-router-dom';
import './NavigationGuard.css';

interface NavigationGuardProps {
    when: boolean;
    message?: string;
}

/**
 * NavigationGuard component that warns users about unsaved changes
 * when attempting to navigate away from the page editor
 */
const NavigationGuard: React.FC<NavigationGuardProps> = ({
    when,
    message = 'You have unsaved changes. Are you sure you want to leave?'
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showWarning, setShowWarning] = useState(false);
    const [nextLocation, setNextLocation] = useState<string | null>(null);

    // Use React Router's useBlocker hook to intercept navigation
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            when && currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        if (blocker.state === 'blocked') {
            setShowWarning(true);
        }
    }, [blocker.state]);

    const confirmNavigation = () => {
        setShowWarning(false);
        setNextLocation(null);
        if (blocker.state === 'blocked') {
            blocker.proceed();
        }
    };

    const cancelNavigation = () => {
        setShowWarning(false);
        setNextLocation(null);
        if (blocker.state === 'blocked') {
            blocker.reset();
        }
    };

    return (
        <>
            {showWarning && (
                <div className="navigation-warning-modal">
                    <div className="modal-overlay" onClick={cancelNavigation}></div>
                    <div className="modal-content">
                        <h2>Unsaved Changes</h2>
                        <p>{message}</p>
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
