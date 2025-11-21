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

import errorHandler from "./middleware/error-handler.js";
import { apiLimiter } from "./middleware/rate-limiter.js";
import requestTimeout from "./middleware/timeout.js";



const app = express();
const port = process.env.PORT || 1234;

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(requestTimeout);
app.use(apiLimiter);



app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api", dietPlanRoutes);
app.use("/api", clientNoteRoutes);
app.use("/api", financialRecordRoutes);
app.use("/api", progressLogRoutes);
app.use("/api", activityLogRoutes);
app.use("/api", statisticsRoutes);



app.use(errorHandler);


app.listen(port, () => {
    console.log("🚀 Server is running on port 1234");
})