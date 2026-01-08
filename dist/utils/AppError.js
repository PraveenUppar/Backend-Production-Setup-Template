'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
class AppError extends Error {
  statusCode;
  status;
  isOperational;
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // If code is 4xx, status is 'fail'. If 5xx, status is 'error'.
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // Operational = True means "We expected this could happen"
    // Operational = False means "Code bug/Crash"
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.default = AppError;
//# sourceMappingURL=AppError.js.map
