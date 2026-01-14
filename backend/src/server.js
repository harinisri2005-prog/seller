import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { startExpiryChecker } from "./services/expiryChecker.js";


dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/upload", uploadRoutes);

// Admin routes exist but NOT used by vendor panel

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Export app for Vercel
export default app;

// Only start the server if not running in a serverless environment (e.g. Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Auth server running on port ${PORT}`);
    console.log(`CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);

    // Start expiry checker service
    startExpiryChecker();
  });
}
