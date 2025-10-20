import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { enrollmentAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatsCardSkeleton } from "@/components/ui/skeleton";
import { BookOpen, TrendingUp, Award, Clock } from "lucide-react";

interface Stats {
  totalEnrolled: number;
  completed: number;
  inProgress: number;
  avgProgress: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { stats } = await enrollmentAPI.getStats();
        setStats(stats);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>
      
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalEnrolled || 0}</div>
                <p className="text-xs text-muted-foreground">Total courses</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.inProgress || 0}</div>
                <p className="text-xs text-muted-foreground">Active courses</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.completed || 0}</div>
                <p className="text-xs text-muted-foreground">Finished courses</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.avgProgress || 0}%</div>
                <p className="text-xs text-muted-foreground">Overall completion</p>
              </CardContent>
            </Card>
          </div>

          {stats?.totalEnrolled === 0 && (
            <Card className="text-center py-12">
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <BookOpen className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div className="space-y-2">
                    <CardTitle className="text-xl">Welcome to your learning journey!</CardTitle>
                    <CardDescription className="max-w-md mx-auto">
                      You haven't enrolled in any courses yet. Discover amazing courses and start learning today.
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link to="/ai-assistant">Get AI Recommendations</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}