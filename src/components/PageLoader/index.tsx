import Spinner from 'components/Spinner';
import { FC, ReactElement } from 'react';

const PageLoader: FC = (): ReactElement => {
  return (
    <div className="min-w-full min-h-full flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default PageLoader;
