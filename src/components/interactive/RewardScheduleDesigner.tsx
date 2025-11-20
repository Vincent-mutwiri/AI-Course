import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Gift, TrendingUp } from 'lucide-react';

export const RewardScheduleDesigner = () => {
    const [attempts, setAttempts] = useState(0);
    const [rewards, setRewards] = useState(0);
    const [schedule, setSchedule] = useState<'fixed' | 'variable'>('variable');
    const [nextFixedReward, setNextFixedReward] = useState(3);
    const [history, setHistory] = useState<Array<{ attempt: number; rewarded: boolean }>>([]);

    const handleAttempt = () => {
        const newAttempt = attempts + 1;
        let rewarded = false;

        if (schedule === 'fixed') {
            if (newAttempt === nextFixedReward) {
                rewarded = true;
                setRewards(r => r + 1);
                setNextFixedReward(n => n + 3);
            }
        } else {
            // Variable Ratio: 33% chance
            if (Math.random() < 0.33) {
                rewarded = true;
                setRewards(r => r + 1);
            }
        }

        setAttempts(newAttempt);
        setHistory(prev => [...prev, { attempt: newAttempt, rewarded }].slice(-10));
    };

    const reset = () => {
        setAttempts(0);
        setRewards(0);
        setNextFixedReward(3);
        setHistory([]);
    };

    const rewardRate = attempts > 0 ? ((rewards / attempts) * 100).toFixed(1) : '0';

    return (
        <Card className="p-6 space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-indigo-700 mb-2">Reward Schedule Designer</h3>
                <p className="text-gray-600">
                    Simulate the impact of fixed vs. variable ratio reward schedules on engagement.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${schedule === 'fixed'
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    onClick={() => {
                        setSchedule('fixed');
                        reset();
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-bold">Fixed Ratio</h4>
                    </div>
                    <p className="text-sm text-gray-600">Reward every 3rd attempt</p>
                    <p className="text-xs text-gray-500 mt-2">Predictable but can lead to post-reward pauses</p>
                </div>

                <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${schedule === 'variable'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    onClick={() => {
                        setSchedule('variable');
                        reset();
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-purple-600" />
                        <h4 className="font-bold">Variable Ratio</h4>
                    </div>
                    <p className="text-sm text-gray-600">33% chance per attempt</p>
                    <p className="text-xs text-gray-500 mt-2">Unpredictable - creates sustained engagement</p>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Total Attempts</p>
                        <p className="text-3xl font-bold text-gray-800">{attempts}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Rewards Earned</p>
                        <p className="text-3xl font-bold text-green-600">{rewards}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Reward Rate</p>
                        <p className="text-3xl font-bold text-blue-600">{rewardRate}%</p>
                    </div>
                </div>

                {schedule === 'fixed' && attempts < nextFixedReward && (
                    <div className="text-center p-3 bg-indigo-100 rounded-lg mb-4">
                        <p className="text-sm font-semibold text-indigo-700">
                            Next reward in {nextFixedReward - attempts} attempt(s)
                        </p>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button
                        onClick={handleAttempt}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    >
                        Make an Effort (Attempt)
                    </Button>
                    <Button
                        onClick={reset}
                        variant="outline"
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {history.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm font-semibold">Recent History:</Label>
                    <div className="flex gap-1 flex-wrap">
                        {history.map((item, idx) => (
                            <div
                                key={idx}
                                className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${item.rewarded
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}
                                title={`Attempt ${item.attempt}: ${item.rewarded ? 'Rewarded!' : 'No reward'}`}
                            >
                                {item.attempt}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                    <strong>Key Insight:</strong> Variable ratio schedules create more sustained engagement
                    because the unpredictability keeps learners motivated. This is the same principle behind
                    slot machines - but use it ethically! Always be transparent about reward mechanics.
                </p>
            </div>
        </Card>
    );
};
