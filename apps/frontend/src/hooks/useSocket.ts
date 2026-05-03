import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import type { Transaction } from '../types';

export default function useSocket(
  token: string | null,
  onTransactionUpdate: (transaction: Transaction) => void
) {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const onTransactionUpdateRef = useRef(onTransactionUpdate);

  useEffect(() => {
    onTransactionUpdateRef.current = onTransactionUpdate;
  });

  useEffect(() => {
    if (!token) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (err: Error) => {
      console.log('Socket connection error:', err.message);
    });

    socket.on('transaction_updated', (transaction: Transaction) => {
      onTransactionUpdateRef.current(transaction);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      setIsConnected(false);
    };
  }, [token]);

  return { isConnected };
}
