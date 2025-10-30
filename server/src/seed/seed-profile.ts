import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import InstructorProfile from '../models/InstructorProfile.js';

// Load .env.local variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });

const profileData = {
  name: 'Vincent Mutwiri',
  location: 'Nairobi, Kenya',
  contact: {
    phone: '+254715279851',
    email: 'vincentmutwir9i@email.com',
    linkedin: 'linkedin.com/in/vincentmutwiri',
  },
  professionalProfile:
    'A results-oriented Instructional Designer and EdTech professional with a proven record of developing engaging learning experiences and innovative educational solutions. Combines hands-on teaching fellowship experience with extensive certifications in Learning Sciences, Software Product Management, and Data Storytelling. Adept at applying instructional design principles and data analysis to enhance learner outcomes and drive educational innovation.',
  keySkills: [
    'Instructional Design & Pedagogy',
    'Curriculum Design & Development',
    'Learning Sciences & Engineering',
    'E-Learning & MOOC Design',
    'Learning Platforms & LMS',
    'Technical & Design Tools',
    'Figma & Prototyping Tools',
    'Power BI & Excel',
    'MERN Stack & CI/CD',
    'Agile Project Management',
    'Project Coordination',
    'Quality Assurance Testing',
    'Team Collaboration',
    'Stakeholder Communication',
    'Workshop Facilitation',
    'Problem-Solving',
    'Continuous Learning',
  ],
  experience: [
    {
      title: 'Mastercard Foundation EdTech Fellow',
      organization: 'iHub Nairobi',
      period: 'Dec 2023 - Present',
      description:
        'Contributed to the development of 3 EdTech project prototypes by applying instructional design principles to address learning challenges in the African context. Collaborated in cross-functional teams to design and present technology-driven educational solutions that received positive stakeholder feedback.',
    },
    {
      title: 'Teaching Fellow',
      organization: 'Teach For Kenya',
      period: 'Nov 2022 - Jan 2024',
      description:
        'Designed and implemented interactive learning strategies that increased classroom engagement by 25%. Simplified complex STEM concepts, resulting in a 15% improvement in student assessment performance. Received the Community Award for Leadership (2023).',
    },
    {
      title: 'Quality Assurance Intern',
      organization: 'Tamarillo Limited',
      period: 'Jan 2022 - Dec 2022',
      description:
        'Executed over 200 product quality assurance tests, identifying bugs that reduced post-release defects by 10%. Documented test results and recommended process improvements adopted to improve QA cycle efficiency.',
    },
  ],
  volunteerExperience: [
    {
      title: 'Innovation Officer',
      organization: 'EdTech Guardian Hub',
      period: 'Jan 2025 - Present',
      description:
        'Research emerging EdTech trends and prototype new educational program concepts in collaboration with community stakeholders to ensure relevance and local impact.',
    },
  ],
  projects: [
    {
      title: 'How AI Thinks: An Introductory E-Learning Course',
      role: 'Instructional Designer & Content Developer',
      url: 'https://laggbcxo.manus.space/',
      period: 'June 2025 – Sept 2025',
      description:
        'Designed an interactive course that simplifies AI concepts for beginners. Applied instructional design principles to make technical topics accessible, engaging, and self-paced.',
    },
    {
      title: 'Squid Game X: Interactive E-Learning & Engagement Platform',
      role: 'Lead Developer & Solution Architect',
      url: 'https://squid-game-x.onrender.com/',
      period: 'Aug 2025 – Present',
      description:
        'Developed a full-stack, real-time multiplayer quiz platform for educational engagement using Next.js, TypeScript, and AWS S3. Implemented live leaderboards, host roles, and a scalable multi-tenant architecture.',
    },
  ],
  education: [
    {
      degree: 'BSc Industrial Chemistry',
      institution: 'Dedan Kimathi University of Technology (DeKUT)',
      year: '2021',
    },
    {
      degree: 'Full-Stack Development Program',
      institution: 'Power Learn Project',
      year: '2025',
      description:
        'Trained in MongoDB, Express.js, React, and Node.js — building proficiency in MERN stack development.',
    },
  ],
  certifications: [
    'Software Product Management Specialization – University of Alberta (2025)',
    'DevOps Professional Certificate – PagerDuty & LinkedIn (2025)',
    'Career Essentials in Software Development – Microsoft & LinkedIn (2025)',
    'Educational Game Design – Carnegie Mellon University (2025)',
    'Design Thinking for Nonprofit Leaders – Team4Tech Foundation (2025)',
  ],
};

const seedProfile = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected...');

    // Clear existing profile (ensures only one profile)
    await InstructorProfile.deleteMany({});
    console.log('Old profile data cleared.');

    // Insert new profile
    await InstructorProfile.create(profileData);
    console.log('✅ Instructor profile seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding profile:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedProfile();
