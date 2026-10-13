import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import { razorpayWebhook } from "./src/controllers/paymentController.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";
import "dotenv/config";
const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean),
    credentials: true,
  }),
);

app.use(cookieParser());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// Razorpay needs the raw request body to verify the webhook signature, so this
// route is mounted before the global JSON body parser.
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook,
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "Atelier API is running" }),
);
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Reuse the same MongoDB connection promise.
const dbPromise = connectDB();

// On Vercel, wait for MongoDB before processing requests.
if (process.env.VERCEL) {
  app.use(async (req, res, next) => {
    try {
      await dbPromise;
      next();
    } catch (error) {
      next(error);
    }
  });
}

// Start the HTTP server only when running locally.
if (!process.env.VERCEL) {
  dbPromise
    .then(() => {
      app.listen(PORT, () => {
        console.log(`OFFDUTY API running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err.message);
      process.exit(1);
    });
}

// Export Express app for Vercel.
export default app;
