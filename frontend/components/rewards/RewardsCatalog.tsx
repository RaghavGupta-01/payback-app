'use client';

import React, { useState, useEffect } from 'react';
import { useCatalog, useRedeemMutation, useBalance } from '@/lib/queries';
import { Reward } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Gift, Sparkles, HelpCircle, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

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
        message: `Successfully redeemed! Redemption ID: ${data.redemption_id.slice(0, 8)}...`,
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
    <div className="space-y-6">
      {/* Title section */}
      <div className="flex items-center justify-between border-b border-[var(--color-neutral-100)] pb-3">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-[var(--color-primary-500)]" />
          <h3 className="font-semibold text-sm text-[var(--color-neutral-700)]">
            Rewards Catalogue
          </h3>
        </div>
        <div className="text-xs text-[var(--color-neutral-400)]">
          Balance: <strong className="font-semibold text-amber-600">{userBalance} Coins</strong>
        </div>
      </div>

      {/* Alert notifications */}
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
          return (
            <Card
              key={reward.id}
              className="flex flex-col justify-between hover:shadow-md transition-all h-full bg-white border border-[var(--color-neutral-200)]"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-semibold text-sm text-[var(--color-neutral-800)] line-clamp-1">
                    {reward.name}
                  </h4>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-amber-200/50 flex-shrink-0">
                    <Sparkles className="w-3 h-3 fill-amber-50" />
                    <span>{reward.coin_cost} Coins</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-neutral-500)] line-clamp-2 leading-relaxed">
                  {reward.description}
                </p>
              </div>

              <div className="pt-4 mt-auto">
                <Button
                  variant={canAfford ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setRewardToRedeem(reward)}
                  disabled={!canAfford}
                  className="w-full h-8 text-xs font-semibold"
                >
                  {canAfford ? 'Redeem Reward' : 'Insufficient Coins'}
                </Button>
              </div>
            </Card>
          );
        })}
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
                <p className="text-[10px] text-[var(--color-neutral-400)] uppercase tracking-wider font-semibold">
                  Redeem Rewards System
                </p>
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
    </div>
  );
}
