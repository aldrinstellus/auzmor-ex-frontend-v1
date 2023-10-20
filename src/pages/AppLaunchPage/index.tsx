import { FC, useEffect } from 'react';
import { launchApp } from 'queries/apps';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import PageLoader from 'components/PageLoader';

interface IAppLaunchProps {}

const AppLaunchPage: FC<IAppLaunchProps> = () => {
  const { id } = useParams();

  const launchAppMutation = useMutation({
    mutationKey: ['launch-app', id],
    mutationFn: launchApp,
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
