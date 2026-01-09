"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../libs/prisma");
const redis_1 = __importDefault(require("../redis/redis"));
const router = (0, express_1.Router)();
// Without health checks:
// Docker thinks a broken app is “up”
// Kubernetes will route traffic to dead pods
// Load balancers won’t know to stop traffic
router.get('/database', async (_req, res) => {
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        const pong = await redis_1.default.ping();
        return res.status(200).json({
            status: 'Active',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            services: {
                database: 'Connected',
                redis: pong === 'PONG' ? 'Connected' : 'Failed to Connect to Redis',
            },
        });
    }
    catch (err) {
        return res.status(503).json({
            status: 'error',
            message: 'Failed to connect to the Database',
        });
    }
});
// router.get('/redis', async (_req, res) => {
//   try {
//     const pong = await redis.ping();
//     res.status(200).json({
//       status: 'Active',
//       uptime: process.uptime(),
//       timestamp: new Date().toISOString(),
//       services: {
//         redis: pong === 'PONG' ? 'Connected' : 'Failed to Connect to Redis',
//       },
//     });
//   } catch (error: any) {
//     res.status(503).json({
//       status: 'Inactive',
//       error: error.message,
//     });
//   }
// });
exports.default = router;
//# sourceMappingURL=health.check.js.map