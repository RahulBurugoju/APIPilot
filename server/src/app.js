import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/index.js";
import projectRouter from "./routes/project.routes.js";
import guestRouter from "./routes/guest.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// Parse CORS allowed origins from environment variable or default to localhost and Vercel domains
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman, or server-to-server)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive CORS for deployed client/server interaction
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint for Render deployment monitoring
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "APIPilot server is running cleanly",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/guest", guestRouter);
app.use("/api/v1", apiRouter);
app.use("/api/v1/projects", projectRouter);

app.use(errorHandler);

export default app;