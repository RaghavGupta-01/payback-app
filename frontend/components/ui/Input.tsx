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
          className={`w-full px-[var(--spacing-3)] py-[var(--spacing-2)] text-[var(--font-size-sm)] bg-white dark:bg-[var(--color-neutral-900)] border border-[var(--color-neutral-200)] dark:border-[var(--color-neutral-800)] rounded-[var(--radius-lg)] outline-none focus:border-[var(--color-primary-500)] dark:focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] transition-all placeholder-[var(--color-neutral-400)] dark:placeholder-[var(--color-neutral-500)] text-[var(--color-neutral-900)] dark:text-[var(--color-neutral-100)] ${
            icon ? 'pl-[var(--spacing-9)]' : ''
          } ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
