/**
 * Accessibility utilities for the course builder
 * Provides helpers for ARIA labels, keyboard navigation, and focus management
 */

/**
 * Generate descriptive ARIA labels for block types
 */
export function getBlockAriaLabel(blockType: string, blockOrder?: number): string {
    const blockTypeLabels: Record<string, string> = {
        text: 'Text content block',
        video: 'Video block',
        image: 'Image block',
        code: 'Code snippet block',
        list: 'List block',
        divider: 'Divider block',
        reflection: 'Reflection question block',
        poll: 'Poll block',
        wordCloud: 'Word cloud block',
        aiGenerator: 'AI generator block',
        choiceComparison: 'Choice comparison block',
        designFixer: 'Design fixer block',
        playerTypeSimulator: 'Player type simulator block',
        rewardScheduleDesigner: 'Reward schedule designer block',
        flowChannelEvaluator: 'Flow channel evaluator block',
        pitchAnalysisGenerator: 'Pitch analysis generator block',
        narrativeGenerator: 'Narrative generator block',
        darkPatternRedesigner: 'Dark pattern redesigner block',
        roeDashboard: 'ROE dashboard block',
        journeyTimeline: 'Journey timeline block',
        certificateGenerator: 'Certificate generator block',
        finalAssessment: 'Final assessment block',
    };

    const label = blockTypeLabels[blockType] || `${blockType} block`;
    return blockOrder !== undefined ? `${label}, position ${blockOrder + 1}` : label;
}

/**
 * Generate ARIA label for block actions
 */
export function getBlockActionAriaLabel(action: string, blockType: string, blockOrder?: number): string {
    const blockLabel = getBlockAriaLabel(blockType, blockOrder);
    const actionLabels: Record<string, string> = {
        edit: `Edit ${blockLabel}`,
        duplicate: `Duplicate ${blockLabel}`,
        delete: `Delete ${blockLabel}`,
        preview: `Preview ${blockLabel}`,
    };

    return actionLabels[action] || `${action} ${blockLabel}`;
}

/**
 * Keyboard navigation handler for lists
 */
export function handleListKeyboardNavigation(
    event: React.KeyboardEvent,
    currentIndex: number,
    totalItems: number,
    onNavigate: (index: number) => void,
    onSelect?: (index: number) => void
): void {
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            if (currentIndex < totalItems - 1) {
                onNavigate(currentIndex + 1);
            }
            break;
        case 'ArrowUp':
            event.preventDefault();
            if (currentIndex > 0) {
                onNavigate(currentIndex - 1);
            }
            break;
        case 'Home':
            event.preventDefault();
            onNavigate(0);
            break;
        case 'End':
            event.preventDefault();
            onNavigate(totalItems - 1);
            break;
        case 'Enter':
        case ' ':
            event.preventDefault();
            if (onSelect) {
                onSelect(currentIndex);
            }
            break;
    }
}

/**
 * Focus management utilities
 */
export const focusManagement = {
    /**
     * Trap focus within a container
     */
    trapFocus(container: HTMLElement): () => void {
        const focusableElements = container.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        container.addEventListener('keydown', handleKeyDown);
        return () => container.removeEventListener('keydown', handleKeyDown);
    },

    /**
     * Return focus to a previous element
     */
    returnFocus(element: HTMLElement | null): void {
        if (element && typeof element.focus === 'function') {
            // Use setTimeout to ensure the element is ready to receive focus
            setTimeout(() => element.focus(), 0);
        }
    },

    /**
     * Focus first error in a form
     */
    focusFirstError(formElement: HTMLElement): void {
        const errorElement = formElement.querySelector<HTMLElement>('[aria-invalid="true"]');
        if (errorElement) {
            errorElement.focus();
        }
    },
};

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Check if color contrast meets WCAG AA standards
 * This is a simplified check - for production, use a proper contrast checker
 */
export function meetsContrastRequirements(foreground: string, background: string): boolean {
    // This is a placeholder - in a real implementation, you would:
    // 1. Parse the color values
    // 2. Calculate relative luminance
    // 3. Calculate contrast ratio
    // 4. Check against WCAG AA standards (4.5:1 for normal text, 3:1 for large text)

    // For now, we'll assume our design system colors meet requirements
    return true;
}

/**
 * Generate unique IDs for form fields
 */
let idCounter = 0;
export function generateUniqueId(prefix: string = 'a11y'): string {
    idCounter += 1;
    return `${prefix}-${idCounter}-${Date.now()}`;
}
