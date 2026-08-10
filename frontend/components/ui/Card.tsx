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
  const hasPaddingOverride = className.split(' ').some(cls => cls.startsWith('p-') || cls.startsWith('px-') || cls.startsWith('py-'));
  const paddingStyle = hasPaddingOverride ? '' : 'p-[var(--spacing-6)]';
  const baseStyles = `bg-white border border-[var(--color-neutral-200)] rounded-[var(--radius-xl)] shadow-sm ${paddingStyle}`;
  const hoverStyles = hoverable 
    ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[var(--color-primary-200)]' 
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
