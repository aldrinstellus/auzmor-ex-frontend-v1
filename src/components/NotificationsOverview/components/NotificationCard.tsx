import Card from 'components/Card';
import Divider from 'components/Divider';
import React from 'react';

export type NotificationCardProps = {
  TopCardContent?: string;
  BottomCardContent?: string;
  image?: string;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  TopCardContent,
  BottomCardContent,
  image = undefined,
}) => {
  return (
    <Card className="border-neutral-200 border-1 overflow-hidden">
      {/* Comment */}
      {TopCardContent && (
        <div>
          <p
            className="my-2 mx-4 text-sm text-neutral-900 font-medium line-clamp-1"
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
  );
};

export default NotificationCard;
