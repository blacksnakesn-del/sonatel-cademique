import dotenv from 'dotenv';
import process from 'node:process';
dotenv.config();
export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    database: {
        name: process.env.DB_NAME || '',
        user: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306
    },
    jwt: {
        secret: process.env.JWT_SECRET || '',
        accessTokenTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL_SECONDS) || 900,
        refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS) || 30,
    }
};
//# sourceMappingURL=env.js.map