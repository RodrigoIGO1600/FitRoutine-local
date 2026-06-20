"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const client_js_1 = require("../generated/prisma/client.js");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
}
const adapter = new adapter_better_sqlite3_1.PrismaBetterSqlite3({
    url: databaseUrl,
});
exports.prisma = new client_js_1.PrismaClient({
    adapter,
});
