"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const ratelimit_middleware_1 = require("./middlewares/ratelimit.middleware");
const logger_js_1 = __importDefault(require("./utils/logger.js"));
const error_middleware_js_1 = __importDefault(require("./middlewares/error.middleware.js"));
const AppError_js_1 = __importDefault(require("./utils/AppError.js"));
const user_route_js_1 = __importDefault(require("./routes/user.route.js"));
const todo_route_js_1 = __importDefault(require("./routes/todo.route.js"));
const prisma_js_1 = require("./libs/prisma.js");
const redis_js_1 = __importDefault(require("./redis/redis.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(ratelimit_middleware_1.rateLimitMiddleware);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const morganFormat = ':method :url :status :response-time ms';
app.use((0, morgan_1.default)(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(' ')[0],
                url: message.split(' ')[1],
                status: message.split(' ')[2],
                responseTime: message.split(' ')[3],
            };
            logger_js_1.default.info(JSON.stringify(logObject));
        },
    },
}));
app.get('/health/database', async (req, res) => {
    try {
        await prisma_js_1.prisma.$queryRaw `SELECT 1`;
        res.status(200).json({
            status: 'Active',
            services: {
                database: 'Connected',
            },
        });
    }
    catch (error) {
        res.status(503).json({
            status: 'Inactive',
            error: error.message,
        });
    }
});
app.get('/health/redis', async (req, res) => {
    try {
        const pong = await redis_js_1.default.ping();
        res.status(200).json({
            status: 'Active',
            services: {
                redis: pong === 'PONG' ? 'connected' : 'unexpected response',
            },
        });
    }
    catch (error) {
        res.status(503).json({
            status: 'Inactive',
            error: error.message,
        });
    }
});
app.use('/api/v1/auth', user_route_js_1.default);
app.use('/api/v1', todo_route_js_1.default);
app.all('/*splat', (req, res, next) => {
    next(new AppError_js_1.default(`Not Found`, 404));
});
app.use(error_middleware_js_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map