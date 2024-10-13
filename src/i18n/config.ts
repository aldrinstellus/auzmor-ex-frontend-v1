import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
const resources = {
  'en-US': {
    learnNotifications: require('locales/en-US/learnNotifications.json'),
    adminSetting: require('locales/en-US/adminSetting.json'),
    announcement: require('locales/en-US/announcement.json'),
    appLauncher: require('locales/en-US/appLauncher.json'),
    celebrationWidget: require('locales/en-US/celebrationWidget.json'),
    channelDetail: require('locales/en-US/channelDetail.json'),
    channelLinksWidget: require('locales/en-US/channelLinksWidget.json'),
    channels: require('locales/en-US/channels.json'),
    common: require('locales/en-US/common.json'),
    feed: require('locales/en-US/feed.json'),
    filterModal: require('locales/en-US/filterModal.json'),
    navbar: require('locales/en-US/navbar.json'),
    orgChart: require('locales/en-US/orgChart.json'),
    peoplehub: require('locales/en-US/peoplehub.json'),
    postBuilder: require('locales/en-US/postBuilder.json'),
    profile: require('locales/en-US/profile.json'),
    userSetting: require('locales/en-US/userSetting.json'),
    team: require('locales/en-US/team.json'),
    button: require('locales/en-US/button.json'),
    acceptInvite: require('locales/en-US/acceptInvite.json'),
    auth: require('locales/en-US/auth.json'),
    document: require('locales/en-US/document.json'),
    learnWidget: require('locales/en-US/learnWidget.json'),
    post: require('locales/en-US/post.json'),
    notifications: require('locales/en-US/notifications.json'),
    pageTitle: require('locales/en-US/pageTitle.json'),
    components: require('locales/en-US/components.json'),
  },
};

i18next.use(initReactI18next).init({
  fallbackLng: 'en-US',
  debug: process.env.NODE_ENV === 'development',
  resources,
});
