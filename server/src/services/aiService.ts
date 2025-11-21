import axios from 'axios';
import { AIPrompts, AIGeneratorType } from '../config/aiPrompts';
import { INFLECTION_API_URL, INFLECTION_API_KEY } from '../config/env';

// Inflection API context structure
interface InflectionContext {
    text: string;
    type: 'System' | 'Human' | 'AI';
    event_type?: string;
}

// Inflection API request payload
interface InflectionAPIPayload {
    config: string;
    context: InflectionContext[];
}

// Inflection API response structure
interface InflectionAPIResponse {
    text: string;
    created: number;
    tool_calls: any[];
    reasoning_content: any;
}

/**
 * Generate AI Game Master response using Inflection AI API
 * @param generatorType - Type of AI generator to use
 * @param userInput - User's input text
 * @param context - Optional conversation context for continuity
 * @returns AI-generated response text
 */
export async function generateAIGameMasterResponse(
    generatorType: AIGeneratorType,
    userInput: string,
    context: InflectionContext[] = []
): Promise<string> {
    try {
        // Validate generator type exists
        const promptTemplate = AIPrompts[generatorType];
        if (!promptTemplate) {
            throw new Error(`Unknown generator type: ${generatorType}`);
        }

        // Replace {userInput} placeholder in prompt template
        const systemPrompt = promptTemplate.replace('{userInput}', userInput);

        // Build Inflection API payload with config 'Pi-3.1' and context array
        const payload: InflectionAPIPayload = {
            config: 'Pi-3.1',
            context: [
                { text: systemPrompt + '\n\n' + userInput, type: 'Human' }
            ]
        };

        // Make POST request to Inflection AI API with authorization header
        const response = await axios.post<InflectionAPIResponse>(
            INFLECTION_API_URL,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${INFLECTION_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 second timeout
            }
        );

        // Extract text from API response
        const completionText = response.data.text;

        if (!completionText) {
            throw new Error('No completion text in API response');
        }

        return completionText;

    } catch (error: any) {
        // Log detailed error information
        if (axios.isAxiosError(error)) {
            console.error('Inflection API Call Failed:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });

            // Provide user-friendly error messages based on error type
            if (error.code === 'ECONNABORTED') {
                throw new Error('AI service request timed out. Please try again.');
            }

            if (error.response?.status === 401) {
                throw new Error('AI service authentication failed. Please check API credentials.');
            }

            if (error.response?.status === 429) {
                throw new Error('AI service rate limit exceeded. Please try again later.');
            }

            if (error.response?.status >= 500) {
                throw new Error('AI service is temporarily unavailable. Please try again later.');
            }
        } else {
            console.error('AI Service Error:', error.message);
        }

        // Return generic user-friendly error message
        throw new Error('AI service is currently unavailable. Please try again later.');
    }
}
