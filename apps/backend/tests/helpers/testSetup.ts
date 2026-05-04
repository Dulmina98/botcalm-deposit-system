import { Pool } from 'pg';

export const testWalletAddress = 'test_wallet_0x1234567890abcdef';
export const testTxHash = 'test_tx_hash_0xabcdef1234567890';

export async function getTestToken(): Promise<string> {
  const res = await fetch('http://localhost:5002/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get test token: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { token: string };
  return data.token;
}

export async function cleanupTestData(
  pool: Pool,
  walletAddress: string
): Promise<void> {
  try {
    await pool.query('DELETE FROM transactions WHERE wallet_address = $1', [walletAddress]);
    await pool.query('DELETE FROM wallets WHERE address = $1', [walletAddress]);
  } catch {
    // ignore cleanup errors
  }
}
