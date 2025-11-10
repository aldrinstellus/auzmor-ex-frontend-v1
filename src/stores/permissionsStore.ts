import { create } from "zustand";
import apiService from "utils/apiService";

const permissionView: Record<string, string> = {
  administrative_view: "administrativeView",
  learner_view: "learnerView",
};

interface PermissionState {
  accessibleModules: string[];
  loading: boolean;
  error: string | null;
  fetchAccessibleModules: () => Promise<void>;
  getAccessibleModules: () => string[];
}

const usePermissionStore = create<PermissionState>((set, get) => ({
  accessibleModules: [],
  loading: false,
  error: null,
  fetchAccessibleModules: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiService.get("/accessible_modules");
      const permissions = Object.keys(res.data.result.data)
        .reduce<string[]>((acc, key) => {
          const prefix = permissionView[key] || key;
          acc.push(...res?.data?.result?.data[key].map((m: string) => `${prefix}:${m}`));
          return acc;
        }, []);
      set({ accessibleModules: permissions, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch modules", loading: false });
    }
  },

  getAccessibleModules: () => get().accessibleModules,
}));

export default usePermissionStore;
