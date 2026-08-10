export interface Transaction {
  id: string;
  external_id: string;
  occurred_at: string;
  merchant: string;
  category: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  payment_method: string;
  coins_earned: number;
}

export interface CoinBalance {
  coin_balance: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  coin_cost: number;
  active: boolean;
}

export interface RedeemResponse {
  coin_balance: number;
  redemption_id: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    let errorDetail = 'API Request Failed';
    try {
      const err = await response.json();
      errorDetail = err.detail || err.message || errorDetail;
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getTransactions: async (params?: Record<string, string | number | undefined>): Promise<Transaction[]> => {
    let query = '';
    if (params) {
      const cleanParams: Record<string, string> = {};
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = String(val);
        }
      });
      const qString = new URLSearchParams(cleanParams).toString();
      if (qString) {
        query = `?${qString}`;
      }
    }
    return fetchJson<Transaction[]>(`/api/transactions${query}`);
  },

  getTransactionById: async (id: string): Promise<Transaction> => {
    return fetchJson<Transaction>(`/api/transactions/${id}`);
  },

  getBalance: async (): Promise<CoinBalance> => {
    return fetchJson<CoinBalance>('/api/rewards/balance');
  },

  getCatalog: async (): Promise<Reward[]> => {
    return fetchJson<Reward[]>('/api/rewards/catalog');
  },

  redeemReward: async (rewardId: string): Promise<RedeemResponse> => {
    return fetchJson<RedeemResponse>('/api/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ reward_id: rewardId }),
    });
  },
};
