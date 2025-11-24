import { useEffect, useMemo } from "react";
import usePermissionStore from "stores/permissionsStore";
import { CUSTOM_ROLES } from "constants/customRoles";
import { isModuleAccessible } from "utils/customRolesPermissions/permissions";
import { isLearnerRoute } from "components/LxpNotificationsOverview/utils/learnNotification";

export const useModulePermissions = (moduleId: string, shouldFetch = true) => {
  const {
    allModulesPermissions,
    accessibleModules,
    fetchModulePermissions,
    fetchAccessibleModules,
    loading,
  } = usePermissionStore();

  const scope = useMemo(() => (isLearnerRoute() ? CUSTOM_ROLES.learner : CUSTOM_ROLES.admin), []);

  const modulePermissions = allModulesPermissions[moduleId] || [];
  const hasModuleAccess = isModuleAccessible(accessibleModules, moduleId);

  // decide if we need to fetch
  const shouldFetchPermissions =
    shouldFetch &&
    hasModuleAccess &&
    !Object.prototype.hasOwnProperty.call(allModulesPermissions, moduleId);

  useEffect(() => {
    if (accessibleModules.length === 0) {
      fetchAccessibleModules();
    }
  }, [accessibleModules, fetchAccessibleModules]);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (shouldFetchPermissions) {
        try {
          await fetchModulePermissions(moduleId, scope);
        } catch (error) {
          console.error("Failed to fetch permissions for", moduleId, error);
        }
      }
    };

    fetchPermissions();
  }, [moduleId, scope, shouldFetchPermissions, fetchModulePermissions]);

  return {
    modulePermissions,
    hasModuleAccess,
    isLoading: loading || shouldFetchPermissions,
  };
};
