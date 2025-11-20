import { ME_PERMISSIONS } from 'constants/permissions';

export const getLearnerMePermissions = (modulePermissions: string[] = []) => {
  const permissionsSet = new Set(modulePermissions);

  return {
    isMeCertificatesInternalReadLearnerAllowed: permissionsSet.has(ME_PERMISSIONS.ME_CERTIFICATES_INTERNAL_READ_LEARNER),
    isMeCertificatesExternalReadLearnerAllowed: permissionsSet.has(ME_PERMISSIONS.ME_CERTIFICATES_EXTERNAL_READ_LEARNER),
    isMeOrdersReadLearnerAllowed: permissionsSet.has(ME_PERMISSIONS.ME_ORDERS_READ_LEARNER),
    isMeActivitiesReadLearnerAllowed: permissionsSet.has(ME_PERMISSIONS.ME_ACTIVITIES_READ_LEARNER),
  };
};
