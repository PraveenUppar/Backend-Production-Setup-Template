"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsMiddleware = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const metricsMiddleware = (req, res, next) => {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
        logger_1.default.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs.toFixed(2)}ms`);
    });
    next();
};
exports.metricsMiddleware = metricsMiddleware;
//# sourceMappingURL=metrics.middleware.js.map