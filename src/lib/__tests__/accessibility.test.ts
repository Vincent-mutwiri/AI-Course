import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    getBlockAriaLabel,
    getBlockActionAriaLabel,
    handleListKeyboardNavigation,
    focusManagement,
    announceToScreenReader,
    generateUniqueId,
} from '../accessibility';

describe('Accessibility Utilities', () => {
    describe('getBlockAriaLabel', () => {
        it('should return correct label for text block', () => {
            expect(getBlockAriaLabel('text')).toBe('Text content block');
        });

        it('should return correct label for video block', () => {
            expect(getBlockAriaLabel('video')).toBe('Video block');
        });

        it('should include position when provided', () => {
            expect(getBlockAriaLabel('text', 0)).toBe('Text content block, position 1');
            expect(getBlockAriaLabel('video', 2)).toBe('Video block, position 3');
        });

        it('should handle unknown block types', () => {
            expect(getBlockAriaLabel('unknown')).toBe('unknown block');
        });
    });

    describe('getBlockActionAriaLabel', () => {
        it('should return correct label for edit action', () => {
            expect(getBlockActionAriaLabel('edit', 'text', 0)).toBe(
                'Edit Text content block, position 1'
            );
        });

        it('should return correct label for duplicate action', () => {
            expect(getBlockActionAriaLabel('duplicate', 'video', 1)).toBe(
                'Duplicate Video block, position 2'
            );
        });

        it('should return correct label for delete action', () => {
            expect(getBlockActionAriaLabel('delete', 'image', 2)).toBe(
                'Delete Image block, position 3'
            );
        });

        it('should return correct label for preview action', () => {
            expect(getBlockActionAriaLabel('preview', 'code')).toBe(
                'Preview Code snippet block'
            );
        });
    });

    describe('handleListKeyboardNavigation', () => {
        it('should navigate down with ArrowDown', () => {
            const onNavigate = vi.fn();
            const event = {
                key: 'ArrowDown',
                preventDefault: vi.fn(),
            } as any;

            handleListKeyboardNavigation(event, 0, 5, onNavigate);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(onNavigate).toHaveBeenCalledWith(1);
        });

        it('should not navigate down at last item', () => {
            const onNavigate = vi.fn();
            const event = {
                key: 'ArrowDown',
                preventDefault: vi.fn(),
            } as any;

            handleListKeyboardNavigation(event, 4, 5, onNavigate);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(onNavigate).not.toHaveBeenCalled();
        });

        it('should navigate up with ArrowUp', () => {
            const onNavigate = vi.fn();
            const event = {
                key: 'ArrowUp',
                preventDefault: vi.fn(),
            } as any;

            handleListKeyboardNavigation(event, 2, 5, onNavigate);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(onNavigate).toHaveBeenCalledWith(1);
        });

        it('should navigate to first item with Home', () => {
            const onNavigate = vi.fn();
            const event = {
                key: 'Home',
                preventDefault: vi.fn(),
            } as any;

            handleListKeyboardNavigation(event, 3, 5, onNavigate);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(onNavigate).toHaveBeenCalledWith(0);
        });

        it('should navigate to last item with End', () => {
            const onNavigate = vi.fn();
            const event = {
                key: 'End',
                preventDefault: vi.fn(),
            } as any;

            handleListKeyboardNavigation(event, 0, 5, onNavigate);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(onNavigate).toHaveBeenCalledWith(4);
        });

        it('should call onSelect with Enter', () => {
            const onNavigate = vi.fn();
            const onSelect = vi.fn();
            const event = {
                key: 'Enter',
                preventDefault: vi.fn(),
            } as any;

            handleListKeyboardNavigation(event, 2, 5, onNavigate, onSelect);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(onSelect).toHaveBeenCalledWith(2);
        });

        it('should call onSelect with Space', () => {
            const onNavigate = vi.fn();
            const onSelect = vi.fn();
            const event = {
                key: ' ',
                preventDefault: vi.fn(),
            } as any;

            handleListKeyboardNavigation(event, 2, 5, onNavigate, onSelect);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(onSelect).toHaveBeenCalledWith(2);
        });
    });

    describe('focusManagement', () => {
        describe('returnFocus', () => {
            it('should focus element after timeout', () => {
                vi.useFakeTimers();
                const element = document.createElement('button');
                element.focus = vi.fn();

                focusManagement.returnFocus(element);

                vi.runAllTimers();
                expect(element.focus).toHaveBeenCalled();
                vi.useRealTimers();
            });

            it('should handle null element gracefully', () => {
                expect(() => focusManagement.returnFocus(null)).not.toThrow();
            });
        });

        describe('focusFirstError', () => {
            it('should focus first invalid element', () => {
                const form = document.createElement('form');
                const input = document.createElement('input');
                input.setAttribute('aria-invalid', 'true');
                input.focus = vi.fn();
                form.appendChild(input);

                focusManagement.focusFirstError(form);

                expect(input.focus).toHaveBeenCalled();
            });

            it('should do nothing if no errors', () => {
                const form = document.createElement('form');
                expect(() => focusManagement.focusFirstError(form)).not.toThrow();
            });
        });
    });

    describe('announceToScreenReader', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
            // Clean up any announcement elements
            document.querySelectorAll('[role="status"]').forEach((el) => el.remove());
        });

        it('should create announcement element with polite priority', () => {
            announceToScreenReader('Test message', 'polite');

            const announcement = document.querySelector('[aria-live="polite"]');
            expect(announcement).toBeTruthy();
            expect(announcement?.textContent).toBe('Test message');
            expect(announcement?.getAttribute('role')).toBe('status');
        });

        it('should create announcement element with assertive priority', () => {
            announceToScreenReader('Error message', 'assertive');

            const announcement = document.querySelector('[aria-live="assertive"]');
            expect(announcement).toBeTruthy();
            expect(announcement?.textContent).toBe('Error message');
        });

        it('should remove announcement after timeout', () => {
            announceToScreenReader('Test message');

            let announcement = document.querySelector('[aria-live="polite"]');
            expect(announcement).toBeTruthy();

            vi.advanceTimersByTime(1000);

            announcement = document.querySelector('[aria-live="polite"]');
            expect(announcement).toBeFalsy();
        });
    });

    describe('generateUniqueId', () => {
        it('should generate unique IDs', () => {
            const id1 = generateUniqueId();
            const id2 = generateUniqueId();

            expect(id1).not.toBe(id2);
        });

        it('should use custom prefix', () => {
            const id = generateUniqueId('custom');
            expect(id).toMatch(/^custom-/);
        });

        it('should use default prefix', () => {
            const id = generateUniqueId();
            expect(id).toMatch(/^a11y-/);
        });
    });
});
