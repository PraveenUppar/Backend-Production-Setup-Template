class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
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

export default AppError;
