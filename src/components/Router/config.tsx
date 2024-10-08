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
import RequireNonProdAuth from 'components/RequireNonProdAuth';
import { ChannelDetailTabsEnum } from 'pages/ChannelDetail';

const ErrorBoundary = lazy(() => import('components/ErrorBoundary'));
const Login = lazy(() => import('pages/Login'));
const Signup = lazy(() => import('pages/Signup'));
const Registration = lazy(() => import('pages/Registration'));
const ForgotPassword = lazy(() => import('pages/ForgotPassword'));
const UserSettings = lazy(() => import('pages/UserSettings'));
const ResetPassword = lazy(() => import('pages/ResetPassword'));
const HomeFeed = lazy(() => import('pages/Feed'));
const Users = lazy(() => import('pages/Users'));
const UserDetail = lazy(() => import('pages/UserDetail'));
const TeamDetail = lazy(() => import('pages/TeamDetail'));
const Apps = lazy(() => import('pages/Apps'));
const AppLaunchPage = lazy(() => import('pages/AppLaunchPage'));
const Admin = lazy(() => import('pages/Admin'));
const AcceptInvite = lazy(() => import('pages/AcceptInvite'));
const ChannelDetail = lazy(() => import('pages/ChannelDetail'));
const PageNotFound = lazy(() => import('pages/PageNotFound'));
const ServerErrorPage = lazy(() => import('pages/ServerErrorPage'));
const PostPage = lazy(() => import('pages/Post'));
const Logout = lazy(() => import('pages/Logout'));
const Channels = lazy(() => import('pages/Channels'));
const SearchResults = lazy(() => import('pages/SearchResults'));

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
        <Route path="/" element={<Navigate to="/feed" replace={true} />} />
        <Route path="/home" element={<HomeFeed />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Users />} />
        <Route path="/users/:userId" element={<UserDetail />} />
        <Route path="/teams/:teamId" element={<TeamDetail />} />
        <Route path="/profile" element={<UserDetail />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/apps/:id/launch" element={<AppLaunchPage />} />
        <Route path="/scheduledPosts" element={<HomeFeed />} />
        <Route path="/bookmarks" element={<HomeFeed />} />
        <Route path="/announcements" element={<HomeFeed />} />
        <Route path="/feed" element={<HomeFeed />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route element={<RequireAdminAuth />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/notifications" element={<Notifications />} />
        {/* retricted routes for prod  */}
        <Route element={<RequireNonProdAuth />}>
          <Route path="/channels" element={<Channels />} />
          <Route
            path="/channels/:channelId/documents"
            element={
              <ChannelDetail activeTab={ChannelDetailTabsEnum.Documents} />
            }
          />
          <Route
            path="/channels/:channelId/members"
            element={
              <ChannelDetail activeTab={ChannelDetailTabsEnum.Members} />
            }
          />
          <Route
            path="/channels/:channelId/settings"
            element={
              <ChannelDetail activeTab={ChannelDetailTabsEnum.Setting} />
            }
          />
          <Route
            path="/channels/:channelId/manage-access"
            element={
              <ChannelDetail activeTab={ChannelDetailTabsEnum.ManageAccess} />
            }
          />
          <Route
            path="/channels/:channelId"
            element={<ChannelDetail activeTab={ChannelDetailTabsEnum.Home} />}
          />
          <Route
            path="/channels/:channelId/scheduledPosts"
            element={<ChannelDetail activeTab={ChannelDetailTabsEnum.Home} />}
          />
          <Route
            path="/channels/:channelId/bookmarks"
            element={<ChannelDetail activeTab={ChannelDetailTabsEnum.Home} />}
          />
          <Route path="/search" element={<SearchResults />} />
        </Route>
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
