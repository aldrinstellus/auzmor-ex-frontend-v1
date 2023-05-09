import Avatar from 'components/Avatar';
import Card from 'components/Card';
import React, { ReactElement } from 'react';
import CircularBorder from './CircularBorder';

type MentionUserCardProps = {
  fullName: string;
  image?: string;
  active?: boolean;
  email?: string;
  className?: string;
};

const MentionUserCard: React.FC<MentionUserCardProps> = ({
  fullName,
  image,
  active,
  email,
  className,
}): ReactElement => {
  return (
    <Card className={className}>
      <div className="flex m-5 items-center justify-between gap-x-3">
        <div>
          {/* Profile pic goes here */}
          <Avatar size={80} name={fullName} image={image} active={active} />
        </div>
        <div className="flex items-start flex-col gap-y-2">
          {/* Rest of info goes here */}
          <span className="text-neutral-900 font-bold text-base">
            {fullName}
          </span>
          <span className="text-neutral-500 font-normal text-sm">{email}</span>
          <div className="flex items-center justify-between gap-x-11">
            <span className="flex items-center gap-x-3">
              <CircularBorder name="mail" className="m-2" />
              <CircularBorder name="slack" className="m-2" />
              <CircularBorder name="convertShape" className="m-2" />
            </span>
            <span className="text-neutral-900 font-bold text-sm">
              View Profile
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MentionUserCard;
