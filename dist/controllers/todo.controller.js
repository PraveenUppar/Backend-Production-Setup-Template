"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchTodoController = exports.deleteTodoController = exports.getTodoController = exports.postTodoController = void 0;
const todo_service_1 = require("../services/todo.service");
const AppError_js_1 = __importDefault(require("../utils/AppError.js"));
const postTodoController = async (req, res, next) => {
    const userId = req.userId;
    try {
        const { title, completed } = req.body;
        // zod validation
        // if (!title) {
        //   res.status(400).json({ success: false, message: 'Title is required' });
        // }
        const newTodo = await (0, todo_service_1.createTodoService)(userId, { title, completed });
        return res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            data: newTodo,
        });
    }
    catch (error) {
        return next(new AppError_js_1.default('Failed to create todo', 500));
    }
};
exports.postTodoController = postTodoController;
const getTodoController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const todos = await (0, todo_service_1.getTodoService)(page, limit);
        return res.status(200).json({
            success: true,
            message: 'Todos retrieved successfully',
            data: todos,
        });
    }
    catch (error) {
        return next(new AppError_js_1.default('Failed to create todo', 500));
    }
};
exports.getTodoController = getTodoController;
const deleteTodoController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: 'Todo does not exist' });
        }
        await (0, todo_service_1.deleteTodoService)(id);
        return res.status(200).json({
            success: true,
            message: 'Todo deleted successfully',
        });
    }
    catch (error) {
        return next(new AppError_js_1.default('Failed to delete todos', 500));
    }
};
exports.deleteTodoController = deleteTodoController;
const patchTodoController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: 'Todo does not exist' });
        }
        const { title, completed } = req.body;
        const updateTodo = await (0, todo_service_1.patchTodoService)(id, { title, completed });
        res.status(200).json({
            success: true,
            message: 'Todo updated successfully',
            data: updateTodo,
        });
    }
    catch (error) {
        return next(new AppError_js_1.default('Failed to update todo', 500));
    }
};
exports.patchTodoController = patchTodoController;
//# sourceMappingURL=todo.controller.js.map