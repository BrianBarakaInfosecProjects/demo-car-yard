'use client';

import { useEffect } from 'react';

type ToastProps = {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
};

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2 duration-200 ${
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      }`}
    >
      <span className="text-base">{type === 'success' ? '✓' : '✕'}</span>
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100 text-base leading-none">
        ×
      </button>
    </div>
  );
}
