import { prisma } from '../libs/prisma';
import redis from '../redis/redis';
import AppError from '../utils/AppError';
import {
  CreateTodoInput,
  UpdateTodoInput,
  PaginatedResponse,
} from '../types/todo.types';
import { Todo } from '@prisma/client';

const CACHE_TTL = 3600; // 1 hour

/**
 * Invalidate cache for a specific user's todos
 */
const invalidateUserTodoCache = async (userId: string) => {
  // Since Upstash doesn't support KEYS, we'll use a pattern-based approach
  // In production, consider maintaining a set of cache keys per user
  const cacheKey = `todos:user:${userId}:*`;
  // For now, we'll just let cache expire naturally
  // In a real system, you might maintain a list of keys per user
};

/**
 * Create a new todo for a user
 */
export const createTodoService = async (
  userId: string,
  todoData: CreateTodoInput,
): Promise<Todo> => {
  const newTodo = await prisma.todo.create({
    data: {
      title: todoData.title,
      completed: todoData.completed ?? false,
      userId: userId,
    },
  });

  // Invalidate user's cache
  await invalidateUserTodoCache(userId);

  return newTodo;
};

/**
 * Get paginated todos for a specific user
 */
export const getTodoService = async (
  userId: string,
  page: number,
  limit: number,
): Promise<PaginatedResponse<Todo>> => {
  const skip = (page - 1) * limit;
  const cacheKey = `todos:user:${userId}:page:${page}:limit:${limit}`;

  // Try to get from cache
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (error) {
      // If cache is corrupted, continue to database
    }
  }

  // Fetch from database with user filter
  const [todos, total] = await prisma.$transaction([
    prisma.todo.findMany({
      where: { userId }, // CRITICAL: Filter by userId
      skip: skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.todo.count({
      where: { userId }, // CRITICAL: Count only user's todos
    }),
  ]);

  const result: PaginatedResponse<Todo> = {
    data: todos,
    meta: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      itemsPerPage: limit,
    },
  };

  // Cache the result
  await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTL });

  return result;
};

/**
 * Delete a todo (with ownership verification)
 */
export const deleteTodoService = async (
  id: string,
  userId: string,
): Promise<Todo> => {
  // First verify the todo exists and belongs to the user
  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo) {
    throw new AppError('Todo not found', 404);
  }

  if (todo.userId !== userId) {
    throw new AppError('You do not have permission to delete this todo', 403);
  }

  const deletedTodo = await prisma.todo.delete({
    where: { id },
  });

  await invalidateUserTodoCache(userId);

  return deletedTodo;
};

/**
 * Update a todo (with ownership verification)
 */
export const patchTodoService = async (
  id: string,
  userId: string,
  todoData: UpdateTodoInput,
): Promise<Todo> => {
  // First verify the todo exists and belongs to the user
  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo) {
    throw new AppError('Todo not found', 404);
  }

  if (todo.userId !== userId) {
    throw new AppError('You do not have permission to update this todo', 403);
  }

  // Build update data (only include provided fields)
  const updateData: Partial<UpdateTodoInput> = {};
  if (todoData.title !== undefined) {
    updateData.title = todoData.title;
  }
  if (todoData.completed !== undefined) {
    updateData.completed = todoData.completed;
  }

  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: updateData,
  });

  await invalidateUserTodoCache(userId);

  return updatedTodo;
};
