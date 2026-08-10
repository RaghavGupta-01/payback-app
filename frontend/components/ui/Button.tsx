import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] active:bg-[var(--color-primary-800)] text-white shadow-sm focus-visible:outline-[var(--color-primary-600)]',
    secondary: 'bg-[var(--color-neutral-100)] dark:bg-[var(--color-neutral-800)] text-[var(--color-neutral-700)] dark:text-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-200)] dark:hover:bg-[var(--color-neutral-700)] border border-[var(--color-neutral-200)] dark:border-[var(--color-neutral-700)] shadow-sm focus-visible:outline-[var(--color-neutral-400)]',
    danger: 'bg-[var(--color-failed-600)] hover:bg-[var(--color-failed-700)] active:bg-[var(--color-failed-800)] text-white shadow-sm focus-visible:outline-[var(--color-failed-600)]',
    ghost: 'text-[var(--color-neutral-600)] dark:text-[var(--color-neutral-400)] hover:bg-[var(--color-neutral-100)] dark:hover:bg-[var(--color-neutral-800)] hover:text-[var(--color-neutral-900)] dark:hover:text-[var(--color-neutral-100)] focus-visible:outline-[var(--color-neutral-400)]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[var(--font-size-xs)] rounded-[var(--radius-md)] gap-1.5',
    md: 'px-4 py-2 text-[var(--font-size-sm)] rounded-[var(--radius-lg)] gap-2',
    lg: 'px-6 py-3 text-[var(--font-size-base)] rounded-[var(--radius-xl)] gap-3',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
