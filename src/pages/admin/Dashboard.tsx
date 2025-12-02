import { useEffect, useState } from "react";
import { adminAPI, courseAPI } from "@/services/api";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, TrendingUp, Activity, Award, Zap } from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsData, coursesData] = await Promise.all([
                adminAPI.getStats(),
                courseAPI.getAll(),
            ]);
            setStats(statsData.stats);

            // Fetch analytics for first course as a sample for now
            // In a real scenario, this might be aggregated or selectable
            if (coursesData.courses.length > 0) {
                const analyticsData = await api.get(`/analytics/stats?courseId=${coursesData.courses[0]._id}`);
                setAnalytics(analyticsData.data);
            }
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.publishedCourses || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalEnrollments || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Overview */}
            {analytics && (
                <Card>
                    <CardHeader>
                        <CardTitle>Platform Activity</CardTitle>
                        <CardDescription>Recent engagement metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="flex items-center gap-3 p-4 border rounded-lg">
                                <Activity className="h-8 w-8 text-blue-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Events</p>
                                    <p className="text-2xl font-bold">
                                        {analytics.stats?.reduce((sum: number, s: any) => sum + s.count, 0) || 0}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 border rounded-lg">
                                <Award className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Certificates Earned</p>
                                    <p className="text-2xl font-bold">{analytics.certificateCompletionRate || 0}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 border rounded-lg">
                                <Zap className="h-8 w-8 text-yellow-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">AI Requests</p>
                                    <p className="text-2xl font-bold">{analytics.totalAIRequests || 0}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
