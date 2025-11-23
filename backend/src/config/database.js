import pkg from "pg";
const { Pool } = pkg;
import logger from "./logger.js";

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    idleTimeoutMillis: 10000, // 10 saniye idle timeout
    connectionTimeoutMillis: 30000, // 30 saniye connection timeout
    max: 20, // Maksimum bağlantı sayısını azalt
    min: 2, // Minimum bağlantı sayısı
    acquireTimeoutMillis: 20000, // Bağlantı alma timeout'u
    createTimeoutMillis: 10000, // Bağlantı oluşturma timeout'u
    destroyTimeoutMillis: 5000, // Bağlantı yok etme timeout'u
    reapIntervalMillis: 1000, // Boş bağlantıları temizleme aralığı
    createRetryIntervalMillis: 200, // Bağlantı oluşturma retry aralığı
});

pool.query("SELECT 1")
    .then(() => logger.info("✅ Database connected successfully"))
    .catch(err => {
        logger.error("❌ Database connection error:", err.stack);
        // Production'da database bağlantısı olmadan devam etme
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    });

// Database connection error handling
pool.on('error', (err) => {
    logger.error('Unexpected database pool error:', err);
});

export default pool;