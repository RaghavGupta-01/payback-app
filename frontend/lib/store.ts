import { create } from 'zustand';
import { Reward } from './api';

export interface FilterState {
  searchQuery: string;
  category: string;
  status: string;
  dateFrom: string; // YYYY-MM-DD
  dateTo: string; // YYYY-MM-DD
  amountMin: string;
  amountMax: string;
  
  // Sorting
  sortField: 'occurred_at' | 'amount' | 'merchant' | 'coins_earned';
  sortDirection: 'asc' | 'desc';

  // UI Modal / Drawer states
  isDrawerOpen: boolean;
  selectedTransactionId: string | null;
  selectedReward: Reward | null;
}

interface FilterActions {
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setStatus: (status: string) => void;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  setAmountMin: (amount: string) => void;
  setAmountMax: (amount: string) => void;
  setSort: (field: FilterState['sortField'], direction: FilterState['sortDirection']) => void;
  
  // Drawer / Modal triggers
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  setSelectedReward: (reward: Reward | null) => void;

  // Reset
  resetFilters: () => void;
}

const initialFiltersState: FilterState = {
  searchQuery: '',
  category: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  amountMin: '',
  amountMax: '',
  sortField: 'occurred_at',
  sortDirection: 'desc',
  isDrawerOpen: false,
  selectedTransactionId: null,
  selectedReward: null,
};

export const useStore = create<FilterState & FilterActions>((set) => ({
  ...initialFiltersState,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategory: (category) => set({ category }),
  setStatus: (status) => set({ status }),
  setDateFrom: (dateFrom) => set({ dateFrom }),
  setDateTo: (dateTo) => set({ dateTo }),
  setAmountMin: (amountMin) => set({ amountMin }),
  setAmountMax: (amountMax) => set({ amountMax }),
  
  setSort: (sortField, sortDirection) => set({ sortField, sortDirection }),

  openDrawer: (id) => set({ isDrawerOpen: true, selectedTransactionId: id }),
  closeDrawer: () => set({ isDrawerOpen: false, selectedTransactionId: null }),
  setSelectedReward: (selectedReward) => set({ selectedReward }),

  resetFilters: () =>
    set({
      searchQuery: '',
      category: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      sortField: 'occurred_at',
      sortDirection: 'desc',
    }),
}));
