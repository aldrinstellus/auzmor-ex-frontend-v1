import { APPS_PERMISSIONS } from "constants/permissions";

export const getAppPermissions = (modulePermissions: string[] = []) => {
  const permissionsSet = new Set(modulePermissions);

  return {
    isReadAllowed: permissionsSet.has(APPS_PERMISSIONS.APPS_READ_ADMIN),
    isCreateAllowed: permissionsSet.has(APPS_PERMISSIONS.APPS_CREATE_ADMIN),
    isUpdateAllowed: permissionsSet.has(APPS_PERMISSIONS.APPS_UPDATE_ADMIN),
    isDeleteAllowed: permissionsSet.has(APPS_PERMISSIONS.APPS_DELETE_ADMIN),
    isFeaturedReadAllowed: permissionsSet.has(APPS_PERMISSIONS.APPS_FEATURED_READ_ADMIN),
    isFeaturedCreateAllowed: permissionsSet.has(APPS_PERMISSIONS.APPS_FEATURED_CREATE_ADMIN),
    isFeaturedUpdateAllowed: permissionsSet.has(APPS_PERMISSIONS.APPS_FEATURED_UPDATE_ADMIN),
    isFeaturedDeleteAllowed: permissionsSet.has(APPS_PERMISSIONS.APPS_FEATURED_DELETE_ADMIN),
  };
};

export const getLearnerAppPermissions = (modulePermissions: string[] = []) => {
  const permissionsSet = new Set(modulePermissions);

  return {
    isReadAllowed: permissionsSet.has(APPS_PERMISSIONS.APPS_READ_LEARNER),
    isFeaturedReadAllowed: permissionsSet.has(APPS_PERMISSIONS.APPS_FEATURED_READ_LEARNER),
  };
};
