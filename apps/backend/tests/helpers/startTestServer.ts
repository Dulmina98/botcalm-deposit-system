import bcrypt from 'bcryptjs';
import { runMigrations, pool } from '../../src/config/db';
import { httpServer } from '../../src/app';

export async function startTestServer(): Promise<typeof httpServer> {
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
    httpServer.listen(5002, () => resolve(httpServer));
  });
}

export async function stopTestServer(server: typeof httpServer): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
  await pool.end();
}

