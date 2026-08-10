'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coins } from 'lucide-react';
import { useBalance } from '@/lib/queries';

export default function Header() {
  const { data: balanceData, isLoading } = useBalance();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-neutral-200)] bg-white/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-3 sm:gap-10 h-full">
          <Link href="/dashboard" className="flex items-center select-none cursor-pointer">
            <span className="text-lg sm:text-2xl font-black text-[var(--color-neutral-900)] tracking-tight">
              Pay<span className="text-[var(--color-primary-600)]">Back</span><span className="text-[var(--color-primary-500)]">.</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2.5 sm:gap-6 h-full select-none">
            <Link
              href="/dashboard"
              className={`flex items-center h-16 px-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                pathname === '/dashboard'
                  ? 'border-[var(--color-primary-600)] text-[var(--color-primary-600)]'
                  : 'border-transparent text-[var(--color-neutral-450)] hover:text-[var(--color-neutral-700)] hover:border-[var(--color-neutral-300)]'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/rewards"
              className={`flex items-center h-16 px-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                pathname === '/rewards'
                  ? 'border-[var(--color-primary-600)] text-[var(--color-primary-600)]'
                  : 'border-transparent text-[var(--color-neutral-450)] hover:text-[var(--color-neutral-700)] hover:border-[var(--color-neutral-300)]'
              }`}
            >
              Rewards
            </Link>
          </nav>
        </div>

        {/* Right Action Controls: Coin Balance Pill */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-neutral-50/60 border border-neutral-200 shadow-sm flex-shrink-0">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 flex-shrink-0 select-none">
              <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-100/50 text-amber-500" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-neutral-800 select-none">
              {isLoading ? (
                <span className="inline-block w-8 h-4 bg-neutral-200/50 rounded animate-pulse" />
              ) : (
                <>
                  {(balanceData?.coin_balance ?? 0).toLocaleString()}
                  <span className="hidden sm:inline ml-1 font-semibold text-neutral-400">Coins</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
