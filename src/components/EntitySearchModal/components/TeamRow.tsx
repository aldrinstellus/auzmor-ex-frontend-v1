import TeamWork from 'images/teamwork.svg';
import AvatarList from 'components/AvatarList';
import Icon from 'components/Icon';
import { ITeam } from 'interfaces';
import { FC } from 'react';
import truncate from 'lodash/truncate';

export enum TeamRowVariant {
  Small = 'SMALL',
  Large = 'LARGE',
}

interface ITeamRowProps {
  team: ITeam;
  variant?: TeamRowVariant;
  onClick?: () => void;
}

const TeamRow: FC<ITeamRowProps> = ({
  team,
  variant = TeamRowVariant.Large,
  onClick,
}) => {
  if (variant === TeamRowVariant.Small)
    return (
      <div
        className="flex items-center w-full pr-6 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center" data-testid="team-image">
          {team.recentMembers.length > 0 ? (
            <AvatarList
              size={24}
              users={team.recentMembers || []}
              moreCount={team.totalMembers}
              className="-space-x-[12px]"
              avatarClassName="!b-[1px]"
            />
          ) : (
            <div className="w-8 h-8 bg-neutral-200 rounded-full flex justify-center items-center">
              <img src={TeamWork} height={20} width={20} alt="Team Icon" />
            </div>
          )}
        </div>

        <div className="flex flex-col  ml-4 ">
          <div
            data-testid="team-name"
            className="flex flex-col text-sm font-bold justify-between truncate"
          >
            {truncate(team?.name || '', {
              length: 20,
              separator: ' ',
            })}
          </div>
          <div className="flex items-center">
            {team.category ? (
              <div className="flex">
                <div
                  className="text-neutral-500 text-xs ml-1"
                  data-testid="team-category"
                >
                  {truncate(team.category.name || '', {
                    length: 15,
                    separator: ' ',
                  })}
                </div>
              </div>
            ) : null}
            {team.category ? (
              <div className="mx-6 w-1 h-1 bg-neutral-500 rounded-full" />
            ) : null}
            <div className="flex">
              <Icon name="profileUserOutline" size={16} />
              <div
                className="text-neutral-500 text-xs font-normal leading-normal ml-1"
                data-testid="team-members-count"
              >
                {team.totalMembers === 1
                  ? `1 Member`
                  : `${team.totalMembers} Members`}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  else
    return (
      <div
        className="flex items-center justify-between w-full pr-6 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center">
          <div className="flex items-center" data-testid="team-image">
            {team.recentMembers.length > 0 ? (
              <AvatarList
                size={24}
                users={team.recentMembers || []}
                moreCount={team.totalMembers}
                className="-space-x-[12px]"
                avatarClassName="!b-[1px]"
              />
            ) : (
              <div className="w-8 h-8 bg-neutral-200 rounded-full flex justify-center items-center">
                <img src={TeamWork} height={20} width={20} alt="Team Icon" />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between ml-4 truncate">
            <div data-testid="team-name">
              {truncate(team?.name || '', {
                length: 20,
                separator: ' ',
              })}
            </div>
            <div
              className="truncate text-neutral-500 text-xs"
              data-testid="team-description"
            >
              {truncate(team.description || '', {
                length: 50,
                separator: ' ',
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex">
            <div
              className="text-neutral-500 text-xs ml-1"
              data-testid="team-category"
            >
              {truncate(team?.category?.name || '', {
                length: 15,
                separator: ' ',
              })}
            </div>
          </div>
          <div className="mx-6 w-1 h-1 bg-neutral-500 rounded-full" />
          <div className="flex">
            <Icon name="profileUserOutline" size={16} />
            <div
              className="text-neutral-500 text-xs ml-1"
              data-testid="team-members-count"
            >
              {team.totalMembers === 1
                ? `1 Member`
                : `${team.totalMembers} Members`}
            </div>
          </div>
        </div>
      </div>
    );
};

export default TeamRow;
