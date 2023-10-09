import Button from 'components/Button';
import Icon from 'components/Icon';
import Card from 'components/Card';
import EntitySearchModal, {
  EntitySearchModalType,
} from 'components/EntitySearchModal';
import Tooltip from 'components/Tooltip';
import PopupMenu from 'components/PopupMenu';
import { IGetUser } from 'queries/users';
import Avatar from 'components/Avatar';
import {
  addTeamMember,
  useInfiniteMembers,
  useSingleTeam,
} from 'queries/teams';
import FailureToast from 'components/Toast/variants/FailureToast';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { getFullName, getProfileImage, twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import useModal from 'hooks/useModal';
import People from 'pages/Users/components/People';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import TeamModal from 'pages/Users/components/TeamModal';
import { TeamFlow, TeamTab } from 'pages/Users/components/Teams';
import DeleteTeam from 'pages/Users/components/DeleteModals/Team';
import TeamDetailSkeleton from './components/TeamDetailSkeleton';
import { FC } from 'react';

export interface ITeamMemberProps {}

const TeamDetail: FC<ITeamMemberProps> = () => {
  const params = useParams();
  const { state } = useLocation();
  const { prevRoute } = state || {};
  const navigate = useNavigate();
  const { teamId: id } = params;

  const [showTeamModal, openTeamModal, closeTeamModal] = useModal(
    undefined,
    false,
  );
  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);
  const [showDeleteModal, openDeleteModal, closeDeleteModal] = useModal(false);

  const teamDetail = useSingleTeam(id || '');

  const data = teamDetail?.data?.data?.result.data;

  const addTeamMemberMutation = useMutation({
    mutationKey: ['add-team-member', id],
    mutationFn: (payload: any) => {
      return addTeamMember(id || '', payload);
    },
    onError: (_error: any) => {
      toast(
        <FailureToast
          content={`Error Adding Team Members`}
          dataTestId="team-create-error-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
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
      const membersAddedCount =
        data?.result?.data?.length - (data.teamMembers || 0);
      const message =
        membersAddedCount > 1
          ? `${membersAddedCount} members have been added to the team`
          : membersAddedCount === 1
          ? `${membersAddedCount} member has been added to the team`
          : 'Members already exists in the team';
      toast(
        <SuccessToast content={message} dataTestId="team-detail-toaster" />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color="text-white"
              size={20}
              dataTestId="team-detail-toaster-close"
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
      queryClient.invalidateQueries(['team-members']);
      queryClient.invalidateQueries(['team', id]);
      queryClient.invalidateQueries(['teams'], { exact: false });
    },
  });

  const handleGoBack = () => {
    if (prevRoute) {
      navigate(`/teams?tab=${prevRoute}`);
    } else {
      navigate(`/teams`);
    }
  };

  if (!teamDetail?.isLoading && !data) {
    return <Navigate to="/404" />;
  }

  return (
    <>
      <Card className="py-8 space-y-6">
        {teamDetail?.isLoading ? (
          <TeamDetailSkeleton />
        ) : (
          <>
            <div className="flex justify-between items-center px-8">
              <div
                className="flex space-x-2"
                onClick={handleGoBack}
                data-testid="my-team-back"
              >
                <Icon name="linearLeftArrowOutline" size={20} />
                <div className="text-base font-bold text-neutral-900">
                  {prevRoute === TeamTab.MyTeams ? 'My Team' : 'All Team'}
                </div>
              </div>
              <Tooltip
                tooltipContent={
                  <div
                    className="space-y-[6px] w-[231px]"
                    data-testid="team-tooltip"
                  >
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
                  className="flex space-x-1 px-6 py-[10px] rounded-[24px]"
                  label="Add Members"
                  leftIcon="add"
                  leftIconClassName="!text-white"
                  leftIconSize={20}
                  onClick={openAddMemberModal}
                  dataTestId="team-add-members"
                />
              </Tooltip>
            </div>
            <div className="w-full bg-purple-50 border-1 border-purple-200 py-4 pl-8 pr-16 flex justify-between">
              <div className="flex flex-col text-neutral-900 space-y-4">
                <div
                  className="text-2xl font-bold"
                  data-testid="team-details-name"
                >
                  {data.name}
                </div>
                <div
                  className="text-xs font-normal"
                  data-testid="team-details-description"
                >
                  {data.description}
                </div>
              </div>

              <div className="flex items-center space-x-20 ">
                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-semibold text-purple-700">
                    Team type
                  </div>
                  <div
                    className="text-xl font-semibold"
                    data-testid="team-details-category"
                  >
                    {data.category?.name || 'category'}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-semibold text-purple-700">
                    No. of people
                  </div>
                  <div
                    className="text-xl font-semibold"
                    data-testid="tem-details-people-count"
                  >
                    {data.totalMembers || 0}
                  </div>
                </div>
                <div className="relative">
                  <PopupMenu
                    triggerNode={
                      <div className="cursor-pointer">
                        <Icon
                          name="setting"
                          color="text-neutral-900"
                          dataTestId="team-settings"
                        />
                      </div>
                    }
                    menuItems={[
                      {
                        icon: 'edit',
                        label: 'Edit',
                        onClick: () => openTeamModal(),
                        dataTestId: 'team-setting-edit',
                        permissions: [''],
                      },
                      {
                        icon: 'shareForwardOutline',
                        label: 'Share',
                        dataTestId: 'team-setting-share',
                        permissions: [''],
                      },
                      {
                        icon: 'cancel',
                        label: 'Remove',
                        onClick: () => openDeleteModal(),
                        dataTestId: 'team-setting-remove',
                        labelClassName: 'text-red-500',
                        iconClassName: '!text-red-500',
                        permissions: [''],
                      },
                    ]}
                    className="absolute top-10 -right-5 w-44"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        <div className="px-8">
          <People
            showModal={false}
            openModal={openAddMemberModal}
            closeModal={closeAddMemberModal}
            isTeamPeople
            teamId={id}
          />
        </div>
      </Card>
      {showTeamModal && (
        <TeamModal
          open={showTeamModal}
          closeModal={closeTeamModal}
          teamFlowMode={TeamFlow.EditTeam}
          setTeamFlow={() => {}}
          team={data}
          openAddMemberModal={openAddMemberModal}
        />
      )}
      {showAddMemberModal && (
        <EntitySearchModal
          open={showAddMemberModal}
          openModal={openAddMemberModal}
          closeModal={closeAddMemberModal}
          entityType={EntitySearchModalType.User}
          fetchUsers={useInfiniteMembers}
          usersQueryParams={{ entityType: 'TEAM', entityId: data.id }}
          entityRenderer={(data: IGetUser) => {
            return (
              <div className="flex space-x-4 w-full">
                <Avatar
                  name={getFullName(data) || 'U'}
                  size={32}
                  image={getProfileImage(data)}
                />
                <div className="flex space-x-6 w-full">
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-neutral-900 whitespace-nowrap line-clamp-1">
                        {getFullName(data)}
                      </div>
                      <div className="flex space-x-[14px] items-center">
                        {data?.designation?.name && (
                          <div className="flex space-x-1 items-start">
                            <Icon name="briefcase" size={16} />
                            <div className="text-xs font-normal text-neutral-500">
                              {data?.designation.name}
                            </div>
                          </div>
                        )}
                        {data?.designation && data?.workLocation?.name && (
                          <div className="w-1 h-1 bg-neutral-500 rounded-full" />
                        )}
                        {data?.workLocation?.name && (
                          <div className="flex space-x-1 items-start">
                            <Icon name="location" size={16} />
                            <div className="text-xs font-normal text-neutral-500 whitespace-nowrap">
                              {data?.workLocation.name}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="text-xs font-normal text-neutral-500">
                        {data?.primaryEmail}
                      </div>
                      {data?.isPresent && (
                        <div className="text-xs font-semibold text-neutral-500">
                          Already a member
                        </div>
                      )}
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
          disableKey="isPresent"
          title="Add team members"
          submitButtonText="Add Members"
          onCancel={closeAddMemberModal}
          cancelButtonText="Cancel"
        />
      )}
      <DeleteTeam
        open={showDeleteModal}
        closeModal={closeDeleteModal}
        isDetailPage
        teamId={id || ''}
      />
    </>
  );
};

export default TeamDetail;
