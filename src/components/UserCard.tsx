import React, { useMemo } from 'react';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import useHover from 'hooks/useHover';
import Button, { Variant } from 'components/Button';
import clsx from 'clsx';

export interface IUserCardProps {
  userId: string;
  status: string;
  name?: string;
  image?: string;
  designation?: string;
  department?: string;
  location?: string;
  isActive?: boolean;
  setOpen: (show: boolean) => void;
  setId: (id: string) => void;
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
  userId,
  name = '',
  image,
  designation,
  department,
  location,
  status,
  isActive,
  setOpen,
  setId,
}) => {
  const [isHovered, hoverEvents] = useHover();

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
          <Avatar size={80} name={name} image={image} active={isActive} />
          <div className="mt-0.5 truncate text-neutral-900 text-base font-bold">
            {name}
          </div>
          <div className="mt-1 truncate text-neutral-900 text-xs font-normal">
            {designation}
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
                className="!p-2 !gap-2 !rounded-[8px] !border !border-neutral-200 !border-solid"
              />
              <Button
                variant={Variant.Secondary}
                label={'X'}
                onClick={() => {
                  setOpen(true);
                  setId(userId);
                }}
                className="!p-2 !gap-2 !rounded-[8px] !border !border-neutral-200 !border-solid"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserCard;
