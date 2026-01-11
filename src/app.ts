import express from 'express';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import config from './config';
import { prometheusMiddleware } from './observability/metrics';
import { rateLimitMiddleware } from './middlewares/ratelimit.middleware';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import logger from './utils/logger';
import globalErrorHandler from './middlewares/error.middleware';
import AppError from './utils/AppError';
import userRoute from './routes/user.route';
import todoRoute from './routes/todo.route';
import healthRouter from './routes/health.check';
import { metricsMiddleware } from './middlewares/metrics.middleware';

const app = express();

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Request ID middleware (must be first)
app.use(requestIdMiddleware);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  }),
);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimitMiddleware);

// Metrics collection
app.use(metricsMiddleware);
app.use(prometheusMiddleware);

// Request logging
const morganFormat = ':method :url :status :response-time ms';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const parts = message.trim().split(' ');
        const logObject = {
          method: parts[0],
          url: parts[1],
          status: parts[2],
          responseTime: parts[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  }),
);

// Health check (no auth required)
app.use('/health', healthRouter);

// API routes
app.use('/api/v1/auth', userRoute);
app.use('/api/v1', todoRoute);

// 404 handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler (must be last)
app.use(globalErrorHandler);

export default app;
