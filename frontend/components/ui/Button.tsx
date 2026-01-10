import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline-primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'font-bold rounded-lg transition-all duration-300';

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl hover:-translate-y-1',
    'outline-primary': 'border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-md hover:shadow-lg hover:-translate-y-1',
    secondary: 'bg-secondary hover:bg-blue-600 text-white shadow-md hover:shadow-lg hover:-translate-y-1',
    danger: 'bg-danger hover:bg-red-600 text-white shadow-md hover:shadow-lg hover:-translate-y-1',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-10 py-4 text-lg',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
