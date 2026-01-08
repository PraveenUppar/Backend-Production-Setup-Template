"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchTodoController = exports.deleteTodoController = exports.getTodoController = exports.postTodoController = void 0;
const todo_service_1 = require("../services/todo.service");
const postTodoController = async (req, res) => {
    const userId = req.userId;
    try {
        const { title, completed } = req.body;
        if (!title) {
            return res
                .status(400)
                .json({ success: false, message: 'Title is required' });
        }
        const newTodo = await (0, todo_service_1.createTodoService)(userId, { title, completed });
        return res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            data: newTodo,
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to create todo' });
    }
};
exports.postTodoController = postTodoController;
const getTodoController = async (req, res) => {
    try {
        const todos = await (0, todo_service_1.getTodoService)();
        return res.status(200).json({
            success: true,
            message: 'Todos retrieved successfully',
            data: todos,
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to get todos' });
    }
};
exports.getTodoController = getTodoController;
const deleteTodoController = async (req, res) => {
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
        return res.status(500).json({ message: 'Failed to delete todos' });
    }
};
exports.deleteTodoController = deleteTodoController;
const patchTodoController = async (req, res) => {
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
        res.status(500).json({ message: 'Failed to update todo' });
    }
};
exports.patchTodoController = patchTodoController;
//# sourceMappingURL=todo.controller.js.map