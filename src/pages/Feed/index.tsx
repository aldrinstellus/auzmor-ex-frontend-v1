import { FC } from 'react';
import { usePageTitle } from 'hooks/usePageTitle';
import Feed, { WidgetEnum } from 'components/Feed';
import { useLocation } from 'react-router-dom';
import useMediaQuery from 'hooks/useMediaQuery';
import { CELEBRATION_TYPE } from 'components/CelebrationWidget';
import { FeedModeEnum } from 'stores/feedStore';

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
  const bookmarks = pathname === '/bookmarks';
  const scheduled = pathname === '/scheduledPosts';

  // Set page title
  if (scheduled) {
    usePageTitle('scheduledPosts');
  } else if (bookmarks) {
    usePageTitle('bookmarks');
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
        WidgetEnum.ChannelRequest,
        WidgetEnum.CelebrationBirthday,
        WidgetEnum.CelebrationAnniversary,
        WidgetEnum.Event,
        WidgetEnum.AnnouncementCard,
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
          className: 'sticky top-24',
        },
      }}
      modeProps={{ [FeedModeEnum.Default]: {} }}
    />
  );
};

export default HomeFeed;
