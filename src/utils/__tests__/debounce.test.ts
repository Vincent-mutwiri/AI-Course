import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../debounce';

describe('debounce utility', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('delays function execution', () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 1000);

        debouncedFn();
        expect(mockFn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls when called multiple times', () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 1000);

        debouncedFn();
        vi.advanceTimersByTime(500);
        debouncedFn();
        vi.advanceTimersByTime(500);
        debouncedFn();

        expect(mockFn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('passes arguments to debounced function', () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 1000);

        debouncedFn('arg1', 'arg2');
        vi.advanceTimersByTime(1000);

        expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('executes with correct timing for auto-save scenario', () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 2000);

        // Simulate rapid changes (like typing)
        debouncedFn();
        vi.advanceTimersByTime(500);
        debouncedFn();
        vi.advanceTimersByTime(500);
        debouncedFn();
        vi.advanceTimersByTime(500);

        // Function should not have been called yet
        expect(mockFn).not.toHaveBeenCalled();

        // After 2 seconds of inactivity, it should be called
        vi.advanceTimersByTime(2000);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
