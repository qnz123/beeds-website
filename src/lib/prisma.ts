/**
 * Singleton PrismaClient to prevent hot-reload connection leaks in Next.js dev.
 *
 * Prisma 7 requires a driver adapter (no embedded engine).
 *   - Local dev (SQLite): uses @prisma/adapter-libsql + @libsql/client with DATABASE_URL
 *     set to a file:// URL, e.g. "file:./prisma/dev.db"
 *
 * To swap to Postgres/Supabase in production:
 *   1. Change `provider = "sqlite"` → `provider = "postgresql"` in prisma/schema.prisma
 *   2. Install: npm install @prisma/adapter-pg pg @types/pg
 *   3. Swap the adapter block below to:
 *        import { PrismaPg } from '@prisma/adapter-pg'
 *        const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
 *   4. Set DATABASE_URL="postgresql://..." in your environment
 *   5. Run `npx prisma migrate deploy`
 */

import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '@/generated/prisma/client'

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set. Add it to .env (e.g. DATABASE_URL="file:./dev.db")')
  }
  // PrismaLibSql accepts the same config as @libsql/client.createClient({ url }).
  const adapter = new PrismaLibSql({ url })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
