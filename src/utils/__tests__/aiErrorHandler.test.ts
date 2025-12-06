import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    classifyError,
    isOnline,
    waitForOnline,
    retryWithBackoff,
    getErrorMessageWithSuggestions,
    AIErrorType
} from '../aiErrorHandler';

describe('aiErrorHandler', () => {
    describe('classifyError', () => {
        it('should classify offline errors', () => {
            // Mock navigator.onLine
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: false
            });

            const error = new Error('Network error');
            const result = classifyError(error);

            expect(result.type).toBe(AIErrorType.OFFLINE);
            expect(result.retryable).toBe(true);
            expect(result.userMessage).toContain('offline');
        });

        it('should classify timeout errors', () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: true
            });

            const error = {
                code: 'ECONNABORTED',
                message: 'timeout of 10000ms exceeded'
            };
            const result = classifyError(error);

            expect(result.type).toBe(AIErrorType.TIMEOUT);
            expect(result.retryable).toBe(true);
            expect(result.retryDelay).toBe(2000);
        });

        it('should classify rate limit errors', () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: true
            });

            const error = {
                response: {
                    status: 429,
                    headers: {
                        'retry-after': '60'
                    },
                    data: {}
                }
            };
            const result = classifyError(error);

            expect(result.type).toBe(AIErrorType.RATE_LIMIT);
            expect(result.retryable).toBe(true);
            expect(result.retryDelay).toBe(60000);
        });

        it('should classify validation errors', () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: true
            });

            const error = {
                response: {
                    status: 400,
                    data: {
                        message: 'Invalid prompt format'
                    }
                }
            };
            const result = classifyError(error);

            expect(result.type).toBe(AIErrorType.VALIDATION);
            expect(result.retryable).toBe(false);
            expect(result.userMessage).toContain('Invalid prompt format');
        });

        it('should classify server errors', () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: true
            });

            const error = {
                response: {
                    status: 500,
                    data: {
                        message: 'Internal server error'
                    }
                }
            };
            const result = classifyError(error);

            expect(result.type).toBe(AIErrorType.API_ERROR);
            expect(result.retryable).toBe(true);
            expect(result.retryDelay).toBe(3000);
        });

        it('should classify network errors without response', () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: true
            });

            const error = {
                message: 'Network Error'
            };
            const result = classifyError(error);

            expect(result.type).toBe(AIErrorType.NETWORK);
            expect(result.retryable).toBe(true);
        });
    });

    describe('isOnline', () => {
        it('should return true when online', () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: true
            });

            expect(isOnline()).toBe(true);
        });

        it('should return false when offline', () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: false
            });

            expect(isOnline()).toBe(false);
        });
    });

    describe('waitForOnline', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('should resolve immediately if already online', async () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: true
            });

            const result = await waitForOnline(1000);
            expect(result).toBe(true);
        });

        it('should resolve when connection is restored', async () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: false
            });

            const promise = waitForOnline(5000);

            // Simulate going online after 1 second
            setTimeout(() => {
                Object.defineProperty(navigator, 'onLine', {
                    writable: true,
                    value: true
                });
                window.dispatchEvent(new Event('online'));
            }, 1000);

            vi.advanceTimersByTime(1000);

            const result = await promise;
            expect(result).toBe(true);
        });

        it('should timeout if connection is not restored', async () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: false
            });

            const promise = waitForOnline(1000);
            vi.advanceTimersByTime(1000);

            const result = await promise;
            expect(result).toBe(false);
        });
    });

    describe('retryWithBackoff', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('should succeed on first attempt', async () => {
            const fn = vi.fn().mockResolvedValue('success');
            const result = await retryWithBackoff(fn, 3, 1000);

            expect(result).toBe('success');
            expect(fn).toHaveBeenCalledTimes(1);
        });

        it('should retry on failure and eventually succeed', async () => {
            const fn = vi.fn()
                .mockRejectedValueOnce({ response: { status: 500 } })
                .mockResolvedValueOnce('success');

            const promise = retryWithBackoff(fn, 3, 1000);

            // Advance timers to allow retry
            await vi.advanceTimersByTimeAsync(1000);

            const result = await promise;

            expect(result).toBe('success');
            expect(fn).toHaveBeenCalledTimes(2);
        });

        it('should not retry non-retryable errors', async () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: true
            });

            const fn = vi.fn().mockRejectedValue({ response: { status: 400 } });

            await expect(retryWithBackoff(fn, 3, 1000)).rejects.toThrow();
            expect(fn).toHaveBeenCalledTimes(1);
        });

        it('should exhaust retries and throw last error', async () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: true
            });

            const fn = vi.fn().mockRejectedValue({ response: { status: 500 } });

            const promise = retryWithBackoff(fn, 3, 1000);

            // Advance through all retry attempts (server errors have 3000ms delay)
            await vi.advanceTimersByTimeAsync(3000); // First retry
            await vi.advanceTimersByTimeAsync(3000); // Second retry

            await expect(promise).rejects.toThrow();
            expect(fn).toHaveBeenCalledTimes(3);
        });
    });

    describe('getErrorMessageWithSuggestions', () => {
        it('should provide suggestions for offline errors', () => {
            const error = {
                type: AIErrorType.OFFLINE,
                message: 'No internet',
                userMessage: 'You are offline',
                retryable: true
            };

            const result = getErrorMessageWithSuggestions(error);

            expect(result.title).toBe('No Internet Connection');
            expect(result.suggestions).toContain('Check your internet connection');
        });

        it('should provide suggestions for timeout errors', () => {
            const error = {
                type: AIErrorType.TIMEOUT,
                message: 'Timeout',
                userMessage: 'Request timed out',
                retryable: true
            };

            const result = getErrorMessageWithSuggestions(error);

            expect(result.title).toBe('Request Timeout');
            expect(result.suggestions).toContain('Try simplifying your prompt');
        });

        it('should provide suggestions for rate limit errors', () => {
            const error = {
                type: AIErrorType.RATE_LIMIT,
                message: 'Rate limit',
                userMessage: 'Too many requests',
                retryable: true
            };

            const result = getErrorMessageWithSuggestions(error);

            expect(result.title).toBe('Rate Limit Exceeded');
            expect(result.suggestions).toContain('Wait a moment before trying again');
        });

        it('should provide suggestions for validation errors', () => {
            const error = {
                type: AIErrorType.VALIDATION,
                message: 'Invalid input',
                userMessage: 'Validation failed',
                retryable: false
            };

            const result = getErrorMessageWithSuggestions(error);

            expect(result.title).toBe('Validation Error');
            expect(result.suggestions).toContain('Check your prompt for invalid characters');
        });
    });
});
