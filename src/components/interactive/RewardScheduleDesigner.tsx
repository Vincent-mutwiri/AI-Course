import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Gift, TrendingUp, Sparkles } from 'lucide-react';

type ScheduleType = 'fixed' | 'variable';

export const RewardScheduleDesigner: React.FC = () => {
    const [attempts, setAttempts] = useState(0);
    const [rewards, setRewards] = useState(0);
    const [schedule, setSchedule] = useState<ScheduleType>('fixed');
    const [nextFixedReward, setNextFixedReward] = useState(3);
    const [recentRewards, setRecentRewards] = useState<boolean[]>([]);

    const handleAttempt = () => {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        let rewarded = false;

        if (schedule === 'fixed') {
            // Fixed Ratio: Reward every 3rd attempt
            if (newAttempts >= nextFixedReward) {
                rewarded = true;
                setRewards(rewards + 1);
                setNextFixedReward(nextFixedReward + 3);
            }
        } else {
            // Variable Ratio: 33% random chance
            const randomChance = Math.random();
            if (randomChance < 0.33) {
                rewarded = true;
                setRewards(rewards + 1);
            }
        }

        // Track recent rewards (last 10 attempts)
        setRecentRewards(prev => {
            const updated = [...prev, rewarded];
            return updated.slice(-10);
        });
    };

    const handleReset = () => {
        setAttempts(0);
        setRewards(0);
        setNextFixedReward(3);
        setRecentRewards([]);
    };

    const handleScheduleChange = (value: ScheduleType) => {
        setSchedule(value);
        handleReset();
    };

    const rewardRate = attempts > 0 ? ((rewards / attempts) * 100).toFixed(1) : '0.0';

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Gift className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl">Reward Schedule Designer</CardTitle>
                        <CardDescription>
                            Experiment with fixed vs. variable reward schedules to understand their impact on engagement
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Schedule Selection */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">Select Reward Schedule:</Label>
                    <RadioGroup value={schedule} onValueChange={handleScheduleChange}>
                        <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="fixed" id="fixed" className="mt-1" />
                            <div className="flex-1">
                                <Label htmlFor="fixed" className="font-semibold cursor-pointer">
                                    Fixed Ratio (Predictable)
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Reward every 3rd attempt. Learners know exactly when the next reward comes.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="variable" id="variable" className="mt-1" />
                            <div className="flex-1">
                                <Label htmlFor="variable" className="font-semibold cursor-pointer">
                                    Variable Ratio (Unpredictable)
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                    33% random chance per attempt. Creates anticipation and sustained engagement.
                                </p>
                            </div>
                        </div>
                    </RadioGroup>
                </div>

                {/* Action Button */}
                <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary/20 rounded-lg">
                    <Button
                        onClick={handleAttempt}
                        size="lg"
                        className="w-full max-w-xs text-lg h-14"
                    >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Make an Effort
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                        Click to simulate a learner attempt and see if they receive a reward
                    </p>
                </div>

                {/* Real-time Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-3xl font-bold text-primary">{attempts}</p>
                        <p className="text-sm text-muted-foreground mt-1">Total Attempts</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-3xl font-bold text-green-600">{rewards}</p>
                        <p className="text-sm text-muted-foreground mt-1">Rewards Earned</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-3xl font-bold text-purple-600">{rewardRate}%</p>
                        <p className="text-sm text-muted-foreground mt-1">Reward Rate</p>
                    </div>
                </div>

                {/* Next Reward Indicator (Fixed only) */}
                {schedule === 'fixed' && attempts > 0 && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                Next reward in {nextFixedReward - attempts} attempt(s)
                            </p>
                        </div>
                    </div>
                )}

                {/* Recent Rewards Visualization */}
                {recentRewards.length > 0 && (
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Last 10 Attempts:</Label>
                        <div className="flex gap-2 flex-wrap">
                            {recentRewards.map((rewarded, index) => (
                                <div
                                    key={index}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${rewarded
                                            ? 'bg-green-500 text-white'
                                            : 'bg-muted text-muted-foreground'
                                        }`}
                                    title={rewarded ? 'Reward!' : 'No reward'}
                                >
                                    {rewarded ? '🎁' : '—'}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Educational Commentary */}
                <div className="space-y-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                        🧠 Engagement Psychology:
                    </p>
                    <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
                        <p>
                            <strong>Fixed Ratio:</strong> Predictable rewards create steady motivation but can lead to
                            "post-reward pauses" where engagement drops immediately after receiving a reward.
                            Learners may only engage when they know a reward is coming.
                        </p>
                        <p>
                            <strong>Variable Ratio:</strong> Unpredictable rewards create the highest engagement and
                            resistance to extinction. This is the same principle behind slot machines and social media
                            notifications. The anticipation of "maybe this time" keeps learners engaged longer.
                        </p>
                        <p className="pt-2 border-t border-amber-200 dark:border-amber-800">
                            <strong>💡 Design Tip:</strong> Use variable ratios for sustained engagement, but ensure
                            the average reward rate feels fair. Combine with fixed milestones for predictable progress markers.
                        </p>
                    </div>
                </div>

                {/* Reset Button */}
                {attempts > 0 && (
                    <Button onClick={handleReset} variant="outline" className="w-full">
                        Reset Simulation
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};
