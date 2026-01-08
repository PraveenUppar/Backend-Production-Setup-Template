"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const todo_controller_1 = require("../controllers/todo.controller");
// import validate from '../middlewares/validate.middleware';
const todoRouter = (0, express_1.Router)();
todoRouter.use(auth_middleware_1.default);
todoRouter.post('/create', todo_controller_1.postTodoController);
todoRouter.get('/todo', todo_controller_1.getTodoController);
todoRouter.delete('/todo/:id', todo_controller_1.deleteTodoController);
todoRouter.patch('/todo/:id', todo_controller_1.patchTodoController);
exports.default = todoRouter;
//# sourceMappingURL=todo.route.js.map