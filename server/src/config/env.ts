import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT || 5000;
export const INFLECTION_API_URL = process.env.INFLECTION_API_URL || "https://api.inflection.ai/external/api/inference";
export const INFLECTION_API_KEY = process.env.INFLECTION_API_KEY;

if (!INFLECTION_API_KEY) {
  console.error('ERROR: INFLECTION_API_KEY environment variable is not set');
  process.exit(1);
}
