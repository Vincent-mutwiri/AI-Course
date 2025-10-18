import dotenv from "dotenv";

// In production, env vars come from platform (Render, Vercel, etc.)
// In development, load from .env.local
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT || 5000;
export const INFLECTION_API_URL = process.env.INFLECTION_API_URL || "https://api.inflection.ai/external/api/inference";
export const INFLECTION_API_KEY = process.env.INFLECTION_API_KEY;

if (!INFLECTION_API_KEY) {
  console.warn('WARNING: INFLECTION_API_KEY not set - AI features will be disabled');
}
