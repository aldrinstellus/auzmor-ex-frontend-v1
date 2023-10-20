import Spinner from 'components/Spinner';
import { FC, ReactElement } from 'react';
import { PRIMARY_COLOR } from 'utils/constants';

const PageLoader: FC = (): ReactElement => {
  return (
    <div className="min-w-full min-h-full flex items-center justify-center">
      <Spinner color={PRIMARY_COLOR} />
    </div>
  );
};

export default PageLoader;
