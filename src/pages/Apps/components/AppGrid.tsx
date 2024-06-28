import { FC } from 'react';
import AppCard from './AppCard';
import { App } from 'queries/apps';

type AppGridProps = {
  apps: App[];
  title?: string;
};

const AppGrid: FC<AppGridProps> = ({ apps, title }) => {
  return (
    <div
      className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5"
      tabIndex={0}
      title={title}
    >
      {apps.map((app) => (
        <AppCard app={app} key={app.id} />
      ))}
    </div>
  );
};

export default AppGrid;
