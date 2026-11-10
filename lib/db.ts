import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres.nojhpfnsuednlozlmlyg:krishna%40%23%242062@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

const globalForPool = globalThis as unknown as { pool: Pool };

export const pool =
  globalForPool.pool ||
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== "production") globalForPool.pool = pool;

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows;
}

