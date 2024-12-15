import Icon from 'components/Icon';
import useProduct from 'hooks/useProduct';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { FeedModeEnum } from 'stores/feedStore';

interface IAnnouncementFeedHeaderProps {
  mode?: FeedModeEnum;
}

const AnnouncementFeedHeader: FC<IAnnouncementFeedHeaderProps> = ({
  mode = FeedModeEnum.Default,
}) => {
  const { pathname } = useLocation();
  const { isLxp } = useProduct();
  const { t } = useTranslation('feed');

  let backTo = '';

  if (isLxp) {
    const isLearner = pathname.split('/')[1] === 'user';
    switch (mode) {
      case FeedModeEnum.Default:
        backTo = `${isLearner ? '/user' : ''}/feed`;
        break;
    }
  } else {
    switch (mode) {
      case FeedModeEnum.Default:
        backTo = '/feed';
        break;
    }
  }

  return (
    <div
      className="bg-blue-50 shadow-md rounded-9xl px-6 py-7"
      data-testid="announcements-tab"
    >
      <div className="flex justify-between items-center">
        <div className="gap-y-1">
          <div className="flex gap-x-3 items-center">
            <Link to={backTo}>
              <Icon name="arrowLeft" color="text-neutral-900" />
            </Link>
            <div className="text-2xl font-bold text-neutral-900">
              <span data-testid={`feedpage-filter-bookmark`}>
                {t('announcementPosts.title')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementFeedHeader;
