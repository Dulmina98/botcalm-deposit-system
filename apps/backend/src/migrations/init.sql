-- Users table
CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
    );

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
                                       id SERIAL PRIMARY KEY,
                                       address VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
    );

-- Transaction status enum (create only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
CREATE TYPE transaction_status AS ENUM ('pending', 'processed', 'failed');
END IF;
END$$;

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
                                            id SERIAL PRIMARY KEY,
                                            wallet_address VARCHAR(255) NOT NULL REFERENCES wallets(address),
    transaction_hash VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    status transaction_status DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_address
    ON transactions(wallet_address);

CREATE INDEX IF NOT EXISTS idx_transactions_status
    ON transactions(status);

CREATE INDEX IF NOT EXISTS idx_transactions_hash
    ON transactions(transaction_hash);

-- Default admin user
INSERT INTO users (username, password_hash)
VALUES (
           'admin',
           '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
       )
    ON CONFLICT (username) DO NOTHING;