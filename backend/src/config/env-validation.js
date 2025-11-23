import logger from "./logger.js";

/**
 * Production için kritik environment variable'ları kontrol eder
 */
export function validateEnvironmentVariables() {
    const requiredVars = [
        'DB_USER',
        'DB_HOST',
        'DB_DATABASE',
        'DB_PASSWORD',
        'DB_PORT',
        'JWT_SECRET_KEY',
        'FRONTEND_URL',
        'EMAIL_USER',
        'EMAIL_PASS',
        'NETGSM_NUMBER',
        'NETGSM_PASSWORD',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ];

    const missingVars = [];
    const warnings = [];

    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });

    // Production için özel kontroller
    if (process.env.NODE_ENV === 'production') {
        if (missingVars.length > 0) {
            logger.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }

        // Production güvenlik uyarıları
        if (process.env.JWT_SECRET_KEY && process.env.JWT_SECRET_KEY.length < 32) {
            warnings.push('JWT_SECRET_KEY should be at least 32 characters long for production');
        }

        if (process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes('localhost')) {
            warnings.push('FRONTEND_URL should not point to localhost in production');
        }

        if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.length < 8) {
            warnings.push('DB_PASSWORD should be at least 8 characters long');
        }
    } else {
        // Development için sadece uyarı
        if (missingVars.length > 0) {
            logger.warn(`⚠️  Missing environment variables (development mode): ${missingVars.join(', ')}`);
        }
    }

    if (warnings.length > 0) {
        warnings.forEach(warning => logger.warn(`⚠️  ${warning}`));
    }

    logger.info('✅ Environment variables validated');
}

