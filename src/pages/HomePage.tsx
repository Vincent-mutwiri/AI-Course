import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    Code,
    BarChart,
    Users,
    Award,
    Lightbulb,
    TrendingUp,
    ArrowRight,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { courseAPI } from '@/services/api';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, any> = {
    BookOpen,
    Code,
    BarChart,
    Users,
    Award,
    Lightbulb,
    TrendingUp,
    ArrowRight,
    ChevronRight
};

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function HomePage() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <AreasSection />
            <FeaturedCoursesSection />
            <CTASection />
        </div>
    );
}

// Hero Section Component
function HeroSection() {
    return (
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="max-w-4xl mx-auto text-center"
                >
                    <motion.h1
                        variants={fadeInUp}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    >
                        Edulimika
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
                    >
                        Transforming education through innovative learning solutions and technology
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Button asChild size="lg" className="w-full sm:w-auto">
                            <Link to="/courses">
                                Explore Courses
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                            <Link to="/signup">
                                Get Started
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
            </div>
        </section>
    );
}

// Areas of Work Section
function AreasSection() {
    const areas = [
        { icon: 'Lightbulb', title: 'Instructional Design', description: 'Creating engaging and effective learning experiences' },
        { icon: 'Code', title: 'EdTech Development', description: 'Building innovative educational technology solutions' },
        { icon: 'Users', title: 'Training & Workshops', description: 'Empowering educators with modern teaching methods' },
        { icon: 'Award', title: 'Curriculum Development', description: 'Designing comprehensive learning pathways' }
    ];

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                            What We Do
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our areas of expertise in educational innovation
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {areas.map((area, index) => {
                            const Icon = iconMap[area.icon] || BookOpen;
                            return (
                                <motion.div key={index} variants={fadeInUp}>
                                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                        <CardHeader>
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                                <Icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <CardTitle className="text-xl">{area.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base">
                                                {area.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}



// Featured Courses Section
interface Course {
    _id: string;
    title: string;
    description: string;
    thumbnail?: string;
    level?: string;
    duration?: string;
}

function FeaturedCoursesSection() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseAPI.getAll();
                const coursesArray = Array.isArray(response) ? response : [];
                setCourses(coursesArray.slice(0, 3));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses');
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                            Featured Courses
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="h-full">
                                <div className="w-full h-48 bg-muted animate-pulse" />
                                <CardHeader>
                                    <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                                    <div className="h-4 bg-muted animate-pulse rounded" />
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error || courses.length === 0) {
        return null;
    }

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                            Featured Courses
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Explore our most popular learning experiences
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <motion.div key={course._id} variants={fadeInUp}>
                                <Link to={`/course/${course._id}`}>
                                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                        <div className="w-full h-48 bg-muted overflow-hidden">
                                            {course.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(course.title)}`;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                                                    <BookOpen className="h-16 w-16 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-xl line-clamp-2">{course.title}</CardTitle>
                                            <CardDescription className="line-clamp-3">
                                                {course.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                {course.level && <span className="capitalize">{course.level}</span>}
                                                {course.duration && <span>{course.duration}</span>}
                                            </div>
                                            <Button variant="ghost" className="w-full mt-4 group">
                                                Learn More
                                                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div variants={fadeInUp} className="text-center mt-12">
                        <Button asChild size="lg" variant="outline">
                            <Link to="/courses">
                                View All Courses
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

// CTA Section
function CTASection() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="max-w-4xl mx-auto text-center"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
                    >
                        Ready to Transform Your Learning Experience?
                    </motion.h2>

                    <motion.p
                        variants={fadeInUp}
                        className="text-lg sm:text-xl mb-8 opacity-90"
                    >
                        Join thousands of learners who are already benefiting from our innovative educational solutions.
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                            <Link to="/signup">
                                Get Started Today
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                            <Link to="/courses">
                                Browse Courses
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
