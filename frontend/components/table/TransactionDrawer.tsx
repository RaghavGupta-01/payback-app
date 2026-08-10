'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useTransaction } from '@/lib/queries';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function TransactionDrawer() {
  const store = useStore();
  const { data: transaction, isLoading, isError } = useTransaction(store.selectedTransactionId || '');
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // States to manage smooth transition animations
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Cache the last loaded transaction so the drawer layout doesn't go blank during slide-out
  const [cachedTransaction, setCachedTransaction] = useState<typeof transaction | null>(null);

  useEffect(() => {
    if (transaction) {
      setCachedTransaction(transaction);
    }
  }, [transaction]);

  // Sync open state to trigger entry and exit transitions
  useEffect(() => {
    if (store.isDrawerOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 15);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setCachedTransaction(null); // Clear cached data once animation finishes
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [store.isDrawerOpen]);

  const handleClose = () => {
    store.closeDrawer();
  };

  // Close drawer on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        store.isDrawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [store.isDrawerOpen]);

  // Escape key listener & Focus Trap
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!store.isDrawerOpen) return;

      if (event.key === 'Escape') {
        handleClose();
        return;
      }

      if (event.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex="0"]'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    if (store.isDrawerOpen && closeButtonRef.current) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [store.isDrawerOpen]);

  // Don't render anything if inactive and transition has completed
  if (!shouldRender) return null;

  const displayTxn = transaction || cachedTransaction;

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
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

  const formatStatusText = (status?: string) => {
    if (!status) return '';
    if (status === 'SUCCESS') return 'Success';
    if (status === 'FAILED') return 'Failed';
    if (status === 'PENDING') return 'Pending';
    return status;
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop overlay (fade transition) */}
      <div
        className={`absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out ${animate ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={handleClose}
      />

      {/* Drawer content panel (slide transition) */}
      <div
        ref={drawerRef}
        className={`relative w-full max-w-md h-full bg-white border-l border-[var(--color-neutral-200)] shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-10 ${animate ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--color-neutral-100)] flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--color-neutral-900)] tracking-tight">
            Transaction Details
          </h2>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-50)] focus:ring-2 focus:ring-[var(--color-primary-300)] outline-none transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          {isLoading && !displayTxn ? (
            <div className="space-y-6 pt-8">
              <div className="h-6 w-1/3 bg-neutral-100 rounded animate-pulse" />
              <div className="h-10 w-2/3 bg-neutral-100 rounded animate-pulse" />
              <hr className="border-neutral-100" />
              <div className="space-y-4">
                <div className="flex justify-between"><div className="h-4 w-1/4 bg-neutral-100 rounded animate-pulse" /><div className="h-4 w-1/2 bg-neutral-100 rounded animate-pulse" /></div>
                <div className="flex justify-between"><div className="h-4 w-1/4 bg-neutral-100 rounded animate-pulse" /><div className="h-4 w-1/3 bg-neutral-100 rounded animate-pulse" /></div>
                <div className="flex justify-between"><div className="h-4 w-1/4 bg-neutral-100 rounded animate-pulse" /><div className="h-4 w-1/2 bg-neutral-100 rounded animate-pulse" /></div>
              </div>
            </div>
          ) : isError ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-[var(--color-failed-600)] font-semibold">
                Failed to load transaction details.
              </p>
              <Button variant="secondary" size="sm" onClick={handleClose}>
                Close Drawer
              </Button>
            </div>
          ) : displayTxn ? (
            <>
              {/* Top Highlights (Merchant name & huge amount) */}
              <div className="flex flex-col items-start space-y-1.5 pt-2">
                <span className="text-[10px] font-bold text-[var(--color-neutral-400)] uppercase tracking-wider">
                  Merchant
                </span>
                <h3 className="font-extrabold text-2xl text-[var(--color-neutral-900)] tracking-tight">
                  {displayTxn.merchant}
                </h3>
                <p className="text-4xl font-black text-[var(--color-neutral-950)] tracking-tight pt-1">
                  {formatCurrency(displayTxn.amount)}
                </p>
              </div>

              {/* Core Ledger Grid */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-[var(--color-neutral-400)] uppercase tracking-wider pb-2 border-b border-[var(--color-neutral-100)]">
                  Transaction Metadata
                </h4>

                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between text-sm py-0.5">
                    <span className="text-[var(--color-neutral-450)] font-medium">Payment Status</span>
                    <span className={`font-bold text-right ${displayTxn.status === 'SUCCESS'
                        ? 'text-[var(--color-success-600)]'
                        : displayTxn.status === 'FAILED'
                          ? 'text-[var(--color-failed-600)]'
                          : 'text-[var(--color-pending-600)]'
                      }`}>
                      {formatStatusText(displayTxn.status)}
                    </span>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center justify-between text-sm py-0.5">
                    <span className="text-[var(--color-neutral-450)] font-medium">Date & Time</span>
                    <span className="font-semibold text-[var(--color-neutral-800)] text-right">
                      {formatDate(displayTxn.occurred_at)}
                    </span>
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-between text-sm py-0.5">
                    <span className="text-[var(--color-neutral-450)] font-medium">Category</span>
                    <span className="font-semibold text-[var(--color-neutral-800)] text-right">
                      {displayTxn.category}
                    </span>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center justify-between text-sm py-0.5">
                    <span className="text-[var(--color-neutral-450)] font-medium">Method</span>
                    <span className="font-semibold text-[var(--color-neutral-800)] text-right">
                      {displayTxn.payment_method}
                    </span>
                  </div>

                  {/* External Reference ID */}
                  <div className="flex items-center justify-between text-sm py-0.5">
                    <span className="text-[var(--color-neutral-450)] font-medium">Reference ID</span>
                    <span className="font-mono text-xs text-[var(--color-neutral-500)] text-right break-all max-w-[200px]">
                      {displayTxn.external_id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reward Earning Banner */}
              {displayTxn.status === 'SUCCESS' && displayTxn.coins_earned > 0 && (
                <div className="p-4 bg-amber-50/40 border border-amber-200/50 rounded-xl flex gap-3.5 items-start">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white flex-shrink-0">
                    <Sparkles className="w-4 h-4 fill-amber-100 text-amber-500" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-semibold text-xs text-amber-900">
                      Coins Earned
                    </h5>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      You accumulated <strong className="font-bold">{displayTxn.coins_earned} coins</strong> on this transaction.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
        
      </div>
    </div>
  );
}
