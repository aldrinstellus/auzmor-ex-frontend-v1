import { create } from 'zustand';
import { App } from 'queries/apps';

export interface IAppsStore {
  apps: { [key: string]: App };
  featuredApps: { [key: string]: App };
  setApp: (comment: { [key: string]: App }) => void;
  setFeaturedApp: (comment: { [key: string]: App }) => void;
  updateApp: (id: string, comment: App) => void;
}

export const useAppStore = create<IAppsStore>((set) => ({
  apps: {},
  featuredApps: {},
  setApp: (apps) =>
    set(() => ({
      apps: { ...apps },
    })),
  setFeaturedApp: (apps) =>
    set(() => ({
      featuredApps: { ...apps },
    })),
  updateApp: (id, updatedApp) =>
    set(({ apps }: IAppsStore) => ({
      apps: { ...apps, [id]: { ...updatedApp } },
    })),
}));
