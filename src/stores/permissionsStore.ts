import { create } from "zustand";
import apiService from "utils/apiService";
import { convertKeysToCamelCase } from "utils/misc";
import { PERMISSION_VIEW } from "constants/customRoles";

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
  allModulesPermissions: Record<string, string[]>;
  roles: Role[];
  loading: boolean;
  error: string | null;
  fetchAccessibleModules: () => Promise<void>;
  fetchModulePermissions: (moduleId: string, scope: string) => Promise<void>;
  fetchRoles: (params?: Record<string, any>) => Promise<void>;
  getAccessibleModules: () => string[];
  getRoles: () => Role[];
}

const usePermissionStore = create<PermissionState>((set, get) => ({
  accessibleModules: [],
  allModulesPermissions: {},
  roles: [],
  loading: false,
  error: null,
  fetchAccessibleModules: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiService.get("/accessible_modules");
      const permissions = Object.keys(res.data.result.data)
        .reduce<string[]>((acc, key) => {
          const prefix = PERMISSION_VIEW[key] || key;
          acc.push(...res?.data?.result?.data[key].map((m: string) => `${prefix}:${m}`));
          return acc;
        }, []);
      set({ accessibleModules: permissions, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch modules", loading: false });
    }
  },

  fetchModulePermissions: async (moduleId: string, scope: string) => {
    try {
      const res = await apiService.get("/permissions", {
        resources: moduleId.split(":")[1],
        scope,
      });
      const data: string[] = res?.data?.result?.data || [];
      set((state) => ({
        allModulesPermissions: {
          ...state.allModulesPermissions,
          [moduleId]: data,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch permissions for", moduleId, error);
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

  // selector to read modules array directly
  getAccessibleModules: () => get().accessibleModules,
  
  // selector to read roles array directly 
  getRoles: () => get().roles,
}));

export default usePermissionStore;
