'use client';

import { useMemo } from 'react';
import TableFilters from '@/components/table/TableFilters';
import TransactionTable from '@/components/table/TransactionTable';
import TransactionDrawer from '@/components/table/TransactionDrawer';
import CategoryChart from '@/components/chart/CategoryChart';
import { useTransactions } from '@/lib/queries';
import { useStore } from '@/lib/store';
import Card from '@/components/ui/Card';

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();
  const store = useStore();

  // Extract unique categories dynamically in render layer
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(transactions.map((t) => t.category).filter(Boolean)));
    return uniqueCats.sort();
  }, [transactions]);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 min-w-0">

      {/* Unified Transactions & Filters Card */}
      <Card className="p-0 overflow-hidden flex flex-col min-w-0">
        {/* Card Header with Title */}
        <div className="px-6 py-[var(--spacing-4)] bg-[var(--color-neutral-50)]/50 border-b border-[var(--color-neutral-200)] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-neutral-800)] tracking-tight flex items-center gap-2.5 select-none">
            <span className="w-3 h-3 rounded-sm bg-purple-600 flex-shrink-0" aria-hidden="true" />
            <span>Transactions</span>
          </h2>
        </div>

        {/* Embedded Filters Panel */}
        <div className="p-4 sm:p-6 border-b border-[var(--color-neutral-200)]">
          <TableFilters categories={categories} />
        </div>

        {/* Embedded Table Component */}
        <TransactionTable />
      </Card>

      {/* Category Breakdown Chart Card */}
      <CategoryChart />

      {/* Detail slide-over drawer */}
      <TransactionDrawer />
    </div>
  );
}
