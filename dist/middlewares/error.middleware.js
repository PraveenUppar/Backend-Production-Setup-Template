"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../utils/logger"));
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // log the method, URL, status code, and the error message
    logger_1.default.error(`${req.method} ${req.originalUrl} ${err.statusCode} - ${err.message}`);
    // Handle Specific Prisma Errors (Database issues)
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint failed
        if (err.code === 'P2002') {
            const field = err.meta?.target?.[0] || 'field';
            err.code = '409';
            err.message = `The ${field} is already taken.`;
        }
        // P2025: Record not found
        if (err.code === 'P2025') {
            err.code = '404';
            err.message = 'Record not found.';
        }
    }
    // Send Response (Dev vs Prod)
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else {
        sendErrorProd(err, res);
    }
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        stack: err.stack, // Show stack trace in Dev
        error: err,
    });
};
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational || err.statusCode !== 500) {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
        });
    }
    else {
        // Programming or other unknown error
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Something went wrong!',
        });
    }
};
exports.default = globalErrorHandler;
//# sourceMappingURL=error.middleware.js.map