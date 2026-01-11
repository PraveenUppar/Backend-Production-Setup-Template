import winston from 'winston';
import config from '../config';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

// Development format (human-readable)
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message} ${
        info.stack ? `\n${info.stack}` : ''
      }`,
  ),
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: config.isDevelopment ? devFormat : logFormat,
  }),
];

// Only add file transports in non-containerized environments
// In Docker/Kubernetes, logs should go to stdout/stderr
if (!process.env.DOCKER_ENV && !config.isTest) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: logFormat,
    }),
    new winston.transports.File({
      filename: 'logs/all.log',
      format: logFormat,
    }),
  );
}

const logger = winston.createLogger({
  level: config.isDevelopment ? 'debug' : 'info',
  levels,
  format: config.isDevelopment ? devFormat : logFormat,
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
});

export default logger;
