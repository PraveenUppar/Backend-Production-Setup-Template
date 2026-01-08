import { Request, Response } from 'express';
declare const registerUserController: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
declare const loginUserController: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
export { registerUserController, loginUserController };
//# sourceMappingURL=user.controller.d.ts.map
