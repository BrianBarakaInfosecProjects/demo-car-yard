'use client';

import React, { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

   const modal = (
     <div
       className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
       onClick={onClose}
     >
       <div
         className={cn(
           'bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col',
           sizeClasses[size]
         )}
         onClick={(e) => e.stopPropagation()}
       >
         <div className="flex items-center justify-between p-6 border-b relative">
           <h3 className="text-2xl font-bold text-dark">{title}</h3>
           <button
             onClick={onClose}
             className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none z-10 relative"
           >
             ×
           </button>
         </div>
         <div className="p-6 overflow-y-auto flex-1 relative">{children}</div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
