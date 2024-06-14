import Avatar from 'components/Avatar';
import Card from 'components/Card';
import useHover from 'hooks/useHover';
import useRole from 'hooks/useRole';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import Icon from 'components/Icon';
import {
  IGetUser,
  UserStatus,
  updateRoleToAdmin,
  // updateStatus,
  useResendInvitation,
} from 'queries/users';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import {
  getEditSection,
  getProfileImage,
  isNewEntity,
  titleCase,
  twConfig,
} from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
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

export interface IPeopleCardProps {
  userData: IGetUser;
  teamId?: string;
  teamMemberId?: string;
  isTeamPeople?: boolean;
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
}) => {
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
  const [openReactivate, openReactivateModal, closeReactivateModal] =
    useModal();
  const [openDeactivate, openDeactivateModal, closeDeactivateModal] =
    useModal();

  const resendInviteMutation = useResendInvitation();
  // const updateUserStatusMutation = useMutation({
  //   mutationFn: updateStatus,
  //   mutationKey: ['update-user-status'],
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['users'] });
  //     toast(
  //       <SuccessToast
  //         content={`User has been ${
  //           (status as any) === UserStatus.Inactive
  //             ? 'reactivated'
  //             : 'deactivated'
  //         }`}
  //       />,
  //       {
  //         closeButton: (
  //           <Icon
  //             name="closeCircleOutline"
  //             color="text-primary-500"
  //             size={20}
  //           />
  //         ),
  //         style: {
  //           border: `1px solid ${twConfig.theme.colors.primary['300']}`,
  //           borderRadius: '6px',
  //           display: 'flex',
  //           alignItems: 'center',
  //         },
  //         autoClose: TOAST_AUTOCLOSE_TIME,
  //         transition: slideInAndOutTop,
  //         theme: 'dark',
  //       },
  //     );
  //   },
  // });

  const updateUserRoleMutation = useMutation({
    mutationFn: updateRoleToAdmin,
    mutationKey: ['update-user-role'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast(<SuccessToast content={`User role has been updated to admin`} />, {
        closeButton: (
          <Icon name="closeCircleOutline" color="text-primary-500" size={20} />
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
      });
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
          Pending
        </div>
      );
    }
    if (isNewEntity(createdAt)) {
      return (
        <div
          className={`${rightChipStyle} bg-primary-100 text-primary-600`}
          data-testid={`member-badge`}
        >
          New joinee
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
          {titleCase(role || '')}
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
  const departmentText = department?.name ? departmentName : 'Not specified';
  const workLocationText = workLocation?.name || 'Not specified';
  const workLocationColor = workLocation?.name
    ? 'text-neutral-900'
    : 'text-neutral-300';

  return (
    <div
      className="cursor-pointer w-fit"
      data-testid="people-card"
      {...eventHandlers}
    >
      <Card
        shadowOnHover
        className={`relative  ${
          isLxp ? 'h-[190px] w-[190px] ' : 'h-[244px] w-[233px]'
        } border-solid border rounded-9xl border-neutral-200 bg-white`}
      >
        {!isLxp ? (
          <UserProfileDropdown
            id={id}
            loggedInUserId={user?.id}
            role={role || ''}
            status={status}
            isHovered={isHovered}
            onDeleteClick={openDeleteModal}
            isTeamPeople={isTeamPeople}
            onEditClick={() =>
              navigate(
                `/users/${id}?edit=${getEditSection(id, user?.id, isAdmin)}`,
              )
            }
            onReactivateClick={openReactivateModal}
            onPromoteClick={() => updateUserRoleMutation.mutate({ id })}
            onDeactivateClick={openDeactivateModal}
            onResendInviteClick={() => {
              toast(<SuccessToast content="Invitation has been sent" />, {
                closeButton: (
                  <Icon
                    name="closeCircleOutline"
                    color="text-primary-500"
                    size={20}
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
              });
              resendInviteMutation.mutate(id);
            }}
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
        ) : null}

        {status === UserStatus.Inactive ? (
          <div
            className="absolute top-0 text-xxs text-[#737373] font-medium py-1 bg-[#F5F5F5] w-full justify-center align-center rounded-t-9xl flex"
            data-testid="usercard-deactivate-banner"
          >
            <Icon
              name="forbidden"
              color="text-neutral-500"
              size={16}
              className="mr-1"
            ></Icon>
            Deactivated Account
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
          className="flex flex-col gap-4 items-center z-10 py-6 px-4 justify-between h-full"
          onClick={() => {
            if (isLxp) {
              return null;
            }
            if (id === user?.id) {
              return navigate('/profile');
            }
            return navigate(`/users/${id}`);
          }}
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
                <div className="text-neutral-900 text-xs font-normal line-clamp-1 truncate">
                  {designation?.name.length <= 22
                    ? designation?.name.substring(0, 22)
                    : designation?.name.substring(0, 22) + '..'}
                </div>
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
                <div
                  className={`text-xs font-normal truncate ${departmentColor}`}
                >
                  {departmentText}
                </div>
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
