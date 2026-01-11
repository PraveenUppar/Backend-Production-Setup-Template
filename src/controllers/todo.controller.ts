import { Request, Response, NextFunction } from 'express';
import {
  createTodoService,
  getTodoService,
  deleteTodoService,
  patchTodoService,
} from '../services/todo.service';
import AppError from '../utils/AppError';

/**
 * Create a new todo
 */
export const postTodoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { title, completed } = req.body;

    const newTodo = await createTodoService(userId, {
      title,
      completed,
    });

    return res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Failed to create todo', 500));
  }
};

/**
 * Get paginated todos for the authenticated user
 */
export const getTodoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const todos = await getTodoService(userId, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Todos retrieved successfully',
      data: todos,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Failed to retrieve todos', 500));
  }
};

/**
 * Delete a todo
 */
export const deleteTodoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!id) {
      return next(new AppError('Todo ID is required', 400));
    }

    await deleteTodoService(id, userId);

    return res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Failed to delete todo', 500));
  }
};

/**
 * Update a todo
 */
export const patchTodoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, completed } = req.body;

    if (!id) {
      return next(new AppError('Todo ID is required', 400));
    }

    const updateTodo = await patchTodoService(id, userId, {
      title,
      completed,
    });

    return res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updateTodo,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Failed to update todo', 500));
  }
};
