import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { courseAPI, enrollmentAPI } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseCardSkeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, Search, Filter } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  totalDuration: number;
  enrolledCount: number;
  thumbnail?: string;
}

interface CourseWithProgress extends Course {
  progress?: number;
  isEnrolled?: boolean;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { courses } = await courseAPI.getAll();
        // Fetch enrollment data to show progress
        try {
          const { courses: enrolledCourses } = await enrollmentAPI.getMyCourses();
          const coursesWithProgress = courses.map((course: Course) => {
            const enrollment = enrolledCourses?.find((ec: any) => ec.course._id === course._id);
            return {
              ...course,
              progress: enrollment?.progress || 0,
              isEnrolled: !!enrollment
            };
          });
          setCourses(coursesWithProgress);
        } catch {
          // User not logged in or no enrollments
          setCourses(courses);
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Get unique categories and levels for filters
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(courses.map(course => course.category))];
    return uniqueCategories.filter(Boolean);
  }, [courses]);

  const levels = useMemo(() => {
    const uniqueLevels = [...new Set(courses.map(course => course.level))];
    return uniqueLevels.filter(Boolean);
  }, [courses]);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "instructor":
          return a.instructor.localeCompare(b.instructor);
        case "duration":
          return a.totalDuration - b.totalDuration;
        case "enrolled":
          return b.enrolledCount - a.enrolledCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Courses</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedCourses.length} of {courses.length} courses
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, instructors, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="enrolled">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Course Grid */}
      {filteredAndSortedCourses.length === 0 ? (
        <div className="text-center py-12">
          {courses.length === 0 ? (
            <div className="space-y-4">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No courses available yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We're working on adding amazing courses for you. Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Search className="h-16 w-16 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No courses found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCourses.map((course) => (
            <Card key={course._id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {/* Course Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient background if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary/40" />
                  </div>
                )}
                
                {/* Progress Indicator */}
                {course.isEnrolled && course.progress !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2">
                    <div className="flex items-center justify-between text-white text-xs mb-1">
                      <span>Progress</span>
                      <span>{Math.round(course.progress)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5">
                      <div 
                        className="bg-white rounded-full h-1.5 transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Enrollment Badge */}
                {course.isEnrolled && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Enrolled
                    </span>
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <span>{course.instructor}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 pt-0">
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
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                    {course.level}
                  </span>
                  <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full font-medium">
                    {course.category}
                  </span>
                </div>
                
                <Button asChild className="w-full">
                  <Link to={`/course/${course._id}`}>
                    {course.isEnrolled ? 'Continue Learning' : 'View Course'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}