import { FC, useEffect } from 'react';
import { launchApp } from 'queries/apps';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

interface IAppLaunchProps {}

const AppLaunchPage: FC<IAppLaunchProps> = () => {
  const { id } = useParams();

  const launchAppMutation = useMutation({
    mutationKey: ['launch-app', id],
    mutationFn: launchApp,
    onSuccess: (data: any) => {
      window.location.replace(data?.redirectUrl);
    },
  });

  useEffect(() => {
    launchAppMutation.mutate(id || '');
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Skeleton
        className="!w-32"
        containerClassName="flex-1"
        borderRadius={100}
      />
    </div>
  );
};

export default AppLaunchPage;
