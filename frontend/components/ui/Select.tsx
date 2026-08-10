import React, { forwardRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, className = '', ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full px-[var(--spacing-3)] py-[var(--spacing-2)] text-[var(--font-size-sm)] bg-white dark:bg-[var(--color-neutral-900)] border border-[var(--color-neutral-200)] dark:border-[var(--color-neutral-800)] rounded-[var(--radius-lg)] outline-none focus:border-[var(--color-primary-500)] dark:focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] transition-all text-[var(--color-neutral-900)] dark:text-[var(--color-neutral-100)] ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';

export default Select;
