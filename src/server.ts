import app from './app.js';
import { startTracing, stopTracing } from './observability/tracing';
import { prisma } from './libs/prisma';
import redis from './redis/redis';
import config from './config';
import logger from './utils/logger';

const PORT = config.port;

let server: ReturnType<typeof app.listen>;

const startServer = async () => {
  try {
    // Initialize OpenTelemetry tracing
    await startTracing();

    // Start server
    server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${config.env} mode`);
    });

    // Graceful shutdown handler
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      // Stop accepting new requests
      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          // Close database connections
          await prisma.$disconnect();
          logger.info('Database connection closed');

          // Close Redis connection if it has a quit method
          if (redis.quit) {
            await redis.quit();
            logger.info('Redis connection closed');
          }

          // Stop tracing
          await stopTracing();
          logger.info('Tracing stopped');

          logger.info('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
