import Icon from 'components/Icon';
import useProduct from 'hooks/useProduct';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FeedModeEnum } from 'stores/feedStore';

interface IScheduledFeedHeaderProps {
  mode?: FeedModeEnum;
}

const ScheduledFeedHeader: FC<IScheduledFeedHeaderProps> = ({
  mode = FeedModeEnum.Default,
}) => {
  const { t } = useTranslation('feed');
  const { channelId } = useParams();
  let backTo = '';
  const { isLxp } = useProduct();
  const { pathname } = useLocation();

  if (isLxp) {
    const isLearner = pathname.split('/')[1] === 'user';
    switch (mode) {
      case FeedModeEnum.Default:
        backTo = `${isLearner ? '/user' : ''}/feed`;
        break;
      case FeedModeEnum.Channel:
        backTo = `${isLearner ? '/user' : ''}/channels/${channelId}`;
        break;
      default:
        backTo = `${isLearner ? '/user' : ''}/feed`;
    }
  } else {
    switch (mode) {
      case FeedModeEnum.Default:
        backTo = '/feed';
        break;
      case FeedModeEnum.Channel:
        backTo = `/channels/${channelId}`;
        break;
      default:
        backTo = '/feed';
    }
  }

  return (
    <div
      className="bg-blue-50 shadow-md rounded-9xl px-6 py-7"
      data-testid="scheduled-tab"
    >
      <div className="flex justify-between items-center">
        <div className="gap-y-1">
          <div className="flex gap-x-3 items-center">
            <Link to={backTo}>
              <Icon name="arrowLeft" color="text-neutral-900" />
            </Link>
            <div className="text-2xl font-bold text-neutral-900">
              <span data-testid={`feedpage-filter-scheduled`}>
                {t('scheduledPosts.title')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledFeedHeader;
