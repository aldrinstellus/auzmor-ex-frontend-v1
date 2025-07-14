import { ICheckboxListOption } from 'components/CheckboxList';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type State = {
  filters: { [key: string]: any } | null;
  validFilterKey: FilterKey[];
};

type Actions = {
  getFilter: (key: string) => any;
  setFilters: (filters: { [key: string]: any } | null) => void;
  setValidFilterKeys: (filterKeys: FilterKey[]) => void;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
};

export type FilterKey = {
  key: string;
  label: string;
  transform: (value: any) => any;
  isDynamic?: boolean;
};

export const checkboxTransform = (values: ICheckboxListOption[]) => {
  return values.map(
    (value: ICheckboxListOption) => value.data.label ?? value.data.name ?? '',
  );
};

export const useAppliedFiltersStore = create<State & Actions>()(
  immer((set, get) => ({
    validFilterKey: [],
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
    setValidFilterKeys: (filterKeys: FilterKey[]) =>
      set((state) => {
        state.validFilterKey = [...filterKeys];
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
    'channelRequestStatus',
    'sort',
    'channels',
  ];

  paramsToDelete.forEach((param) => url.searchParams.delete(param));
  window.history.replaceState({}, '', url);
};
