import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'form-control w-full',
          error && 'border-danger',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-danger text-sm mt-1 font-semibold">{error}</p>
      )}
    </div>
  );
};
