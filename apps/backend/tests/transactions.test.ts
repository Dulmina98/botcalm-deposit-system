import supertest from 'supertest';
import http from 'http';
import { startTestServer, stopTestServer } from './helpers/startTestServer';
import { getTestToken, cleanupTestData, testWalletAddress, testTxHash } from './helpers/testSetup';
import { pool } from '../src/config/db';

let server: http.Server;
let token: string;
let request: ReturnType<typeof supertest>;

beforeAll(async () => {
  server = await startTestServer();
  token = await getTestToken();

  // Pre-insert the test wallet so deposit tests have a valid wallet to reference
  await pool.query(
    'INSERT INTO wallets (address) VALUES ($1) ON CONFLICT (address) DO NOTHING',
    [testWalletAddress]
  );

  request = supertest(server);
});

afterAll(async () => {
  await cleanupTestData(pool, testWalletAddress);
  await stopTestServer(server);
});

// ─────────────────────────────────────────────
describe('POST /api/v1/deposits', () => {
  it('should create a new deposit', async () => {
    const res = await request
      .post('/api/v1/deposits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        walletAddress: testWalletAddress,
        transactionHash: testTxHash,
        amount: 1.5,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.transaction.status).toBe('pending');
    expect(res.body.transaction.wallet_address).toBe(testWalletAddress);
  });

  it('should return duplicate true for same hash', async () => {
    const res = await request
      .post('/api/v1/deposits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        walletAddress: testWalletAddress,
        transactionHash: testTxHash,
        amount: 1.5,
      });

    expect(res.status).toBe(200);
    expect(res.body.duplicate).toBe(true);
  });

  it('should return 404 for non-existent wallet', async () => {
    const res = await request
      .post('/api/v1/deposits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        walletAddress: 'non_existent_wallet',
        transactionHash: 'unique_hash_for_404_test',
        amount: 1.0,
      });

    expect(res.status).toBe(404);
  });

  it('should return 400 for negative amount', async () => {
    const res = await request
      .post('/api/v1/deposits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        walletAddress: testWalletAddress,
        transactionHash: 'unique_hash_for_negative_test',
        amount: -1,
      });

    expect(res.status).toBe(400);
  });

  it('should return 400 for missing fields', async () => {
    const res = await request
      .post('/api/v1/deposits')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('should return 401 without token', async () => {
    const res = await request
      .post('/api/v1/deposits')
      .send({
        walletAddress: testWalletAddress,
        transactionHash: testTxHash,
        amount: 1.5,
      });

    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────
describe('GET /api/v1/transactions', () => {
  it('should return paginated transactions', async () => {
    const res = await request
      .get('/api/v1/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transactions)).toBe(true);
    expect(typeof res.body.total).toBe('number');
    expect(typeof res.body.totalPages).toBe('number');
  });

  it('should filter by status', async () => {
    const res = await request
      .get('/api/v1/transactions?status=pending')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transactions)).toBe(true);

    for (const tx of res.body.transactions) {
      expect(tx.status).toBe('pending');
    }
  });

  it('should return 401 without token', async () => {
    const res = await request.get('/api/v1/transactions');

    expect(res.status).toBe(401);
  });
});
