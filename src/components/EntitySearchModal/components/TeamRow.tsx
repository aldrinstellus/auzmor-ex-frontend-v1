import TeamWork from 'images/teamwork.svg';
import AvatarList from 'components/AvatarList';
import Icon from 'components/Icon';
import { ITeam } from 'queries/teams';
import React from 'react';

interface ITeamRowProps {
  team: ITeam;
  onClick?: () => void;
}

const TeamRow: React.FC<ITeamRowProps> = ({ team, onClick }) => {
  return (
    <div
      className="flex items-center justify-between w-full pr-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        {team.recentMembers.length > 0 ? (
          <AvatarList
            size={24}
            users={team.recentMembers || []}
            moreCount={team.totalMembers}
            className="mr-2 -space-x-3"
          />
        ) : (
          <div className="w-8 h-8 bg-neutral-200 rounded-full mr-2 flex justify-center items-center">
            <img src={TeamWork} height={20} width={20} />
          </div>
        )}
        <div className="flex flex-col justify-between ml-4 truncate">
          <div>{team?.name || ''}</div>
          <div className="truncate text-neutral-500 text-xs">
            {team.description || ''}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex">
          <div className="text-neutral-500 text-xs ml-1">
            {team.category.name || ''}
          </div>
        </div>
        <div className="mx-6 w-1 h-1 bg-neutral-500 rounded-full" />
        <div className="flex">
          <Icon name="profileUserOutline" size={16} />
          <div className="text-neutral-500 text-xs ml-1">
            {team.totalMembers} Members
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamRow;
