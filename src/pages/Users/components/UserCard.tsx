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
import Icon from 'components/Icon';

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
          'w-[234px] h-[234px] border-solid border border-neutral-200 flex flex-col items-center justify-center p-6 bg-white relative':
            true,
        },
        {
          '-mb-6 transition-all duration-900 h-72 z-10 shadow-xl ': isHovered,
        },
        {
          'z-0': !isHovered,
        },
      ),
    [isHovered],
  );

  return (
    <div {...hoverEvents}>
      <Card className={`${hoverStyle}`}>
        <div
          style={{ backgroundColor: statusColorMap[role] }}
          className="absolute top-0 left-0 text-white rounded-tl-[12px] rounded-br-[12px] px-3 py-1 text-xs font-medium"
        >
          {role}
        </div>
        <div className="my-6 flex flex-col items-center">
          <Avatar
            size={80}
            name={fullName}
            image={
              image ||
              'https://preview.redd.it/shuntaro-chishiya-from-alice-in-borderland-made-by-me-v0-o9uf994qpaba1.jpg?width=640&crop=smart&auto=webp&s=5ba21f65920faeae15b7c53eb444d524f7a5b976'
            }
            active={active}
          />
          <div className="mt-1 truncate text-neutral-900 text-base font-bold">
            {_.truncate(fullName, {
              length: 24,
              separator: ' ',
            })}
          </div>
          <div className="mt-1 truncate text-neutral-900 text-xs font-normal">
            {designation || role}
          </div>
          <div className="flex justify-center items-center px-3 py-1 mt-2 bg-orange-100 rounded-xl">
            <div></div>
            <div className="text-neutral-900 text-xxs font-medium truncate">
              {department || 'Sales'}
            </div>
          </div>
          <div className="flex space-x-[6px] mt-3">
            <div></div>
            <div className="text-neutral-500 text-xs font-normal truncate">
              {location || 'Mumbai'}
            </div>
          </div>
          {/* {isHovered && (
            <div>
              <div>I</div>
              <div>O</div>
            </div>
          )} */}
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
