import Card from 'components/Card';
import Divider from 'components/Divider';
import { FC } from 'react';

export type NotificationCardProps = {
  TopCardContent?: string;
  BottomCardContent?: string;
  image?: string;
  type?: NOTIFICATION_CARD_TYPE;
};

export enum NOTIFICATION_CARD_TYPE {
  Card = 'CARD',
  Content = 'CONTENT',
}

const NotificationCard: FC<NotificationCardProps> = ({
  TopCardContent,
  BottomCardContent,
  image = undefined,
  type = NOTIFICATION_CARD_TYPE.Card,
}) => {
  return type === NOTIFICATION_CARD_TYPE.Card ? (
    <Card className="border-neutral-200 border-1 overflow-hidden">
      {/* Comment */}
      {TopCardContent && (
        <div>
          <p
            className={`py-2 px-4 text-sm text-neutral-900 font-medium line-clamp-1 relative ${
              TopCardContent === 'Announcement' && 'bg-secondary-500 text-white'
            }`}
            dangerouslySetInnerHTML={{
              __html: TopCardContent,
            }}
          />
          <Divider className="!bg-neutral-200" />
        </div>
      )}
      {/* Post */}
      <div className="flex">
        {image && (
          <div className="max-h-[72px]">
            <img
              src={image}
              className="min-w-[140px] max-w-[140px] min-h-[72px]"
              alt="Image"
            />
          </div>
        )}
        {BottomCardContent && (
          <p
            className="m-2 ml-4 text-sm text-neutral-500 line-clamp-3"
            id="postContent"
            dangerouslySetInnerHTML={{
              __html: BottomCardContent,
            }}
          />
        )}
      </div>
    </Card>
  ) : (
    <div>
      {TopCardContent && (
        <p
          className="text-sm text-neutral-900 font-medium"
          dangerouslySetInnerHTML={{
            __html: TopCardContent,
          }}
        />
      )}
    </div>
  );
};

export default NotificationCard;
