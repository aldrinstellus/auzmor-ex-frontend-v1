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
import { ITeamDetailState } from 'pages/Users';

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
  setShowTeamDetail: (detail: ITeamDetailState) => void;
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
          activeTab: 'TEAM',
          isTeamSelected: false,
          teamDetail: {
            id: id,
            name: name,
            description: description,
            category: category,
            createdAt: createdAtDate,
            totalMembers: totalMembers,
          },
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
        className="relative w-[189.5px] border-solid border border-neutral-200 flex flex-col items-center justify-center p-6 bg-white"
        dataTestId="team-card"
      >
        {isHovered && (
          <PopupMenu
            triggerNode={
              <div className="cursor-pointer">
                <Icon
                  name="moreOutline"
                  stroke="#000"
                  className="absolute top-2 right-2"
                  hover={false}
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
            className="absolute top-0 left-0 text-primary-500 rounded-tl-[12px] rounded-br-[12px] px-3 py-1 text-xs font-medium"
            data-testid="team-badge-recentlyadded"
          >
            Recently added
          </div>
        )}
        <div
          className="flex flex-col items-center"
          onClick={() => {
            setShowTeamDetail({
              activeTab: 'TEAM',
              isTeamSelected: true,
              teamDetail: {
                id: id,
                name: name,
                description: description,
                category: category,
                createdAt: createdAtDate,
                totalMembers: totalMembers,
              },
            });
          }}
        >
          {recentMembers?.length !== 0 ? (
            <AvatarList
              size={80}
              users={recentMembers || []}
              moreCount={totalMembers}
              className="mb-4 mt-1"
              dataTestId="teams-people-icon"
            />
          ) : (
            <div className="p-[18px] bg-neutral-200 rounded-full mb-4 mt-1">
              <img src={TeamWork} height={44} width={44} />
            </div>
          )}
          <div className="space-y-2">
            <div className="flex flex-col items-center space-y-1">
              <div
                className="truncate text-neutral-900 text-base font-bold"
                data-testid={`team-name-${name}`}
              >
                {truncate(name, {
                  length: 24,
                  separator: ' ',
                })}
              </div>

              <div
                className="text-xxs font-semibold rounded-xl py-0.4 px-2 truncate capitalize"
                data-testid={`team-category-${category?.name?.toLowerCase()}`}
              >
                {category?.name?.toLowerCase()}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-1">
              <Icon name="profileUserOutline" size={18} />
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
        openModal={openDeleteModal}
        closeModal={closeDeleteModal}
        userId={id}
      />
    </div>
  );
};

export default TeamsCard;
