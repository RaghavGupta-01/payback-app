'use client';

import React from 'react';
import { Transaction } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import { Sparkles, Calendar, Receipt } from 'lucide-react';

interface TableRowProps {
  transaction: Transaction;
  index: number;
  style: React.CSSProperties;
  onClick: (id: string) => void;
}

export default function TableRow({ transaction, index, style, onClick }: TableRowProps) {
  // Format occurred_at date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const isEven = index % 2 === 0;

  return (
    <div
      style={style}
      onClick={() => onClick(transaction.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(transaction.id);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Transaction at ${transaction.merchant} for ${formatCurrency(transaction.amount)}`}
      className={`flex items-stretch px-6 border-b border-[var(--color-neutral-100)] hover:bg-[var(--color-primary-50)]/50 cursor-pointer focus:bg-[var(--color-primary-50)]/70 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary-500)] outline-none transition-colors duration-150 ${
        isEven ? 'bg-white' : 'bg-neutral-50/75'
      }`}
    >
      {/* Merchant Info */}
      <div className="flex-[2] flex items-center min-w-0 py-3 pr-4 border-r border-[var(--color-neutral-100)]">
        <div className="min-w-0">
          <p className="font-[var(--font-weight-semibold)] text-xs sm:text-sm text-[var(--color-neutral-800)] truncate">
            {transaction.merchant}
          </p>
        </div>
      </div>

      {/* Category */}
      <div className="flex-1 flex items-center py-3 px-4 border-r border-[var(--color-neutral-100)] min-w-0">
        <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] text-xs sm:text-sm font-semibold select-none">
          {transaction.category}
        </span>
      </div>

      {/* Amount */}
      <div className="flex-1 flex items-center py-3 px-4 border-r border-[var(--color-neutral-100)] min-w-0 font-[var(--font-weight-semibold)] text-xs sm:text-sm text-[var(--color-neutral-800)]">
        {formatCurrency(transaction.amount)}
      </div>

      {/* Status (Payment Status) */}
      <div className="flex-1 flex items-center py-3 px-4 border-r border-[var(--color-neutral-100)] min-w-0">
        <Badge variant={transaction.status} className="text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-0.5 select-none">{transaction.status}</Badge>
      </div>

      {/* Date / Timestamp */}
      <div className="flex-[1.5] flex items-center py-3 pl-4 min-w-0 text-xs sm:text-sm text-[var(--color-neutral-500)]">
        {formatDate(transaction.occurred_at)}
      </div>
    </div>
  );
}
