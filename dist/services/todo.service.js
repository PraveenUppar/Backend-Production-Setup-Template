"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchTodoService = exports.deleteTodoService = exports.getTodoService = exports.createTodoService = void 0;
const prisma_js_1 = require("../libs/prisma.js");
const redis_js_1 = __importDefault(require("../redis/redis.js"));
const invalidateTodoCache = async () => {
    const keys = await redis_js_1.default.keys('todos:*');
    if (keys.length > 0) {
        await redis_js_1.default.del(...keys);
    }
};
const createTodoService = async (userId, tododata) => {
    const newTodo = await prisma_js_1.prisma.todo.create({
        data: {
            title: tododata.title,
            completed: tododata.completed,
            userId: userId,
        },
    });
    await invalidateTodoCache();
    return newTodo;
};
exports.createTodoService = createTodoService;
const getTodoService = async (page, limit) => {
    const skip = (page - 1) * limit;
    const cacheKey = `todos:page:${page}:limit:${limit}`;
    const cachedData = await redis_js_1.default.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }
    // const todos = await prisma.todo.findMany();
    // return { data: todos, meta: { total: todos.length } };
    const [todos, total] = await prisma_js_1.prisma.$transaction([
        prisma_js_1.prisma.todo.findMany({
            skip: skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma_js_1.prisma.todo.count(),
    ]);
    const result = {
        data: todos,
        meta: {
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            itemsPerPage: limit,
        },
    };
    await redis_js_1.default.set(cacheKey, result, { ex: 3600 });
    return result;
};
exports.getTodoService = getTodoService;
const deleteTodoService = async (id) => {
    const todo = await prisma_js_1.prisma.todo.delete({ where: { id } });
    await invalidateTodoCache();
    return todo;
};
exports.deleteTodoService = deleteTodoService;
const patchTodoService = async (id, tododata) => {
    const update = await prisma_js_1.prisma.todo.update({ where: { id }, data: tododata });
    await invalidateTodoCache();
    return update;
};
exports.patchTodoService = patchTodoService;
//# sourceMappingURL=todo.service.js.map