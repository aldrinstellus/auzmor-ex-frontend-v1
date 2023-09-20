import TeamWork from 'images/teamwork.svg';
import AvatarList from 'components/AvatarList';
import Icon from 'components/Icon';
import { ITeam } from 'queries/teams';
import { FC } from 'react';
import truncate from 'lodash/truncate';

interface ITeamRowProps {
  team: ITeam;
  onClick?: () => void;
}

const TeamRow: FC<ITeamRowProps> = ({ team, onClick }) => {
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
            className="-space-x-[12px]"
            avatarClassName="!b-[1px]"
          />
        ) : (
          <div className="w-8 h-8 bg-neutral-200 rounded-full mr-2 flex justify-center items-center">
            <img src={TeamWork} height={20} width={20} />
          </div>
        )}
        <div className="flex flex-col justify-between ml-4 truncate">
          <div>
            {truncate(team?.name || '', {
              length: 20,
              separator: ' ',
            })}
          </div>
          <div className="truncate text-neutral-500 text-xs">
            {}
            {truncate(team.description || '', {
              length: 50,
              separator: ' ',
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex">
          <div className="text-neutral-500 text-xs ml-1">
            {truncate(team.category.name || '', {
              length: 15,
              separator: ' ',
            })}
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
