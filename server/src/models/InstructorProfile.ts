import mongoose, { Document, Schema } from 'mongoose';

export interface IInstructorProfile extends Document {
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

const InstructorProfileSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    contact: {
      phone: { type: String },
      email: { type: String },
      linkedin: { type: String },
      github: { type: String },
      twitter: { type: String },
    },
    professionalProfile: { type: String },
    keySkills: [{ type: String }],
    experience: [
      {
        title: { type: String },
        organization: { type: String },
        period: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        year: { type: String },
      },
    ],
    certifications: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IInstructorProfile>(
  'InstructorProfile',
  InstructorProfileSchema
);
