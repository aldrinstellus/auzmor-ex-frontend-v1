import Spinner from 'components/Spinner';
import React, { ReactElement } from 'react';

const PageLoader: React.FC = (): ReactElement => {
  return (
    <div className="min-w-full min-h-full flex items-center justify-center">
      <Spinner color="#10b981" />
    </div>
  );
};

export default PageLoader;
