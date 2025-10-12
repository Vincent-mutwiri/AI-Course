import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";
import enrollmentRoutes from "./routes/enrollment";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
