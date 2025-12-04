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
    ExternalLink,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSiteConfig, type Area, type Partner, type Reason, type CompanyInfo } from '@/config/sites';
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
    ExternalLink,
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

export default function EdulimikaLandingPage() {
    const siteConfig = getSiteConfig();
    const companyInfo = siteConfig.content.companyInfo;

    if (!companyInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-muted-foreground">Configuration error: Company information not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <HeroSection companyInfo={companyInfo} theme={siteConfig.theme} />
            <AreasSection areas={companyInfo.areasOfWork} />
            <PartnersSection partners={companyInfo.partners} />
            <ImageGallery images={companyInfo.images} companyName={companyInfo.name} />
            <WhyWorkWithUsSection reasons={companyInfo.whyWorkWithUs} />
            <FeaturedCoursesSection courseIds={companyInfo.featuredCourses} />
            <CTASection theme={siteConfig.theme} companyName={companyInfo.name} />
        </div>
    );
}

// Hero Section Component
interface HeroSectionProps {
    companyInfo: CompanyInfo;
    theme: { primaryColor: string; secondaryColor: string; logo: string };
}

import { AuroraBackground } from '@/components/ui/aurora-background';

function HeroSection({ companyInfo, theme }: HeroSectionProps) {
    return (
        <AuroraBackground>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
            >
                <motion.h1
                    variants={fadeInUp}
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400"
                >
                    {companyInfo.name}
                </motion.h1>

                <motion.p
                    variants={fadeInUp}
                    className="text-lg sm:text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 mb-8 max-w-3xl mx-auto font-light"
                >
                    {companyInfo.description}
                </motion.p>

                <motion.div
                    variants={fadeInUp}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                        <Link to="/courses">
                            Explore Courses
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
                        <Link to="/signup">
                            Get Started
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </AuroraBackground>
    );
}

// Areas of Work Section
interface AreasSectionProps {
    areas: Area[];
}

function AreasSection({ areas }: AreasSectionProps) {
    if (!areas || areas.length === 0) {
        return null;
    }

    return (
        <section className="py-20 md:py-32 bg-white dark:bg-neutral-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400">
                            What We Do
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Our areas of expertise in educational innovation
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {areas.map((area, index) => {
                            const Icon = iconMap[area.icon] || BookOpen;
                            return (
                                <motion.div key={index} variants={fadeInUp}>
                                    <div className="group relative h-full p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                                <Icon className="h-7 w-7 text-primary" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">{area.title}</h3>
                                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                                {area.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// Partners Section
interface PartnersSectionProps {
    partners: Partner[];
}

function PartnersSection({ partners }: PartnersSectionProps) {
    if (!partners || partners.length === 0) {
        return null;
    }

    return (
        <section className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400">
                            Our Partners
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Collaborating with leading organizations to transform education
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center">
                        {partners.map((partner, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <a
                                    href={partner.website || '#'}
                                    target={partner.website ? "_blank" : undefined}
                                    rel="noopener noreferrer"
                                    className="group block p-8 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="aspect-[3/2] flex items-center justify-center p-4 grayscale group-hover:grayscale-0 transition-all duration-300">
                                        <img
                                            src={partner.logo}
                                            alt={`${partner.name} logo`}
                                            className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerHTML = `<span class="text-lg font-bold text-neutral-400 group-hover:text-primary transition-colors duration-300 text-center">${partner.name}</span>`;
                                            }}
                                        />
                                    </div>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// Image Gallery Section
interface ImageGalleryProps {
    images: string[];
    companyName: string;
}

function ImageGallery({ images, companyName }: ImageGalleryProps) {
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <section className="py-20 md:py-32 bg-white dark:bg-neutral-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400">
                            Our Impact
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            See how we're transforming education around the world
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((image, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className={`relative rounded-2xl overflow-hidden group ${index === 0 || index === 3 ? 'md:col-span-2 aspect-[2/1]' : 'aspect-square'}`}
                            >
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                                <img
                                    src={image}
                                    alt={`${companyName} impact ${index + 1}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://placehold.co/800x600/e2e8f0/64748b?text=${companyName}+Image+${index + 1}`;
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// Why Work With Us Section
interface WhyWorkWithUsSectionProps {
    reasons: Reason[];
}

function WhyWorkWithUsSection({ reasons }: WhyWorkWithUsSectionProps) {
    if (!reasons || reasons.length === 0) {
        return null;
    }

    return (
        <section className="py-20 md:py-32 bg-neutral-900 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                            Why Work With Us
                        </h2>
                        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                            What sets us apart in educational innovation
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {reasons.map((reason, index) => {
                            const Icon = iconMap[reason.icon] || Award;
                            return (
                                <motion.div key={index} variants={fadeInUp}>
                                    <div className="h-full p-8 rounded-3xl bg-neutral-800/50 border border-neutral-700 hover:bg-neutral-800 transition-all duration-300">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                                            <Icon className="h-7 w-7 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-white">{reason.title}</h3>
                                        <p className="text-neutral-400 leading-relaxed">
                                            {reason.description}
                                        </p>
                                    </div>
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
interface FeaturedCoursesSectionProps {
    courseIds: string[];
}

interface Course {
    _id: string;
    title: string;
    description: string;
    thumbnail?: string;
    level?: string;
    duration?: string;
}

function FeaturedCoursesSection({ courseIds }: FeaturedCoursesSectionProps) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!courseIds || courseIds.length === 0) {
                // Fetch all courses if no specific IDs provided
                try {
                    const response = await courseAPI.getAll();
                    const coursesArray = Array.isArray(response) ? response : [];
                    setCourses(coursesArray.slice(0, 3)); // Show first 3 courses
                    setLoading(false);
                } catch (err) {
                    console.error('Error fetching courses:', err);
                    setError('Failed to load courses');
                    setLoading(false);
                }
                return;
            }

            // Fetch specific courses by ID
            try {
                const coursePromises = courseIds.map(id =>
                    courseAPI.getById(id).catch(err => {
                        console.error(`Error fetching course ${id}:`, err);
                        return null;
                    })
                );
                const fetchedCourses = await Promise.all(coursePromises);
                setCourses(fetchedCourses.filter(Boolean));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses');
                setLoading(false);
            }
        };

        fetchCourses();
    }, [courseIds]);

    if (loading) {
        return (
            <section className="py-20 md:py-32 bg-white dark:bg-neutral-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                            Featured Courses
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                                <div className="w-full h-56 bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
                                <div className="p-6 space-y-4">
                                    <div className="h-8 bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-lg w-3/4" />
                                    <div className="h-4 bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded w-full" />
                                    <div className="h-4 bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded w-2/3" />
                                </div>
                            </div>
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
        <section className="py-20 md:py-32 bg-white dark:bg-neutral-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400">
                            Featured Courses
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Explore our most popular learning experiences
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <motion.div key={course._id} variants={fadeInUp}>
                                <Link to={`/course/${course._id}`} className="block h-full group">
                                    <div className="h-full rounded-3xl overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 flex flex-col">
                                        <div className="relative w-full h-56 overflow-hidden">
                                            {course.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => {
                                                        e.currentTarget.src = `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(course.title)}`;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors duration-300">
                                                    <BookOpen className="h-16 w-16 text-primary/40" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-neutral-900 dark:text-neutral-100 shadow-sm">
                                                {course.level || 'All Levels'}
                                            </div>
                                        </div>

                                        <div className="p-8 flex flex-col flex-grow">
                                            <h3 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                                {course.title}
                                            </h3>
                                            <p className="text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-3 flex-grow">
                                                {course.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800 mt-auto">
                                                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                                                    <span className="flex items-center">
                                                        <TrendingUp className="w-4 h-4 mr-1" />
                                                        {course.duration || 'Self-paced'}
                                                    </span>
                                                </div>
                                                <span className="text-primary font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                                                    Start Learning
                                                    <ChevronRight className="ml-1 h-4 w-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div variants={fadeInUp} className="text-center mt-16">
                        <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300">
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
interface CTASectionProps {
    theme: { primaryColor: string; secondaryColor: string; logo: string };
    companyName: string;
}

function CTASection({ theme, companyName }: CTASectionProps) {
    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90 dark:opacity-80" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="max-w-4xl mx-auto text-center text-white"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight"
                    >
                        Ready to Transform Your Learning Experience?
                    </motion.h2>

                    <motion.p
                        variants={fadeInUp}
                        className="text-xl sm:text-2xl mb-12 opacity-90 font-light max-w-2xl mx-auto"
                    >
                        Join thousands of learners who are already benefiting from our innovative educational solutions.
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                    >
                        <Button asChild size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-neutral-100 rounded-full px-10 py-8 text-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-none">
                            <Link to="/signup">
                                Get Started Today
                                <ArrowRight className="ml-2 h-6 w-6" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full px-10 py-8 text-xl transition-all duration-300">
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
