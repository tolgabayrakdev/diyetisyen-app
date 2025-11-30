import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRoutes from "./routes/auth-routes.js";
import subscriptionRoutes from "./routes/subscription-routes.js";
import clientRoutes from "./routes/client-routes.js";
import dietPlanRoutes from "./routes/diet-plan-routes.js";
import clientNoteRoutes from "./routes/client-note-routes.js";
import financialRecordRoutes from "./routes/financial-record-routes.js";
import progressLogRoutes from "./routes/progress-log-routes.js";
import activityLogRoutes from "./routes/activity-log-routes.js";
import statisticsRoutes from "./routes/statistics-routes.js";
import calculatorRoutes from "./routes/calculator-routes.js";
import foodRoutes from "./routes/food-routes.js";
import feedbackRoutes from "./routes/feedback-routes.js";
import paymentRoutes from "./routes/payment-routes.js";
import aiRoutes from "./routes/ai-routes.js";

import errorHandler from "./middleware/error-handler.js";
import { apiLimiter } from "./middleware/rate-limiter.js";
import requestTimeout from "./middleware/timeout.js";
import { validateEnvironmentVariables } from "./config/env-validation.js";
import logger from "./config/logger.js";
import pool from "./config/database.js";



// Environment variable validation
try {
    validateEnvironmentVariables();
} catch (error) {
    logger.error("Environment validation failed:", error);
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 1234;

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL 
        ? (process.env.NODE_ENV === 'production' 
            ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
            : process.env.FRONTEND_URL)
        : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());
app.use(requestTimeout);
app.use(apiLimiter);



// Health check endpoint
app.get("/health", async (req, res) => {
    try {
        // Database connection check
        await pool.query("SELECT 1");
        res.status(200).json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        logger.error("Health check failed:", error);
        res.status(503).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            error: "Database connection failed"
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api", dietPlanRoutes);
app.use("/api", clientNoteRoutes);
app.use("/api", financialRecordRoutes);
app.use("/api", progressLogRoutes);
app.use("/api", activityLogRoutes);
app.use("/api", statisticsRoutes);
app.use("/api", calculatorRoutes);
app.use("/api", foodRoutes);
app.use("/api", feedbackRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", aiRoutes);

app.use(errorHandler);

// Graceful shutdown
const server = app.listen(port, () => {
    logger.info(`🚀 Server is running on port ${port}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown handlers
const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);
    
    server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
            await pool.end();
            logger.info('Database connections closed');
            process.exit(0);
        } catch (error) {
            logger.error('Error during shutdown:', error);
            process.exit(1);
        }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});