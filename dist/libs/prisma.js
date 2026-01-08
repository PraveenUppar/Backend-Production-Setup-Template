'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.prisma = void 0;
require('dotenv/config');
const adapter_pg_1 = require('@prisma/adapter-pg');
const index_js_1 = require('../generated/prisma/index.js'); // Add .js!
const connectionString = `${process.env.DIRECT_URL}`;
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
const prisma = new index_js_1.PrismaClient({ adapter });
exports.prisma = prisma;
//# sourceMappingURL=prisma.js.map
