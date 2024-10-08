import { useMutation } from '@tanstack/react-query';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import queryClient from 'utils/queryClient';
import useAuth from './useAuth';
import { usePermissions } from './usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

export const useHandleResync = () => {
  const { user, updateUser } = useAuth();
  const { getApi } = usePermissions();

  const syncUsers = getApi(ApiEnum.SyncHrisUsers);
  const resyncMutation = useMutation({
    mutationKey: ['resync'],
    mutationFn: (configName: string) => syncUsers(configName),
    onSuccess: async (data: any, configName) => {
      successToastConfig({});
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await queryClient.invalidateQueries(['current-user-me']);
      if (data.lastSync && user && user.integrations) {
        const updatedIntegrations = user.integrations.map((integ: any) => {
          if (integ.name === configName) {
            return {
              ...integ,
              accountDetails: {
                ...integ.accountDetails,
                lastSync: data?.lastSync,
              },
            };
          }
          return integ;
        });
        // update user with new lastSync .
        updateUser({
          ...user,
          integrations: updatedIntegrations,
        });
      }
    },
    onError: () => {
      failureToastConfig({});
    },
  });

  const handleResync = (configName: string) => {
    resyncMutation.mutate(configName);
  };

  return { handleResync, isResyncLoading: resyncMutation.isLoading };
};
