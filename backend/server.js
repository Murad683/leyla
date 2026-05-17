const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const { testConnection } = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

// Security Middlewares
app.use(helmet());
app.set('trust proxy', 1); // Trust Vercel proxy

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  /\.vercel\.app$/ // Allow Vercel preview deployments
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy violation'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Performance Middlewares
app.use(compression());
app.use(express.json({ limit: '10kb' })); // Limit body size for security
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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
    await testConnection();
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
      await testConnection();
      logger.info('Connected to PostgreSQL');
    } catch (error) {
      logger.error('Failed to connect to PostgreSQL on startup', error);
    }
  });
}

module.exports = app;
