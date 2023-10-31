import { FC } from 'react';
import AppCard from './AppCard';
import { App } from 'queries/apps';

type AppGridProps = {
  apps: App[];
};

const AppGrid: FC<AppGridProps> = ({ apps }) => {
  return (
    <div className="grid grid-cols-5 gap-6 justify-items-center lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {apps.map((app) => (
        <AppCard app={app} key={app.id} />
      ))}
    </div>
  );
};

export default AppGrid;
