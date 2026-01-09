"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const todo_controller_1 = require("../controllers/todo.controller");
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const todo_schema_1 = require("../schemas/todo.schema");
const todoRouter = (0, express_1.Router)();
todoRouter.use(auth_middleware_1.default);
todoRouter.post('/create', (0, validate_middleware_1.default)(todo_schema_1.createTodoSchema), todo_controller_1.postTodoController);
todoRouter.get('/todo', todo_controller_1.getTodoController);
todoRouter.delete('/todo/:id', todo_controller_1.deleteTodoController);
todoRouter.patch('/todo/:id', (0, validate_middleware_1.default)(todo_schema_1.updateTodoSchema), todo_controller_1.patchTodoController);
exports.default = todoRouter;
//# sourceMappingURL=todo.route.js.map