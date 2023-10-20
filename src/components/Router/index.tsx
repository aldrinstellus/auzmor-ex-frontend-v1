import { Suspense } from 'react';
import routers from './config';

import { RouterProvider } from 'react-router-dom';

const Routers = () => {
  return (
    <Suspense>
      <RouterProvider router={routers} />
    </Suspense>
  );
};

export default Routers;
