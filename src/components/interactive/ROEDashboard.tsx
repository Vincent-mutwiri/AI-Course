import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Clock, Zap } from 'lucide-react';

interface ROEData {
    month: string;
    enrollments: number;
    completions: number;
    aiRequests: number;
    timeSpent: number;
}

const simulatedData: ROEData[] = [
    { month: 'Jan', enrollments: 120, completions: 85, aiRequests: 500, timeSpent: 1250 },
    { month: 'Feb', enrollments: 150, completions: 100, aiRequests: 620, timeSpent: 1550 },
    { month: 'Mar', enrollments: 145, completions: 110, aiRequests: 700, timeSpent: 1600 },
    { month: 'Apr', enrollments: 160, completions: 130, aiRequests: 800, timeSpent: 1800 },
    { month: 'May', enrollments: 175, completions: 145, aiRequests: 920, timeSpent: 2100 },
    { month: 'Jun', enrollments: 190, completions: 165, aiRequests: 1050, timeSpent: 2400 },
];

export const ROEDashboard = () => {
    const [data, setData] = useState<ROEData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setData(simulatedData);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </Card>
        );
    }

    const latestMonth = data[data.length - 1];
    const completionRate = ((latestMonth.completions / latestMonth.enrollments) * 100).toFixed(1);
    const avgTimePerUser = (latestMonth.timeSpent / latestMonth.enrollments).toFixed(1);
    const engagementScore = ((latestMonth.aiRequests / latestMonth.enrollments) * 10).toFixed(1);

    return (
        <Card className="p-6 space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-purple-700 mb-2">
                    Return on Engagement (ROE) Dashboard
                </h3>
                <p className="text-gray-600">
                    Gamification metrics showing increased engagement and completion rates over time.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <p className="text-sm font-semibold text-blue-900">Completion Rate</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{completionRate}%</p>
                    <p className="text-xs text-blue-700 mt-1">↑ 15% from baseline</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-semibold text-green-900">Avg Time/User</p>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{avgTimePerUser}m</p>
                    <p className="text-xs text-green-700 mt-1">↑ 25% engagement</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <p className="text-sm font-semibold text-purple-900">AI Interactions</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{latestMonth.aiRequests}</p>
                    <p className="text-xs text-purple-700 mt-1">↑ 110% growth</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                        <p className="text-sm font-semibold text-orange-900">Engagement Score</p>
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{engagementScore}</p>
                    <p className="text-xs text-orange-700 mt-1">Interactions per user</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-3">Completion Trends</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="enrollments" name="Enrollments" fill="#3b82f6" />
                            <Bar dataKey="completions" name="Completions" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Engagement Metrics</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="aiRequests"
                                name="AI Interactions"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="timeSpent"
                                name="Time Spent (min)"
                                stroke="#f59e0b"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Key Insights</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Gamification increased completion rates by 15% compared to traditional training</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Time on task increased 25%, indicating deeper engagement with content</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>AI interactions doubled, showing learners actively seeking help and feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Steady month-over-month growth demonstrates sustained engagement, not just novelty effect</span>
                    </li>
                </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                    <strong>Note:</strong> This dashboard shows simulated data for demonstration purposes.
                    In a real implementation, these metrics would be pulled from your learning management system
                    and analytics platform to show actual ROE impact.
                </p>
            </div>
        </Card>
    );
};
