import { create } from 'zustand';

export interface IOrgChartStore {
  isOrgChartMounted: boolean;
  setIsOrgChartMounted: (flag: boolean) => void;
}

export const useOrgChartStore = create<IOrgChartStore>((set) => ({
  isOrgChartMounted: false,
  setIsOrgChartMounted: (flag) =>
    set(() => ({
      isOrgChartMounted: flag,
    })),
}));
