import React from 'react';
import HomeFeed from '..';
import usePermissionStore from 'stores/permissionsStore';
import { isModuleAccessible } from 'utils/customRolesPermissions/permissions';
import { LEARNER_MODULES } from 'constants/permissions';
import { LEARNER_ACCESSIBLE_TRAININGS } from 'constants/training';

const LearnerFeedsRoute = () => {
  const accessibleModules = usePermissionStore((state) =>
        state.getAccessibleModules()
    );
  
  const isLearnersTrainingsModulesAccessible = isModuleAccessible(accessibleModules, LEARNER_ACCESSIBLE_TRAININGS);
  const isLearnersEventsModulesAccessible = isModuleAccessible(accessibleModules, LEARNER_MODULES.EVENT_LEARNER);

  return (
    <HomeFeed
      permissions={{
        canReadTrainings: isLearnersTrainingsModulesAccessible,
        canReadEventModule: isLearnersEventsModulesAccessible,
      }}
    />
  );
};

export default LearnerFeedsRoute;
