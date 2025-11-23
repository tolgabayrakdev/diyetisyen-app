import HttpException from "../exceptions/http-exception.js";
import logger from "../config/logger.js";

export default function errorHandler(err, req, res, _next) {
    if (err instanceof HttpException) {
        logger.warn(`${req.method} ${req.url} - ${err.status} - ${err.message}`);
        return res.status(err.status).json({ message: err.message });
    }

    // Production'da detaylı hata bilgisi gösterme
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    // Log full error details
    logger.error(`${req.method} ${req.url} - 500 - Error:`, {
        message: err.message,
        stack: isDevelopment ? err.stack : undefined,
        ...(isDevelopment && { error: err })
    });

    // Production'da generic mesaj, development'da detaylı
    res.status(500).json({
        message: "Internal server error",
        ...(isDevelopment && { 
            error: err.message,
            stack: err.stack 
        })
    });
}