import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Transaction, CoinBalance, Reward } from './api';

export function useTransactions(params?: Record<string, string | number | undefined>) {
  return useQuery<Transaction[]>({
    queryKey: ['transactions', params],
    queryFn: () => api.getTransactions(params),
  });
}

export function useTransaction(id: string) {
  return useQuery<Transaction>({
    queryKey: ['transaction', id],
    queryFn: () => api.getTransactionById(id),
    enabled: !!id,
  });
}

export function useBalance() {
  return useQuery<CoinBalance>({
    queryKey: ['balance'],
    queryFn: api.getBalance,
  });
}

export function useCatalog() {
  return useQuery<Reward[]>({
    queryKey: ['catalog'],
    queryFn: api.getCatalog,
  });
}

export function useRedeemMutation(
  onSuccess?: (data: { coin_balance: number; redemption_id: string }) => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reward: Reward) => api.redeemReward(reward.id),
    onMutate: async (reward) => {

      await queryClient.cancelQueries({ queryKey: ['balance'] });

      const previousBalance = queryClient.getQueryData<CoinBalance>(['balance']);

      if (previousBalance) {
        queryClient.setQueryData<CoinBalance>(['balance'], {
          coin_balance: previousBalance.coin_balance - reward.coin_cost,
        });
      }

      return { previousBalance };
    },
    onError: (err, reward, context) => {

      if (context?.previousBalance) {
        queryClient.setQueryData(['balance'], context.previousBalance);
      }
      if (onError) {
        onError(err as Error);
      }
    },
    onSuccess: (data) => {

      queryClient.setQueryData(['balance'], { coin_balance: data.coin_balance });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      if (onSuccess) {
        onSuccess(data);
      }
    },
  });
}
