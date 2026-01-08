import { prisma } from '../libs/prisma.js';

const createTodoService = async (
  userId: string,
  tododata: { title: string; completed: boolean },
) => {
  const newTodo = await prisma.todo.create({
    data: {
      title: tododata.title,
      completed: tododata.completed,
      userId: userId,
    },
  });

  return newTodo;
};

const getTodoService = async () => {
  const todos = await prisma.todo.findMany();
  return { data: todos, meta: { total: todos.length } };
};

const deleteTodoService = async (id: string) => {
  const todo = await prisma.todo.delete({ where: { id } });
  return todo;
};

const patchTodoService = async (id: string, tododata: any) => {
  const update = await prisma.todo.update({ where: { id }, data: tododata });
  return update;
};

export {
  createTodoService,
  getTodoService,
  deleteTodoService,
  patchTodoService,
};
