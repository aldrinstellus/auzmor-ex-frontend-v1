import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router-dom';
import queryClient from 'utils/queryClient';
import { loader as homeLoader } from 'pages/Home';
import RequireAuth from 'components/RequireAuth';
import Expirymail from 'components/ExpiryMail';
import { getPosts } from 'queries/post';

const ErrorBoundary = React.lazy(() => import('components/ErrorBoundary'));
const Login = React.lazy(() => import('pages/Login'));
const Signup = React.lazy(() => import('pages/Signup'));
const Registration = React.lazy(() => import('pages/Registration'));
const ForgotPassword = React.lazy(() => import('pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('pages/ResetPassword'));
const Feed = React.lazy(() => import('pages/Feed'));
const Home = React.lazy(() => import('pages/Home'));
const Users = React.lazy(() => import('pages/Users'));
const UserDetail = React.lazy(() => import('pages/UserDetail'));
const Apps = React.lazy(() => import('pages/Apps'));
const Discover = React.lazy(() => import('pages/Discover'));
const Admin = React.lazy(() => import('pages/Admin'));
const AcceptInvite = React.lazy(() => import('pages/AcceptInvite'));
const PageNotFound = React.lazy(() => import('pages/PageNotFound'));
const ServerErrorPage = React.lazy(() => import('pages/ServerErrorPage'));

const routers = createBrowserRouter(
  createRoutesFromElements(
    <Route ErrorBoundary={ErrorBoundary}>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/reset-password"
        element={<ResetPassword expiryToken={''} />}
      />
      <Route path="/password/reset" element={<Expirymail />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />
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
        <Route
          path="/feed"
          element={<Feed />}
          loader={async () => {
            return await getPosts();
          }}
        />
        <Route path="/apps" element={<Apps />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/admin" element={<Admin />} />
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

export default routers;
