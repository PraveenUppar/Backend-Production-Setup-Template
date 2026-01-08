import express from 'express';
import { Response, Request, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { rateLimitMiddleware } from './middlewares/ratelimit.middleware';
import logger from './utils/logger.js';
import globalErrorHandler from './middlewares/error.middleware.js';
import AppError from './utils/AppError.js';
import userRoute from './routes/user.route.js';
import todoRoute from './routes/todo.route.js';
import { prisma } from './libs/prisma.js';
import redis from './redis/redis.js';

dotenv.config();
const app = express();

app.use(rateLimitMiddleware);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const morganFormat = ':method :url :status :response-time ms';

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(' ')[0],
          url: message.split(' ')[1],
          status: message.split(' ')[2],
          responseTime: message.split(' ')[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  }),
);

app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const pong = await redis.ping();
    res.status(200).json({
      status: 'Active',
      services: {
        database: 'Connected',
        redis: pong === 'PONG' ? 'connected' : 'unexpected response',
      },
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'Inactive',
      error: error.message,
    });
  }
});

app.use('/api/v1/auth', userRoute);
app.use('/api/v1', todoRoute);
app.all('/*splat', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Not Found`, 404));
});
app.use(globalErrorHandler);

export default app;
