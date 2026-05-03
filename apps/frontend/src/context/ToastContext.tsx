import { createContext, useCallback, useContext, useState } from 'react';
import type { Toast, ToastContextType, ToastType } from '../types';

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

const toastStyles: Record<ToastType, { container: string; dot: string }> = {
  success: {
    container: 'bg-status-green/10 text-status-green border-status-green/30',
    dot: 'bg-status-green',
  },
  error: {
    container: 'bg-status-red/10 text-status-red border-status-red/30',
    dot: 'bg-status-red',
  },
  warning: {
    container: 'bg-status-yellow/10 text-status-yellow border-status-yellow/30',
    dot: 'bg-status-yellow',
  },
  info: {
    container: 'bg-indigo-dim text-indigo-light border-indigo/30',
    dot: 'bg-indigo-light',
  },
};

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => {
          const styles = toastStyles[toast.type];
          return (
            <div
              key={toast.id}
              className={`animate-toast-in min-w-[280px] max-w-[360px] rounded-xl border px-4 py-3 flex items-center gap-3 ${styles.container}`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${styles.dot}`} />
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
