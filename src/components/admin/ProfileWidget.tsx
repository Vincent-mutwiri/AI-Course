import React, { useState, useEffect } from 'react';
import { profileAPI } from '../../services/api';
import { User, Mail, Linkedin, MapPin, Briefcase, GraduationCap, Award, Github, Twitter } from 'lucide-react';

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

export const ProfileWidget: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        setProfile(res);
      } catch (err) {
        setError('Failed to load profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Helper function to ensure URL has protocol
  const ensureProtocol = (url: string | undefined): string | undefined => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Course Instructor</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-red-600">
          {error || 'Profile not found.'}
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Course Instructor</h3>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900">{profile.name}</h4>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" /> {profile.location}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Profile */}
      <div>
        <p className="text-gray-700 text-sm leading-relaxed">
          {profile.professionalProfile}
        </p>
      </div>

      {/* Contact */}
      <div className="space-y-2 border-t pt-4">
        <a
          href={`mailto:${profile.contact.email}`}
          className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{profile.contact.email}</span>
        </a>
        <a
          href={ensureProtocol(profile.contact.linkedin)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Linkedin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">LinkedIn</span>
        </a>
        {profile.contact.github && (
          <a
            href={ensureProtocol(profile.contact.github)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Github className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">GitHub</span>
          </a>
        )}
        {profile.contact.twitter && (
          <a
            href={ensureProtocol(profile.contact.twitter)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-gray-600 hover:text-sky-600 transition-colors"
          >
            <Twitter className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">X (Twitter)</span>
          </a>
        )}
      </div>

      {/* Key Skills */}
      {profile.keySkills && profile.keySkills.length > 0 && (
        <div className="border-t pt-4">
          <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Key Skills
          </h5>
          <div className="flex flex-wrap gap-2">
            {profile.keySkills.slice(0, 6).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
            {profile.keySkills.length > 6 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                +{profile.keySkills.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="border-t pt-4">
          <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            Experience
          </h5>
          <div className="space-y-3">
            {profile.experience.slice(0, 2).map((exp, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium text-gray-900">{exp.title}</p>
                <p className="text-gray-600">{exp.organization}</p>
                <p className="text-gray-500 text-xs">{exp.period}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <div className="border-t pt-4">
          <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <GraduationCap className="h-4 w-4 mr-2" />
            Education
          </h5>
          <div className="space-y-2">
            {profile.education.map((edu, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium text-gray-900">{edu.degree}</p>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-gray-500 text-xs">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
