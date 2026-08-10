import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className = '', ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-[var(--spacing-3)] text-[var(--color-neutral-400)] pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full py-[var(--spacing-2)] pr-[var(--spacing-3)] text-[var(--font-size-sm)] bg-white border border-[var(--color-neutral-200)] rounded-[var(--radius-lg)] outline-none hover:border-neutral-450 hover:bg-neutral-50/40 focus:bg-white focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] transition-all placeholder-[var(--color-neutral-400)] text-[var(--color-neutral-900)] cursor-pointer ${
            icon ? 'pl-9' : 'pl-[var(--spacing-3)]'
          } ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
