import { FeedModeEnum } from 'components/Feed';
import Icon from 'components/Icon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

interface IBookmarkFeedHeaderProps {
  mode?: FeedModeEnum;
}

const BookmarkFeedHeader: FC<IBookmarkFeedHeaderProps> = ({
  mode = FeedModeEnum.Default,
}) => {
  const { t } = useTranslation('feed');
  const { channelId } = useParams();
  let backTo = '';

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

  return (
    <div
      className="bg-blue-50 shadow-md rounded-9xl px-6 py-7"
      data-testid="mybookmarks-tab"
    >
      <div className="flex justify-between items-center">
        <div className="gap-y-1">
          <div className="flex gap-x-3 items-center">
            <Link to={backTo}>
              <Icon name="arrowLeft" color="text-neutral-900" />
            </Link>
            <div className="text-2xl font-bold text-neutral-900">
              <span data-testid={`feedpage-filter-bookmark`}>
                {t('bookmark.title')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkFeedHeader;
