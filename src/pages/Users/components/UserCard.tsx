import React, { useMemo, useState } from 'react';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import useHover from 'hooks/useHover';
import Button, { Variant } from 'components/Button';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { deleteUser } from 'queries/users';
import ConfirmationBox from 'components/ConfirmationBox';
import _ from 'lodash';

import queryClient from 'utils/queryClient';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

export interface IUserCardProps {
  id: string;
  status: string;
  fullName: string;
  image?: string;
  designation?: string;
  department?: string;
  location?: string;
  active?: boolean;
  workEmail?: string;
}

export enum Status {
  Admin = 'Admin',
  Pending = 'Pending',
  Owner = 'Owner',
}

const statusColorMap: Record<string, string> = {
  [Status.Admin]: '#3F83F8',
  [Status.Pending]: '#EA580C',
  [Status.Owner]: '#171717',
};

const UserCard: React.FC<IUserCardProps> = ({
  id,
  status,
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
          'w-[244px] border-solid border border-neutral-200 flex flex-col items-center justify-center p-6 bg-white relative':
            true,
        },
        {
          '-mb-6 z-10 shadow-xl ': isHovered,
        },
        {
          'mb-8 z-0': !isHovered,
        },
      ),
    [isHovered],
  );

  return (
    <div {...hoverEvents}>
      <Card className={hoverStyle}>
        <div
          style={{ backgroundColor: statusColorMap[status] }}
          className="absolute top-0 left-0 text-white rounded-tl-[12px] rounded-br-[12px] px-3 py-1 text-xs font-medium"
        >
          {status}
        </div>
        <div className="flex flex-col justify-center items-center">
          <Avatar size={80} name={fullName} image={image} active={active} />
          <div className="mt-0.5 truncate text-neutral-900 text-base font-bold">
            {_.truncate(fullName, {
              length: 24,
              separator: ' ',
            })}
          </div>
          <div className="mt-1 truncate text-neutral-900 text-xs font-normal">
            {designation ? designation : workEmail}
          </div>
          <div className="mt-2 bg-orange-100 px-4 rounded-md truncate">
            {department}
          </div>
          <div className="mt-3 text-neutral-500 text-xs font-normal truncate">
            {location}
          </div>
          {isHovered && (
            <div className="flex justify-between items-center mt-4 space-x-3">
              <Button
                variant={Variant.Secondary}
                label={'O'}
                onClick={() => {
                  if (user?.id === id) {
                    navigate('/profile', { state: { userId: id } });
                  } else navigate(`/users/${id}`);
                }}
                className="!p-2 !gap-2 !rounded-[8px] !border !border-neutral-200 !border-solid"
              />
              <Button
                variant={Variant.Secondary}
                label={'X'}
                onClick={() => {
                  setShowDeleteModal(true);
                }}
                className="!p-2 !gap-2 !rounded-[8px] !border !border-neutral-200 !border-solid"
              />
            </div>
          )}
        </div>
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
