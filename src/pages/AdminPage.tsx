import { useEffect, useState } from "react";
import { adminAPI, courseAPI } from "@/services/api";
import api from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, BookOpen, GraduationCap, TrendingUp, Activity, Award, Zap } from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
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
      setCourses(coursesData.courses);
      
      // Fetch analytics for first course
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

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await adminAPI.createCourse({
        title: formData.get("title"),
        description: formData.get("description"),
        instructor: formData.get("instructor"),
        category: formData.get("category"),
        level: formData.get("level"),
        isPublished: true,
        modules: [],
      });
      setShowCourseForm(false);
      fetchData();
    } catch (error) {
      console.error("Failed to create course", error);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await adminAPI.createQuiz({
        courseId: formData.get("courseId"),
        lessonId: formData.get("lessonId"),
        title: formData.get("title"),
        passingScore: Number(formData.get("passingScore")),
        questions: [
          {
            question: formData.get("question1"),
            options: [
              { text: formData.get("option1_1"), isCorrect: true },
              { text: formData.get("option1_2"), isCorrect: false },
              { text: formData.get("option1_3"), isCorrect: false },
              { text: formData.get("option1_4"), isCorrect: false },
            ],
            explanation: formData.get("explanation1"),
          },
        ],
      });
      setShowQuizForm(false);
      alert("Quiz created successfully!");
    } catch (error) {
      console.error("Failed to create quiz", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Course Analytics</CardTitle>
            <CardDescription>Track user engagement and AI usage</CardDescription>
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
            
            {analytics.stats && analytics.stats.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Event Breakdown</h3>
                <div className="space-y-2">
                  {analytics.stats.map((stat: any) => (
                    <div key={stat._id} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm capitalize">{stat._id.replace('_', ' ')}</span>
                      <span className="font-semibold">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>Create and manage courses</CardDescription>
          </CardHeader>
          <CardContent>
            {!showCourseForm ? (
              <Button onClick={() => setShowCourseForm(true)}>Create New Course</Button>
            ) : (
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" required />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input id="instructor" name="instructor" required />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" required />
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <select id="level" name="level" className="w-full border rounded p-2" required>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Create</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCourseForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 space-y-2">
              <h3 className="font-semibold">Existing Courses ({courses.length})</h3>
              {courses.slice(0, 5).map((course) => (
                <div key={course._id} className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">{course.title}</span>
                  <span className="text-xs text-muted-foreground">{course.level}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Management</CardTitle>
            <CardDescription>Create and manage quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            {!showQuizForm ? (
              <Button onClick={() => setShowQuizForm(true)}>Create New Quiz</Button>
            ) : (
              <form onSubmit={handleCreateQuiz} className="space-y-4">
                <div>
                  <Label htmlFor="courseId">Course ID</Label>
                  <select id="courseId" name="courseId" className="w-full border rounded p-2" required>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="lessonId">Lesson ID</Label>
                  <Input id="lessonId" name="lessonId" required />
                </div>
                <div>
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input id="passingScore" name="passingScore" type="number" defaultValue="70" required />
                </div>
                <div>
                  <Label>Question 1</Label>
                  <Input name="question1" placeholder="Question text" required className="mb-2" />
                  <Input name="option1_1" placeholder="Correct answer" required className="mb-1" />
                  <Input name="option1_2" placeholder="Wrong answer" required className="mb-1" />
                  <Input name="option1_3" placeholder="Wrong answer" required className="mb-1" />
                  <Input name="option1_4" placeholder="Wrong answer" required className="mb-1" />
                  <Input name="explanation1" placeholder="Explanation (optional)" />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Create</Button>
                  <Button type="button" variant="outline" onClick={() => setShowQuizForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
