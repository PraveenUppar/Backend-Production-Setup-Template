'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const user_controller_js_1 = require('../controllers/user.controller.js');
const validate_middleware_js_1 = __importDefault(
  require('../middlewares/validate.middleware.js'),
);
const user_schema_js_1 = require('../schemas/user.schema.js');
const userRouter = (0, express_1.Router)();
userRouter.post(
  '/sign-up',
  (0, validate_middleware_js_1.default)(user_schema_js_1.signupSchema),
  user_controller_js_1.registerUserController,
);
userRouter.post(
  '/login',
  (0, validate_middleware_js_1.default)(user_schema_js_1.loginSchema),
  user_controller_js_1.loginUserController,
);
exports.default = userRouter;
//# sourceMappingURL=user.route.js.map
