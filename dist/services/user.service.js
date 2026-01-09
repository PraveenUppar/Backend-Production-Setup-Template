"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserService = exports.findUserService = exports.createUserService = void 0;
const prisma_js_1 = require("../libs/prisma.js");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUserService = async (userData) => {
    const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
    const newUser = await prisma_js_1.prisma.user.create({
        data: {
            email: userData.email,
            password: hashedPassword,
        },
    });
    return newUser;
};
exports.createUserService = createUserService;
const findUserService = async (email) => {
    const user = await prisma_js_1.prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    return user;
};
exports.findUserService = findUserService;
const verifyUserService = async (password, hashedPassword) => {
    const isMatch = await bcrypt_1.default.compare(password, hashedPassword);
    return isMatch;
};
exports.verifyUserService = verifyUserService;
//# sourceMappingURL=user.service.js.map