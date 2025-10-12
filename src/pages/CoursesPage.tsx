import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { courseAPI } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  totalDuration: number;
  enrolledCount: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { courses } = await courseAPI.getAll();
        setCourses(courses);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading courses...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
      
      {courses.length === 0 ? (
        <p className="text-muted-foreground">No courses available yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course._id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.instructor}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {Math.floor(course.totalDuration / 60)}h
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course.enrolledCount} enrolled
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {course.level}
                  </span>
                  <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                    {course.category}
                  </span>
                </div>
                <Button asChild className="w-full">
                  <Link to={`/course/${course._id}`}>View Course</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}