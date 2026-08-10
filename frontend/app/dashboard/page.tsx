'use client';

import React, { useMemo } from 'react';
import TableFilters from '@/components/table/TableFilters';
import TransactionTable from '@/components/table/TransactionTable';
import TransactionDrawer from '@/components/table/TransactionDrawer';
import { useTransactions } from '@/lib/queries';

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();

  // Extract unique categories dynamically in render layer
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(transactions.map((t) => t.category).filter(Boolean)));
    return uniqueCats.sort();
  }, [transactions]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">

      {/* Filters & Transaction Table */}
      <div className="flex flex-col gap-6">
        <TableFilters categories={categories} />
        <TransactionTable />
      </div>

      {/* Detail slide-over drawer */}
      <TransactionDrawer />
    </div>
  );
}
