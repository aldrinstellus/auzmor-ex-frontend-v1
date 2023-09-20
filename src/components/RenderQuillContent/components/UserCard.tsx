import Avatar from 'components/Avatar';
import { FC, ReactElement } from 'react';

type MentionUserCardProps = {
  fullName: string;
  image?: string;
  active?: boolean;
  email?: string;
};

const UserCard: FC<MentionUserCardProps> = ({
  fullName,
  image,
  active,
  email,
}): ReactElement => {
  return (
    <div className="flex gap-x-4">
      <Avatar size={80} name={fullName} image={image} active={active} />
      <div className="flex flex-col gap-y-2">
        <div className="text-base text-neutral-900 font-bold">{fullName}</div>
        <div className="text-sm font-normal text-neutral-500">{email}</div>
        {/* <div className="flex items-center gap-x-2">
          <Icon name="location" color="text-neutral-900" />
          <div className="text-sm font-normal text-neutral-500">
            New York, USA
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UserCard;
