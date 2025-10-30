import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { profileAPI } from "@/services/api";
import profileImage from "@/assets/Vincent profile.png";
import {
  User,
  Mail,
  Linkedin,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight,
  Code,
  Lightbulb,
  Users,
  Github,
  Twitter,
} from "lucide-react";

interface Profile {
  name: string;
  location: string;
  contact: {
    phone: string;
    email: string;
    linkedin: string;
    github?: string;
    twitter?: string;
  };
  professionalProfile: string;
  keySkills: string[];
  experience?: Array<{
    title: string;
    organization: string;
    period: string;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications?: string[];
}

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        setProfile(res);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Helper function to ensure URL has protocol
  const ensureProtocol = (url: string | undefined, fallback: string): string => {
    if (!url) return fallback;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Profile Info */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Profile Image - Mobile/Tablet */}
              <div className="lg:hidden flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                    <img
                      src={profileImage}
                      alt="Vincent Mutwiri"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                </motion.div>
              </div>

              <div className="inline-block">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Instructional Designer & EdTech Professional
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                {loading ? (
                  <div className="h-16 bg-gray-200 rounded animate-pulse" />
                ) : (
                  profile?.name || "Vincent Mutwiri"
                )}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">
                  {loading ? "Loading..." : profile?.location || "Nairobi, Kenya"}
                </span>
              </div>

              <p className="text-xl text-gray-700 leading-relaxed">
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                  </div>
                ) : (
                  profile?.professionalProfile ||
                  "A results-oriented Instructional Designer and EdTech professional with a proven record of developing engaging learning experiences."
                )}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/courses">
                    Explore Courses <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <a
                    href={`mailto:${profile?.contact.email || "vincentmutwir9i@email.com"}`}
                  >
                    <Mail className="h-4 w-4" /> Get in Touch
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={ensureProtocol(profile?.contact.linkedin, "https://www.linkedin.com/in/vincentmutwiri/")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="font-medium">LinkedIn</span>
                </a>
                <a
                  href={ensureProtocol(profile?.contact.github, "https://github.com/Vincent-mutwiri")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span className="font-medium">GitHub</span>
                </a>
                <a
                  href={ensureProtocol(profile?.contact.twitter, "https://x.com/Mu_twiry")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="font-medium">X (Twitter)</span>
                </a>
              </div>
            </motion.div>

            {/* Right Column - Profile Image & Highlights */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Profile Image - Desktop */}
              <div className="hidden lg:flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                    <img
                      src={profileImage}
                      alt="Vincent Mutwiri"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                </motion.div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  What I Bring
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Innovation</h4>
                    <p className="text-sm text-gray-600">
                      Cutting-edge learning solutions
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Mentorship</h4>
                    <p className="text-sm text-gray-600">
                      Guiding learners to success
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Code className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Technical</h4>
                    <p className="text-sm text-gray-600">
                      MERN Stack & Modern Tools
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Pedagogy</h4>
                    <p className="text-sm text-gray-600">
                      Evidence-based teaching
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Expertise
            </h2>
            <p className="text-xl text-gray-600">
              A comprehensive skill set in instructional design and technology
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3"
          >
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"
                />
              ))
            ) : (
              profile?.keySkills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 rounded-full font-medium border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {skill}
                </motion.span>
              ))
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Experience & Education Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Experience</h3>
              </div>
              <div className="space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  </div>
                ) : (
                  profile?.experience?.map((exp, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                      <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                      <p className="text-blue-600 font-medium">
                        {exp.organization}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">{exp.period}</p>
                      <p className="text-gray-700 text-sm">{exp.description}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Education & Certifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Education */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Education</h3>
                </div>
                <div className="space-y-4">
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                    </div>
                  ) : (
                    profile?.education?.map((edu, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-gray-900">
                          {edu.degree}
                        </h4>
                        <p className="text-purple-600 font-medium">
                          {edu.institution}
                        </p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Certifications
                  </h3>
                </div>
                <ul className="space-y-2">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <li key={i}>
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </li>
                    ))
                  ) : (
                    profile?.certifications?.map((cert, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{cert}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join me on an interactive journey through Learning Science and
            Educational Technology
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 text-lg px-8"
            >
              <Link to="/courses">
                Explore Courses <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 text-lg px-8 bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
            >
              <Link to="/signup">Get Started Free</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}