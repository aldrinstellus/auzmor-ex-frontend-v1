import { useMutation } from '@tanstack/react-query';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { syncUser } from 'queries/intergration';
import queryClient from 'utils/queryClient';
import momentTz from 'moment-timezone';
import { IUser } from 'contexts/AuthContext';

export const useHandleResync = () => {
  const resyncMutation = useMutation({
    mutationKey: ['resync'],
    mutationFn: syncUser,
    onSuccess: async () => {
      successToastConfig({});
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await queryClient.invalidateQueries(['current-user-me']);
    },
    onError: () => {
      failureToastConfig({});
    },
  });

  const handleResync = (
    configName: string,
    user: any,
    updateUser: (user: IUser) => void,
  ) => {
    resyncMutation.mutate(configName);
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
  };

  return { handleResync, isResyncLoading: resyncMutation.isLoading };
};
