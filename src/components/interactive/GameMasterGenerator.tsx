import { useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Sparkles, Loader2 } from 'lucide-react';

interface GameMasterGeneratorProps {
    generatorType: 'mechanic-analyst' | 'narrative-generator' | 'dark-pattern-redesigner';
    title: string;
    description: string;
    placeholder?: string;
}

const generatorConfig = {
    'mechanic-analyst': {
        icon: '🎯',
        buttonText: 'Analyze My Pitch',
        loadingText: 'Game Master is analyzing...',
        successMessage: 'Pitch analysis complete!'
    },
    'narrative-generator': {
        icon: '📖',
        buttonText: 'Generate Narrative',
        loadingText: 'Crafting your story...',
        successMessage: 'Narrative wrapper created!'
    },
    'dark-pattern-redesigner': {
        icon: '⚖️',
        buttonText: 'Get Ethical Redesign',
        loadingText: 'Analyzing ethical concerns...',
        successMessage: 'Ethical redesign complete!'
    }
};

export const GameMasterGenerator = ({
    generatorType,
    title,
    description,
    placeholder = "Enter your text here..."
}: GameMasterGeneratorProps) => {
    const [userInput, setUserInput] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const MAX_CHAR_LIMIT = 2000;
    const config = generatorConfig[generatorType];

    const handleSubmit = async () => {
        if (userInput.length === 0 || userInput.length > MAX_CHAR_LIMIT) {
            toast.error(`Input must be between 1 and ${MAX_CHAR_LIMIT} characters.`);
            return;
        }

        setLoading(true);
        setAiResponse('');

        try {
            const response = await axios.post('/api/ai-generator/generate', {
                generatorType,
                userInput,
            });

            setAiResponse(response.data.result);
            toast.success(config.successMessage);
        } catch (error: any) {
            console.error('AI Generator Error:', error);
            toast.error(error.response?.data?.message || 'Game Master is offline. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setUserInput('');
        setAiResponse('');
    };

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-start gap-3">
                <span className="text-4xl">{config.icon}</span>
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-indigo-700 mb-2">{title}</h3>
                    <p className="text-gray-600">{description}</p>
                </div>
            </div>

            <div className="space-y-3">
                <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={placeholder}
                    rows={8}
                    maxLength={MAX_CHAR_LIMIT}
                    className="w-full resize-none"
                    disabled={loading}
                />

                <div className="flex justify-between items-center">
                    <span className={`text-sm ${userInput.length > MAX_CHAR_LIMIT * 0.9
                            ? 'text-red-500 font-semibold'
                            : 'text-gray-500'
                        }`}>
                        {userInput.length}/{MAX_CHAR_LIMIT} characters
                    </span>

                    <div className="flex gap-2">
                        {userInput && (
                            <Button
                                onClick={handleClear}
                                variant="outline"
                                disabled={loading}
                            >
                                Clear
                            </Button>
                        )}
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !userInput.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {config.loadingText}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {config.buttonText}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {aiResponse && (
                <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-700">Game Master's Feedback:</h4>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                        {aiResponse}
                    </div>
                </div>
            )}

            {!aiResponse && !loading && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                        💡 <strong>Tip:</strong> Be specific and detailed in your input. The more context you provide,
                        the better feedback the Game Master can give you.
                    </p>
                </div>
            )}
        </Card>
    );
};
