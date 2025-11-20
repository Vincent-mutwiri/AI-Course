import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import api from '@/services/api';

export type AIGeneratorType =
    | 'mechanic-analyst'
    | 'narrative-generator'
    | 'dark-pattern-redesigner'
    | 'core-loop-critique'
    | 'roe-measurement-advisor';

interface AIGameMasterGeneratorProps {
    generatorType: AIGeneratorType;
    title: string;
    description: string;
}

const MAX_CHARS = 5000;
const WARNING_THRESHOLD = 0.9; // 90%

export const AIGameMasterGenerator = ({
    generatorType,
    title,
    description
}: AIGameMasterGeneratorProps) => {
    const [userInput, setUserInput] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const charCount = userInput.length;
    const charPercentage = charCount / MAX_CHARS;
    const showWarning = charPercentage >= WARNING_THRESHOLD;

    const handleSubmit = async () => {
        // Validation
        if (!userInput.trim()) {
            toast.error('Please enter some text before submitting.');
            return;
        }

        if (userInput.length > MAX_CHARS) {
            toast.error(`Input exceeds maximum length of ${MAX_CHARS} characters.`);
            return;
        }

        setLoading(true);
        setAiResponse('');

        try {
            const { data } = await api.post('/ai/game-master', {
                generatorType,
                userInput: userInput.trim()
            });

            setAiResponse(data.result);
            toast.success('AI feedback generated successfully!');
        } catch (error: any) {
            console.error('AI Game Master Error:', error);

            const errorMessage = error.response?.status === 401
                ? 'Please log in to use this feature.'
                : error.response?.status === 400
                    ? error.response?.data?.message || 'Invalid input. Please check your submission.'
                    : error.response?.status === 500
                        ? 'AI service is temporarily unavailable. Please try again later.'
                        : 'Failed to generate AI response. Please check your connection and try again.';

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && (
                    <p className="text-sm text-muted-foreground mt-2">{description}</p>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="user-input">Your Input</Label>
                    <Textarea
                        id="user-input"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter your gamification design, pitch, or concept here..."
                        rows={8}
                        maxLength={MAX_CHARS}
                        className="mt-2"
                        disabled={loading}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <p
                            className={`text-xs transition-colors ${showWarning
                                    ? 'text-yellow-600 dark:text-yellow-500 font-medium'
                                    : 'text-muted-foreground'
                                }`}
                        >
                            {charCount} / {MAX_CHARS} characters
                            {showWarning && ' (approaching limit)'}
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={loading || !userInput.trim() || charCount > MAX_CHARS}
                    className="w-full"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span>
                            Consulting the Game Master...
                        </span>
                    ) : (
                        'Get AI Feedback'
                    )}
                </Button>

                {aiResponse && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                            <span className="text-2xl">🎮</span>
                            Game Master's Feedback
                        </h4>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                {aiResponse}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
