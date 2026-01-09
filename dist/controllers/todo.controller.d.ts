import { Request, Response, NextFunction } from 'express';
declare const postTodoController: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const getTodoController: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const deleteTodoController: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const patchTodoController: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export { postTodoController, getTodoController, deleteTodoController, patchTodoController, };
//# sourceMappingURL=todo.controller.d.ts.map