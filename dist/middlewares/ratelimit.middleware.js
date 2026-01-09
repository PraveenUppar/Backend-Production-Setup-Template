"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = void 0;
const ratelimit_1 = require("@upstash/ratelimit");
const redis_js_1 = __importDefault(require("../redis/redis.js"));
const AppError_js_1 = __importDefault(require("../utils/AppError.js"));
const limiter = new ratelimit_1.Ratelimit({
    redis: redis_js_1.default,
    limiter: ratelimit_1.Ratelimit.slidingWindow(10, '60 s'),
    analytics: true,
    prefix: '@upstash/ratelimit',
});
const rateLimitMiddleware = async (req, res, next) => {
    try {
        const identifier = req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress ||
            '127.0.0.1';
        const { success, limit, remaining, reset } = await limiter.limit(identifier);
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', reset);
        if (!success) {
            return next(new AppError_js_1.default('Too many requests, please try again in a minute.', 429));
        }
        next();
    }
    catch (error) {
        console.error('Rate Limiter Error:', error);
        next();
    }
};
exports.rateLimitMiddleware = rateLimitMiddleware;
//# sourceMappingURL=ratelimit.middleware.js.map