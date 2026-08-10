import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'SUCCESS' | 'PENDING' | 'FAILED' | 'default';
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[var(--font-size-xs)] font-semibold rounded-full border';

  const variantStyles = {
    SUCCESS: 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border-[var(--color-success-200)] dark:bg-[var(--color-success-950)]/30 dark:text-[var(--color-success-500)] dark:border-[var(--color-success-700)]/40',
    PENDING: 'bg-[var(--color-pending-50)] text-[var(--color-pending-700)] border-[var(--color-pending-200)] dark:bg-[var(--color-pending-950)]/30 dark:text-[var(--color-pending-500)] dark:border-[var(--color-pending-700)]/40',
    FAILED: 'bg-[var(--color-failed-50)] text-[var(--color-failed-700)] border-[var(--color-failed-200)] dark:bg-[var(--color-failed-950)]/30 dark:text-[var(--color-failed-500)] dark:border-[var(--color-failed-700)]/40',
    default: 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] border-[var(--color-neutral-200)] dark:bg-[var(--color-neutral-800)] dark:text-[var(--color-neutral-300)] dark:border-[var(--color-neutral-700)]',
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
