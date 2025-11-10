import { FC } from 'react';
import { usePageTitle } from 'hooks/usePageTitle';
import Feed from 'components/Feed';
import { useLocation } from 'react-router-dom';
import { CELEBRATION_TYPE } from 'components/CelebrationWidget';
import { FeedModeEnum } from 'stores/feedStore';
import { ComponentEnum } from 'utils/permissions/enums/componentEnum';

interface IHomeFeedProps {
  permissions?: {
    canReadTeamsWidget?: boolean,
    canReadTrainings?: boolean,
    canReadCourseModule?: boolean,
    canReadEventModule: boolean,
  }
}

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

const HomeFeed: FC<IHomeFeedProps> = ({
  permissions = {
    canReadTeamsWidget: true,
    canReadTrainings: true,
    canReadCourseModule: true,
    canReadEventModule: true,
  }
}) => {
  const { pathname } = useLocation();
  const { canReadTeamsWidget = false, canReadTrainings = false, canReadCourseModule = false, canReadEventModule } = permissions;

  const bookmarks = pathname === '/bookmarks' || pathname == '/user/bookmarks';
  const scheduled =
    pathname === '/scheduledPosts' || pathname == '/user/scheduledPosts';
  const announcements =
    pathname === '/announcements' || pathname == '/user/announcements';

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

  return (
    <Feed
      mode={FeedModeEnum.Default}
      leftWidgets={[
        ComponentEnum.UserCardWidget,
        ComponentEnum.AppLauncherWidget,
        ComponentEnum.ChannelsWidget,
        ...(canReadTeamsWidget ? [ComponentEnum.TeamsWidget] : []),
      ]}
      rightWidgets={[
        ...(canReadTrainings ? [ComponentEnum.ProgressTrackerWidget] : []),
        ComponentEnum.BirthdayCelebrationWidget,
        ComponentEnum.AnniversaryCelebrationWidget,
        ...(canReadEventModule ? [ComponentEnum.EventWidget] : []),
        ComponentEnum.AnnouncementWidget,
        ComponentEnum.ChannelRequestWidget, 
        ...((canReadCourseModule || canReadEventModule) ? [ComponentEnum.EvaluationRequestWidget] : []),
      ]}
      widgetProps={{
        [ComponentEnum.BirthdayCelebrationWidget]: {
          type: CELEBRATION_TYPE.Birthday,
        },
        [ComponentEnum.AnniversaryCelebrationWidget]: {
          type: CELEBRATION_TYPE.WorkAnniversary,
        },
        [ComponentEnum.EvaluationRequestWidget]: {
          permissions: {
            canReadCourses: canReadCourseModule,
            canReadEvents: canReadEventModule,
          },
        },
      }}
      modeProps={{ [FeedModeEnum.Default]: {} }}
    />
  );
};

export default HomeFeed;
