#!/usr/bin/env node
/**
 * Applies db/migrations/*.sql in order and seeds the first admin user.
 *   npm run db:migrate
 * Reads MYSQL_URL (mysql://user:pass@host:port/db) or MYSQL_HOST / MYSQL_PORT /
 * MYSQL_USER / MYSQL_PASSWORD / MYSQL_DATABASE. Loads .env.local if present.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

for (const f of ['.env.local', '.env']) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const conn = await mysql.createConnection(
  process.env.MYSQL_URL
    ? { uri: process.env.MYSQL_URL, multipleStatements: true }
    : {
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        multipleStatements: true,
      },
);

await conn.query(
  'CREATE TABLE IF NOT EXISTS schema_migrations (name VARCHAR(190) PRIMARY KEY, applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB',
);
const [done] = await conn.query('SELECT name FROM schema_migrations');
const applied = new Set(done.map((r) => r.name));
for (const file of readdirSync('db/migrations').filter((f) => f.endsWith('.sql')).sort()) {
  if (applied.has(file)) continue;
  console.log('applying', file);
  await conn.query(readFileSync(join('db/migrations', file), 'utf8'));
  await conn.query('INSERT INTO schema_migrations (name) VALUES (?)', [file]);
}

// First admin. In production a real ADMIN_PASSWORD is required; admin/admin is dev-only.
const [users] = await conn.query('SELECT COUNT(*) AS n FROM users');
if (users[0].n === 0) {
  const prod = process.env.NODE_ENV === 'production';
  const username = process.env.ADMIN_USERNAME || (prod ? '' : 'admin');
  const password = process.env.ADMIN_PASSWORD || (prod ? '' : 'admin');
  if (!username || !password) {
    console.error('No users yet: set ADMIN_USERNAME and ADMIN_PASSWORD, then re-run.');
  } else {
    await conn.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [
      username,
      await bcrypt.hash(password, 12),
      'admin',
    ]);
    console.log(`created admin user "${username}"`);
  }
}
await conn.end();
console.log('migrations up to date');
