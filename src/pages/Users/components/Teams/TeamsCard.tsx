import AvatarList from 'components/AvatarList';
import Card from 'components/Card';
import React from 'react';
import useHover from 'hooks/useHover';
import { truncate } from 'lodash';
import Icon from 'components/Icon';
import TeamWork from 'images/teamwork.svg';
import PopupMenu from 'components/PopupMenu';
import useRole from 'hooks/useRole';
import DeleteTeam from '../DeleteModals/Team';
import useModal from 'hooks/useModal';
import { TeamFlow } from '.';
import moment from 'moment';
import { useNavigate, useSearchParams } from 'react-router-dom';

export interface ITeamsCardProps {
  id: string;
  name: string;
  category: Record<string, any>;
  description: string;
  createdAtDate: string;
  totalMembers: number;
  recentMembers: any;
  setTeamFlow: (mode: string) => void;
  openModal: () => void;
  setShowTeamDetail: (detail: Record<string, any> | null) => void;
}

const TeamsCard: React.FC<ITeamsCardProps> = ({
  id,
  name,
  description,
  category,
  createdAtDate,
  totalMembers,
  recentMembers = [],
  setTeamFlow,
  openModal,
  setShowTeamDetail,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isHovered, eventHandlers] = useHover();
  const [showDeleteModal, openDeleteModal, closeDeleteModal] = useModal(false);
  const { isAdmin, isMember, isSuperAdmin } = useRole();
  const currentDate = moment();

  const teamAllOption = [
    {
      icon: 'edit',
      label: 'Edit',
      onClick: () => {
        openModal();
        setTeamFlow(TeamFlow.EditTeam);
        setShowTeamDetail({
          id: id,
          name: name,
          description: description,
          category: category,
          createdAt: createdAtDate,
          totalMembers: totalMembers,
        });
      },
      dataTestId: 'team-edit',
      enabled: isAdmin || isSuperAdmin,
    },
    {
      icon: 'shareForwardOutline',
      label: 'Share',
      dataTestId: 'team-share',
      enabled: isAdmin || isSuperAdmin || isMember,
    },
    {
      icon: 'cancel',
      label: 'Remove',
      labelClassName: 'text-red-500',
      iconClassName: '!text-red-500',
      onClick: () => openDeleteModal(),
      dataTestId: 'team-remove',
      enabled: isAdmin || isSuperAdmin,
    },
  ];

  const teamOption = teamAllOption.filter((option) => option?.enabled);

  return (
    <div className="cursor-pointer" data-testid="" {...eventHandlers}>
      <Card
        shadowOnHover
        className="relative w-[190px] h-[217px] border-solid border border-neutral-200 flex flex-col items-center justify-center py-6 px-3 bg-white"
        dataTestId="team-card"
      >
        {isHovered && (
          <PopupMenu
            triggerNode={
              <div className="cursor-pointer">
                <Icon
                  name="moreOutline"
                  color="text-black"
                  className="absolute top-2 right-2"
                  dataTestId="people-card-ellipsis"
                />
              </div>
            }
            menuItems={teamOption}
            className="-right-36 w-44 top-8"
          />
        )}
        {moment(createdAtDate)?.isBetween(
          moment().subtract(7, 'days'),
          currentDate,
          null,
          '[]',
        ) && (
          <div
            style={{
              backgroundColor: '#D1FAE5',
            }}
            className="absolute top-0 left-0 text-primary-500 rounded-tl-[12px] rounded-br-[12px] px-3 py-1 text-xxs font-medium"
            data-testid="team-badge-recentlyadded"
          >
            Recently added
          </div>
        )}
        <div
          className="flex flex-col items-center gap-4 justify-between"
          onClick={() => {
            navigate(`/teams/${id}`, {
              state: { prevRoute: searchParams.get('tab') },
            });
          }}
        >
          {recentMembers?.length !== 0 ? (
            <AvatarList
              size={80}
              users={recentMembers || []}
              moreCount={totalMembers}
              dataTestId="teams-people-icon"
            />
          ) : (
            <div className="p-[18px] bg-neutral-200 rounded-full">
              <img src={TeamWork} height={44} width={44} />
            </div>
          )}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className="truncate text-neutral-900 text-base font-bold text-center"
                data-testid={`team-name-${name}`}
              >
                {truncate(name, {
                  length: 18,
                  separator: ' ',
                })}
              </div>

              <div
                // different colors for category
                className="text-xxs font-semibold py-[2px] px-2 line-clamp-1 capitalize rounded bg-indigo-100 text-indigo-500"
                data-testid={`team-category-${category?.name?.toLowerCase()}`}
              >
                {category?.name?.toLowerCase()}
              </div>
            </div>

            <div className="flex items-center justify-center gap-1">
              <Icon
                name="profileUserOutline"
                size={16}
                color="text-neutral-900"
                strokeWidth="1"
                hover={false}
              />
              <div
                className="text-xs font-normal text-neutral-500"
                data-testid={`team-no-of-members-${totalMembers}`}
              >
                {totalMembers} members
              </div>
            </div>
          </div>
        </div>
      </Card>

      <DeleteTeam
        open={showDeleteModal}
        closeModal={closeDeleteModal}
        teamId={id}
      />
    </div>
  );
};

export default TeamsCard;
