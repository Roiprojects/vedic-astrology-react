import "dotenv/config"; // auto-loads .env (and .env.local fallback)
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { adminAuthMiddleware } from "./middleware/adminAuth";

// Auth
import authRoutes from "./routes/auth";

// Public routes
import publicServicesRoutes from "./routes/public/services";
import publicHomamsRoutes from "./routes/public/homams";
import publicAstrologersRoutes from "./routes/public/astrologers";
import publicPagesRoutes from "./routes/public/pages";
import publicTestimonialsRoutes from "./routes/public/testimonials";

// Existing public routes
import chatRoutes from "./routes/chat";
import palmReadingRoutes from "./routes/palm-reading";
import enquiryRoutes from "./routes/enquiry";
import razorpayRoutes from "./routes/razorpay";
import consultationRoutes from "./routes/consultation";
import userRoutes from "./routes/user";
import subscriptionRoutes from "./routes/subscriptions";

// Admin routes
import adminServicesRoutes from "./routes/admin/services";
import adminHomamsRoutes from "./routes/admin/homams";
import adminAstrologersRoutes from "./routes/admin/astrologers";
import adminPagesRoutes from "./routes/admin/pages";
import adminTestimonialsRoutes from "./routes/admin/testimonials";
import adminEnquiriesRoutes from "./routes/admin/enquiries";
import adminUploadRoutes from "./routes/admin/upload";
import adminSeedRoutes from "./routes/admin/seed";

const app = express();
const PORT = process.env.PORT || 3002;

const allowedOrigins = new Set([
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://localhost",
  "http://localhost",
  "capacitor://localhost",
  "ionic://localhost",
  "https://myvedicastrology.in",
  "https://www.myvedicastrology.in",
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS: origin not allowed — ${origin}`));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// Security headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  next();
});

// Serve static files from dist and uploads
app.use(express.static(path.join(__dirname, "..", "dist")));
app.use("/uploads", express.static(path.join(__dirname, "..", "public", "uploads")));

// Auth
app.use("/api/auth", authRoutes);

// Public API
app.use("/api/public/services", publicServicesRoutes);
app.use("/api/public/homams", publicHomamsRoutes);
app.use("/api/public/astrologers", publicAstrologersRoutes);
app.use("/api/public/pages", publicPagesRoutes);
app.use("/api/public/testimonials", publicTestimonialsRoutes);

// Other public routes
app.use("/api/chat", chatRoutes);
app.use("/api/palm-reading", palmReadingRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Admin routes (all protected)
app.use("/api/admin/seed", adminAuthMiddleware, adminSeedRoutes);
app.use("/api/admin/services", adminAuthMiddleware, adminServicesRoutes);
app.use("/api/admin/homams", adminAuthMiddleware, adminHomamsRoutes);
app.use("/api/admin/astrologers", adminAuthMiddleware, adminAstrologersRoutes);
app.use("/api/admin/pages", adminAuthMiddleware, adminPagesRoutes);
app.use("/api/admin/testimonials", adminAuthMiddleware, adminTestimonialsRoutes);
app.use("/api/admin/enquiries", adminAuthMiddleware, adminEnquiriesRoutes);
app.use("/api/admin/upload", adminAuthMiddleware, adminUploadRoutes);

// SPA fallback
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
