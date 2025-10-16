import { PORT } from "./config/env";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";
import enrollmentRoutes from "./routes/enrollment";
import uploadRoutes from "./routes/upload";
import aiRoutes from "./routes/ai";
import quizRoutes from "./routes/quiz";
import adminRoutes from "./routes/admin";
import inflectionRoutes from "./routes/inflection";
import progressRoutes from "./routes/progress";

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://ai-course-amber-six.vercel.app',
      'https://ai-course-l3na.onrender.com'
    ];
    
    // Allow Vercel preview deployments
    if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "AI Course API is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Note: Ad blockers may block /signup endpoints. Users should whitelist localhost:5173
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inflection-ai", inflectionRoutes);
app.use("/api/progress", progressRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
