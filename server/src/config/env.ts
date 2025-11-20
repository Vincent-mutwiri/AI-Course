import dotenv from "dotenv";

// In production, env vars come from platform (Render, Vercel, etc.)
// In development, load from .env.local
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

// Required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'INFLECTION_API_KEY',
  'INFLECTION_API_URL',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_REGION',
  'AWS_S3_BUCKET_NAME'
];

// Validate environment variables on startup
export function validateEnvironment(): void {
  const missingVars: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease ensure all required environment variables are set in .env.local (development) or your deployment platform (production).');
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  console.log('✅ All required environment variables are set');
}

// Export environment variables
export const MONGODB_URI = process.env.MONGODB_URI!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const PORT = process.env.PORT || 5000;
export const INFLECTION_API_URL = process.env.INFLECTION_API_URL!;
export const INFLECTION_API_KEY = process.env.INFLECTION_API_KEY!;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID!;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;
export const AWS_S3_REGION = process.env.AWS_S3_REGION!;
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
