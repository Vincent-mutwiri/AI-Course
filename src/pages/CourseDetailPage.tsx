import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseAPI } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, BarChart, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  totalDuration: number;
  enrolledCount: number;
  modules: Array<{
    _id: string;
    title: string;
    description: string;
    duration: number;
    order: number;
    lessons: Array<{
      title: string;
      description: string;
      duration: number;
    }>;
  }>;
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { course } = await courseAPI.getById(id!);
        setCourse(course);
      } catch (error) {
        console.error("Failed to fetch course", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setEnrolling(true);
      await courseAPI.enroll(id!);
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
        <p className="text-xl text-muted-foreground mb-4">{course.instructor}</p>
        
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-5 w-5" />
            {course.enrolledCount} students
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart className="h-5 w-5" />
            {course.level}
          </div>
        </div>

        <Button size="lg" onClick={handleEnroll} disabled={enrolling}>
          {enrolling ? "Enrolling..." : "Enroll Now"}
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About This Course</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{course.description}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Course Content</h2>
        <div className="space-y-2">
          {course.modules?.map((module, index) => (
            <Card 
              key={module._id}
              className="group hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/course/${id}/module/${module._id}`)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {module.lessons?.length || 0} lessons • {Math.floor(module.duration / 60)}h {module.duration % 60}m
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>What You'll Learn</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{course.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
          <CardDescription>
            {course.modules.length} modules • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.modules.map((module, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{module.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
              <ul className="space-y-2">
                {module.lessons.map((lesson, lessonIdx) => (
                  <li key={lessonIdx} className="flex justify-between text-sm">
                    <span>{lesson.title}</span>
                    <span className="text-muted-foreground">{lesson.duration}m</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
