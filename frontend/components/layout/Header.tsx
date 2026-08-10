'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useBalance } from '@/lib/queries';

export default function Header() {
  const { data: balanceData, isLoading } = useBalance();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-neutral-200)] bg-white/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center select-none">
          <span className="text-2xl font-black text-[var(--color-neutral-900)] tracking-tight">
            Pay<span className="text-[var(--color-primary-600)]">Back</span><span className="text-[var(--color-primary-500)]">.</span>
          </span>
        </div>

        {/* Navigation & Action Controls */}
        <div className="flex items-center gap-4">
          {/* Coin Balance Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 shadow-inner">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white animate-spin-slow">
              <Sparkles className="w-3 h-3 fill-amber-100 text-amber-500" />
            </div>
            <span className="text-[var(--font-size-xs)] font-[var(--font-weight-semibold)] text-amber-800">
              {isLoading ? (
                <span className="inline-block w-8 h-4 bg-amber-200/50 rounded animate-pulse" />
              ) : (
                `${(balanceData?.coin_balance ?? 0).toLocaleString()} Coins`
              )}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
