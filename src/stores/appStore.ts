import { create } from 'zustand';
import _ from 'lodash';
import { App } from 'queries/apps';

export interface IAppsStore {
  apps: { [key: string]: App };
  setApp: (comment: { [key: string]: App }) => void;
  updateApp: (id: string, comment: App) => void;
}

export const useAppStore = create<IAppsStore>((set) => ({
  apps: {},
  setApp: (apps) =>
    set(() => ({
      apps: { ...apps },
    })),
  updateApp: (id, updatedApp) =>
    set(({ apps }: IAppsStore) => ({
      apps: { ...apps, [id]: { ...updatedApp } },
    })),
}));
