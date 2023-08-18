import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import React from 'react';

interface ITeamRowProps {
  team: any;
  onClick?: () => void;
}

const TeamRow: React.FC<ITeamRowProps> = ({ team, onClick }) => {
  return (
    <div
      className="flex items-center justify-between w-full pr-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        <Avatar name={team?.name || ''} size={32} />
        <div className="flex flex-col justify-between ml-4 truncate">
          <div>{team?.name || ''}</div>
          <div className="truncate text-neutral-500 text-xs">
            {team.description || ''}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex">
          <Icon name="globalOutline" size={16} />
          <div className="text-neutral-500 text-xs ml-1">Everyone</div>
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
