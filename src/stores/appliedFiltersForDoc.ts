import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type State = {
  filters: { [key: string]: any } | null;
};

type Actions = {
  getFilter: (key: string) => any;
  setFilters: (filters: { [key: string]: any }) => void;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
};

export const useAppliedFiltersForDoc = create<State & Actions>()(
  immer((set, get) => ({
    filters: null,
    getFilter: (key: string) => {
      const filters = get().filters;
      if (filters) {
        return filters[key];
      }
      return undefined;
    },
    setFilters: (filters: { [key: string]: any } | null) =>
      set({ filters: { ...get().filters, ...filters } }),
    updateFilter: (key, value) => set({ filters: { [key]: value } }),
    clearFilters: () => set({ filters: null }),
  })),
);
