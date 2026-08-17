import pg from "pg";
const { Pool } = pg;

if (!process.env.PG_HOST || !process.env.PG_PASSWORD) {
  console.error("[db] WARNING: PG_HOST / PG_PASSWORD not set in environment. Database will not connect.");
}

const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: process.env.PG_SSL === "false" ? false : { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("[db] Unexpected pool error", err.message);
});

export { pool };
export const query = (text: string, params?: unknown[]) => pool.query(text, params);
