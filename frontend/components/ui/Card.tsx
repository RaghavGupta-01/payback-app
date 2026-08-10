import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export default function Card({
  children,
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'bg-white dark:bg-[var(--color-neutral-900)] border border-[var(--color-neutral-200)] dark:border-[var(--color-neutral-800)] rounded-[var(--radius-xl)] p-[var(--spacing-6)] shadow-sm';
  const hoverStyles = hoverable 
    ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[var(--color-primary-200)] dark:hover:border-[var(--color-primary-800)]' 
    : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
