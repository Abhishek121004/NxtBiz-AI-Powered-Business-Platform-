import dotenv from 'dotenv';

dotenv.config();

const requiredInProduction = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

for (const key of requiredInProduction) {
  if (process.env.NODE_ENV === 'production' && !process.env[key]) {
    throw new Error(`${key} is required in production`);
  }
}

const defaultClientOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://nxt-biz-ai-powered-business-platform.vercel.app',
  'https://nxt-biz-ai-business-platform.vercel.app'
];
const configuredClientOrigins = (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);
const clientOrigins = [...new Set([...configuredClientOrigins, ...defaultClientOrigins])];

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientOrigin: clientOrigins[0],
  clientOrigins,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nxtbiz',
  redisUrl: process.env.REDIS_URL || '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'local-nxtbiz-access-secret-change-me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'local-nxtbiz-refresh-secret-change-me',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  pdfBaseUrl: process.env.PDF_BASE_URL || 'http://localhost:5000/pdfs',
  emailFrom: process.env.EMAIL_FROM || 'operations@nxtbiz.local'
};
