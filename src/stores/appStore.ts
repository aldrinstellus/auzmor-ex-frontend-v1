import { create } from 'zustand';
import { IApp } from 'interfaces';

export interface IAppsStore {
  apps: { [key: string]: IApp };
  featuredApps: { [key: string]: IApp };
  widgetApps: { [key: string]: IApp };
  getApps: () => { [key: string]: IApp };
  getFeaturedApps: () => { [key: string]: IApp };
  setApp: (app: { [key: string]: IApp }) => void;
  setFeaturedApp: (app: { [key: string]: IApp }) => void;
  setWidgetApp: (app: { [key: string]: IApp }) => void;
  updateApp: (id: string, app: IApp) => void;
}

export const useAppStore = create<IAppsStore>((set, get) => ({
  apps: {},
  featuredApps: {},
  widgetApps: {},
  getApps: () => get().apps,
  getFeaturedApps: () => get().featuredApps,
  setApp: (apps) =>
    set((state) => ({
      apps: { ...state.apps, ...apps },
    })),
  setFeaturedApp: (apps) =>
    set(() => ({
      featuredApps: { ...apps },
    })),
  setWidgetApp: (apps) =>
    set(() => ({
      widgetApps: { ...apps },
    })),
  updateApp: (id, updatedApp) =>
    set(({ apps }: IAppsStore) => ({
      apps: { ...apps, [id]: { ...updatedApp } },
    })),
}));
