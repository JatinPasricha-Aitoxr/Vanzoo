import mysql from 'mysql2/promise';

/**
 * MySQL access for the CMS. One pool per server process, reused across hot
 * reloads in development. Configure with MYSQL_URL or MYSQL_HOST / MYSQL_PORT /
 * MYSQL_USER / MYSQL_PASSWORD / MYSQL_DATABASE.
 */
const globalForDb = globalThis as unknown as { __vzPool?: mysql.Pool };

export function dbConfigured(): boolean {
  return Boolean(process.env.MYSQL_URL || (process.env.MYSQL_USER && process.env.MYSQL_DATABASE));
}

function pool(): mysql.Pool {
  if (!globalForDb.__vzPool) {
    const common = { waitForConnections: true, connectionLimit: 8, dateStrings: true, charset: 'utf8mb4' } as const;
    globalForDb.__vzPool = process.env.MYSQL_URL
      ? mysql.createPool({ uri: process.env.MYSQL_URL, ...common })
      : mysql.createPool({
          host: process.env.MYSQL_HOST || '127.0.0.1',
          port: Number(process.env.MYSQL_PORT || 3306),
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          ...common,
        });
  }
  return globalForDb.__vzPool;
}

/** Runs a parameterised query and returns the rows. */
export async function query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [rows] = await pool().query(sql, params);
  return rows as T[];
}

/** Runs INSERT/UPDATE/DELETE and returns the result header. */
export async function exec(sql: string, params: unknown[] = []): Promise<mysql.ResultSetHeader> {
  const [res] = await pool().query(sql, params);
  return res as mysql.ResultSetHeader;
}

/** mysql2 returns JSON columns as strings or objects depending on the server; normalise. */
export function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}
