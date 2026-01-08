import { Request, Response } from 'express';
declare const postTodoController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const getTodoController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const deleteTodoController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const patchTodoController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export { postTodoController, getTodoController, deleteTodoController, patchTodoController, };
//# sourceMappingURL=todo.controller.d.ts.map