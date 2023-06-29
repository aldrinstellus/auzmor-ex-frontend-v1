import React from 'react';
import routers from './config';

import { RouterProvider } from 'react-router-dom';

const Routers = () => {
  return (
    <React.Suspense>
      <RouterProvider router={routers} />
    </React.Suspense>
  );
};

export default Routers;
