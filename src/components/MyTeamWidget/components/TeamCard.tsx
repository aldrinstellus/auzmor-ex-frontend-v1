import AvatarList from 'components/AvatarList';
import Icon from 'components/Icon';
import React from 'react';
import { truncate } from 'lodash';
import { useNavigate } from 'react-router-dom';

interface ITeamCard {
  id: string;
  name: string;
  category: Record<string, any>;
  totalMembers: number;
  recentMembers: any;
}

const TeamCard: React.FC<ITeamCard> = ({
  id,
  name,
  category,
  totalMembers,
  recentMembers,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2">
      <div onClick={() => navigate(`/teams/${id}`)}>
        <AvatarList
          size={32}
          users={recentMembers}
          moreCount={totalMembers}
          avatarClassName="!b-[1px] cursor-pointer"
          className="-space-x-[16px]"
          dataTestId="teams-icon"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div
          className="text-sm font-bold truncate cursor-pointer"
          onClick={() => navigate(`/teams/${id}`)}
        >
          {truncate(name, {
            length: 26,
            separator: ' ',
          })}
        </div>
        <div className="flex items-center gap-3">
          {category?.name && (
            <>
              <div className="text-xs text-neutral-500 truncate">
                {truncate(category?.name, {
                  length: 12,
                  separator: ' ',
                })}
              </div>
              <div className="w-1 h-1 rounded-full bg-neutral-900" />
            </>
          )}

          <div className="flex items-center justify-center gap-1">
            <Icon
              name="profileUserOutline"
              size={16}
              color="text-neutral-900"
              strokeWidth="1"
              hover={false}
            />
            <div
              className="text-xs text-neutral-500"
              data-testid={`team-no-of-members-${totalMembers}`}
            >
              {totalMembers} members
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
