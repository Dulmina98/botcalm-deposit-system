import {useCallback, useEffect, useState} from 'react';
import {useAuth} from '../../context/AuthContext';
import useSocket from '../../hooks/useSocket';
import {getWallets} from '../../api';
import type {Transaction, Wallet} from '../../types';
import Navbar from './Navbar';
import WalletSection from './WalletSection';
import TransactionSection from './TransactionSection';

export default function Dashboard() {
  const { token, username, logout } = useAuth();

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [latestUpdate, setLatestUpdate] = useState<Transaction | null>(null);

  const handleTransactionUpdate = useCallback((tx: Transaction) => {
    setLatestUpdate(tx);
  }, []);

  const { isConnected } = useSocket(token, handleTransactionUpdate);

  useEffect(() => {
    getWallets()
      .then((data) => {
        setWallets(data);
        setWalletsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch wallets:', err);
        setWalletsLoading(false);
      });
  }, []);

  const handleWalletAdded = (wallet: Wallet) => {
    setWallets((prev) => [...prev, wallet]);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#050d1a] relative">
      <Navbar
        username={username ?? ''}
        isConnected={isConnected}
        onLogout={handleLogout}
      />

      <main className="pt-14 relative z-[1]">
        <div className="p-6 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">

          <WalletSection
            wallets={wallets}
            loading={walletsLoading}
            onWalletAdded={handleWalletAdded}
          />

          <TransactionSection wallets={wallets} latestUpdate={latestUpdate} />
        </div>
      </main>
    </div>
  );
}
