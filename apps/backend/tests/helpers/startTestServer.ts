import http from 'http';
import bcrypt from 'bcryptjs';
import { runMigrations, pool } from '../../src/config/db';
import { app } from '../../src/app';
import depositQueue from '../../src/workers/depositWorker';

export async function startTestServer(): Promise<http.Server> {
  // Clear stale jobs left over from previous test runs
  await depositQueue.clean(0, 'failed');
  await depositQueue.clean(0, 'wait');
  await depositQueue.clean(0, 'active');
  await depositQueue.clean(0, 'delayed');

  // Run DB migrations against the test database
  await runMigrations();

  // Seed the admin user if it doesn't already exist
  const hash = await bcrypt.hash('admin123', 10);
  await pool.query(
    `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO NOTHING`,
    ['admin', hash]
  );

  // Start the HTTP server on the test port
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(5002, () => resolve(server));
  });
}

export async function stopTestServer(server: http.Server): Promise<void> {
  await depositQueue.close();
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
  await pool.end();
}
