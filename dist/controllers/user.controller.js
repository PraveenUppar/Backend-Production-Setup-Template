"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserController = exports.registerUserController = void 0;
const user_service_js_1 = require("../services/user.service.js");
const jwt_js_1 = require("../utils/jwt.js");
const sendError = (res, statusCode, message) => {
    return res.status(statusCode).json({ success: false, message });
};
const registerUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // zod validation
        // if (!email || !password) {
        //   return sendError(res, 400, 'Email and password are required');
        // }
        const newUser = await (0, user_service_js_1.createUserService)({ email, password });
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { email: newUser.email },
        });
    }
    catch (error) {
        console.error('Registration Error:', error);
        return sendError(res, 409, 'User already exists');
    }
};
exports.registerUserController = registerUserController;
const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //  zod validation
        // if (!email || !password) {
        //   return sendError(res, 400, 'Email and password are required');
        // }
        const user = await (0, user_service_js_1.findUserService)(email);
        if (!user) {
            return sendError(res, 404, 'Invalid credentials');
        }
        const isPasswordValid = await (0, user_service_js_1.verifyUserService)(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = (0, jwt_js_1.generateToken)(user.id);
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: { email: user.email },
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.loginUserController = loginUserController;
//# sourceMappingURL=user.controller.js.map