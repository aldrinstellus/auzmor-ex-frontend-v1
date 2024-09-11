import { useMutation } from '@tanstack/react-query';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { syncUser } from 'queries/intergration';
import queryClient from 'utils/queryClient';
import momentTz from 'moment-timezone';
import useAuth from './useAuth';

export const useHandleResync = () => {
  const { user, updateUser } = useAuth();
  const resyncMutation = useMutation({
    mutationKey: ['resync'],
    mutationFn: syncUser,
    onSuccess: async (data, configName) => {
      successToastConfig({});
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await queryClient.invalidateQueries(['current-user-me']);
      const newSyncDate = momentTz().toISOString();
      if (user && user.integrations) {
        const updatedIntegrations = user.integrations.map((integ: any) => {
          if (integ.name === configName) {
            return {
              ...integ,
              accountDetails: {
                ...integ.accountDetails,
                lastSync: newSyncDate,
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
