import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
declare const validate: (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default validate;
//# sourceMappingURL=validate.middleware.d.ts.map