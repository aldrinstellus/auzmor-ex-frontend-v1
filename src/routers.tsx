import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { loader as homeLoader } from 'pages/Home';

const RequireAuth = React.lazy(() => import('components/RequireAuth'));
const ErrorBoundary = React.lazy(() => import('components/ErrorBoundary'));

const Login = React.lazy(() => import('pages/Login'));
const Registration = React.lazy(() => import('pages/Registration'));
const ForgotPassword = React.lazy(() => import('pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('pages/ResetPassword'));
const Feed = React.lazy(() => import('pages/Feed'));
const Home = React.lazy(() => import('pages/Home'));
const Users = React.lazy(() => import('pages/Users'));
const UserDetail = React.lazy(() => import('pages/UserDetail'));
const PageNotFound = React.lazy(() => import('pages/PageNotFound'));
const ServerErrorPage = React.lazy(() => import('pages/ServerErrorPage'));

interface IRoutersProps {}

// ⬇️ react query client instance
const queryClient = new QueryClient();

const routers = createBrowserRouter(
  createRoutesFromElements(
    <Route ErrorBoundary={ErrorBoundary}>
      // root router
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<RequireAuth />}>
        // protected routers
        <Route
          path="/"
          element={<Home />}
          loader={() => {
            // ⬇️ loader fetch data as earlier as possible
            return '';
          }}
        />
        <Route
          path="/home"
          element={<Home />}
          // ⬇️ loader fetch data as earlier as possible
          loader={homeLoader(queryClient)}
        />
        <Route
          path="/users"
          element={<Users />}
          loader={async () => {
            // ⬇️ loader fetch data as earlier as possible
            return '';
          }}
        />
        <Route
          path="/users/:userId"
          element={<UserDetail />}
          loader={() => {
            // ⬇️ loader fetch data as earlier as possible
            return '';
          }}
        />
        <Route path="/feed" element={<Feed />} />
      </Route>
      <Route
        path="/404"
        element={<PageNotFound statusCode={400} message="Page is not found" />}
      />
      <Route
        path="/500"
        element={
          <ServerErrorPage statusCode={500} message="Internal Server Error" />
        }
      />
      <Route path="*" element={<Navigate to="/404" />} />
    </Route>,
  ),
);

const Routers: React.FC<IRoutersProps> = () => {
  return (
    <React.Suspense fallback={<div>LOADING...</div>}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routers} />
        {process.env.NODE_ENV === 'development' ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </QueryClientProvider>
    </React.Suspense>
  );
};

export default Routers;
