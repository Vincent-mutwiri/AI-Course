import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, CheckCircle, MessageSquare, Clock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface ROEData {
    month: string;
    enrollments: number;
    completions: number;
    aiRequests: number;
    timeSpent: number; // in minutes
}

export const ROEDashboard: React.FC = () => {
    const [data, setData] = useState<ROEData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchROEData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get<ROEData[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/simulations/roe-data`);
                setData(response.data);
            } catch (err) {
                console.error('Failed to fetch ROE data:', err);
                setError('Failed to load engagement metrics. Please try again later.');
                toast.error('Failed to load ROE dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchROEData();
    }, []);

    // Calculate summary statistics
    const totalEnrollments = data.reduce((sum, item) => sum + item.enrollments, 0);
    const totalCompletions = data.reduce((sum, item) => sum + item.completions, 0);
    const totalAIRequests = data.reduce((sum, item) => sum + item.aiRequests, 0);
    const totalTimeSpent = data.reduce((sum, item) => sum + item.timeSpent, 0);
    const completionRate = totalEnrollments > 0 ? ((totalCompletions / totalEnrollments) * 100).toFixed(1) : '0';
    const avgTimePerLearner = totalEnrollments > 0 ? (totalTimeSpent / totalEnrollments).toFixed(0) : '0';

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">ROE Analytics Dashboard</CardTitle>
                    <CardDescription>Loading engagement metrics...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">ROE Analytics Dashboard</CardTitle>
                    <CardDescription>Return on Engagement Metrics</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl">ROE Analytics Dashboard</CardTitle>
                        <CardDescription>
                            Return on Engagement: Track learner enrollments, completions, AI interactions, and time investment
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Summary Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-semibold text-muted-foreground">Total Enrollments</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{totalEnrollments}</p>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-semibold text-muted-foreground">Completions</span>
                        </div>
                        <p className="text-3xl font-bold text-green-600">{totalCompletions}</p>
                        <p className="text-xs text-muted-foreground mt-1">{completionRate}% completion rate</p>
                    </div>

                    <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-semibold text-muted-foreground">AI Interactions</span>
                        </div>
                        <p className="text-3xl font-bold text-purple-600">{totalAIRequests}</p>
                    </div>

                    <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            <span className="text-sm font-semibold text-muted-foreground">Total Time</span>
                        </div>
                        <p className="text-3xl font-bold text-orange-600">{(totalTimeSpent / 60).toFixed(0)}h</p>
                        <p className="text-xs text-muted-foreground mt-1">{avgTimePerLearner} min/learner</p>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Monthly Engagement Trends</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="enrollments" fill="#3b82f6" name="Enrollments" />
                            <Bar dataKey="completions" fill="#22c55e" name="Completions" />
                            <Bar dataKey="aiRequests" fill="#a855f7" name="AI Interactions" />
                            <Bar dataKey="timeSpent" fill="#f97316" name="Time Spent (min)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Educational Commentary */}
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm">
                            <strong>📊 What is ROE (Return on Engagement)?</strong> ROE measures the value generated from
                            learner interactions with your gamified course. Unlike traditional ROI (Return on Investment),
                            ROE focuses on behavioral metrics: completion rates, time invested, and active participation
                            through AI interactions. High ROE indicates learners are deeply engaged and extracting maximum
                            value from the experience.
                        </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm">
                            <strong>✅ Completion Rate:</strong> The percentage of enrolled learners who finish the course.
                            In gamified learning, aim for 60%+ completion rates (vs. 5-15% for traditional MOOCs). High
                            completion rates indicate effective motivation mechanics and well-balanced difficulty progression.
                        </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                        <p className="text-sm">
                            <strong>💬 AI Interactions:</strong> Measures how often learners engage with AI-powered features
                            like the Game Master feedback system. High AI interaction counts suggest learners are actively
                            seeking personalized guidance and iterating on their designs—a key indicator of deep learning.
                        </p>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <p className="text-sm">
                            <strong>⏱️ Time Investment:</strong> Total minutes spent in the course. While more time doesn't
                            always mean better learning, consistent time investment combined with high completion rates
                            indicates learners find the content valuable enough to dedicate sustained attention. Track
                            average time per learner to identify pacing issues.
                        </p>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Key ROE Insights
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>
                                <strong>Growing Engagement:</strong> The upward trend in all metrics indicates successful
                                gamification mechanics that drive sustained learner participation.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>
                                <strong>AI-Powered Learning:</strong> High AI interaction rates show learners are actively
                                using personalized feedback to improve their gamification designs.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span>
                                <strong>Completion Success:</strong> A {completionRate}% completion rate demonstrates that
                                the course maintains engagement from start to finish through effective game mechanics.
                            </span>
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};
