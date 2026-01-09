"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// libs/prisma.ts
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
let prisma;
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}
// Use connection pooling with pg
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.prisma = prisma = new client_1.PrismaClient({
    adapter,
    log: ['error', 'warn'],
});
// Handle graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=prisma.js.map