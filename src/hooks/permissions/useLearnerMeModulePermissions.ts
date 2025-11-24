
import { getLearnerMePermissions } from "utils/customRolesPermissions/me";
import { LEARNER_MODULES } from "../../constants/permissions";
import { useModulePermissions } from "../useModulePermissions";

function useLearnerMeModulePermissions() {
  const { modulePermissions, hasModuleAccess, isLoading } = useModulePermissions(LEARNER_MODULES.ME_LEARNER);
  return {
    ...getLearnerMePermissions(modulePermissions),
    hasModuleAccess,
    isPermissionsLoading: isLoading,
  };
}

export default useLearnerMeModulePermissions;
