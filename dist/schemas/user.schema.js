'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require('zod');
exports.signupSchema = zod_1.z.object({
  body: zod_1.z.object({
    email: zod_1.z.email({ message: 'Email is required' }),
    password: zod_1.z
      .string({ message: 'Password is required' })
      .min(4, { message: 'Password must be at least 4 characters long' }),
  }),
});
exports.loginSchema = zod_1.z.object({
  body: zod_1.z.object({
    email: zod_1.z.email({ message: 'Email is required' }),
    password: zod_1.z.string({ message: 'Password is required' }),
  }),
});
//# sourceMappingURL=user.schema.js.map
