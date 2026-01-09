"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserController = exports.registerUserController = void 0;
const user_service_js_1 = require("../services/user.service.js");
const jwt_js_1 = require("../utils/jwt.js");
const AppError_js_1 = __importDefault(require("../utils/AppError.js"));
const registerUserController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // zod validation
        // if (!email || !password) {
        //   return sendError(res, 400, 'Email and password are required');
        // }
        const newUser = await (0, user_service_js_1.createUserService)({ email, password });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { email: newUser.email },
        });
    }
    catch (error) {
        return next(new AppError_js_1.default('Failed to register user', 500));
    }
};
exports.registerUserController = registerUserController;
const loginUserController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //  zod validation
        // if (!email || !password) {
        //   return sendError(res, 400, 'Email and password are required');
        // }
        const user = await (0, user_service_js_1.findUserService)(email);
        if (!user) {
            return next(new AppError_js_1.default('Invalid credentials', 404));
        }
        const isPasswordValid = await (0, user_service_js_1.verifyUserService)(password, user.password);
        if (!isPasswordValid) {
            return next(new AppError_js_1.default('Invalid credentials', 404));
        }
        const token = (0, jwt_js_1.generateToken)(user.id);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: { email: user.email },
        });
    }
    catch (error) {
        return next(new AppError_js_1.default('Failed to login user', 500));
    }
};
exports.loginUserController = loginUserController;
//# sourceMappingURL=user.controller.js.map