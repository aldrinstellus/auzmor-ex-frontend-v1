import React, { useState } from 'react';
import _ from 'lodash';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import useHover from 'hooks/useHover';
import useRole from 'hooks/useRole';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import { UserStatus, useResendInvitation } from 'queries/users';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { twConfig } from 'utils/misc';
import { PRIMARY_COLOR, TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import useModal from 'hooks/useModal';
import DeletePeople from '../DeleteModals/People';

export interface IPeopleCardProps {
  id: string;
  role: string;
  fullName: string;
  image?: string;
  designation?: string;
  department?: string;
  location?: string;
  active?: boolean;
  workEmail?: string;
  status?: string;
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
  [Status.SUPERADMIN]: PRIMARY_COLOR,
};

const PeopleCard: React.FC<IPeopleCardProps> = ({
  id,
  role,
  fullName,
  image,
  designation,
  department,
  location,
  active,
  status,
  workEmail,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const [isHovered, eventHandlers] = useHover();
  const [open, openModal, closeModal] = useModal();
  const resendInviteMutation = useResendInvitation();

  const _options = [];

  if ([UserStatus.Invited, UserStatus.Created].includes(status as any)) {
    _options.push({
      icon: 'redo',
      label: 'Resend Invite',
      dataTestId: 'people-card-ellipsis-resend-invite',
      onClick: () => {
        toast(<SuccessToast content="Invitation has been sent" />, {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.primary['500']}
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
      },
    });
  }

  if (id !== user?.id) {
    _options.push({
      icon: 'userRemove',
      label: 'Remove',
      dataTestId: 'people-card-ellipsis-remove-user',
      onClick: openModal,
    });
  }

  return (
    <div
      className="cursor-pointer"
      data-testid="people-card"
      {...eventHandlers}
    >
      <Card
        shadowOnHover
        className="relative w-[230px] border-solid border border-neutral-200 flex flex-col items-center justify-center p-6 bg-white"
      >
        {isAdmin && isHovered && _options.length > 0 && (
          <PopupMenu
            triggerNode={
              <div className="cursor-pointer">
                <Icon
                  name="dotsVertical"
                  stroke="#000"
                  className="absolute top-2 right-2"
                  hover={false}
                  dataTestId="people-card-ellipsis"
                />
              </div>
            }
            menuItems={_options}
            className="right-0 top-8"
          />
        )}
        <div
          style={{
            backgroundColor: [
              UserStatus.Invited,
              UserStatus.Created,
              UserStatus.Attempted,
            ].includes(status as any)
              ? '#EA580C'
              : statusColorMap[role],
          }}
          className="absolute top-0 left-0 text-white rounded-tl-[12px] rounded-br-[12px] px-3 py-1 text-xs font-medium"
          data-testid={`people-card-role-${role}`}
        >
          {[
            UserStatus.Invited,
            UserStatus.Created,
            UserStatus.Attempted,
          ].includes(status as any)
            ? 'Pending'
            : role}
        </div>
        <div
          className="my-6 flex flex-col items-center"
          onClick={() => {
            if (id === user?.id) {
              return navigate('/profile');
            }
            return navigate(`/users/${id}`);
          }}
        >
          <Avatar
            size={80}
            name={fullName}
            image={image}
            active={active}
            dataTestId="people-card-profile-pic"
            showActiveIndicator
          />
          <div
            className="mt-1 truncate text-neutral-900 text-base font-bold"
            data-testid={`people-card-name-${fullName}`}
          >
            {_.truncate(fullName, {
              length: 24,
              separator: ' ',
            })}
          </div>
          <div
            className="mt-1 truncate text-neutral-900 text-xs font-normal"
            data-testid={`people-card-title-${designation || role}`}
          >
            {designation || role}
          </div>
          <div
            className="flex justify-center items-center px-3 py-1 mt-2 rounded-xl"
            data-testid={`people-card-department-${department}`}
          >
            <div></div>
            <div className="text-neutral-900 text-xxs font-medium truncate">
              {department}
            </div>
          </div>
          <div className="flex space-x-[6px] mt-3">
            <div></div>
            <div
              className="text-neutral-500 text-xs font-normal truncate"
              data-testid={`people-card-location-${location}`}
            >
              {location}
            </div>
          </div>
        </div>
        {/* {isHovered && (
          <div className="">
            <div className="flex justify-between items-center mt-0 space-x-4">
              <div className="rounded-7xl border border-solid border-neutral-200">
                <IconButton
                  icon="email"
                  variant={IconVariant.Secondary}
                  size={IconSize.Medium}
                  dataTestId="people-card-email"
                />
              </div>
              <div className="rounded-7xl border border-solid border-neutral-200">
                <IconButton
                  icon="slack"
                  variant={IconVariant.Secondary}
                  size={IconSize.Medium}
                  dataTestId="people-card-slack"
                />
              </div>
            </div>
          </div>
        )} */}
      </Card>
      <DeletePeople
        open={open}
        openModal={openModal}
        closeModal={closeModal}
        userId={id}
      />
    </div>
  );
};

export default PeopleCard;
