import Button from 'components/Button';
import Icon from 'components/Icon';
import React, { useState } from 'react';
import Card from 'components/Card';
import { ITeamDetailState } from 'pages/Users';
import People from '../People';
import EntitySearchModal, {
  EntitySearchModalType,
} from 'components/EntitySearchModal';
import Tooltip from 'components/Tooltip';
import PopupMenu from 'components/PopupMenu';
import { IGetUser } from 'queries/users';
import Avatar from 'components/Avatar';
import { addTeamMember } from 'queries/teams';
import FailureToast from 'components/Toast/variants/FailureToast';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';

export interface ITeamMemberProps {
  id?: string;
  name?: string;
  category?: Record<string, string>;
  description?: string;
  teamMembers?: number;
  teamTab: string;
  openModal: () => void;
  setShowTeamDetail: (detail: ITeamDetailState) => void;
  showAddMemberModal: boolean;
  openAddMemberModal: () => void;
  closeAddMemberModal: () => void;
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
  showAddMemberModal,
  openAddMemberModal,
  closeAddMemberModal,
}) => {
  const addTeamMemberMutation = useMutation({
    mutationKey: ['add-team-member', id],
    mutationFn: (payload: any) => {
      return addTeamMember(id || '', payload);
    },
    onError: (error: any) => {
      toast(
        <FailureToast
          content={`Error Adding Team Members`}
          dataTestId="team-create-error-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.red['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
    onSuccess: (data: any) => {
      toast(<SuccessToast content={'Members has been added to team'} />, {
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
      });
      queryClient.invalidateQueries(['categories']);
      queryClient.invalidateQueries(['team-members']);
    },
  });

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
              onClick={openAddMemberModal}
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
                {category?.name || 'category'}
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
                    // onClick: () => {
                    //   setTeamFlow(TeamFlow.EditTeam);
                    // },
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
                    // onClick: () => openDeleteModal(),
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
      {showAddMemberModal && (
        <EntitySearchModal
          open={showAddMemberModal}
          openModal={openAddMemberModal}
          closeModal={closeAddMemberModal}
          entityType={EntitySearchModalType.User}
          entityRenderer={(data: IGetUser) => {
            return (
              <div className="flex space-x-4 w-full">
                <Avatar
                  name={data?.fullName || 'U'}
                  size={32}
                  image={data?.profileImage?.original}
                />
                <div className="flex space-x-6 w-full">
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-neutral-900">
                        {data?.fullName}
                      </div>
                      {/* <div className="flex space-x-[14px] items-center">
                        <div className="flex space-x-1 items-start">
                          <Icon name="briefcase" size={16} />
                          <div className="text-xs font-normal text-neutral-500">
                            {'Chief Financial officer'}
                          </div>
                        </div>

                        <div className="w-1 h-1 bg-neutral-500 rounded-full" />

                        <div className="flex space-x-1 items-start">
                          <Icon name="location" size={16} />
                          <div className="text-xs font-normal text-neutral-500">
                            {'New York, US.'}
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <div className="text-xs font-normal text-neutral-500">
                      {data?.primaryEmail}
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
          onSubmit={(userIds: string[]) => {
            addTeamMemberMutation.mutate({ userIds: userIds });
            closeAddMemberModal();
          }}
          title="Add Members"
          submitButtonText="Add Members"
          onCancel={closeAddMemberModal}
          cancelButtonText="Cancel"
        />
      )}
    </>
  );
};

export default TeamDetail;
