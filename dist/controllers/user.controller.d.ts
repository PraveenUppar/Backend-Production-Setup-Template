import { Request, Response, NextFunction } from 'express';
declare const registerUserController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const loginUserController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { registerUserController, loginUserController };
//# sourceMappingURL=user.controller.d.ts.map