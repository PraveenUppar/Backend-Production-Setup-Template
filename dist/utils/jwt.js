'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const generateToken = (userId) => {
  const payload = { id: userId };
  const secret = '09c7n0we987w0c89rcq8wnrqw8np8qw7ce8qn7wrpc8qc';
  const token = jsonwebtoken_1.default.sign(payload, secret, {
    expiresIn: '1h',
  });
  return token;
};
exports.generateToken = generateToken;
//# sourceMappingURL=jwt.js.map
