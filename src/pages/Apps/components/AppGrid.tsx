import { FC } from 'react';
import AppCard from './AppCard';
import { App } from 'queries/apps';

type AppGridProps = {
  apps: App[];
};

const AppGrid: FC<AppGridProps> = ({ apps }) => {
  return (
    <div className="flex flex-wrap gap-6">
      {apps.map((app) => (
        <AppCard app={app} key={app.id} />
      ))}
    </div>
  );
};

export default AppGrid;
