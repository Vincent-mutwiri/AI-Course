import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIAssistantPanel } from '../AIAssistantPanel';
import type { CourseContext } from '@/services/courseContextBuilder';

// Mock dependencies
vi.mock('@/services/api', () => ({
    default: {
        post: vi.fn(),
    },
}));

vi.mock('@/utils/aiContentCache', () => ({
    aiContentCache: {
        get: vi.fn(),
        set: vi.fn(),
    },
    GenerationOptions: {},
}));

vi.mock('@/components/admin/GenerationHistory', () => ({
    addToHistory: vi.fn(),
}));

vi.mock('@/components/admin/AISettings', () => ({
    loadAISettings: vi.fn(() => ({
        tone: 'conversational',
        readingLevel: 'college',
        length: 'moderate',
    })),
}));

vi.mock('@/hooks/useOnlineStatus', () => ({
    useOnlineStatus: vi.fn(() => true),
}));

vi.mock('@/utils/aiErrorHandler', () => ({
    classifyError: vi.fn(),
    getErrorMessageWithSuggestions: vi.fn(() => ({
        title: 'Error',
        message: 'Test error',
        suggestions: [],
    })),
    retryWithBackoff: vi.fn(),
}));

vi.mock('@/components/ui/toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('AIAssistantPanel Keyboard Shortcuts', () => {
    const mockCourseContext: CourseContext = {
        courseId: 'test-course',
        courseTitle: 'Test Course',
        moduleId: 'test-module',
        moduleName: 'Test Module',
        lessonId: 'test-lesson',
        lessonName: 'Test Lesson',
    };

    const mockOnContentGenerated = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders keyboard shortcuts button', () => {
        render(
            <AIAssistantPanel
                blockType="text"
                courseContext={mockCourseContext}
                onContentGenerated={mockOnContentGenerated}
            />
        );

        const keyboardButton = screen.getByLabelText('View keyboard shortcuts');
        expect(keyboardButton).toBeInTheDocument();
    });

    it('opens keyboard shortcuts dialog when button is clicked', async () => {
        render(
            <AIAssistantPanel
                blockType="text"
                courseContext={mockCourseContext}
                onContentGenerated={mockOnContentGenerated}
            />
        );

        const keyboardButton = screen.getByLabelText('View keyboard shortcuts');
        fireEvent.click(keyboardButton);

        await waitFor(() => {
            expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
        });

        expect(screen.getByText('Toggle AI Assistant')).toBeInTheDocument();
        expect(screen.getByText('Generate Content')).toBeInTheDocument();
        expect(screen.getByText('Regenerate Content')).toBeInTheDocument();
        expect(screen.getByText('Refine Content')).toBeInTheDocument();
    });

    it('toggles panel with Cmd+G keyboard shortcut', () => {
        render(
            <AIAssistantPanel
                blockType="text"
                courseContext={mockCourseContext}
                onContentGenerated={mockOnContentGenerated}
            />
        );

        // Panel should be collapsed initially
        expect(screen.queryByLabelText('Prompt')).not.toBeInTheDocument();

        // Press Cmd+G to open
        fireEvent.keyDown(window, { key: 'g', metaKey: true });

        // Panel should be expanded
        expect(screen.getByLabelText('Prompt')).toBeInTheDocument();

        // Press Cmd+G again to close
        fireEvent.keyDown(window, { key: 'g', metaKey: true });

        // Panel should be collapsed again
        expect(screen.queryByLabelText('Prompt')).not.toBeInTheDocument();
    });

    it('toggles panel with Ctrl+G keyboard shortcut', () => {
        render(
            <AIAssistantPanel
                blockType="text"
                courseContext={mockCourseContext}
                onContentGenerated={mockOnContentGenerated}
            />
        );

        // Panel should be collapsed initially
        expect(screen.queryByLabelText('Prompt')).not.toBeInTheDocument();

        // Press Ctrl+G to open
        fireEvent.keyDown(window, { key: 'g', ctrlKey: true });

        // Panel should be expanded
        expect(screen.getByLabelText('Prompt')).toBeInTheDocument();
    });

    it('displays tooltip on Generate button', async () => {
        render(
            <AIAssistantPanel
                blockType="text"
                courseContext={mockCourseContext}
                onContentGenerated={mockOnContentGenerated}
            />
        );

        // Open the panel first
        fireEvent.keyDown(window, { key: 'g', metaKey: true });

        const generateButton = screen.getByRole('button', { name: /Generate Content/i });
        expect(generateButton).toBeInTheDocument();
    });
});
