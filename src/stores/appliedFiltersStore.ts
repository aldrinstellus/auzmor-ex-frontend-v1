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

export const useAppliedFiltersStore = create<State & Actions>()(
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
      set((state) => {
        state.filters = { ...state.filters, ...filters };
      }),
    updateFilter: (key, value) =>
      set((state) => {
        if (state.filters) {
          state.filters[key] = value;
        } else {
          state.filters = { [key]: value };
        }
      }),
    clearFilters: () => {
      clearURLParams();
      set((state) => {
        state.filters = null;
      });
    },
  })),
);

const clearURLParams = () => {
  const url = new URL(window.location.href);

  const paramsToDelete = [
    'status',
    'roles',
    'departments',
    'locations',
    'teams',
    'categories',
    'channelType',
    'byPeople',
  ];

  paramsToDelete.forEach((param) => url.searchParams.delete(param));
  window.history.replaceState({}, '', url);
};
