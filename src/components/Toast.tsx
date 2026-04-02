import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'error' | 'success';
}

interface ToastContextValue {
  toast: (opts: { message: string; type?: 'error' | 'success' }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ message, type = 'success' }: { message: string; type?: 'error' | 'success' }) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const duration = toast.type === 'error' ? 6000 : 4000;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.type, onDismiss]);

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-lg max-w-sm ${
        toast.type === 'error'
          ? 'bg-red-500 text-white'
          : 'bg-green-500 text-white'
      }`}
    >
      <p className="text-sm font-medium">{toast.message}</p>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
