'use client';

import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTransactions } from '@/lib/queries';
import { useStore } from '@/lib/store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { PieChart as ChartIcon, BarChart2, FilterX } from 'lucide-react';

const COLORS = [
  'var(--color-primary-500)', // Indigo
  '#f59e0b',                 // Amber (Warning/Coins)
  '#10b981',                 // Emerald (Success)
  '#3b82f6',                 // Blue
  '#ec4899',                 // Pink
  '#8b5cf6',                 // Purple
  '#f43f5e',                 // Rose
  '#14b8a6',                 // Teal
];

export default function CategoryChart() {
  const { data: transactions = [], isLoading } = useTransactions();
  const store = useStore();
  const [chartView, setChartView] = useState<'donut' | 'bar'>('donut');
  const [hoveredSlice, setHoveredSlice] = useState<{ name: string; value: number; percentage: number; color: string } | null>(null);

  // Process data: aggregate SUCCESS transaction amounts by category
  const chartData = useMemo(() => {
    const successfulTxns = transactions.filter((t) => t.status === 'SUCCESS');
    const categoryTotals: Record<string, number> = {};
    let totalSpend = 0;

    successfulTxns.forEach((txn) => {
      if (txn.category) {
        categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
        totalSpend += txn.amount;
      }
    });

    return Object.entries(categoryTotals)
      .map(([name, value], index) => ({
        name,
        value,
        percentage: totalSpend > 0 ? (value / totalSpend) * 100 : 0,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Format currency helpers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Abbreviated numbers inside donut hole to prevent layout overflows (e.g. ₹10.6 Cr / ₹1.2 L)
  const formatShortCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)} K`;
    }
    return formatCurrency(value);
  };

  const handleSliceClick = (data: any) => {
    if (data && data.name) {
      if (store.category === data.name) {
        store.setCategory('');
      } else {
        store.setCategory(data.name);
      }
    }
  };

  const activeCategory = store.category;

  if (isLoading) {
    return (
      <Card className="h-[350px] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin" />
        <span className="text-[var(--font-size-sm)] text-[var(--color-neutral-400)] font-medium">
          Loading breakdown analysis...
        </span>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="h-[300px] flex flex-col items-center justify-center p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-neutral-100)] text-[var(--color-neutral-400)] mb-4">
          <ChartIcon className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-sm text-[var(--color-neutral-700)] mb-1">
          No expenditure breakdown available
        </h4>
        <p className="text-xs text-[var(--color-neutral-400)] max-w-xs">
          Successful transactions will automatically show their category breakdowns here.
        </p>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-[var(--color-neutral-200)] rounded-lg p-3 shadow-md">
          <p className="font-semibold text-xs text-[var(--color-neutral-850)]">{data.name}</p>
          <p className="font-bold text-sm text-[var(--color-primary-600)] mt-1">
            {formatCurrency(data.value)}
          </p>
          <p className="text-[10px] text-[var(--color-neutral-400)] mt-0.5">
            {data.percentage.toFixed(1)}% of successful spend
          </p>
        </div>
      );
    }
    return null;
  };

  const totalValueSum = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-0 overflow-hidden flex flex-col">
      {/* Header Panel with Title & Toggle Controls */}
      <div className="px-6 py-[var(--spacing-4)] bg-[var(--color-neutral-50)]/50 border-b border-[var(--color-neutral-200)] flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-neutral-800)] tracking-tight flex items-center gap-2.5 select-none">
          <span className="w-3 h-3 rounded-sm bg-purple-600 flex-shrink-0" aria-hidden="true" />
          <span>Expenditure Analysis</span>
        </h2>
        
        <div className="flex items-center gap-3">
          {/* Segmented View Toggle Switch */}
          <div className="flex items-center bg-[var(--color-neutral-100)] p-0.5 rounded-lg border border-[var(--color-neutral-200)]">
            <button
              onClick={() => setChartView('donut')}
              className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                chartView === 'donut'
                  ? 'bg-white text-[var(--color-neutral-800)] shadow-sm'
                  : 'text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-800)]'
              }`}
              title="Donut Chart View"
            >
              <ChartIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Donut</span>
            </button>
            <button
              onClick={() => setChartView('bar')}
              className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                chartView === 'bar'
                  ? 'bg-white text-[var(--color-neutral-800)] shadow-sm'
                  : 'text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-800)]'
              }`}
              title="Bar List View"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bar List</span>
            </button>
          </div>

          {/* Clear Category Filter Toggle */}
          {activeCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => store.setCategory('')}
              className="text-[var(--color-failed-600)] hover:bg-[var(--color-failed-50)] text-xs h-8 flex items-center gap-1.5"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </Button>
          )}
        </div>
      </div>

      {/* Render Chart View conditionally */}
      {chartView === 'donut' ? (
        <div className="p-4 sm:p-6 flex flex-col md:flex-row items-center gap-8 min-h-[380px]">
          {/* Donut Chart View */}
          <div className="w-full md:w-1/2 h-[340px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={95}
                  outerRadius={125}
                  paddingAngle={3}
                  dataKey="value"
                  onClick={handleSliceClick}
                  onMouseEnter={(data) => {
                    if (data) {
                      const target = data.payload || data;
                      setHoveredSlice({
                        name: target.name,
                        value: target.value,
                        percentage: target.percentage,
                        color: target.color || 'var(--color-primary-500)',
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className="cursor-pointer outline-none"
                >
                  {chartData.map((entry, index) => {
                    const isSelected = activeCategory === entry.name;
                    const isAnySelected = activeCategory !== '';
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={isAnySelected && !isSelected ? 0.35 : 1}
                        stroke={isSelected ? 'var(--color-primary-600)' : '#fff'}
                        strokeWidth={isSelected ? 2 : 1}
                        className="transition-all duration-200 outline-none"
                      />
                    );
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Abbreviated Number in Donut Center (Hover Sensitive) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
              {hoveredSlice ? (
                <>
                  <span 
                    className="text-xs font-bold uppercase tracking-wider truncate max-w-[160px]"
                    style={{ color: hoveredSlice.color }}
                  >
                    {hoveredSlice.name}
                  </span>
                  <span className="text-lg font-black text-[var(--color-neutral-800)] mt-0.5 max-w-[165px] truncate">
                    {formatShortCurrency(hoveredSlice.value)}
                  </span>
                  <span className="text-[10px] font-semibold text-[var(--color-neutral-450)] mt-0.5">
                    {hoveredSlice.percentage.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-[var(--color-neutral-400)] uppercase tracking-wider">
                    Total Spend
                  </span>
                  <span className="text-lg font-black text-[var(--color-neutral-800)] mt-0.5 max-w-[165px] truncate">
                    {formatShortCurrency(totalValueSum)}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-2">
              {chartData.map((item) => {
                const isSelected = activeCategory === item.name;
                const isAnySelected = activeCategory !== '';
                return (
                  <div
                    key={item.name}
                    onClick={() => handleSliceClick(item)}
                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[var(--color-primary-300)] bg-[var(--color-primary-50)]/40 shadow-sm'
                        : 'border-transparent hover:bg-[var(--color-neutral-50)]'
                    } ${isAnySelected && !isSelected ? 'opacity-50' : 'opacity-100'}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-semibold text-[var(--color-neutral-700)] truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right pl-2">
                      <span className="text-xs font-bold text-[var(--color-neutral-800)] block">
                        {formatCurrency(item.value)}
                      </span>
                      <span className="text-[10px] text-[var(--color-neutral-400)] block">
                        {item.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Horizontal Progress-Bar List View */
        <div className="p-4 sm:p-6 min-h-[380px] flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[330px] overflow-y-auto pr-2">
            {chartData.map((item) => {
              const isSelected = activeCategory === item.name;
              const isAnySelected = activeCategory !== '';
              return (
                <div
                  key={item.name}
                  onClick={() => handleSliceClick(item)}
                  className={`group p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[var(--color-primary-300)] bg-[var(--color-primary-50)]/40 shadow-sm'
                      : 'border-[var(--color-neutral-100)] hover:border-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-50)]'
                  } ${isAnySelected && !isSelected ? 'opacity-50' : 'opacity-100'}`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-neutral-700)]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 pl-3">
                      <span className="text-[var(--color-neutral-800)]">{formatCurrency(item.value)}</span>
                      <span className="text-[var(--color-neutral-400)] font-normal">({item.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="mt-2.5 w-full bg-[var(--color-neutral-100)] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
