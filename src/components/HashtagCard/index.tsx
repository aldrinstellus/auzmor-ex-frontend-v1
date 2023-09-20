import Card from 'components/Card';
import Icon from 'components/Icon';
import { FC, ReactElement } from 'react';
import { getTextByCount } from './helper';

type HashtagCardProps = {
  hashtag: string;
  count: number;
};

const HashtagCard: FC<HashtagCardProps> = (hashtag, count): ReactElement => {
  return (
    <Card className="!bg-orange-50 mb-6">
      <div className="flex flex-row items-center justify-between m-6">
        <div className="flex flex-col">
          <div className="text-neutral-900 text-2xl font-bold">
            {`#${hashtag}`}
          </div>
          <div className="text-neutral-500 text-base font-normal mt-2">
            {getTextByCount(count)}
          </div>
        </div>
        <Icon name="orangeHashtag" size={60} />
      </div>
    </Card>
  );
};

export default HashtagCard;
