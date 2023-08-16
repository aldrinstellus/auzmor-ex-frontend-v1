import Button from 'components/Button';
import Icon from 'components/Icon';
import React from 'react';
import Card from 'components/Card';
import { ITeamDetailState } from 'pages/Users';
import People from '../People';
import EntitySearchModal, {
  EntitySearchModalType,
} from 'components/EntitySearchModal';
import Tooltip from 'components/Tooltip';
import PopupMenu from 'components/PopupMenu';
import { TeamFlow } from '.';

export interface ITeamMemberProps {
  id?: string;
  name?: string;
  category?: string;
  description?: string;
  teamMembers?: number;
  teamTab: string;
  openModal: () => void;
  setShowTeamDetail: (detail: ITeamDetailState) => void;
  setTeamFlow: any;
  setTeamId: (teamId: string) => void;
  openDeleteModal: () => void;
}

const TeamDetail: React.FC<ITeamMemberProps> = ({
  id,
  name,
  description,
  category,
  teamMembers,
  teamTab,
  openModal,
  setShowTeamDetail,
  setTeamFlow,
  setTeamId,
  openDeleteModal,
}) => {
  return (
    <>
      <Card className="py-8 space-y-6">
        <div className="flex justify-between items-center px-8">
          <div
            className="flex space-x-2"
            onClick={() => {
              setShowTeamDetail({
                isTeamSelected: false,
                teamDetail: null,
                activeTab: 'TEAM',
              });
            }}
          >
            <Icon name="linearLeftArrowOutline" size={20} />
            <div className="text-base font-bold text-neutral-900">My Team</div>
          </div>
          <Tooltip
            tooltipContent={
              <div className="space-y-[6px] w-[231px]">
                <div className="text-sm font-medium text-white">
                  Invite members
                </div>
                <div className="text-sm font-normal text-neutral-400">
                  {
                    "Don't forget to add members to the team. Click on the 'Add Members' button to get started."
                  }
                </div>
              </div>
            }
            tooltipPosition="left"
          >
            <Button
              className="flex space-x-1"
              label="Add Members"
              leftIcon="add"
              onClick={() => {
                // add memeber modal
              }}
              dataTestId="add-members-btn"
            />
          </Tooltip>
        </div>
        <div className="w-full bg-purple-50 border-1 border-purple-200 py-4 pl-8 pr-16 flex justify-between">
          <div className="flex flex-col text-neutral-900 space-y-4">
            <div className="text-2xl font-bold">{name || 'Design Team'}</div>
            <div className="text-xs font-normal">
              {description || ' This is a team for design members'}
            </div>
          </div>

          <div className="flex items-center space-x-20 ">
            <div className="flex flex-col space-y-2">
              <div className="text-sm font-semibold text-purple-700">
                Team type
              </div>
              <div className="text-xl font-semibold">
                {category || 'category'}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="text-sm font-semibold text-purple-700">
                No. of people
              </div>
              <div className="text-xl font-semibold">{teamMembers || 0}</div>
            </div>
            <div>
              <PopupMenu
                triggerNode={
                  <div className="cursor-pointer">
                    <Icon name="setting" stroke="#171717" />
                  </div>
                }
                menuItems={[
                  {
                    icon: 'edit',
                    label: 'Edit',
                    onClick: () => {
                      openModal();
                      setTeamFlow(TeamFlow.EditTeam);
                      id && setTeamId(id);
                    },
                    dataTestId: 'team-edit',
                    permissions: [''],
                  },
                  {
                    icon: 'shareForwardOutline',
                    label: 'Share',
                    dataTestId: 'team-share',
                    permissions: [''],
                  },
                  {
                    icon: 'cancel',
                    label: 'Remove',
                    onClick: () => openDeleteModal(),
                    dataTestId: 'team-remove',
                    permissions: [''],
                  },
                ]}
                className=" right-20 w-44"
              />
            </div>
          </div>
        </div>
        <div className="px-8">
          <People
            showModal={false}
            openModal={() => {}}
            closeModal={() => {}}
            teamTab={teamTab}
            teamId={id}
          />
        </div>
      </Card>
      <EntitySearchModal
        entityType={EntitySearchModalType.Team}
        onSubmit={() => {}}
        title="Add Members"
        submitButtonText="add Members"
      />
    </>
  );
};

export default TeamDetail;
