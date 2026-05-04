import supertest from 'supertest';
import http from 'http';
import { startTestServer, stopTestServer } from './helpers/startTestServer';
import { getTestToken, cleanupTestData, testWalletAddress } from './helpers/testSetup';
import { pool } from '../src/config/db';

let server: http.Server;
let token: string;
let request: ReturnType<typeof supertest>;

beforeAll(async () => {
  server = await startTestServer();
  token = await getTestToken();
  request = supertest(server);
});

afterAll(async () => {
  await cleanupTestData(pool, testWalletAddress);
  await stopTestServer(server);
});

// ─────────────────────────────────────────────
describe('POST /api/v1/wallets', () => {
  it('should create a new wallet', async () => {
    const res = await request
      .post('/api/v1/wallets')
      .set('Authorization', `Bearer ${token}`)
      .send({ address: testWalletAddress });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.wallet.address).toBe(testWalletAddress);
  });

  it('should return 409 for duplicate address', async () => {
    const res = await request
      .post('/api/v1/wallets')
      .set('Authorization', `Bearer ${token}`)
      .send({ address: testWalletAddress });

    expect(res.status).toBe(409);
  });

  it('should return 400 when address is missing', async () => {
    const res = await request
      .post('/api/v1/wallets')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('should return 401 without token', async () => {
    const res = await request
      .post('/api/v1/wallets')
      .send({ address: testWalletAddress });

    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────
describe('GET /api/v1/wallets', () => {
  it('should return list of wallets', async () => {
    const res = await request
      .get('/api/v1/wallets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.wallets)).toBe(true);
  });

  it('should return 401 without token', async () => {
    const res = await request.get('/api/v1/wallets');

    expect(res.status).toBe(401);
  });
});
