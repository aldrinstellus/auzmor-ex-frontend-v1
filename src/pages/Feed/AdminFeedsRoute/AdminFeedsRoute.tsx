import React, { lazy } from 'react';
import usePermissionStore from 'stores/permissionsStore';
import { isModuleAccessible } from 'utils/customRolesPermissions/permissions';
import { ADMIN_MODULES } from 'constants/permissions';

const HomeFeed = lazy(() => import('pages/Feed'));

const AdminFeedsRoute = () => {
  const accessibleModules = usePermissionStore((state) =>
        state.getAccessibleModules()
    );
  
    const canReadTeamsWidget = isModuleAccessible(accessibleModules, ADMIN_MODULES.TEAM_ADMIN);
    const isCoursesModuleAccessible = isModuleAccessible(accessibleModules, ADMIN_MODULES.COURSE_ADMIN);
    const isEventsModuleAccessible = isModuleAccessible(accessibleModules, ADMIN_MODULES.EVENT_ADMIN);

  return (
    <HomeFeed
      permissions={{
        canReadTeamsWidget,
        canReadCourseModule: isCoursesModuleAccessible,
        canReadEventModule: isEventsModuleAccessible,
      }}
    />
  );
};

export default AdminFeedsRoute;
