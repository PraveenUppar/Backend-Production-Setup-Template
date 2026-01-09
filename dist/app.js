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
const health_check_js_1 = __importDefault(require("./routes/health.check.js"));
const metrics_middleware_js_1 = require("./middlewares/metrics.middleware.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(ratelimit_middleware_1.rateLimitMiddleware);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(metrics_middleware_js_1.metricsMiddleware);
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
app.use('/health', health_check_js_1.default);
app.use('/api/v1/auth', user_route_js_1.default);
app.use('/api/v1', todo_route_js_1.default);
app.all('/*splat', (req, res, next) => {
    next(new AppError_js_1.default(`Not Found`, 404));
});
app.use(error_middleware_js_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map