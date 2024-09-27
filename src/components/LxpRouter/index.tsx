import { Suspense } from 'react';
import routers from './components/config';

import { RouterProvider } from 'react-router-dom';

const LxpRouter = () => {
  return (
    <Suspense>
      <RouterProvider router={routers} />
    </Suspense>
  );
};

export default LxpRouter;
