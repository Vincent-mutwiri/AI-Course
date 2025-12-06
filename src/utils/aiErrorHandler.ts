/**
 * AI Error Handler Utility
 * 
 * Provides comprehensive error handling for AI content generation,
 * including error classification, user-friendly messages, and retry logic.
 */

export enum AIErrorType {
    NETWORK = 'network',
    TIMEOUT = 'timeout',
    RATE_LIMIT = 'rate_limit',
    VALIDATION = 'validation',
    API_ERROR = 'api_error',
    OFFLINE = 'offline',
    UNKNOWN = 'unknown'
}

export interface AIError {
    type: AIErrorType;
    message: string;
    userMessage: string;
    retryable: boolean;
    retryDelay?: number;
    originalError?: any;
}

/**
 * Classify error based on error object
 */
export function classifyError(error: any): AIError {
    // Check if offline
    if (!navigator.onLine) {
        return {
            type: AIErrorType.OFFLINE,
            message: 'No internet connection',
            userMessage: 'You appear to be offline. Please check your internet connection and try again.',
            retryable: true,
            originalError: error
        };
    }

    // Network errors (no response from server)
    if (!error.response) {
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            return {
                type: AIErrorType.TIMEOUT,
                message: 'Request timed out',
                userMessage: 'The request took too long to complete. This might be due to a complex generation. Please try again.',
                retryable: true,
                retryDelay: 2000,
                originalError: error
            };
        }

        return {
            type: AIErrorType.NETWORK,
            message: 'Network error',
            userMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
            retryable: true,
            retryDelay: 1000,
            originalError: error
        };
    }

    const status = error.response?.status;
    const responseData = error.response?.data;

    // Rate limiting (429)
    if (status === 429) {
        const retryAfter = error.response?.headers?.['retry-after'];
        const retryDelay = retryAfter ? parseInt(retryAfter) * 1000 : 60000;

        return {
            type: AIErrorType.RATE_LIMIT,
            message: 'Rate limit exceeded',
            userMessage: 'Too many requests. Please wait a moment before trying again.',
            retryable: true,
            retryDelay,
            originalError: error
        };
    }

    // Validation errors (400)
    if (status === 400) {
        const validationMessage = responseData?.message || 'Invalid request';
        return {
            type: AIErrorType.VALIDATION,
            message: validationMessage,
            userMessage: `Validation error: ${validationMessage}. Please check your input and try again.`,
            retryable: false,
            originalError: error
        };
    }

    // Server errors (500+)
    if (status >= 500) {
        return {
            type: AIErrorType.API_ERROR,
            message: responseData?.message || 'Server error',
            userMessage: 'The AI service is temporarily unavailable. Please try again in a moment.',
            retryable: true,
            retryDelay: 3000,
            originalError: error
        };
    }

    // API-specific errors
    if (status === 402) {
        return {
            type: AIErrorType.API_ERROR,
            message: 'Insufficient credits',
            userMessage: 'AI generation credits have been exhausted. Please contact your administrator.',
            retryable: false,
            originalError: error
        };
    }

    if (status === 503) {
        return {
            type: AIErrorType.API_ERROR,
            message: 'Service unavailable',
            userMessage: 'The AI service is currently unavailable. Please try again later.',
            retryable: true,
            retryDelay: 5000,
            originalError: error
        };
    }

    // Unknown error
    return {
        type: AIErrorType.UNKNOWN,
        message: responseData?.message || error.message || 'Unknown error',
        userMessage: 'An unexpected error occurred. Please try again.',
        retryable: true,
        retryDelay: 2000,
        originalError: error
    };
}

/**
 * Check if user is online
 */
export function isOnline(): boolean {
    return navigator.onLine;
}

/**
 * Wait for online connection
 */
export function waitForOnline(timeout: number = 30000): Promise<boolean> {
    return new Promise((resolve) => {
        if (navigator.onLine) {
            resolve(true);
            return;
        }

        const timeoutId = setTimeout(() => {
            window.removeEventListener('online', onlineHandler);
            resolve(false);
        }, timeout);

        const onlineHandler = () => {
            clearTimeout(timeoutId);
            window.removeEventListener('online', onlineHandler);
            resolve(true);
        };

        window.addEventListener('online', onlineHandler);
    });
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            const aiError = classifyError(error);

            // Don't retry if error is not retryable
            if (!aiError.retryable) {
                throw error;
            }

            // Don't retry on last attempt
            if (attempt === maxRetries - 1) {
                throw error;
            }

            // Calculate delay with exponential backoff
            const delay = aiError.retryDelay || (initialDelay * Math.pow(2, attempt));

            console.log(`[AI Error Handler] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

/**
 * Get user-friendly error message with suggestions
 */
export function getErrorMessageWithSuggestions(error: AIError): {
    title: string;
    message: string;
    suggestions: string[];
} {
    const suggestions: string[] = [];

    switch (error.type) {
        case AIErrorType.OFFLINE:
            suggestions.push('Check your internet connection');
            suggestions.push('Try again when you\'re back online');
            break;

        case AIErrorType.NETWORK:
            suggestions.push('Check your internet connection');
            suggestions.push('Verify the server is accessible');
            suggestions.push('Try again in a moment');
            break;

        case AIErrorType.TIMEOUT:
            suggestions.push('Try simplifying your prompt');
            suggestions.push('Reduce the content length setting');
            suggestions.push('Try again - the service may be busy');
            break;

        case AIErrorType.RATE_LIMIT:
            suggestions.push('Wait a moment before trying again');
            suggestions.push('Consider using cached content');
            break;

        case AIErrorType.VALIDATION:
            suggestions.push('Check your prompt for invalid characters');
            suggestions.push('Ensure all required fields are filled');
            suggestions.push('Try a different prompt');
            break;

        case AIErrorType.API_ERROR:
            suggestions.push('Try again in a few moments');
            suggestions.push('Contact support if the issue persists');
            break;

        default:
            suggestions.push('Try again');
            suggestions.push('Contact support if the issue persists');
    }

    return {
        title: getErrorTitle(error.type),
        message: error.userMessage,
        suggestions
    };
}

function getErrorTitle(type: AIErrorType): string {
    switch (type) {
        case AIErrorType.OFFLINE:
            return 'No Internet Connection';
        case AIErrorType.NETWORK:
            return 'Network Error';
        case AIErrorType.TIMEOUT:
            return 'Request Timeout';
        case AIErrorType.RATE_LIMIT:
            return 'Rate Limit Exceeded';
        case AIErrorType.VALIDATION:
            return 'Validation Error';
        case AIErrorType.API_ERROR:
            return 'Service Error';
        default:
            return 'Generation Error';
    }
}
