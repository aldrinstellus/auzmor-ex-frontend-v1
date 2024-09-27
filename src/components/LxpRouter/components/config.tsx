import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router-dom';
import RequireAuth from 'components/RequireAuth';
import Notifications from 'pages/Notifications';
import { lazy } from 'react';
import RequireNonProdAuth from 'components/RequireNonProdAuth';
import { ChannelDetailTabsEnum } from 'pages/ChannelDetail';
import ViewManager from './ViewManager';

const ErrorBoundary = lazy(() => import('components/ErrorBoundary'));
const HomeFeed = lazy(() => import('pages/Feed'));
const Apps = lazy(() => import('pages/Apps'));
const Users = lazy(() => import('pages/Users'));
const Channels = lazy(() => import('pages/Channels'));
const TeamDetail = lazy(() => import('pages/TeamDetail'));
const ChannelDetail = lazy(() => import('pages/ChannelDetail'));
const AppLaunchPage = lazy(() => import('pages/AppLaunchPage'));
const PostPage = lazy(() => import('pages/Post'));
const SearchResults = lazy(() => import('pages/SearchResults'));
const PageNotFound = lazy(() => import('pages/PageNotFound'));
const ServerErrorPage = lazy(() => import('pages/ServerErrorPage'));

const routers = createBrowserRouter(
  createRoutesFromElements(
    <Route ErrorBoundary={ErrorBoundary}>
      <Route element={<RequireAuth />}>
        <Route element={<ViewManager />}>
          <Route path="/" element={<Navigate to="/feed" replace={true} />} />
          <Route path="/home" element={<HomeFeed />} />
          <Route path="/teams" element={<Users />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/:id/launch" element={<AppLaunchPage />} />
          <Route path="/scheduledPosts" element={<HomeFeed />} />
          <Route path="/bookmarks" element={<HomeFeed />} />
          <Route path="/feed" element={<HomeFeed />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route path="/notifications" element={<Notifications />} />
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

        <Route path="/user">
          <Route path="" element={<Navigate to="feed" replace={true} />} />
          <Route path="home" element={<HomeFeed />} />
          <Route path="teams" element={<Users />} />
          <Route path="teams/:teamId" element={<TeamDetail />} />
          <Route path="apps" element={<Apps />} />
          <Route path="apps/:id/launch" element={<AppLaunchPage />} />
          <Route path="scheduledPosts" element={<HomeFeed />} />
          <Route path="bookmarks" element={<HomeFeed />} />
          <Route path="feed" element={<HomeFeed />} />
          <Route path="posts/:id" element={<PostPage />} />
          <Route path="notifications" element={<Notifications />} />
          {/* retricted routes for prod  */}
          <Route element={<RequireNonProdAuth />}>
            <Route path="channels" element={<Channels />} />
            <Route
              path="channels/:channelId/documents"
              element={
                <ChannelDetail activeTab={ChannelDetailTabsEnum.Documents} />
              }
            />
            <Route
              path="channels/:channelId/members"
              element={
                <ChannelDetail activeTab={ChannelDetailTabsEnum.Members} />
              }
            />
            <Route
              path="channels/:channelId/settings"
              element={
                <ChannelDetail activeTab={ChannelDetailTabsEnum.Setting} />
              }
            />
            <Route
              path="channels/:channelId/manage-access"
              element={
                <ChannelDetail activeTab={ChannelDetailTabsEnum.ManageAccess} />
              }
            />
            <Route
              path="channels/:channelId"
              element={<ChannelDetail activeTab={ChannelDetailTabsEnum.Home} />}
            />
            <Route
              path="channels/:channelId/scheduledPosts"
              element={<ChannelDetail activeTab={ChannelDetailTabsEnum.Home} />}
            />
            <Route
              path="channels/:channelId/bookmarks"
              element={<ChannelDetail activeTab={ChannelDetailTabsEnum.Home} />}
            />
            <Route path="search" element={<SearchResults />} />
          </Route>
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
