import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { enrollmentAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled</CardTitle>
                <CardDescription>Total courses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.totalEnrolled || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>In Progress</CardTitle>
                <CardDescription>Active courses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.inProgress || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completed</CardTitle>
                <CardDescription>Finished courses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.completed || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avg Progress</CardTitle>
                <CardDescription>Overall completion</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.avgProgress || 0}%</p>
              </CardContent>
            </Card>
          </div>

          {stats?.totalEnrolled === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>You haven't enrolled in any courses yet</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}