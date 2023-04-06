import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from 'routes/Layout';
import ErrorPage from 'routes/ErrorPage';

const Login = React.lazy(() => import('pages/Login'));
const Registration = React.lazy(() => import('pages/Registration'));
const ForgotPassword = React.lazy(() => import('pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('pages/ResetPassword'));
const Feed = React.lazy(() => import('pages/Feed'));
const Home = React.lazy(() => import('pages/Home'));
const People = React.lazy(() => import('pages/People'));
const PeopleDetail = React.lazy(() => import('pages/PeopleDetail'));

interface IRoutersProps {}

// ⬇️ react query client instance
const queryClient = new QueryClient();

const RequireAuth = () => {
  // ⬇️ get authentication token
  let isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const routers = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<RequireAuth />}>
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
          loader={() => {
            // ⬇️ loader fetch data as earlier as possible
            return '';
          }}
        />
        <Route
          path="/users"
          element={<People />}
          loader={() => {
            // ⬇️ loader fetch data as earlier as possible
            return '';
          }}
        />
        <Route
          path="/users/:userId"
          element={<PeopleDetail />}
          loader={() => {
            // ⬇️ loader fetch data as earlier as possible
            return '';
          }}
          errorElement={<ErrorPage />}
        />
        <Route path="/feed" element={<Feed />} />
      </Route>
    </Route>,
  ),
);

const Routers = (props: IRoutersProps) => {
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
