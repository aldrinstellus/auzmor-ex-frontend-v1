import { create } from 'zustand';
import { App } from 'queries/apps';

export interface IAppsStore {
  apps: { [key: string]: App };
  featuredApps: { [key: string]: App };
  widgetApps: { [key: string]: App };
  setApp: (app: { [key: string]: App }) => void;
  setFeaturedApp: (app: { [key: string]: App }) => void;
  setWidgetApp: (app: { [key: string]: App }) => void;
  updateApp: (id: string, app: App) => void;
}

export const useAppStore = create<IAppsStore>((set) => ({
  apps: {},
  featuredApps: {},
  widgetApps: {},
  setApp: (apps) =>
    set(() => ({
      apps: { ...apps },
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
