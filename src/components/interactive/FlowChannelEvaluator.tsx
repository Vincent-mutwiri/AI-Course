import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, Smile, Frown, Meh } from 'lucide-react';

export const FlowChannelEvaluator = () => {
    const [skill, setSkill] = useState(5);
    const [difficulty, setDifficulty] = useState(7);

    const getFlowState = (s: number, d: number): {
        state: string;
        color: string;
        bgColor: string;
        borderColor: string;
        icon: any;
        advice: string;
    } => {
        const delta = d - s;

        if (delta > 2) {
            return {
                state: 'Anxiety Zone',
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-300',
                icon: Frown,
                advice: 'Challenge is too high! Reduce difficulty or provide more scaffolding and support.'
            };
        }

        if (delta < -2) {
            return {
                state: 'Boredom Zone',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-300',
                icon: Meh,
                advice: 'Too easy! Increase challenge or offer advanced content to maintain engagement.'
            };
        }

        if (Math.abs(delta) <= 1) {
            return {
                state: 'Flow Channel (Optimal!)',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-300',
                icon: Smile,
                advice: 'Perfect balance! Learners are challenged but not overwhelmed. This is the sweet spot for engagement and learning.'
            };
        }

        return {
            state: delta > 0 ? 'Arousal Zone' : 'Control Zone',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-300',
            icon: AlertCircle,
            advice: delta > 0
                ? 'Slightly challenging - good for growth, but monitor for frustration.'
                : 'Comfortable but engaged - good for building confidence.'
        };
    };

    const { state, color, bgColor, borderColor, icon: Icon, advice } = getFlowState(skill, difficulty);

    return (
        <Card className="p-6 space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-indigo-700 mb-2">Flow Channel Evaluator</h3>
                <p className="text-gray-600">
                    Find the balance between learner skill and content difficulty to achieve optimal flow state.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm font-semibold">Learner Skill Level</Label>
                        <span className="text-2xl font-bold text-indigo-600">{skill}</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={skill}
                        onChange={(e) => setSkill(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Novice</span>
                        <span>Expert</span>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm font-semibold">Content Difficulty</Label>
                        <span className="text-2xl font-bold text-purple-600">{difficulty}</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={difficulty}
                        onChange={(e) => setDifficulty(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Very Easy</span>
                        <span>Very Hard</span>
                    </div>
                </div>
            </div>

            <div className={`p-6 border-2 rounded-lg ${borderColor} ${bgColor}`}>
                <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-10 h-10 ${color}`} />
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Current Learning State:</p>
                        <p className={`text-2xl font-bold ${color}`}>{state}</p>
                    </div>
                </div>

                <p className="text-gray-700">{advice}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-sm">Flow Theory (Csikszentmihalyi)</h4>
                    <p className="text-xs text-gray-600">
                        Optimal engagement occurs when challenge slightly exceeds skill. Too easy = boredom.
                        Too hard = anxiety. Just right = flow.
                    </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-sm">Dynamic Balance</h4>
                    <p className="text-xs text-gray-600">
                        As learners' skills increase, you must increase challenge to maintain flow.
                        This is why games have progressive levels.
                    </p>
                </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                    <strong>Design Tip:</strong> Aim for difficulty that's about 10% above current skill level.
                    This creates the "stretch zone" where optimal learning happens.
                </p>
            </div>
        </Card>
    );
};
