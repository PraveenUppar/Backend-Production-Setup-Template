"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTodoSchema = exports.createTodoSchema = void 0;
const zod_1 = require("zod");
exports.createTodoSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({ message: 'Title is required' })
            .min(1, 'Title cannot be empty'),
        completed: zod_1.z.boolean().optional().default(false),
    }),
});
exports.updateTodoSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ message: 'Todo ID is required' }),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        completed: zod_1.z.boolean().optional(),
    }),
});
//# sourceMappingURL=todo.schema.js.map