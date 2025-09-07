import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server Configuration
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  database: {
    uri: process.env.DB || 'mongodb://localhost:27017/auth-api',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.TOKEN_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // CORS Configuration
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token', 'x-session-id'],
  },
  
  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  // Email Configuration
  email: {
    sendgridApiKey: process.env.SENDGRID_API_KEY,
  },
  
  // OAuth Configuration
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
    }
  },
  
  // AWS Configuration
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET,
  },
  
  // Admin Configuration
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
  },
  
  // Security Configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    rateLimitWindow: process.env.RATE_LIMIT_WINDOW || '15m',
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  }
};

export default config;
