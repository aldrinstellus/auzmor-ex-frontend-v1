import React, { useMemo, useState } from 'react';
import _ from 'lodash';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import useHover from 'hooks/useHover';
import Button, { Variant } from 'components/Button';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { deleteUser } from 'queries/users';
import ConfirmationBox from 'components/ConfirmationBox';
import queryClient from 'utils/queryClient';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

export interface IUserCardProps {
  id: string;
  role: string;
  fullName: string;
  image?: string;
  designation?: string;
  department?: string;
  location?: string;
  active?: boolean;
  workEmail?: string;
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
  [Status.SUPERADMIN]: '#10B981',
};

const UserCard: React.FC<IUserCardProps> = ({
  id,
  role,
  fullName,
  image,
  designation,
  department,
  location,
  active,
  workEmail,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isHovered, hoverEvents] = useHover();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteUserMutation = useMutation({
    mutationKey: ['delete-user', id],
    mutationFn: deleteUser,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables, context) => {
      setShowDeleteModal(false);
      alert('Successfully Deleted');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const hoverStyle = useMemo(
    () =>
      clsx(
        {
          'relative w-[234px] border-solid border border-neutral-200 flex flex-col items-center justify-center p-6 bg-white':
            true,
        },
        {
          'z-10 shadow-xl visible': isHovered,
        },
        {
          'mb-0 z-0': !isHovered,
        },
      ),
    [isHovered],
  );

  return (
    <div
      {...hoverEvents}
      className="cursor-pointer"
      onClick={() => {
        if (id === user?.id) {
          return navigate('/profile');
        }
        return navigate(`/users/${id}`);
      }}
    >
      <Card className={`${hoverStyle}`}>
        <div
          style={{ backgroundColor: statusColorMap[role] }}
          className="absolute top-0 left-0 text-white rounded-tl-[12px] rounded-br-[12px] px-3 py-1 text-xs font-medium"
        >
          {role}
        </div>
        <div className="my-6 flex flex-col items-center">
          <Avatar size={80} name={fullName} image={image} active={active} />
          <div className="mt-1 truncate text-neutral-900 text-base font-bold">
            {_.truncate(fullName, {
              length: 24,
              separator: ' ',
            })}
          </div>
          <div className="mt-1 truncate text-neutral-900 text-xs font-normal">
            {designation || role}
          </div>
          <div className="flex justify-center items-center px-3 py-1 mt-2 rounded-xl">
            <div></div>
            <div className="text-neutral-900 text-xxs font-medium truncate">
              {department}
            </div>
          </div>
          <div className="flex space-x-[6px] mt-3">
            <div></div>
            <div className="text-neutral-500 text-xs font-normal truncate">
              {location}
            </div>
          </div>
        </div>
        {isHovered && (
          <div className="flex justify-between items-center mt-4 space-x-4">
            <div className="rounded-7xl border border-solid border-neutral-200">
              <IconButton
                icon="draft"
                variant={IconVariant.Secondary}
                size={IconSize.Medium}
                className="rounded-7xl"
                onClick={() => {
                  if (user?.id === id) {
                    navigate('/profile', { state: { userId: id } });
                  } else navigate(`/users/${id}`);
                }}
              />
            </div>
            <div className="rounded-7xl border border-solid border-neutral-200">
              <IconButton
                icon="slack"
                variant={IconVariant.Secondary}
                size={IconSize.Medium}
                className="rounded-7xl"
              />
            </div>
          </div>
        )}
      </Card>

      <ConfirmationBox
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User?"
        description={
          <span>
            Are you sure you want to delete this member?
            <br /> This cannot be undone.
          </span>
        }
        success={{
          label: 'Delete',
          className: 'bg-red-500 text-white ',
          onSubmit: () => {
            deleteUserMutation.mutate(id);
          },
        }}
        discard={{
          label: 'cancel',
          className: 'text-neutral-900 bg-white ',
          onCancel: () => {
            setShowDeleteModal(false);
          },
        }}
      />
    </div>
  );
};

export default UserCard;
