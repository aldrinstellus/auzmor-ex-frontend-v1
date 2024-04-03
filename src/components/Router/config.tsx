import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router-dom';
import RequireAuth from 'components/RequireAuth';
import Notifications from 'pages/Notifications';
import { lazy } from 'react';
import RequireAdminAuth from 'components/RequireAdminAuth';
import RequireOfficeAuth from 'components/RequireOfficeAuth';

const ErrorBoundary = lazy(() => import('components/ErrorBoundary'));
const Login = lazy(() => import('pages/Login'));
const Signup = lazy(() => import('pages/Signup'));
const Registration = lazy(() => import('pages/Registration'));
const ForgotPassword = lazy(() => import('pages/ForgotPassword'));
const UserSettings = lazy(() => import('pages/UserSettings'));
const ResetPassword = lazy(() => import('pages/ResetPassword'));
const Feed = lazy(() => import('pages/Feed'));
const Users = lazy(() => import('pages/Users'));
const UserDetail = lazy(() => import('pages/UserDetail'));
const TeamDetail = lazy(() => import('pages/TeamDetail'));
const Apps = lazy(() => import('pages/Apps'));
const AppLaunchPage = lazy(() => import('pages/AppLaunchPage'));
// const Discover = lazy(() => import('pages/Discover'));
const Admin = lazy(() => import('pages/Admin'));
const AcceptInvite = lazy(() => import('pages/AcceptInvite'));
// const ChannelDetail = lazy(() => import('pages/ChannelDetail'));
const PageNotFound = lazy(() => import('pages/PageNotFound'));
const ServerErrorPage = lazy(() => import('pages/ServerErrorPage'));
const PostPage = lazy(() => import('pages/Post'));
const Logout = lazy(() => import('pages/Logout'));

const routers = createBrowserRouter(
  createRoutesFromElements(
    <Route ErrorBoundary={ErrorBoundary}>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />
      <Route element={<RequireAuth />}>
        <Route
          path="/"
          element={<Navigate to="/feed" replace={true} />}
          // loader={() => {
          //   // ⬇️ loader fetch data as earlier as possible
          //   return '';
          // }}
        />
        <Route
          path="/home"
          element={<Feed />}
          // ⬇️ loader fetch data as earlier as possible
          // loader={homeLoader(queryClient)}
        />
        <Route element={<RequireOfficeAuth />}>
          <Route // users route  is not required in lxp
            path="/users"
            element={<Users />}
            loader={async () => {
              // ⬇️ loader fetch data as earlier as possible
              return '';
            }}
          />
        </Route>
        <Route
          path="/teams"
          element={<Users />}
          loader={async () => {
            // ⬇️ loader fetch data as earlier as possible
            return '';
          }}
        />
        <Route element={<RequireOfficeAuth />}>
          <Route // users details route  is not required in lxp
            path="/users/:userId"
            element={<UserDetail />}
            loader={async () => {
              // ⬇️ loader fetch data as earlier as possible
              return '';
            }}
          />
        </Route>
        <Route
          path="/teams/:teamId"
          element={<TeamDetail />}
          loader={({}) => {
            // ⬇️ loader fetch data as earlier as possible
            return '';
          }}
        />
        <Route element={<RequireOfficeAuth />}>
          <Route
            path="/profile"
            element={<UserDetail />}
            loader={() => {
              return '';
            }}
          />
        </Route>
        {/* <Route path="/discover" element={<Discover />} />
        <Route path="/channels" element={<Channels />} /> */}
        {/* <Route
          path="/channels/:channelId"
          element={<ChannelDetail />}
          loader={() => {
            return '';
          }}
        /> */}
        <Route element={<RequireOfficeAuth />}>
          <Route // apps route  is not required in lxp
            path="/apps"
            element={<Apps />}
          />
        </Route>
        <Route element={<RequireOfficeAuth />}>
          <Route // apps  launch route  is not required in lxp
            path="/apps/:id/launch"
            element={<AppLaunchPage />}
          />
        </Route>
        <Route path="/scheduledPosts" element={<Feed />} />
        <Route path="/bookmarks" element={<Feed />} />
        <Route path="/feed" element={<Feed />} />
        <Route element={<RequireOfficeAuth />}>
          <Route path="/settings" element={<UserSettings />} />
        </Route>
        <Route element={<RequireAdminAuth /> && <RequireOfficeAuth />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/notifications" element={<Notifications />} />
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
