import { useTranslation } from 'react-i18next';

type PageMapping = {
  title: string;
  description: string;
};

export const usePageTitleMappings = (): Record<string, PageMapping> => {
  const { t } = useTranslation('pageTitle');

  return {
    login: {
      title: t('login.title'),
      description: t('login.description'),
    },
    announcements: {
      title: t('announcements.title'),
      description: t('announcements.description'),
    },
    signup: {
      title: t('signup.title'),
      description: t('signup.description'),
    },
    register: {
      title: t('register.title'),
      description: t('register.description'),
    },
    logout: {
      title: t('logout.title'),
      description: t('logout.description'),
    },
    forgotPassword: {
      title: t('forgotPassword.title'),
      description: t('forgotPassword.description'),
    },
    resetPassword: {
      title: t('resetPassword.title'),
      description: t('resetPassword.description'),
    },
    acceptInvite: {
      title: t('acceptInvite.title'),
      description: t('acceptInvite.description'),
    },
    feed: {
      title: t('feed.title'),
      description: t('feed.description'),
    },
    users: {
      title: t('users.title'),
      description: t('users.description'),
    },
    teams: {
      title: t('teams.title'),
      description: t('teams.description'),
    },
    userProfile: {
      title: t('userProfile.title'),
      description: t('userProfile.description'),
    },
    teamProfile: {
      title: t('teamProfile.title'),
      description: t('teamProfile.description'),
    },
    profile: {
      title: t('profile.title'),
      description: t('profile.description'),
    },
    apps: {
      title: t('apps.title'),
      description: t('apps.description'),
    },
    scheduledPosts: {
      title: t('scheduledPosts.title'),
      description: t('scheduledPosts.description'),
    },
    bookmarks: {
      title: t('bookmarks.title'),
      description: t('bookmarks.description'),
    },
    settings: {
      title: t('settings.title'),
      description: t('settings.description'),
    },
    admin: {
      title: t('admin.title'),
      description: t('admin.description'),
    },
    postDetails: {
      title: t('postDetails.title'),
      description: t('postDetails.description'),
    },
    notifications: {
      title: t('notifications.title'),
      description: t('notifications.description'),
    },
    channels: {
      title: t('channels.title'),
      description: t('channels.description'),
    },
    channelDetails: {
      title: t('channelDetails.title'),
      description: t('channelDetails.description'),
    },
    searchResults: {
      title: t('searchResults.title'),
      description: t('searchResults.description'),
    },
    pageNotFound: {
      title: t('pageNotFound.title'),
      description: t('pageNotFound.description'),
    },
    serverError: {
      title: t('serverError.title'),
      description: t('serverError.description'),
    },
  };
};
