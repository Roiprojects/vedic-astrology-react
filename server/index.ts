/**
 * Express.js backend entry point for the Vedic Astrology application.
 *
 * Replaces Next.js API routes with a standalone Express server.
 * Serves the Vite-built SPA from `dist/` on the same port.
 */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
import { adminAuthMiddleware } from "./middleware/adminAuth";

// Routes
import chatRoutes from "./routes/chat";
import palmReadingRoutes from "./routes/palm-reading";
import enquiryRoutes from "./routes/enquiry";
import adminSeedRoutes from "./routes/admin/seed";
import adminServicesRoutes from "./routes/admin/services";
import adminHomamsRoutes from "./routes/admin/homams";
import adminPagesRoutes from "./routes/admin/pages";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// Serve static files from the Vite build output
app.use(express.static(path.join(__dirname, "..", "dist")));

// API routes (public)
app.use("/api/chat", chatRoutes);
app.use("/api/palm-reading", palmReadingRoutes);
app.use("/api/enquiry", enquiryRoutes);

// Admin API routes (protected)
app.use("/api/admin/seed", adminSeedRoutes);
app.use("/api/admin/services", adminServicesRoutes);
app.use("/api/admin/homams", adminHomamsRoutes);
app.use("/api/admin/pages", adminPagesRoutes);

// SPA fallback — serve index.html for all non-API routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
