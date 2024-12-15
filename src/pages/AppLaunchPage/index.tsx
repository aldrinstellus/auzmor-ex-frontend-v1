import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import PageLoader from 'components/PageLoader';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

interface IAppLaunchProps {}

const AppLaunchPage: FC<IAppLaunchProps> = () => {
  const { id } = useParams();
  const { getApi } = usePermissions();

  const launchApp = getApi(ApiEnum.LaunchApp);
  const launchAppMutation = useMutation({
    mutationKey: ['launch-app', id],
    mutationFn: (id: string) => launchApp(id),
    onSuccess: (data: any) => {
      const redirectUrl = data?.redirectUrl.startsWith('http')
        ? data?.redirectUrl
        : `https://${data?.redirectUrl}`;
      window.location.replace(redirectUrl);
    },
  });

  useEffect(() => {
    launchAppMutation.mutate(id || '');
  }, []);

  return (
    <div className="flex h-full justify-center">
      <PageLoader />
    </div>
  );
};

export default AppLaunchPage;
