'use client';

import { Search, FilterX, Calendar, IndianRupee, ListFilter } from 'lucide-react';
import { useStore } from '@/lib/store';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface TableFiltersProps {
  categories: string[];
}

export default function TableFilters({ categories }: TableFiltersProps) {
  const store = useStore();

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'SUCCESS', label: 'Success' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'FAILED', label: 'Failed' },
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  // Helper to check if any filters are active
  const hasActiveFilters = 
    store.searchQuery !== '' ||
    store.category !== '' ||
    store.status !== '' ||
    store.dateFrom !== '' ||
    store.dateTo !== '' ||
    store.amountMin !== '' ||
    store.amountMax !== '';

  return (
    <div className="space-y-4">
      {/* Filters Sub-header & Reset Button */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-neutral-100)]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-neutral-400)] uppercase tracking-wider select-none">
          <ListFilter className="w-3.5 h-3.5 text-[var(--color-primary-500)]" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={store.resetFilters}
            className="text-[var(--color-failed-600)] hover:bg-[var(--color-failed-50)] text-xs h-7 px-2.5 flex items-center gap-1"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </Button>
        )}
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search input */}
        <div className="space-y-1.5">
          <label className="text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-neutral-500)]">
            Search Merchant
          </label>
          <Input
            placeholder="Type merchant..."
            value={store.searchQuery}
            onChange={(e) => store.setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Category dropdown */}
        <div className="space-y-1.5">
          <label className="text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-neutral-500)]">
            Category
          </label>
          <Select
            options={categoryOptions}
            value={store.category}
            onChange={(e) => store.setCategory(e.target.value)}
          />
        </div>

        {/* Status dropdown */}
        <div className="space-y-1.5">
          <label className="text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-neutral-500)]">
            Status
          </label>
          <Select
            options={statusOptions}
            value={store.status}
            onChange={(e) => store.setStatus(e.target.value)}
          />
        </div>
      </div>

      {/* Advanced Filters Row (Date and Amount Ranges) */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 pt-4 border-t border-[var(--color-neutral-100)]">
        {/* Date Range Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-neutral-500)] flex-shrink-0">
            <Calendar className="w-4 h-4 text-[var(--color-neutral-400)]" />
            <span>Date Range</span>
          </div>
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <Input
              type="date"
              value={store.dateFrom}
              onChange={(e) => store.setDateFrom(e.target.value)}
              className="flex-1 sm:flex-initial sm:w-36 text-xs px-1 sm:px-3"
            />
            <span className="text-[var(--color-neutral-400)] text-xs flex-shrink-0">to</span>
            <Input
              type="date"
              value={store.dateTo}
              onChange={(e) => store.setDateTo(e.target.value)}
              className="flex-1 sm:flex-initial sm:w-36 text-xs px-1 sm:px-3"
            />
          </div>
        </div>

        {/* Amount Range Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto lg:ml-auto">
          <div className="flex items-center gap-1.5 text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-neutral-500)] flex-shrink-0">
            <IndianRupee className="w-4 h-4 text-[var(--color-neutral-400)]" />
            <span>Amount Range (₹)</span>
          </div>
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <Input
              type="number"
              placeholder="Min"
              value={store.amountMin}
              onChange={(e) => store.setAmountMin(e.target.value)}
              className="flex-1 sm:flex-initial sm:w-28 text-xs px-1.5 sm:px-3"
            />
            <span className="text-[var(--color-neutral-400)] text-xs flex-shrink-0">—</span>
            <Input
              type="number"
              placeholder="Max"
              value={store.amountMax}
              onChange={(e) => store.setAmountMax(e.target.value)}
              className="flex-1 sm:flex-initial sm:w-28 text-xs px-1.5 sm:px-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
