import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Activity, AlertTriangle, Coffee, Target, Zap } from 'lucide-react';

type FlowState = 'Anxiety' | 'Boredom' | 'Flow' | 'Arousal' | 'Control';

interface FlowStateInfo {
    name: FlowState;
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
    designAdvice: string;
}

const flowStateInfo: Record<FlowState, FlowStateInfo> = {
    Anxiety: {
        name: 'Anxiety',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        borderColor: 'border-red-500',
        description: 'Challenge far exceeds skill level. Learners feel overwhelmed and frustrated.',
        designAdvice: 'Reduce difficulty, provide scaffolding, break tasks into smaller steps, or offer hints and support.'
    },
    Boredom: {
        name: 'Boredom',
        icon: Coffee,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50 dark:bg-gray-950/20',
        borderColor: 'border-gray-500',
        description: 'Skill level far exceeds challenge. Learners are disengaged and passive.',
        designAdvice: 'Increase difficulty, add complexity, introduce new mechanics, or provide advanced challenges.'
    },
    Flow: {
        name: 'Flow',
        icon: Target,
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-950/20',
        borderColor: 'border-green-500',
        description: 'Perfect balance! Learners are fully engaged, focused, and in the optimal learning zone.',
        designAdvice: 'Maintain this balance! Gradually increase difficulty as skills improve to keep learners in flow.'
    },
    Arousal: {
        name: 'Arousal',
        icon: Zap,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-950/20',
        borderColor: 'border-orange-500',
        description: 'Challenge slightly exceeds skill. Learners are engaged but may need support.',
        designAdvice: 'This can be productive! Provide just-in-time support to help learners stretch their abilities.'
    },
    Control: {
        name: 'Control',
        icon: Activity,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        borderColor: 'border-blue-500',
        description: 'Skill slightly exceeds challenge. Learners feel confident and in control.',
        designAdvice: 'Good for building confidence! Gradually introduce new challenges to move toward flow.'
    }
};

export const FlowChannelEvaluator: React.FC = () => {
    const [skill, setSkill] = useState(5);
    const [difficulty, setDifficulty] = useState(5);

    const getFlowState = (): FlowState => {
        const delta = difficulty - skill;

        if (delta > 2) {
            return 'Anxiety';
        } else if (delta < -2) {
            return 'Boredom';
        } else if (Math.abs(delta) <= 1) {
            return 'Flow';
        } else if (delta > 0) {
            return 'Arousal';
        } else {
            return 'Control';
        }
    };

    const currentState = getFlowState();
    const stateInfo = flowStateInfo[currentState];
    const StateIcon = stateInfo.icon;

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Activity className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl">Flow Channel Evaluator</CardTitle>
                        <CardDescription>
                            Adjust skill and difficulty levels to see how they affect learner engagement and flow state
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Skill Slider */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Learner Skill Level</Label>
                        <span className="text-2xl font-bold text-primary">{skill}</span>
                    </div>
                    <Slider
                        value={[skill]}
                        onValueChange={(value) => setSkill(value[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Beginner</span>
                        <span>Expert</span>
                    </div>
                </div>

                {/* Difficulty Slider */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Task Difficulty</Label>
                        <span className="text-2xl font-bold text-purple-600">{difficulty}</span>
                    </div>
                    <Slider
                        value={[difficulty]}
                        onValueChange={(value) => setDifficulty(value[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Easy</span>
                        <span>Very Hard</span>
                    </div>
                </div>

                {/* Current Flow State Display */}
                <div className={`p-6 border-2 rounded-lg ${stateInfo.bgColor} ${stateInfo.borderColor}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <StateIcon className={`h-10 w-10 ${stateInfo.color}`} />
                        <div>
                            <h3 className="text-2xl font-bold">{stateInfo.name}</h3>
                            <p className="text-sm text-muted-foreground">Current Flow State</p>
                        </div>
                    </div>
                    <p className="text-base mb-4">{stateInfo.description}</p>
                    <div className="p-3 bg-background/50 rounded-lg border">
                        <p className="text-sm">
                            <strong>💡 Design Advice:</strong> {stateInfo.designAdvice}
                        </p>
                    </div>
                </div>

                {/* Visual Flow Channel Diagram */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold">Flow Channel Visualization:</Label>
                    <div className="relative h-64 border-2 rounded-lg p-4 bg-muted/30">
                        {/* Axes */}
                        <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-border"></div>
                        <div className="absolute bottom-4 left-4 top-4 w-0.5 bg-border"></div>

                        {/* Axis Labels */}
                        <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">Low</div>
                        <div className="absolute bottom-0 right-4 text-xs text-muted-foreground">High Skill →</div>
                        <div className="absolute top-0 left-0 text-xs text-muted-foreground rotate-90 origin-top-left ml-2">
                            High Difficulty ↑
                        </div>

                        {/* Flow Channel (diagonal band) */}
                        <div className="absolute inset-4 pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Anxiety zone (top left) */}
                                <polygon points="0,0 0,40 40,0" fill="rgba(239, 68, 68, 0.1)" />

                                {/* Boredom zone (bottom right) */}
                                <polygon points="60,100 100,100 100,60" fill="rgba(156, 163, 175, 0.1)" />

                                {/* Flow channel (diagonal) */}
                                <polygon points="30,0 0,30 70,100 100,70" fill="rgba(34, 197, 94, 0.15)" />
                            </svg>
                        </div>

                        {/* Current Position Marker */}
                        <div
                            className="absolute w-4 h-4 bg-primary border-2 border-white rounded-full shadow-lg transition-all duration-100"
                            style={{
                                left: `${((skill - 1) / 9) * 85 + 5}%`,
                                bottom: `${((difficulty - 1) / 9) * 85 + 5}%`,
                            }}
                            title={`Skill: ${skill}, Difficulty: ${difficulty}`}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                You are here
                            </div>
                        </div>
                    </div>
                </div>

                {/* Educational Commentary */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm">
                        <strong>🎯 Flow Theory (Csikszentmihalyi):</strong> Flow occurs when challenge and skill
                        are balanced at a high level. This is the "sweet spot" where learners are fully immersed,
                        lose track of time, and achieve peak performance. In gamified learning, continuously adjust
                        difficulty to match growing skills, keeping learners in the flow channel.
                    </p>
                </div>

                {/* Quick Presets */}
                <div className="space-y-2">
                    <Label className="text-sm font-semibold">Quick Scenarios:</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <button
                            onClick={() => { setSkill(3); setDifficulty(8); }}
                            className="p-2 text-xs border rounded hover:bg-muted transition-colors"
                        >
                            😰 Overwhelmed Beginner
                        </button>
                        <button
                            onClick={() => { setSkill(8); setDifficulty(3); }}
                            className="p-2 text-xs border rounded hover:bg-muted transition-colors"
                        >
                            😴 Bored Expert
                        </button>
                        <button
                            onClick={() => { setSkill(7); setDifficulty(7); }}
                            className="p-2 text-xs border rounded hover:bg-muted transition-colors"
                        >
                            🎯 Perfect Flow
                        </button>
                        <button
                            onClick={() => { setSkill(5); setDifficulty(7); }}
                            className="p-2 text-xs border rounded hover:bg-muted transition-colors"
                        >
                            ⚡ Productive Stretch
                        </button>
                        <button
                            onClick={() => { setSkill(7); setDifficulty(5); }}
                            className="p-2 text-xs border rounded hover:bg-muted transition-colors"
                        >
                            💪 Building Confidence
                        </button>
                        <button
                            onClick={() => { setSkill(5); setDifficulty(5); }}
                            className="p-2 text-xs border rounded hover:bg-muted transition-colors"
                        >
                            ✅ Balanced Start
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
