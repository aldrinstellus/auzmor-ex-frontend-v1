import { create } from "zustand";
import apiService from "utils/apiService";
import { convertKeysToCamelCase } from "utils/misc";

const permissionView: Record<string, string> = {
  administrative_view: "administrativeView",
  learner_view: "learnerView",
};

interface Role {
  id: number;
  name: string;
  displayName: string;
  organizationId: number;
  locale: string;
  createdAt: number;
  updatedAt: number;
}

interface PermissionState {
  accessibleModules: string[];
  roles: Role[];
  loading: boolean;
  error: string | null;
  fetchAccessibleModules: () => Promise<void>;
  fetchRoles: (params?: Record<string, any>) => Promise<void>;
  getAccessibleModules: () => string[];
  getRoles: () => Role[];
}

const usePermissionStore = create<PermissionState>((set, get) => ({
  accessibleModules: [],
  roles: [],
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

  fetchRoles: async (params = {}) => {
    try {
      const { data } = await apiService.get("/roles", params);
      const roles = convertKeysToCamelCase(data)?.result?.data || [];
      set({ roles });
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  },

  getAccessibleModules: () => get().accessibleModules,

  getRoles: () => get().roles,
}));

export default usePermissionStore;
