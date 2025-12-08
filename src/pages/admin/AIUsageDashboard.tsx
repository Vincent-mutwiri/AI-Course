import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { courseAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import {
    Sparkles,
    TrendingUp,
    Database,
    DollarSign,
    Calendar,
    Filter,
    ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

interface UsageStats {
    totalGenerations: number;
    cachedGenerations: number;
    cacheHitRate: number;
    byBlockType: Record<string, number>;
    byGenerationType: Record<string, number>;
    totalTokens: number;
    byDate: Record<string, number>;
    filter: {
        courseId: string;
        startDate: string;
        endDate: string;
    };
}

interface Course {
    _id: string;
    title: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

// Estimated cost per 1000 tokens (adjust based on actual API pricing)
const COST_PER_1000_TOKENS = 0.002;

export default function AIUsageDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<UsageStats | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCourse, setSelectedCourse] = useState<string>("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        fetchStats();
    }, [selectedCourse, startDate, endDate]);

    const fetchCourses = async () => {
        try {
            const response = await courseAPI.getAll();
            setCourses(response.courses || []);
        } catch (error) {
            console.error("Failed to fetch courses", error);
            toast.error("Failed to load courses");
        }
    };

    const fetchStats = async () => {
        try {
            setLoading(true);
            const params: any = {};

            if (selectedCourse && selectedCourse !== "all") {
                params.courseId = selectedCourse;
            }

            if (startDate) {
                params.startDate = startDate;
            }

            if (endDate) {
                params.endDate = endDate;
            }

            const response = await api.get("/ai/usage-stats", { params });
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch AI usage stats", error);
            toast.error("Failed to load AI usage statistics");
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilters = () => {
        setSelectedCourse("all");
        setStartDate("");
        setEndDate("");
    };

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading AI usage statistics...</p>
                </div>
            </div>
        );
    }

    // Prepare chart data
    const blockTypeData = stats ? Object.entries(stats.byBlockType).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count: value
    })) : [];

    const generationTypeData = stats ? Object.entries(stats.byGenerationType).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count: value
    })) : [];

    const timelineData = stats ? Object.entries(stats.byDate)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            generations: count
        })) : [];

    const estimatedCost = stats ? (stats.totalTokens / 1000) * COST_PER_1000_TOKENS : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/admin")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">AI Usage Dashboard</h1>
                        <p className="text-muted-foreground">Monitor AI content generation usage and costs</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="course-filter">Course</Label>
                            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                <SelectTrigger id="course-filter">
                                    <SelectValue placeholder="All Courses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Courses</SelectItem>
                                    {courses.map((course) => (
                                        <SelectItem key={course._id} value={course._id}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end-date">End Date</Label>
                            <Input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div className="flex items-end">
                            <Button variant="outline" onClick={handleResetFilters} className="w-full">
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalGenerations || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            AI content generations
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.cacheHitRate.toFixed(1) || 0}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats?.cachedGenerations || 0} cached requests
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalTokens.toLocaleString() || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total API tokens consumed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${estimatedCost.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Based on token usage
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Generations by Block Type */}
                <Card>
                    <CardHeader>
                        <CardTitle>Generations by Block Type</CardTitle>
                        <CardDescription>Distribution of AI generations across content types</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {blockTypeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={blockTypeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                No data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Generations by Type */}
                <Card>
                    <CardHeader>
                        <CardTitle>Generation Types</CardTitle>
                        <CardDescription>Breakdown by generation, refinement, and outline</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {generationTypeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={generationTypeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry: any) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {generationTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                No data available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Usage Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Usage Over Time
                    </CardTitle>
                    <CardDescription>Daily AI generation activity</CardDescription>
                </CardHeader>
                <CardContent>
                    {timelineData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="generations"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                            No timeline data available
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Summary Stats */}
            {stats && (
                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Most Used Block Type</p>
                                <p className="text-lg font-semibold">
                                    {blockTypeData.length > 0
                                        ? blockTypeData.reduce((max, item) => item.count > max.count ? item : max).name
                                        : 'N/A'
                                    }
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Average Tokens per Generation</p>
                                <p className="text-lg font-semibold">
                                    {stats.totalGenerations > 0
                                        ? Math.round(stats.totalTokens / stats.totalGenerations).toLocaleString()
                                        : 0
                                    }
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Cache Efficiency</p>
                                <p className="text-lg font-semibold">
                                    {stats.cacheHitRate > 50 ? '🟢 Excellent' : stats.cacheHitRate > 25 ? '🟡 Good' : '🔴 Low'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
