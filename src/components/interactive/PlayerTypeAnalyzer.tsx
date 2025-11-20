import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Trophy, Compass, Users, Zap } from 'lucide-react';

// Player type definitions based on Bartle/Marczewski taxonomy
type PlayerType = 'Achiever' | 'Explorer' | 'Socializer' | 'Disruptor';

interface Question {
    id: number;
    text: string;
    playerType: PlayerType;
}

// Questions mapped to player types
const questions: Question[] = [
    { id: 1, text: "I love earning badges, points, and completing challenges.", playerType: 'Achiever' },
    { id: 2, text: "I enjoy discovering hidden features and experimenting with new tools.", playerType: 'Explorer' },
    { id: 3, text: "I prefer working with others and sharing my progress.", playerType: 'Socializer' },
    { id: 4, text: "I like finding creative ways to bend the rules or test system limits.", playerType: 'Disruptor' },
    { id: 5, text: "Leaderboards and competition motivate me to do my best.", playerType: 'Achiever' },
    { id: 6, text: "I'm curious about how things work behind the scenes.", playerType: 'Explorer' },
    { id: 7, text: "Helping teammates succeed is more rewarding than personal wins.", playerType: 'Socializer' },
    { id: 8, text: "I enjoy surprising others with unexpected strategies.", playerType: 'Disruptor' },
    { id: 9, text: "Clear goals and measurable progress keep me engaged.", playerType: 'Achiever' },
    { id: 10, text: "I love exploring all possible paths, even if they're not optimal.", playerType: 'Explorer' },
    { id: 11, text: "I value community feedback and collaborative achievements.", playerType: 'Socializer' },
    { id: 12, text: "I like to challenge conventions and try unconventional approaches.", playerType: 'Disruptor' },
];

// Answer options with point values
const answerOptions = [
    { value: 'strongly-agree', label: 'Strongly Agree', points: 2 },
    { value: 'agree', label: 'Agree', points: 1 },
    { value: 'neutral', label: 'Neutral', points: 0 },
    { value: 'disagree', label: 'Disagree', points: -1 },
    { value: 'strongly-disagree', label: 'Strongly Disagree', points: -2 },
];

// Player type metadata
const playerTypeInfo: Record<PlayerType, { icon: any; color: string; description: string; designTips: string }> = {
    Achiever: {
        icon: Trophy,
        color: 'text-yellow-600',
        description: "You're driven by goals, achievements, and measurable progress. You thrive on challenges and love seeing your accomplishments recognized.",
        designTips: "Design for Achievers: Use clear progression systems, badges, leaderboards, and milestone celebrations. Provide frequent feedback on progress."
    },
    Explorer: {
        icon: Compass,
        color: 'text-blue-600',
        description: "You're curious and love discovering new features, hidden content, and understanding how systems work. Experimentation excites you.",
        designTips: "Design for Explorers: Include easter eggs, branching paths, optional content, and discovery mechanics. Reward curiosity and experimentation."
    },
    Socializer: {
        icon: Users,
        color: 'text-green-600',
        description: "You value relationships, collaboration, and community. You're motivated by helping others and sharing experiences with your peers.",
        designTips: "Design for Socializers: Enable collaboration, peer feedback, team challenges, and social sharing. Create opportunities for meaningful interaction."
    },
    Disruptor: {
        icon: Zap,
        color: 'text-purple-600',
        description: "You enjoy testing boundaries, finding creative solutions, and challenging the status quo. You're motivated by innovation and surprise.",
        designTips: "Design for Disruptors: Allow creative problem-solving, provide multiple solution paths, and embrace unconventional approaches. Channel disruption positively."
    }
};

export const PlayerTypeAnalyzer: React.FC = () => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [result, setResult] = useState<PlayerType | null>(null);

    const handleAnswerChange = (questionId: number, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const calculateResult = () => {
        // Initialize scores for each player type
        const scores: Record<PlayerType, number> = {
            Achiever: 0,
            Explorer: 0,
            Socializer: 0,
            Disruptor: 0
        };

        // Calculate scores based on answers
        questions.forEach(question => {
            const answer = answers[question.id];
            if (answer) {
                const option = answerOptions.find(opt => opt.value === answer);
                if (option) {
                    scores[question.playerType] += option.points;
                }
            }
        });

        // Find the dominant player type (highest score)
        let dominantType: PlayerType = 'Achiever';
        let maxScore = scores.Achiever;

        (Object.keys(scores) as PlayerType[]).forEach(type => {
            if (scores[type] > maxScore) {
                maxScore = scores[type];
                dominantType = type;
            }
        });

        setResult(dominantType);
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            return;
        }
        calculateResult();
    };

    const handleReset = () => {
        setAnswers({});
        setResult(null);
    };

    const allQuestionsAnswered = Object.keys(answers).length === questions.length;

    if (result) {
        const info = playerTypeInfo[result];
        const Icon = info.icon;

        return (
            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Icon className={`h-8 w-8 ${info.color}`} />
                        <div>
                            <CardTitle className="text-2xl">Your Player Type: {result}</CardTitle>
                            <CardDescription>Based on your responses</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Result Display */}
                    <div className={`p-6 border-2 rounded-lg bg-gradient-to-br from-background to-muted`}>
                        <p className="text-lg mb-4">{info.description}</p>
                        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                            <p className="text-sm font-semibold mb-2">💡 Design Insight:</p>
                            <p className="text-sm">{info.designTips}</p>
                        </div>
                    </div>

                    {/* All Player Types Overview */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground">All Player Types:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(Object.keys(playerTypeInfo) as PlayerType[]).map(type => {
                                const typeInfo = playerTypeInfo[type];
                                const TypeIcon = typeInfo.icon;
                                const isSelected = type === result;

                                return (
                                    <div
                                        key={type}
                                        className={`p-3 rounded-lg border-2 transition-all ${isSelected
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted bg-muted/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <TypeIcon className={`h-5 w-5 ${typeInfo.color}`} />
                                            <span className="font-semibold text-sm">{type}</span>
                                            {isSelected && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">You</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Educational Commentary */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm">
                            <strong>🎮 Remember:</strong> Most learners are a mix of types! Use this as a starting point
                            to design diverse mechanics that appeal to different motivations. A well-gamified experience
                            offers something for everyone.
                        </p>
                    </div>

                    <Button onClick={handleReset} variant="outline" className="w-full">
                        Retake Assessment
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Player Type Analyzer</CardTitle>
                <CardDescription>
                    Answer these questions to discover your dominant player type. This helps you understand
                    what motivates different learners in gamified experiences.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {questions.map((question, index) => (
                    <div key={question.id} className="space-y-3 p-4 border rounded-lg bg-muted/30">
                        <Label className="text-base font-semibold">
                            {index + 1}. {question.text}
                        </Label>
                        <RadioGroup
                            value={answers[question.id] || ''}
                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                        >
                            {answerOptions.map(option => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={`q${question.id}-${option.value}`} />
                                    <Label
                                        htmlFor={`q${question.id}-${option.value}`}
                                        className="font-normal cursor-pointer"
                                    >
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                ))}

                <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-muted-foreground">
                        {Object.keys(answers).length} of {questions.length} questions answered
                    </span>
                    <Button
                        onClick={handleSubmit}
                        disabled={!allQuestionsAnswered}
                        size="lg"
                    >
                        Calculate My Player Type
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
