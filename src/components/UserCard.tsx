import React, { useMemo } from 'react';
import { Avatar } from '@auzmorui/component-library.components.avatar';
import { Card } from '@auzmorui/component-library.components.card';
import { useHover } from '@auzmorui/component-library.hooks.use-hover';
import { Button, Variant } from '@auzmorui/component-library.components.button';
import clsx from 'clsx';

export interface IUserCardProps {
  status: string;
  name?: string;
  image?: string;
  designation?: string;
  department?: string;
  location?: string;
  isActive?: boolean;
}

export enum Status {
  Admin = "ADMIN",
  Pending = "PENDING",
  Owner = "OWNER",
}

const statusColorMap: Record<string, string> = {
  [Status.Admin]: "#3F83F8",
  [Status.Pending]: "#EA580C",
  [Status.Owner]: "#171717",
}

const UserCard: React.FC<IUserCardProps> = ({ name = '', image, designation, department, location, status, isActive }) => {

  const [isHovered, hoverEvents] = useHover();

  const hoverStyle = useMemo(() => clsx(
    {
      'w-[234px] border-solid border-1 border-[#e5e5e5] flex flex-col items-center justify-center p-6 mr-6 bg-white relative': true
    },
    {
      '-mb-6 z-10 shadow-xl': isHovered
    },
    {
      'mb-6 z-0': !isHovered
    }
  ), [isHovered])

  return (
    <div {...hoverEvents}>
      <Card className={`${hoverStyle}`}>
        <div
          // style={{ backgroundColor: statusColorMap[status] }}
          className='absolute top-0 left-0 text-white rounded-tl-[12px] bg-black rounded-br-[12px] px-3 py-1 text-xs'>{status}</div>
        <div className='flex flex-col justify-center items-center'>
          <Avatar size={80} name={name} image={image} className="mt-6" active={isActive} />
          <h2 className='mb-1 mt-1 truncate text-neutral-900 text-base font-bold'>{name}</h2>
          <div className='truncate text-neutral-900 text-xs font-normal'>{designation}</div>
          <div className='mb-3 mt-2 bg-primary-300 px-4 rounded-md truncate'>{department}</div>
          <div className='text-neutral-500 text-xs font-normal truncate mb-4'>{location}</div>
          {isHovered ? (<div className='flex justify-between items-center'>
            <Button variant={Variant.Secondary} className='mr-3' label={'O'} />
            <Button variant={Variant.Secondary} className='ml-3' label={'X'} />
          </div>) : (<></>)}
        </div>
      </Card>
    </div>
  );
};

export default UserCard;
