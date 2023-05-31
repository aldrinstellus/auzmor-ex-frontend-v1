import React from 'react';
import routers from './config';

import { RouterProvider } from 'react-router-dom';
import PageLoader from 'components/PageLoader';

const Routers = () => {
  return (
    <React.Suspense
      fallback={
        <div className="w-screen h-screen">
          <PageLoader />
        </div>
      }
    >
      <RouterProvider router={routers} />
    </React.Suspense>
  );
};

export default Routers;
