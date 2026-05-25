const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
require('dotenv').config({ path: '../.env' }); // Adjust for monorepo

const prisma = require('./config/prisma');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow serving images
app.set('trust proxy', 1);

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://digitaleyla.az',
  'https://www.digitaleyla.az',
  'http://localhost:3000',
  /\.vercel\.app$/
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
      return callback(null, true);
    }
    // Return a 403 Forbidden instead of throwing an Error that becomes a 500
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    const error = new Error(msg);
    error.status = 403; // This will be caught by errorHandler and returned as 403 instead of 500
    return callback(error, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Performance Middlewares
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static Files (Uploads)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

if (!isProduction) {
  app.use(morgan('dev'));
}

// Routes
app.use('/api', routes);

// API Documentation (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'ok', 
      environment: process.env.NODE_ENV,
      db: 'connected' 
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      db: 'disconnected' 
    });
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Conditional Start for Local Development
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  app.listen(PORT, async () => {
    logger.info(`Backend server starting at port ${PORT}`);
    try {
      await prisma.$connect();
      logger.info('Connected to PostgreSQL via Prisma');
    } catch (error) {
      logger.error('Failed to connect to PostgreSQL on startup', error);
    }
  });
}

module.exports = app;
