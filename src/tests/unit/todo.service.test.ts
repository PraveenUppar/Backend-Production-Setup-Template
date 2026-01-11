jest.mock('../../libs/prisma');
jest.mock('../../redis/redis');

import {
  createTodoService,
  getTodoService,
  deleteTodoService,
  patchTodoService,
} from '../../services/todo.service';

import { prisma } from '../../libs/prisma';
import redis from '../../redis/redis';

describe('Todo Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTodoService', () => {
    it('Creates todo and clears cache', async () => {
      const mockTodo = {
        id: '1',
        title: 'Learn Jest',
        completed: false,
        userId: 'user-1',
      };

      (prisma.todo.create as jest.Mock).mockResolvedValue(mockTodo);
      (redis.keys as jest.Mock).mockResolvedValue([]);

      const result = await createTodoService('user-1', {
        title: 'Learn Jest',
        completed: false,
      });

      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: {
          title: 'Learn Jest',
          completed: false,
          userId: 'user-1',
        },
      });

      expect(result).toEqual(mockTodo);
    });
  });

  describe('getTodoService', () => {
    it('Returns cached data when cache exists', async () => {
      const cachedResult = JSON.stringify({
        data: [{ id: '1', title: 'Cached Todo', userId: 'user-1' }],
        meta: { totalItems: 1, totalPages: 1, currentPage: 1, itemsPerPage: 5 },
      });
      (redis.get as jest.Mock).mockResolvedValue(cachedResult);

      const result = await getTodoService('user-1', 1, 5);

      expect(redis.get).toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(result.data).toBeDefined();
    });

    it('Fetches from DB and sets cache when cache is empty', async () => {
      const todos = [{ id: '1', title: 'DB Todo', userId: 'user-1' }];
      const total = 1;

      (redis.get as jest.Mock).mockResolvedValue(null);
      (prisma.$transaction as jest.Mock).mockResolvedValue([todos, total]);
      (redis.set as jest.Mock).mockResolvedValue('OK');

      const result = await getTodoService('user-1', 1, 5);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(redis.set).toHaveBeenCalled();
      expect(result.data).toEqual(todos);
      expect(result.meta.totalItems).toBe(1);
    });
  });

  describe('deleteTodoService', () => {
    it('Deletes todo when user owns it', async () => {
      const todo = { id: '1', userId: 'user-1', title: 'Test Todo' };
      const deletedTodo = { id: '1', userId: 'user-1' };

      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(todo);
      (prisma.todo.delete as jest.Mock).mockResolvedValue(deletedTodo);

      const result = await deleteTodoService('1', 'user-1');

      expect(prisma.todo.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.todo.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });

      expect(result).toEqual(deletedTodo);
    });

    it('Throws error when todo does not belong to user', async () => {
      const todo = { id: '1', userId: 'user-2', title: 'Test Todo' };

      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(todo);

      await expect(deleteTodoService('1', 'user-1')).rejects.toThrow();
    });
  });

  describe('patchTodoService', () => {
    it('Updates todo when user owns it', async () => {
      const todo = { id: '1', userId: 'user-1', title: 'Test Todo' };
      const updatedTodo = { id: '1', title: 'Updated Todo', userId: 'user-1' };

      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(todo);
      (prisma.todo.update as jest.Mock).mockResolvedValue(updatedTodo);

      const result = await patchTodoService('1', 'user-1', {
        title: 'Updated Todo',
      });

      expect(prisma.todo.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: 'Updated Todo' },
      });

      expect(result).toEqual(updatedTodo);
    });

    it('Throws error when todo does not belong to user', async () => {
      const todo = { id: '1', userId: 'user-2', title: 'Test Todo' };

      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(todo);

      await expect(
        patchTodoService('1', 'user-1', { title: 'Updated' }),
      ).rejects.toThrow();
    });
  });
});
