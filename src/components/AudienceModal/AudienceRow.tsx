import Avatar from 'components/Avatar';
import AvatarList from 'components/AvatarList';
import useAuth from 'hooks/useAuth';
import useProduct from 'hooks/useProduct';
import { IAudience } from 'queries/audience';
import { AudienceEntityType } from 'queries/post';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamWork from 'images/teamwork.svg';

interface IAudienceRowProps {
  audience: IAudience;
}

const AudienceRow: FC<IAudienceRowProps> = ({ audience }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLxp } = useProduct();

  return (
    <div
      className="flex justify-between py-5 border-b-1 border-neutral-100 cursor-pointer"
      onClick={() => {
        if (isLxp) return;
        if (audience.id === user?.id) {
          return navigate('/profile');
        }
        if (audience.entityType === AudienceEntityType.User) {
          return navigate(`/users/${audience.id}`);
        }
        if (audience.entityType === AudienceEntityType.Team) {
          return navigate(`/teams/${audience.id}`);
        }
      }}
    >
      <div className="flex w-1/2 items-center">
        <div className="mr-4">
          {audience.entityType === AudienceEntityType.User ? (
            <Avatar
              name={audience?.name}
              image={audience?.profileImage}
              size={32}
            />
          ) : (audience?.recentMembers || []).length > 0 ? (
            <AvatarList
              size={32}
              users={audience.recentMembers?.map((user) => ({
                ...user,
                image: user.profileImage.original,
              }))}
              moreCount={audience?.totalMembers || 0}
              avatarClassName="!b-[1px] cursor-pointer"
              className="-space-x-[16px]"
              dataTestId="teams-icon"
            />
          ) : (
            <div className="p-[8px] bg-neutral-200 rounded-full">
              <img src={TeamWork} height={24} width={24} />
            </div>
          )}
        </div>
        <div className="flex flex-col truncate w-full">
          <div className="text-neutral-900 font-bold text-sm truncate">
            {audience.name}
          </div>
          <div className="text-neutral-500 text-xs truncate">
            {audience?.description || ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceRow;
