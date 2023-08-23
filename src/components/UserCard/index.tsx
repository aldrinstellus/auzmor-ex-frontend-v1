import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Divider from 'components/Divider';
import { getUser, useSingleUser } from 'queries/users';
import React from 'react';

interface IUserCard {}

const UserCard: React.FC = () => {
  return (
    <div className="flex flex-col shadow-xl rounded-9xl bg-white min-w-[600px] overflow-hidden">
      <div className="flex"></div>
      <div className="flex flex-col px-6 py-4">
        <div className="flex">
          <div className="mr-4">
            <Avatar size={144} />
          </div>
          <div className="flex flex-col py-4">
            <div className="text-lg font-bold text-neutral-900 truncate mb-2">
              Ava James
            </div>
            <div className="text-sm font-normal text-neutral-500 truncate mb-2">
              Jr. Marketing Executive
            </div>
            <div className="flex items-center mb-2">
              {/* <div><Icon /></div> */}
              <div className="text-xs font-normal text-neutral-500 truncate">
                Marketing
              </div>
            </div>
            <div className="flex items-center mb-2">
              {/* <div><Icon /></div> */}
              <div className="text-xs font-normal text-neutral-500 truncate">
                San Francisco
              </div>
            </div>
          </div>
        </div>
        <Divider className="mt-4 mb-5" />
        <div className="flex">
          <div className="flex flex-col w-1/2">
            <div className="text-sm text-neutral-500 font-bold mb-2">
              Information
            </div>
            <div className="flex justify-between mb-4">
              <div className="truncate">james.ava@auzmoroffice.com</div>
            </div>
            <div className="flex">
              <div className="truncate">+918469057446</div>
            </div>
          </div>
          <div className="flex flex-col w-1/2">
            <div className="text-sm text-neutral-500 font-bold mb-2">
              Manager
            </div>
            <div className="flex">
              <div className="mr-4">
                <Avatar size={32} />
              </div>
              <div className="flex flex-col justify-between">
                <div className="text-sm font-bold text-neutral-900">
                  Megan Berry
                </div>
                <div className="text-xs font-normal text-neutral-500">
                  Marketing Executive
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex px-6 py-6 justify-between bg-blue-50">
        <div></div>
        <div>
          <Button
            label="View Profile"
            leftIcon="profileOutline"
            iconColor="white"
            leftIconSize={16}
            leftIconClassName="mr-1"
          />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
