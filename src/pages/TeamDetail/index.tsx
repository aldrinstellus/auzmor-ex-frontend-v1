import Button from 'components/Button';
import Icon from 'components/Icon';
import Card from 'components/Card';
import EntitySearchModal, {
  EntitySearchModalType,
} from 'components/EntitySearchModal';
import Tooltip from 'components/Tooltip';
import { IGetUser } from 'interfaces';
import Avatar from 'components/Avatar';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { useMutation } from '@tanstack/react-query';
import { getFullName, getProfileImage } from 'utils/misc';
import queryClient from 'utils/queryClient';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import useModal from 'hooks/useModal';
import People from 'pages/Users/components/People';
import {
  Navigate,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import TeamModal from 'pages/Users/components/TeamModal';
import { TeamFlow, TeamTab } from 'pages/Users/components/Teams';
import TeamDetailSkeleton from './components/TeamDetailSkeleton';
import { FC, useEffect } from 'react';
import useRole from 'hooks/useRole';
import TeamOptions from 'components/TeamOptions';
import useProduct from 'hooks/useProduct';
import { usePageTitle } from 'hooks/usePageTitle';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigation';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

export interface ITeamMemberProps {}

const TeamDetail: FC<ITeamMemberProps> = () => {
  const { t } = useTranslation('team');
  usePageTitle('teamProfile');

  const params = useParams();
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const { prevRoute } = state || {};
  const navigate = useNavigate();
  const { teamId: id } = params;
  const { isAdmin } = useRole();
  const { isLxp } = useProduct();
  const { getApi } = usePermissions();

  const [showTeamModal, openTeamModal, closeTeamModal] = useModal(
    undefined,
    false,
  );
  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(searchParams.get('addMembers') === 'true', false);

  const useInfiniteMembers = getApi(ApiEnum.GetMembers);

  const useSingleTeam = getApi(ApiEnum.GetTeam);
  const teamDetail = useSingleTeam(id || '');

  const data = teamDetail?.data?.data?.result.data;

  const addTeamMember = getApi(ApiEnum.AddTeamMembers);
  const addTeamMemberMutation = useMutation({
    mutationKey: ['add-team-member', id],
    mutationFn: (payload: any) => {
      return addTeamMember(id || '', payload);
    },
    onError: () =>
      failureToastConfig({
        content: t('errorAddingMembers'),
        dataTestId: 'team-create-error-toaster',
      }),
    onSuccess: (data: any) => {
      const membersAddedCount =
        data?.result?.data?.length - (data.teamMembers || 0);
      const message =
        membersAddedCount > 1
          ? t('multipleMembersAdded', { count: membersAddedCount })
          : membersAddedCount === 1
          ? t('singleMemberAdded')
          : t('membersExist');
      successToastConfig({
        content: message,
        dataTestId: 'team-detail-toaster',
      });
      queryClient.invalidateQueries(['search-team-members'], { exact: false });
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

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('addMembers');
    history.replaceState({}, '', url);
  }, []);

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
                onKeyUp={(e) => (e.code === 'Enter' ? handleGoBack() : '')}
                role="button"
                title={
                  prevRoute === TeamTab.MyTeams
                    ? t('goBack.myTeams')
                    : t('goBack.allTeams')
                }
                tabIndex={0}
                data-testid="my-team-back"
              >
                <Icon name="linearLeftArrowOutline" size={20} />
                <div className="text-base font-bold text-neutral-900">
                  {prevRoute === TeamTab.MyTeams
                    ? t('goBackText.myTeams')
                    : t('goBackText.allTeams')}
                </div>
              </div>
              {isAdmin && !isLxp ? (
                <Tooltip
                  tooltipContent={
                    <div
                      className="space-y-[6px] w-[231px]"
                      data-testid="team-tooltip"
                    >
                      <div className="text-sm font-medium text-white">
                        {t('inviteMembers')}
                      </div>
                      <div className="text-sm font-normal text-neutral-400">
                        {t('inviteMembersTooltip')}
                      </div>
                    </div>
                  }
                  tooltipPosition="left"
                >
                  <Button
                    className="flex space-x-1 px-6 py-[10px] rounded-[24px]"
                    label={t('addMembersButton')}
                    leftIcon="add"
                    leftIconClassName="!text-white"
                    leftIconSize={20}
                    onClick={openAddMemberModal}
                    dataTestId="team-add-members"
                  />
                </Tooltip>
              ) : null}
            </div>
            <div className="w-full bg-purple-50 border-1 border-purple-200 py-4 pl-8 pr-16 flex justify-between">
              <div className="flex flex-col text-neutral-900 space-y-4">
                <h1
                  className="text-2xl font-bold"
                  data-testid="team-details-name"
                  tabIndex={0}
                  role="contentinfo"
                >
                  {data.name}
                </h1>
                {!!data?.description && (
                  <div
                    className="text-xs font-normal"
                    data-testid="team-details-description"
                    tabIndex={0}
                  >
                    {data.description}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-20 ">
                {!isLxp ? (
                  <div
                    className="flex flex-col space-y-2"
                    role="contentinfo"
                    title={t('teamType', {
                      type: data.category?.name || t('category'),
                    })}
                    tabIndex={0}
                  >
                    <div className="text-sm font-semibold text-purple-700">
                      {t('teamTypeLabel')}
                    </div>
                    <div
                      className="text-xl font-semibold"
                      data-testid="team-details-category"
                    >
                      {data.category?.name || t('category')}
                    </div>
                  </div>
                ) : null}
                {isLxp ? (
                  <div
                    className="flex flex-col space-y-2"
                    tabIndex={0}
                    role="contentinfo"
                  >
                    <div className="flex items-center text-sm font-semibold text-purple-700">
                      <span
                        className="text-xl font-semibold text-neutral-900"
                        data-testid="team-details-people-count"
                      >
                        {t('membersCount', { count: data.totalMembers || 0 })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col space-y-2"
                    tabIndex={0}
                    role="contentinfo"
                  >
                    <div className="text-sm font-semibold text-purple-700">
                      {t('peopleCountLabel')}
                    </div>
                    <div
                      className="text-xl font-semibold"
                      data-testid="team-details-people-count"
                    >
                      {data.totalMembers || 0}
                    </div>
                  </div>
                )}
                {!isLxp ? (
                  <div className="relative">
                    {isAdmin && (
                      <TeamOptions
                        id={id || ''}
                        onEdit={openTeamModal}
                        triggerIcon="setting"
                        dataTestId="team-settings"
                        dataTestIdPrefix="team-settings"
                        isDetailPage
                        className="absolute top-5 -right-5 w-44"
                        iconColor="text-neutral-900"
                      />
                    )}
                  </div>
                ) : null}
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
        />
      )}
      {showAddMemberModal && (
        <EntitySearchModal
          open={showAddMemberModal}
          openModal={openAddMemberModal}
          closeModal={closeAddMemberModal}
          entityType={EntitySearchModalType.User}
          dataTestId="add-members"
          fetchUsers={useInfiniteMembers}
          usersQueryParams={{ entityType: 'TEAM', entityId: id }}
          entityRenderer={(data: IGetUser) => {
            return (
              <div className="flex space-x-4 w-full">
                <Avatar
                  name={getFullName(data) || 'U'}
                  size={32}
                  image={getProfileImage(data)}
                  dataTestId="member-profile-pic"
                />
                <div className="flex space-x-6 w-full">
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center">
                      <div
                        className="text-sm font-bold text-neutral-900 whitespace-nowrap line-clamp-1"
                        data-testid="member-name"
                      >
                        {getFullName(data)}
                      </div>
                      <div className="flex space-x-[14px] items-center">
                        {data?.department?.name && (
                          <div className="flex space-x-1 items-start">
                            <Icon name="briefcase" size={16} />
                            <div
                              className="text-xs font-normal text-neutral-500"
                              data-testid="member-department"
                            >
                              {data?.department.name}
                            </div>
                          </div>
                        )}
                        {data?.department && data?.workLocation?.name && (
                          <div className="w-1 h-1 bg-neutral-500 rounded-full" />
                        )}
                        {data?.workLocation?.name && (
                          <div className="flex space-x-1 items-start">
                            <Icon name="location" size={16} />
                            <div
                              className="text-xs font-normal text-neutral-500 whitespace-nowrap"
                              data-testid="member-location"
                            >
                              {data?.workLocation.name}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="text-xs font-normal text-neutral-500"
                        data-testid="member-email"
                      >
                        {data?.primaryEmail}
                      </div>
                      {data?.isPresent && (
                        <div className="text-xs font-semibold text-neutral-500">
                          {t('alreadyMember')}
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
          title={t('addTeamMembersTitle')}
          submitButtonText={t('addMembersButton')}
          onCancel={closeAddMemberModal}
          cancelButtonText={t('cancelButton')}
        />
      )}
    </>
  );
};

export default TeamDetail;
