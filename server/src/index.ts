import { PORT, validateEnvironment } from "./config/env";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";

// Validate environment variables on startup
validateEnvironment();
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";
import enrollmentRoutes from "./routes/enrollment";
import uploadRoutes from "./routes/upload";
import aiRoutes from "./routes/ai";
import aiGeneratorRoutes from "./routes/aiGenerator";
import quizRoutes from "./routes/quiz";
import adminRoutes from "./routes/admin";
import inflectionRoutes from "./routes/inflection";
import progressRoutes from "./routes/progress";
import analyticsRoutes from "./routes/analytics";
import mediaRoutes from "./routes/media";
import profileRoutes from "./routes/profile";

const app = express();

app.use(cors({
  origin: function (origin, callback) {
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
app.use("/api/ai", aiGeneratorRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inflection-ai", inflectionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/profile", profileRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
