jest.mock('../../libs/prisma');
jest.mock('../../redis/redis');

import { createTodoService } from '../../services/todo.service';

import { prisma } from '../../libs/prisma';
import redis from '../../redis/redis';

describe('Todo Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTodoService', () => {
    it('creates todo and clears cache', async () => {
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
});
