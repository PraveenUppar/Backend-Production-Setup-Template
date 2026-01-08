'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const zod_1 = require('zod');
const validate = (schema) => async (req, res, next) => {
  try {
    // Check if req.body/query/params matches the schema rules
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // If successful, move to the Controller
    next();
  } catch (error) {
    // If validation fails, format the error nicely
    if (error instanceof zod_1.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.issues.map((err) => ({
          field: err.path[1],
          message: err.message, // e.g., "Invalid email format"
        })),
      });
    }
    next(error);
  }
};
exports.default = validate;
//# sourceMappingURL=validate.middleware.js.map
