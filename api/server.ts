/**
 * Vercel serverless entry point — wraps the Express app.
 * All /api/* requests are routed here by vercel.json.
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { adminAuthMiddleware } from "../server/middleware/adminAuth";
import authRoutes from "../server/routes/auth";
import publicServicesRoutes from "../server/routes/public/services";
import publicHomamsRoutes from "../server/routes/public/homams";
import publicAstrologersRoutes from "../server/routes/public/astrologers";
import publicPagesRoutes from "../server/routes/public/pages";
import publicTestimonialsRoutes from "../server/routes/public/testimonials";
import chatRoutes from "../server/routes/chat";
import palmReadingRoutes from "../server/routes/palm-reading";
import enquiryRoutes from "../server/routes/enquiry";
import razorpayRoutes from "../server/routes/razorpay";
import consultationRoutes from "../server/routes/consultation";
import userRoutes from "../server/routes/user";
import subscriptionRoutes from "../server/routes/subscriptions";
import adminServicesRoutes from "../server/routes/admin/services";
import adminHomamsRoutes from "../server/routes/admin/homams";
import adminAstrologersRoutes from "../server/routes/admin/astrologers";
import adminPagesRoutes from "../server/routes/admin/pages";
import adminTestimonialsRoutes from "../server/routes/admin/testimonials";
import adminEnquiriesRoutes from "../server/routes/admin/enquiries";
import adminUploadRoutes from "../server/routes/admin/upload";
import adminSeedRoutes from "../server/routes/admin/seed";

const app = express();

const allowedOrigins = new Set([
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  "http://localhost:5173",
  "https://myvedicastrology.in",
  "https://www.myvedicastrology.in",
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin) || (origin ?? "").endsWith(".vercel.app")) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS: origin not allowed — ${origin}`));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/public/services", publicServicesRoutes);
app.use("/api/public/homams", publicHomamsRoutes);
app.use("/api/public/astrologers", publicAstrologersRoutes);
app.use("/api/public/pages", publicPagesRoutes);
app.use("/api/public/testimonials", publicTestimonialsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/palm-reading", palmReadingRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/admin/seed", adminAuthMiddleware, adminSeedRoutes);
app.use("/api/admin/services", adminAuthMiddleware, adminServicesRoutes);
app.use("/api/admin/homams", adminAuthMiddleware, adminHomamsRoutes);
app.use("/api/admin/astrologers", adminAuthMiddleware, adminAstrologersRoutes);
app.use("/api/admin/pages", adminAuthMiddleware, adminPagesRoutes);
app.use("/api/admin/testimonials", adminAuthMiddleware, adminTestimonialsRoutes);
app.use("/api/admin/enquiries", adminAuthMiddleware, adminEnquiriesRoutes);
app.use("/api/admin/upload", adminAuthMiddleware, adminUploadRoutes);

export default app;
