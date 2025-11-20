import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Trophy, Compass, Users, Zap } from 'lucide-react';

interface Question {
    id: number;
    text: string;
    options: Array<{
        text: string;
        type: string;
        points: number;
    }>;
}

interface PlayerTypeSimulatorProps {
    title?: string;
    description?: string;
    questions?: Question[];
}

const defaultQuestions: Question[] = [
    {
        id: 1,
        text: "In a training program, I'm most excited when...",
        options: [
            { text: "I complete all modules and earn every badge", type: "Achiever", points: 3 },
            { text: "I discover hidden resources or bonus content", type: "Explorer", points: 3 },
            { text: "I collaborate with colleagues and share insights", type: "Socializer", points: 3 },
            { text: "I rank #1 on the leaderboard", type: "Killer", points: 3 }
        ]
    },
    {
        id: 2,
        text: "The best reward for completing a challenge is...",
        options: [
            { text: "A certificate or achievement badge", type: "Achiever", points: 3 },
            { text: "Access to advanced or secret content", type: "Explorer", points: 3 },
            { text: "Recognition from my team or peers", type: "Socializer", points: 3 },
            { text: "Beating others' scores or times", type: "Killer", points: 3 }
        ]
    },
    {
        id: 3,
        text: "I lose interest in a gamified experience when...",
        options: [
            { text: "There are no more goals to achieve", type: "Achiever", points: 3 },
            { text: "I've seen everything there is to see", type: "Explorer", points: 3 },
            { text: "I'm working alone with no social interaction", type: "Socializer", points: 3 },
            { text: "There's no competition or ranking", type: "Killer", points: 3 }
        ]
    }
];

const playerTypeInfo = {
    Achiever: {
        icon: Trophy,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-300",
        description: "You're motivated by mastery and completion. You want to level up, earn all badges, and top leaderboards.",
        mechanics: "Progress bars, achievements, skill trees, completion percentages"
    },
    Explorer: {
        icon: Compass,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-300",
        description: "You're motivated by discovery and understanding. You want to find hidden content and understand how systems work.",
        mechanics: "Easter eggs, unlockable content, deep lore, exploration rewards"
    },
    Socializer: {
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-300",
        description: "You're motivated by connection and relationships. You want to interact with others and build community.",
        mechanics: "Chat, teams, social sharing, collaborative challenges"
    },
    Killer: {
        icon: Zap,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-300",
        description: "You're motivated by competition and dominance. You want to win and be recognized as the best.",
        mechanics: "Leaderboards, PvP challenges, competitive rankings, time trials"
    }
};

export const PlayerTypeSimulator = ({
    title = "Discover Your Player Type",
    description = "Answer these questions to identify your dominant player motivation.",
    questions = defaultQuestions
}: PlayerTypeSimulatorProps) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [result, setResult] = useState<string | null>(null);

    const handleAnswerChange = (questionId: number, optionIndex: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const calculateResult = () => {
        const scores: Record<string, number> = {
            Achiever: 0,
            Explorer: 0,
            Socializer: 0,
            Killer: 0
        };

        Object.entries(answers).forEach(([qId, optionIndex]) => {
            const question = questions.find(q => q.id === parseInt(qId));
            if (question) {
                const option = question.options[parseInt(optionIndex)];
                if (option) {
                    scores[option.type] += option.points;
                }
            }
        });

        const winningType = Object.keys(scores).reduce((a, b) =>
            scores[a] > scores[b] ? a : b, 'Achiever'
        ) as keyof typeof playerTypeInfo;

        setResult(winningType);
    };

    const isComplete = Object.keys(answers).length === questions.length;
    const info = result ? playerTypeInfo[result as keyof typeof playerTypeInfo] : null;
    const Icon = info?.icon;

    return (
        <Card className="p-6 space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-indigo-700 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>

            {!result ? (
                <>
                    <div className="space-y-6">
                        {questions.map((question, qIndex) => (
                            <div key={question.id} className="p-4 border rounded-lg bg-gray-50">
                                <p className="font-semibold mb-3">{question.text}</p>
                                <RadioGroup
                                    value={answers[question.id]?.toString()}
                                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                                >
                                    {question.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex items-center space-x-2 mb-2">
                                            <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                                            <Label htmlFor={`q${qIndex}-o${oIndex}`} className="cursor-pointer">
                                                {option.text}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={calculateResult}
                        disabled={!isComplete}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                        {isComplete ? 'Analyze My Type' : `Answer ${questions.length - Object.keys(answers).length} more question(s)`}
                    </Button>
                </>
            ) : (
                <div className={`p-6 border-2 rounded-lg ${info?.borderColor} ${info?.bgColor}`}>
                    <div className="flex items-center gap-3 mb-4">
                        {Icon && <Icon className={`w-12 h-12 ${info?.color}`} />}
                        <div>
                            <h4 className={`text-2xl font-bold ${info?.color}`}>
                                Your Player Type: {result}
                            </h4>
                        </div>
                    </div>

                    <p className="text-lg mb-4">{info?.description}</p>

                    <div className="bg-white p-4 rounded-lg border">
                        <p className="font-semibold mb-2">Best Mechanics for You:</p>
                        <p className="text-gray-700">{info?.mechanics}</p>
                    </div>

                    <Button
                        onClick={() => {
                            setAnswers({});
                            setResult(null);
                        }}
                        variant="outline"
                        className="w-full mt-4"
                    >
                        Take Again
                    </Button>
                </div>
            )}
        </Card>
    );
};
