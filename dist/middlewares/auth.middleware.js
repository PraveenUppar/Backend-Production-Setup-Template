'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const secret = '09c7n0we987w0c89rcq8wnrqw8np8qw7ce8qn7wrpc8qc';
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map
