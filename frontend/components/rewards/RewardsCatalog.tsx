'use client';

import React, { useState, useEffect } from 'react';
import { useCatalog, useRedeemMutation, useBalance } from '@/lib/queries';
import { Reward } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { HelpCircle, CheckCircle2, AlertCircle, Loader2, Ticket, Coins, ShoppingBag, Gift } from 'lucide-react';

// Theme builder for high-fidelity fintech vouchers
function getVoucherTheme(name: string) {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('amazon')) {
    return {
      gradient: 'from-orange-500/[0.04] to-amber-500/[0.02] border-orange-200/50',
      textAccent: 'text-orange-600',
      badgeBg: 'bg-orange-50/70 text-orange-700 border-orange-200/40',
      Icon: ShoppingBag,
    };
  }
  if (lowercaseName.includes('cashback')) {
    return {
      gradient: 'from-emerald-500/[0.04] to-teal-500/[0.02] border-emerald-200/50',
      textAccent: 'text-emerald-600',
      badgeBg: 'bg-emerald-50/70 text-emerald-700 border-emerald-200/40',
      Icon: Coins,
    };
  }
  if (lowercaseName.includes('movie') || lowercaseName.includes('ticket') || lowercaseName.includes('pvr')) {
    return {
      gradient: 'from-purple-500/[0.04] to-indigo-500/[0.02] border-purple-200/50',
      textAccent: 'text-purple-600',
      badgeBg: 'bg-purple-50/70 text-purple-700 border-purple-200/40',
      Icon: Ticket,
    };
  }
  return {
    gradient: 'from-blue-500/[0.04] to-indigo-500/[0.02] border-blue-200/50',
    textAccent: 'text-blue-600',
    badgeBg: 'bg-blue-50/70 text-blue-700 border-blue-200/40',
    Icon: Gift,
  };
}

export default function RewardsCatalog() {
  const { data: rewards = [], isLoading: isCatalogLoading, isError: isCatalogError } = useCatalog();
  const { data: balanceData } = useBalance();
  const userBalance = balanceData?.coin_balance ?? 0;

  const [rewardToRedeem, setRewardToRedeem] = useState<Reward | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const redeemMutation = useRedeemMutation(
    (data) => {
      setNotification({
        type: 'success',
        message: `Successfully redeemed!`,
      });
      setRewardToRedeem(null);
    },
    (error) => {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to redeem reward. Please try again.',
      });
      setRewardToRedeem(null);
    }
  );

  const handleConfirmRedeem = () => {
    if (rewardToRedeem) {
      redeemMutation.mutate(rewardToRedeem);
    }
  };

  if (isCatalogLoading) {
    return (
      <Card className="h-[250px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[var(--color-primary-600)] animate-spin" />
        <span className="text-[var(--font-size-sm)] text-[var(--color-neutral-400)] font-medium">
          Loading rewards catalogue...
        </span>
      </Card>
    );
  }

  if (isCatalogError) {
    return (
      <Card className="h-[200px] flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-10 h-10 text-[var(--color-failed-600)] mb-3" />
        <h4 className="font-semibold text-sm text-[var(--color-neutral-700)] mb-1">
          Failed to load rewards
        </h4>
        <p className="text-xs text-[var(--color-neutral-400)] max-w-xs">
          Please check your connection and refresh the dashboard.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden flex flex-col">
      {/* Card Header with Title */}
      <div className="px-6 py-[var(--spacing-4)] bg-[var(--color-neutral-50)]/50 border-b border-[var(--color-neutral-200)] flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-neutral-800)] tracking-tight flex items-center gap-2.5 select-none">
          <span className="w-3 h-3 rounded-sm bg-purple-600 flex-shrink-0" aria-hidden="true" />
          <span>Rewards Catalogue</span>
        </h2>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Success / Error alert notifications */}
        {notification && (
          <div
            className={`flex items-start gap-2.5 p-3.5 rounded-lg border text-xs shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rewards.map((reward) => {
            const canAfford = userBalance >= reward.coin_cost;
            const theme = getVoucherTheme(reward.name);
            const Icon = theme.Icon;
            
            return (
              <div
                key={reward.id}
                className={`flex flex-col justify-between p-5 transition-all duration-300 h-full bg-gradient-to-br ${theme.gradient} border rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral-200/45 relative overflow-hidden group`}
              >
                {/* Giant background watermark stamp */}
                <div className="absolute -right-4 -bottom-4 text-neutral-900/5 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-24 h-24" />
                </div>

                <div className="space-y-3.5 relative z-10">
                  {/* Category icon and cost badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className={`p-2 rounded-lg bg-white shadow-sm border border-neutral-100/60 ${theme.textAccent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border select-none ${theme.badgeBg}`}>
                      <span>{reward.coin_cost} Coins</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[var(--color-neutral-850)] leading-snug group-hover:text-[var(--color-primary-700)] transition-colors">
                      {reward.name}
                    </h4>
                    <p className="text-[11px] text-[var(--color-neutral-450)] leading-relaxed line-clamp-2">
                      {reward.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-auto relative z-10">
                  <Button
                    variant={canAfford ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setRewardToRedeem(reward)}
                    disabled={!canAfford}
                    className="w-full h-8 text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    {canAfford ? 'Redeem Voucher' : 'Insufficient Coins'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {rewardToRedeem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setRewardToRedeem(null)} />
          <Card className="relative w-full max-w-sm mx-4 bg-white p-6 shadow-2xl z-10 flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 text-amber-600 border border-amber-200/50">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--color-neutral-800)]">
                  Confirm Redemption
                </h4>
              </div>
            </div>

            <div className="bg-[var(--color-neutral-50)] rounded-lg p-3 text-xs text-[var(--color-neutral-600)] space-y-1.5 border border-[var(--color-neutral-100)]">
              <p>
                Reward: <strong className="font-semibold text-[var(--color-neutral-800)]">{rewardToRedeem.name}</strong>
              </p>
              <p>
                Cost: <strong className="font-semibold text-amber-600">{rewardToRedeem.coin_cost} Coins</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setRewardToRedeem(null)}
                disabled={redeemMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1.5"
                onClick={handleConfirmRedeem}
                disabled={redeemMutation.isPending}
              >
                {redeemMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Redeeming...</span>
                  </>
                ) : (
                  <span>Confirm</span>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
