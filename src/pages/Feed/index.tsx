import { FC } from 'react';
import { usePageTitle } from 'hooks/usePageTitle';
import Feed, { WidgetEnum } from 'components/Feed';
import { useLocation } from 'react-router-dom';
import useMediaQuery from 'hooks/useMediaQuery';
import { CELEBRATION_TYPE } from 'components/CelebrationWidget';
import { FeedModeEnum } from 'stores/feedStore';
import useProduct from 'hooks/useProduct';

interface IHomeFeedProps {}

export interface IProfileImage {
  blurHash: string;
  original: string;
}

export interface ICreated {
  designation: string;
  fullName: string;
  userId: string;
  workLocation: Record<string, string>;
  status: string;
  department: string;
  profileImage: IProfileImage;
}
export interface IMyReactions {
  id?: string;
  type?: string;
  reaction?: string;
  createdBy?: ICreated;
}

const HomeFeed: FC<IHomeFeedProps> = () => {
  const { pathname } = useLocation();

  const bookmarks = pathname === '/bookmarks' || pathname == '/user/bookmarks';
  const scheduled =
    pathname === '/scheduledPosts' || pathname == '/user/scheduledPosts';
  const announcements =
    pathname === '/announcements' || pathname == '/user/announcements';

  const { isOffice } = useProduct();

  // Set page title
  if (scheduled) {
    usePageTitle('scheduledPosts');
  } else if (bookmarks) {
    usePageTitle('bookmarks');
  } else if (announcements) {
    usePageTitle('announcements');
  } else {
    usePageTitle('feed');
  }

  const isLargeScreen = useMediaQuery('(min-width: 1300px)');

  return (
    <Feed
      mode={FeedModeEnum.Default}
      leftWidgets={[
        WidgetEnum.UserCard,
        WidgetEnum.AppLauncher,
        WidgetEnum.Channels,
        WidgetEnum.MyTeam,
      ]}
      rightWidgets={[
        WidgetEnum.ProgressTracker,
        WidgetEnum.CelebrationBirthday,
        WidgetEnum.CelebrationAnniversary,
        WidgetEnum.Event,
        WidgetEnum.AnnouncementCard,
        WidgetEnum.ChannelRequest,
        WidgetEnum.EvaluationRequestWidget,
      ]}
      widgetProps={{
        [WidgetEnum.MyTeam]: {
          className: isLargeScreen ? 'sticky top-24' : '',
        },
        [WidgetEnum.CelebrationBirthday]: {
          type: CELEBRATION_TYPE.Birthday,
        },
        [WidgetEnum.CelebrationAnniversary]: {
          type: CELEBRATION_TYPE.WorkAnniversary,
        },
        [WidgetEnum.Event]: {
          className: 'sticky top-24',
        },
        [WidgetEnum.AnnouncementCard]: {
          className: isOffice ? 'sticky top-24' : ' ',
        },
        [WidgetEnum.EvaluationRequestWidget]: {
          className: 'sticky top-24',
        },
      }}
      modeProps={{ [FeedModeEnum.Default]: {} }}
    />
  );
};

export default HomeFeed;
