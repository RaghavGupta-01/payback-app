'use client';

import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ArrowUpDown, AlertCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { useTransactions } from '@/lib/queries';
import { useStore } from '@/lib/store';
import { Transaction } from '@/lib/api';
import TableRow from './TableRow';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function TransactionTable() {
  const { data: transactions = [], isLoading, isError, refetch } = useTransactions();
  const store = useStore();

  // Derived filtered & sorted transactions
  const filteredSortedTransactions = useMemo(() => {
    // 1. Filtering
    let result = transactions.filter((txn) => {
      // Search filter (merchant name)
      if (store.searchQuery) {
        const query = store.searchQuery.toLowerCase();
        if (!txn.merchant.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category filter
      if (store.category && txn.category !== store.category) {
        return false;
      }

      // Status filter
      if (store.status && txn.status !== store.status) {
        return false;
      }

      // Date range filter
      if (store.dateFrom) {
        const txnDate = new Date(txn.occurred_at).toISOString().split('T')[0];
        if (txnDate < store.dateFrom) {
          return false;
        }
      }
      if (store.dateTo) {
        const txnDate = new Date(txn.occurred_at).toISOString().split('T')[0];
        if (txnDate > store.dateTo) {
          return false;
        }
      }

      // Amount range filter
      if (store.amountMin !== '') {
        const min = parseFloat(store.amountMin);
        if (isNaN(min) || txn.amount < min) {
          return false;
        }
      }
      if (store.amountMax !== '') {
        const max = parseFloat(store.amountMax);
        if (isNaN(max) || txn.amount > max) {
          return false;
        }
      }

      return true;
    });

    // 2. Sorting
    result.sort((a, b) => {
      let fieldA: any = a[store.sortField];
      let fieldB: any = b[store.sortField];

      // Format casing if string
      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }

      // Handle date sorting
      if (store.sortField === 'occurred_at') {
        fieldA = new Date(a.occurred_at).getTime();
        fieldB = new Date(b.occurred_at).getTime();
      }

      if (fieldA < fieldB) {
        return store.sortDirection === 'asc' ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return store.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [transactions, store.searchQuery, store.category, store.status, store.dateFrom, store.dateTo, store.amountMin, store.amountMax, store.sortField, store.sortDirection]);

  // Toggle sorting
  const handleSort = (field: typeof store.sortField) => {
    if (store.sortField === field) {
      // Toggle direction
      store.setSort(field, store.sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Switch field, default to desc
      store.setSort(field, 'desc');
    }
  };


// Row Renderer for react-window list
const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
  const transaction = filteredSortedTransactions[index];
  if (!transaction) return null;
  return (
    <TableRow
      transaction={transaction}
      index={index}
      style={style}
      onClick={(id) => store.openDrawer(id)}
    />
  );
};

// Loading skeleton state
if (isLoading) {
  return (
    <Card className="space-y-4">
      <div className="h-6 w-48 bg-[var(--color-neutral-100)] rounded animate-pulse" />
      <div className="space-y-2 pt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="h-10 flex-1 bg-[var(--color-neutral-100)] rounded animate-pulse" />
            <div className="h-10 flex-2 bg-[var(--color-neutral-100)] rounded animate-pulse" />
            <div className="h-10 flex-1 bg-[var(--color-neutral-100)] rounded animate-pulse" />
          </div>
        ))}
      </div>
    </Card>
  );
}

// Error state
if (isError) {
  return (
    <Card className="text-center py-8">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-failed-50)] text-[var(--color-failed-600)] mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-[var(--font-weight-bold)] text-[var(--font-size-base)] text-[var(--color-neutral-900)] mb-2">
        Failed to load transactions
      </h3>
      <p className="text-[var(--font-size-sm)] text-[var(--color-neutral-500)] mb-4 max-w-sm mx-auto">
        There was an error communicating with the server. Please check your connection and try again.
      </p>
      <Button variant="secondary" onClick={() => refetch()}>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Retry Connection
      </Button>
    </Card>
  );
}

return (
  <div className="w-full overflow-x-auto">
        <div className="min-w-[768px] flex flex-col">
          {/* Sticky Table Header */}
          <div className="flex items-stretch px-6 py-0 border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]/80 text-xs font-bold text-[var(--color-neutral-400)] uppercase tracking-wider select-none">
            {/* Merchant Column Header */}
            <div
              className="flex-[2] flex items-center gap-1 cursor-pointer py-3 pr-4 border-r border-[var(--color-neutral-200)] hover:text-[var(--color-neutral-600)] transition-colors"
              onClick={() => handleSort('merchant')}
            >
              <span>Merchant</span>
              <ArrowUpDown className="w-3 h-3" />
            </div>

            {/* Category Column Header */}
            <div className="flex-1 flex items-center py-3 px-4 border-r border-[var(--color-neutral-200)]">Category</div>

            {/* Amount Column Header */}
            <div
              className="flex-1 flex items-center gap-1 cursor-pointer py-3 px-4 border-r border-[var(--color-neutral-200)] hover:text-[var(--color-neutral-600)] transition-colors"
              onClick={() => handleSort('amount')}
            >
              <span>Amount</span>
              <ArrowUpDown className="w-3 h-3" />
            </div>

            {/* Payment Status Column Header */}
            <div className="flex-1 flex items-center py-3 px-4 border-r border-[var(--color-neutral-200)]">Payment Status</div>

            {/* Timestamp Column Header */}
            <div
              className="flex-[1.5] flex items-center gap-1 cursor-pointer py-3 pl-4 hover:text-[var(--color-neutral-600)] transition-colors"
              onClick={() => handleSort('occurred_at')}
            >
              <span>Timestamp</span>
              <ArrowUpDown className="w-3 h-3" />
            </div>
          </div>

          {/* Virtualized list or Empty State */}
          {filteredSortedTransactions.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-neutral-100)] dark:bg-[var(--color-neutral-800)] text-[var(--color-neutral-400)] mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="font-[var(--font-weight-semibold)] text-[var(--font-size-sm)] text-[var(--color-neutral-800)] dark:text-[var(--color-neutral-200)] mb-1">
                No transactions found
              </h4>
              <p className="text-[var(--font-size-xs)] text-[var(--color-neutral-400)] dark:text-[var(--color-neutral-500)] max-w-xs mx-auto">
                Try adjusting your search keywords, status flags, or date range selections.
              </p>
            </div>
          ) : (
            <List
              height={500}
              itemCount={filteredSortedTransactions.length}
              itemSize={52}
              width="100%"
            >
              {Row}
            </List>
          )}
        </div>
      </div>
  );
}
