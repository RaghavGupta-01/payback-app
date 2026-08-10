'use client';

import React, { useEffect, useRef } from 'react';
import { X, Calendar, Receipt, DollarSign, Sparkles, Tag, ShieldCheck, CreditCard, Layers } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useTransaction } from '@/lib/queries';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function TransactionDrawer() {
  const store = useStore();
  const { data: transaction, isLoading, isError } = useTransaction(store.selectedTransactionId || '');
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close drawer helpers
  const handleClose = () => {
    store.closeDrawer();
  };

  // Close on Click Outside
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

      // Close on Escape
      if (event.key === 'Escape') {
        handleClose();
        return;
      }

      // Focus Trap
      if (event.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex="0"]'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          // Shift + Tab (backward tab)
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          // Tab (forward tab)
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus the close button when drawer opens
    if (store.isDrawerOpen && closeButtonRef.current) {
      // Small timeout to let drawer slide in
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [store.isDrawerOpen]);

  if (!store.isDrawerOpen) return null;

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity" />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-white border-l border-[var(--color-neutral-200)] shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[var(--color-neutral-100)] flex items-center justify-between">
            <h2 className="text-[var(--font-size-base)] font-[var(--font-weight-bold)] text-[var(--color-neutral-900)]">
              Transaction Details
            </h2>
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="p-1.5 rounded-lg text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {isLoading ? (
              <div className="space-y-4 pt-10">
                <div className="h-8 w-3/4 bg-neutral-100 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-neutral-100 rounded animate-pulse" />
                <div className="h-12 w-full bg-neutral-100 rounded animate-pulse pt-4" />
                <div className="space-y-2 pt-4">
                  <div className="h-8 w-full bg-neutral-100 rounded animate-pulse" />
                  <div className="h-8 w-full bg-neutral-100 rounded animate-pulse" />
                  <div className="h-8 w-full bg-neutral-100 rounded animate-pulse" />
                </div>
              </div>
            ) : isError || !transaction ? (
              <div className="py-12 text-center">
                <p className="text-[var(--font-size-sm)] text-[var(--color-failed-600)] font-medium">
                  Failed to load transaction details.
                </p>
                <Button variant="secondary" onClick={handleClose} className="mt-4">
                  Close Drawer
                </Button>
              </div>
            ) : (
              <>
                {/* Main details banner */}
                <div className="flex flex-col items-center text-center p-5 bg-[var(--color-primary-50)]/40 border border-[var(--color-primary-100)] rounded-[var(--radius-xl)]">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-600)] mb-3">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <h3 className="font-[var(--font-weight-bold)] text-[var(--font-size-lg)] text-[var(--color-neutral-900)] max-w-xs truncate">
                    {transaction.merchant}
                  </h3>
                  <p className="text-[var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-neutral-950)] mt-1">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <div className="mt-3">
                    <Badge variant={transaction.status}>{transaction.status}</Badge>
                  </div>
                </div>

                {/* Grid details list */}
                <div className="space-y-4">
                  <h4 className="text-[var(--font-size-xs)] font-[var(--font-weight-bold)] text-[var(--color-neutral-400)] uppercase tracking-wider">
                    Core Information
                  </h4>
                  
                  {/* Occurred Date */}
                  <div className="flex items-start gap-3 text-[var(--font-size-sm)] py-1.5 border-b border-[var(--color-neutral-100)]/60">
                    <Calendar className="w-4 h-4 mt-0.5 text-[var(--color-neutral-400)]" />
                    <div>
                      <p className="text-[var(--color-neutral-400)] text-xs">Date and Time</p>
                      <p className="font-medium text-[var(--color-neutral-800)] mt-0.5">
                        {formatDate(transaction.occurred_at)}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-start gap-3 text-[var(--font-size-sm)] py-1.5 border-b border-[var(--color-neutral-100)]/60">
                    <Tag className="w-4 h-4 mt-0.5 text-[var(--color-neutral-400)]" />
                    <div>
                      <p className="text-[var(--color-neutral-400)] text-xs">Category</p>
                      <p className="font-medium text-[var(--color-neutral-800)] mt-0.5">
                        {transaction.category}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-start gap-3 text-[var(--font-size-sm)] py-1.5 border-b border-[var(--color-neutral-100)]/60">
                    <CreditCard className="w-4 h-4 mt-0.5 text-[var(--color-neutral-400)]" />
                    <div>
                      <p className="text-[var(--color-neutral-400)] text-xs">Payment Method</p>
                      <p className="font-medium text-[var(--color-neutral-800)] mt-0.5">
                        {transaction.payment_method}
                      </p>
                    </div>
                  </div>

                  {/* External ID */}
                  <div className="flex items-start gap-3 text-[var(--font-size-sm)] py-1.5 border-b border-[var(--color-neutral-100)]/60">
                    <Layers className="w-4 h-4 mt-0.5 text-[var(--color-neutral-400)]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[var(--color-neutral-400)] text-xs">External Reference ID</p>
                      <p className="font-medium text-[var(--color-neutral-800)] mt-0.5 font-mono text-xs break-all">
                        {transaction.external_id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cashback & Coins Earning Banner */}
                {transaction.status === 'SUCCESS' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-[var(--radius-lg)] flex gap-3 items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white flex-shrink-0">
                      <Sparkles className="w-4 h-4 fill-amber-100" />
                    </div>
                    <div>
                      <h5 className="font-[var(--font-weight-semibold)] text-[var(--font-size-sm)] text-amber-900">
                        Coins Reward Earned!
                      </h5>
                      <p className="text-[var(--font-size-xs)] text-amber-800 mt-0.5">
                        You earned <strong className="font-bold">{transaction.coins_earned} coins</strong> on this transaction.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Action */}
          <div className="px-6 py-4 border-t border-[var(--color-neutral-100)] bg-[var(--color-neutral-50)]/50">
            <Button variant="secondary" onClick={handleClose} className="w-full">
              Close Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
