import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  postTodoController,
  getTodoController,
  deleteTodoController,
  patchTodoController,
} from '../controllers/todo.controller';
import validate from '../middlewares/validate.middleware';
import {
  createTodoSchema,
  updateTodoSchema,
  getTodosQuerySchema,
  todoParamsSchema,
} from '../schemas/todo.schema';

const todoRouter = Router();

// All todo routes require authentication
todoRouter.use(authMiddleware);

// Create todo
todoRouter.post('/todos', validate(createTodoSchema), postTodoController);

// Get todos with pagination
todoRouter.get('/todos', validate(getTodosQuerySchema), getTodoController);

// Update todo
todoRouter.patch(
  '/todos/:id',
  validate(todoParamsSchema),
  validate(updateTodoSchema),
  patchTodoController,
);

// Delete todo
todoRouter.delete(
  '/todos/:id',
  validate(todoParamsSchema),
  deleteTodoController,
);

export default todoRouter;
