"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchTodoService = exports.deleteTodoService = exports.getTodoService = exports.createTodoService = void 0;
const prisma_js_1 = require("../libs/prisma.js");
const createTodoService = async (userId, tododata) => {
    const newTodo = await prisma_js_1.prisma.todo.create({
        data: {
            title: tododata.title,
            completed: tododata.completed,
            userId: userId,
        },
    });
    return newTodo;
};
exports.createTodoService = createTodoService;
const getTodoService = async () => {
    const todos = await prisma_js_1.prisma.todo.findMany();
    return todos;
};
exports.getTodoService = getTodoService;
const deleteTodoService = async (id) => {
    const todo = await prisma_js_1.prisma.todo.delete({ where: { id } });
    return todo;
};
exports.deleteTodoService = deleteTodoService;
const patchTodoService = async (id, tododata) => {
    const update = await prisma_js_1.prisma.todo.update({
        where: { id: id },
        data: tododata,
    });
    return update;
};
exports.patchTodoService = patchTodoService;
//# sourceMappingURL=todo.service.js.map