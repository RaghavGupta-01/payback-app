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
      className={`flex items-stretch px-6 border-b border-[var(--color-neutral-100)] hover:bg-[var(--color-primary-50)]/30 cursor-pointer focus:bg-[var(--color-primary-50)]/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary-500)] outline-none transition-colors duration-150 ${
        isEven ? 'bg-white' : 'bg-[var(--color-neutral-50)]/40'
      }`}
    >
      {/* Merchant Info */}
      <div className="flex-[2] flex items-center gap-3 min-w-0 py-3 pr-4 border-r border-[var(--color-neutral-100)]">
        <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-neutral-100)] text-[var(--color-neutral-500)] flex-shrink-0">
          <Receipt className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="font-[var(--font-weight-semibold)] text-[var(--font-size-sm)] text-[var(--color-neutral-800)] truncate">
            {transaction.merchant}
          </p>
          <p className="sm:hidden text-[10px] text-[var(--color-neutral-400)] mt-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(transaction.occurred_at)}
          </p>
        </div>
      </div>

      {/* Category */}
      <div className="flex-1 flex items-center py-3 px-4 border-r border-[var(--color-neutral-100)] min-w-0">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] font-medium">
          {transaction.category}
        </span>
      </div>

      {/* Amount */}
      <div className="flex-1 flex items-center py-3 px-4 border-r border-[var(--color-neutral-100)] min-w-0 font-[var(--font-weight-semibold)] text-[var(--font-size-sm)] text-[var(--color-neutral-800)]">
        {formatCurrency(transaction.amount)}
      </div>

      {/* Status (Payment Status) */}
      <div className="flex-1 flex items-center py-3 px-4 border-r border-[var(--color-neutral-100)] min-w-0">
        <Badge variant={transaction.status}>{transaction.status}</Badge>
      </div>

      {/* Date / Timestamp */}
      <div className="flex-[1.5] flex items-center py-3 pl-4 min-w-0 text-[var(--font-size-xs)] text-[var(--color-neutral-500)]">
        {formatDate(transaction.occurred_at)}
      </div>
    </div>
  );
}
