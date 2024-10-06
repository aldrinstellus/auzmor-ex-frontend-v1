import Avatar from 'components/Avatar';
import Card from 'components/Card';
import useHover from 'hooks/useHover';
import useRole from 'hooks/useRole';
import useNavigate from 'hooks/useNavigation';
import useAuth from 'hooks/useAuth';
import Icon from 'components/Icon';
import { IGetUser, UserRole, UserStatus } from 'interfaces';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import {
  getEditSection,
  getProfileImage,
  isNewEntity,
  titleCase,
  twConfig,
} from 'utils/misc';
import useModal from 'hooks/useModal';
import DeletePeople from '../DeleteModals/People';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import UserProfileDropdown from 'components/UserProfileDropdown';
import DeactivatePeople from '../DeactivateModal/Deactivate';
import ReactivatePeople from '../ReactivateModal/Reactivate';
import clsx from 'clsx';
import RemoveTeamMember from '../DeleteModals/TeamMember';
import { FC } from 'react';
import useProduct from 'hooks/useProduct';
import Truncate from 'components/Truncate';
import { CHANNEL_ROLE, IChannel } from 'stores/channelStore';
import RemoveChannelMember from '../DeleteModals/ChannelMember';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

export interface IPeopleCardProps {
  userData: IGetUser;
  teamId?: string;
  teamMemberId?: string;
  isTeamPeople?: boolean;
  isChannelPeople?: boolean;
  channelId?: string;
  channelData?: IChannel;
  isMember?: boolean;
  isChannelAdmin?: boolean;
  isReadOnly?: boolean;
  showNewJoineeBadge?: boolean;
}

export enum Status {
  ADMIN = 'ADMIN',
  PENDING = 'PENDING',
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
  SUPERADMIN = 'SUPERADMIN',
}

const statusColorMap: Record<string, string> = {
  [Status.ADMIN]: '#3F83F8',
  [Status.PENDING]: '#EA580C',
  [Status.OWNER]: '#171717',
  [Status.MEMBER]: '#c6cc8d',
  [Status.SUPERADMIN]: twConfig.theme.colors.primary['500'],
};

const PeopleCard: FC<IPeopleCardProps> = ({
  userData,
  teamId,
  teamMemberId,
  isTeamPeople,
  isChannelPeople,
  channelId,
  isChannelAdmin,
  isReadOnly = true,
  showNewJoineeBadge = true,
}) => {
  const { getApi } = usePermissions();
  const { t } = useTranslation('profile', { keyPrefix: 'peopleCard' });
  const {
    id,
    role,
    fullName,
    designation,
    status,
    department,
    workLocation,
    workEmail,
    createdAt,
    userId,
  } = userData;

  const { isLxp } = useProduct();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const [isHovered, eventHandlers] = useHover();
  const [openDelete, openDeleteModal, closeDeleteModal] = useModal();
  const [
    openRemoveTeamMember,
    openRemoveTeamMemberModal,
    closeRemoveTeamMemberModal,
  ] = useModal();

  const [
    openRemoveChannelMember,
    openRemoveChannelMemberModal,
    closeRemoveChannelMemberModal,
  ] = useModal();
  const [openReactivate, openReactivateModal, closeReactivateModal] =
    useModal();
  const [openDeactivate, openDeactivateModal, closeDeactivateModal] =
    useModal();

  const useResendInvitation = getApi(ApiEnum.ResendInvitation);
  const resendInviteMutation = useResendInvitation();

  const updateUser = getApi(ApiEnum.UpdateUser);
  const updateUserRoleMutation = useMutation({
    mutationFn: (payload: { id: string; role: UserRole }) =>
      updateUser(payload.id, { role: payload.role }),
    mutationKey: ['update-user-role'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      successToastConfig({ content: t('roleUpdated') });
    },
  });

  const updateChannelMember = getApi(ApiEnum.UpdateChannelMember);
  const updateMemberRoleMutation = useMutation({
    mutationFn: (data: {
      channelId: string;
      memberId: string;
      role: CHANNEL_ROLE;
    }) =>
      updateChannelMember({
        channelId: data.channelId,
        memberId: data.memberId,
        data: { role: data.role },
      }),
    mutationKey: ['update-channel-member-role'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel-members'] });
      successToastConfig({ content: t('roleUpdated') });
    },
  });

  const leftChipStyle = clsx({
    'absolute top-0 left-0 text-white rounded-tl-[12px] rounded-br-[12px] px-3 py-1 text-xxs font-medium':
      true,
  });
  const rightChipStyle = clsx({
    'absolute top-0 right-0 rounded-bl-[12px] rounded-tr-[12px] px-3 py-1 text-xxs font-medium':
      true,
  });

  const RenderRightChip = () => {
    if (
      [UserStatus.Invited, UserStatus.Created, UserStatus.Attempted].includes(
        status as UserStatus,
      )
    ) {
      return (
        <div
          className={`${rightChipStyle} bg-amber-100 text-orange-600`}
          data-testid={`people-card-role-${role}`}
        >
          {t('status.pending')}
        </div>
      );
    }
    if (isNewEntity(createdAt) && showNewJoineeBadge) {
      return (
        <div
          className={`${rightChipStyle} bg-primary-100 text-primary-600`}
          data-testid={`member-badge`}
        >
          {t('status.newJoinee')}
        </div>
      );
    }
    return null;
  };

  const RenderLeftChip = () => {
    if ([Status.ADMIN, Status.SUPERADMIN].includes(role as unknown as Status)) {
      return (
        <div
          style={{
            backgroundColor: statusColorMap[role || ''],
          }}
          className={leftChipStyle}
          data-testid={`people-card-role-${role}`}
        >
          {titleCase(t(`roles.${role?.toLowerCase()}`) || '')}
        </div>
      );
    }

    return null;
  };
  const departmentName =
    department?.name && department?.name.length <= 22
      ? department?.name
      : department?.name?.substring(0, 22) + '..';
  const departmentColor = department?.name
    ? 'text-neutral-900'
    : 'text-neutral-300';
  const departmentText = department?.name ? departmentName : t('notSpecified');
  const workLocationText = workLocation?.name || t('notSpecified');
  const workLocationColor = workLocation?.name
    ? 'text-neutral-900'
    : 'text-neutral-300';

  const handleProfileClick = () => {
    if (isLxp) {
      return null;
    }
    if (id === user?.id) {
      return navigate('/profile');
    }
    return navigate(`/users/${id}`);
  };
  return (
    <div
      className="cursor-pointer w-fit"
      data-testid="people-card"
      {...eventHandlers}
    >
      <Card
        shadowOnHover
        className={`relative w-[190px] ${
          isLxp ? 'h-[190px] w-[189px] ' : 'h-[244px] w-[233px]'
        } border-solid border rounded-9xl border-neutral-200 bg-white focus-within:shadow-xl`}
      >
        {(!isLxp || (isChannelPeople && isReadOnly)) && (
          <UserProfileDropdown
            isChannelAdmin={isChannelAdmin}
            id={id}
            userId={userId}
            loggedInUserId={user?.id}
            role={role || ''}
            status={status}
            isHovered={isHovered}
            onDeleteClick={openDeleteModal}
            isTeamPeople={isTeamPeople}
            isChannelPeople={isChannelPeople}
            onEditClick={() =>
              navigate(
                `/users/${id}?edit=${getEditSection(id, user?.id, isAdmin)}`,
              )
            }
            onReactivateClick={openReactivateModal}
            onPromoteClick={() => {
              isChannelPeople
                ? updateMemberRoleMutation.mutate({
                    memberId: id,
                    channelId: channelId!,
                    role: CHANNEL_ROLE.Admin,
                  })
                : updateUserRoleMutation.mutate({ id, role: UserRole.Admin });
            }}
            onDeactivateClick={openDeactivateModal}
            onResendInviteClick={() => {
              successToastConfig({ content: t('invitationSent') });
              resendInviteMutation.mutate(id);
            }}
            onRemoveChannelMember={openRemoveChannelMemberModal}
            onRemoveTeamMember={openRemoveTeamMemberModal}
            triggerNode={
              <div className="cursor-pointer">
                <Icon
                  name="moreOutline"
                  className={`absolute z-10 top-${
                    status === UserStatus.Inactive ? 6 : 2
                  } right-2`}
                  dataTestId="people-card-ellipsis"
                />
              </div>
            }
            showOnHover={true}
            className="right-0 top-8 border border-[#e5e5e5]"
          />
        )}

        {status === UserStatus.Inactive ? (
          <div
            className="absolute top-0 text-xxs text-[#737373] font-medium py-1 bg-[#F5F5F5] w-full justify-center align-center rounded-t-9xl flex"
            data-testid="usercard-deactivate-banner"
            tabIndex={0}
            title={t('deactivatedAccount')}
          >
            <Icon
              name="forbidden"
              color="text-neutral-500"
              size={16}
              className="mr-1"
            ></Icon>
            {t('deactivatedAccount')}
          </div>
        ) : (
          <div
            className={clsx({
              'transition-all': true,
              'opacity-0 z-0': isHovered,
              'opacity-100': !isHovered,
            })}
          >
            <RenderLeftChip />
            <RenderRightChip />
          </div>
        )}

        <div
          className="flex flex-col gap-4 items-center z-10 py-6 px-4 justify-between h-full outline-none"
          onClick={handleProfileClick}
          onKeyUp={(e) => (e.code === 'Enter' ? handleProfileClick() : '')}
          tabIndex={0}
          title={fullName || workEmail}
        >
          <Avatar
            size={80}
            name={fullName || workEmail}
            image={getProfileImage(userData, 'small')}
            active={status === UserStatus.Active}
            dataTestId="people-card-profile-pic"
            showActiveIndicator
            disable={(status as any) === UserStatus.Inactive}
            bgColor={
              (status as any) === UserStatus.Inactive ? '#ffffff' : undefined
            }
          />
          <div className="flex flex-col items-center gap-2 justify-start flex-1 w-full">
            <div className="flex flex-col items-center gap-1 w-full">
              <div
                className="text-neutral-900 text-base font-bold truncate w-full block text-center"
                data-testid={`people-card-name-${fullName || workEmail}`}
              >
                {fullName || workEmail}
              </div>
              {!isLxp && designation?.name && (
                <div
                  className="text-neutral-900 text-xs font-normal line-clamp-1 truncate w-full block text-center"
                  data-testid={`people-card-title-${designation.designationId}`}
                >
                  {designation?.name}
                </div>
              )}
            </div>
            {isLxp && designation?.name && (
              <div
                className="flex justify-center items-center gap-1"
                data-testid={`people-card-title-${designation?.designationId}`}
              >
                <Icon
                  name="briefcase"
                  size={16}
                  hover={false}
                  color="text-neutral-900"
                />
                <Truncate
                  text={designation?.name}
                  className="text-neutral-900 text-xs font-normal max-w-[128px]"
                />
              </div>
            )}
            {isLxp && (userData as any)?.email && (
              <div
                className="flex justify-center items-center gap-1"
                data-testid={`people-card-email-id-${(userData as any)?.email}`}
              >
                <Truncate
                  text={(userData as any)?.email}
                  className="text-neutral-900 text-xs font-normal max-w-[128px]"
                />
              </div>
            )}
            {!isLxp && (
              <div
                className={`flex justify-center items-center px-3 py-[4px] gap-1`}
                data-testid={`people-card-department-${department?.name}`}
              >
                <Icon
                  name="briefcase"
                  size={16}
                  hover={false}
                  color={departmentColor}
                />
                <Truncate
                  text={departmentText}
                  className="text-neutral-900 text-xs font-normal max-w-[128px]"
                />
              </div>
            )}

            {!isLxp && (
              <div className="flex gap-1">
                <Icon
                  name="location"
                  size={16}
                  color={workLocationColor}
                  hover={false}
                />
                <div
                  className={`text-xs font-normal line-clamp-1 ${workLocationColor}`}
                  data-testid={`people-card-location-${workLocation?.name}`}
                >
                  {workLocationText}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      <DeletePeople
        open={openDelete}
        openModal={openDeleteModal}
        closeModal={closeDeleteModal}
        userId={id}
      />
      <RemoveChannelMember
        channelId={channelId}
        open={openRemoveChannelMember}
        openModal={openRemoveChannelMemberModal}
        closeModal={closeRemoveChannelMemberModal}
        userId={id}
      />
      <RemoveTeamMember
        open={openRemoveTeamMember}
        closeModal={closeRemoveTeamMemberModal}
        userId={teamMemberId || ''}
        teamId={teamId || ''}
      />
      <DeactivatePeople
        open={openDeactivate}
        openModal={openDeactivateModal}
        closeModal={closeDeactivateModal}
        userId={id}
      />
      <ReactivatePeople
        open={openReactivate}
        openModal={openReactivateModal}
        closeModal={closeReactivateModal}
        userId={id}
      />
    </div>
  );
};

export default PeopleCard;
