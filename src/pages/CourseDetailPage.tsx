import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseAPI } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, BarChart, ChevronRight, PlayCircle } from "lucide-react";
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-lg">
        <div className="max-w-3xl">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">{course.category}</Badge>
          <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
          <p className="text-xl text-blue-100 mb-6">{course.description}</p>
          
          <div className="flex flex-wrap gap-6 mb-6 text-blue-100">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>{course.modules.length} modules</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              <span className="capitalize">{course.level}</span>
            </div>
          </div>

          <Button size="lg" onClick={handleEnroll} disabled={enrolling} className="bg-white text-blue-600 hover:bg-blue-50">
            {enrolling ? "Enrolling..." : "Enroll in Course"}
          </Button>
        </div>
      </div>

      {/* Course Modules */}
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Course Modules</h2>
          <p className="text-muted-foreground">
            {course.modules.length} modules • {course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} lessons
          </p>
        </div>

        <div className="grid gap-4">
          {course.modules?.map((module, index) => (
            <Card 
              key={module._id}
              className="group hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-500"
              onClick={() => navigate(`/course/${id}/module/${module._id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{module.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {module.lessons?.length || 0} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {module.duration} min
                      </span>
                    </div>

                    {module.lessons && module.lessons.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Lessons:</p>
                        <ul className="space-y-1">
                          {module.lessons.slice(0, 3).map((lesson, lessonIdx) => (
                            <li key={lessonIdx} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              {lesson.title}
                            </li>
                          ))}
                          {module.lessons.length > 3 && (
                            <li className="text-sm text-muted-foreground italic">
                              + {module.lessons.length - 3} more lessons
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Instructor Info */}
      <Card>
        <CardHeader>
          <CardTitle>Instructor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{course.instructor}</p>
        </CardContent>
      </Card>
    </div>
  );
}
