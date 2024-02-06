import clsx from 'clsx';
import Button, { Size } from 'components/Button';
import Icon from 'components/Icon';
import React from 'react';

type AppProps = {
  activeTab: string;
  setActiveTab: (...args: any) => any;
};

const ProfileSection: React.FC<AppProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      label: 'Home',
      key: 'home',
      isActive: activeTab === 'home',
    },
    {
      label: 'Members',
      key: 'members',
      isActive: activeTab === 'members',
    },
  ];

  return (
    <div className="h-[330px] rounded-9xl relative mb-4">
      <div className="absolute top-4 left-4">
        <div className="bg-white rounded-7xl px-3 py-1.5 text-xxs text-primary-500 font-medium">
          You own this space
        </div>
      </div>
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <div className="bg-white rounded-full p-2 cursor-pointer">
          <Icon
            name="notification"
            size={16}
            className="text-neutral-400"
            // onClick={() => userProfileImageRef?.current?.click()}
            dataTestId="edit-profilepic"
          />
        </div>
        <div className="bg-white rounded-full p-2 cursor-pointer">
          <Icon
            name="star"
            size={16}
            className="text-neutral-400"
            // onClick={() => userProfileImageRef?.current?.click()}
            dataTestId="edit-profilepic"
          />
        </div>
        <div className="bg-white rounded-full p-2 cursor-pointer">
          <Icon
            name="more"
            size={16}
            className="text-neutral-400"
            // onClick={() => userProfileImageRef?.current?.click()}
            dataTestId="edit-profilepic"
          />
        </div>
        <div className="bg-white rounded-full p-2 cursor-pointer">
          <Icon
            name="edit"
            size={16}
            className="text-neutral-400"
            // onClick={() => userProfileImageRef?.current?.click()}
            dataTestId="edit-profilepic"
          />
        </div>
      </div>
      <div>
        <img
          src={require('images/channelDefaultHero.png')}
          className="rounded-9xl w-full object-cover"
        />
      </div>
      <div className="absolute left-0 right-0 bottom-0 text-white px-6">
        <div className="flex justify-between items-center">
          <div className="mb-2 flex items-start space-x-6">
            <div className="h-14 w-14 rounded-full border-2 border-white bg-blue-300 center">
              <Icon name="chart" className="text-white" size={24} />
            </div>
            <div className="space-y-2 text-white">
              <div className="text-2xl font-bold">Sales</div>
              <div className="text-xs">This is a private space for sales</div>
            </div>
          </div>
          <Button label="Join Channel" size={Size.Small} />
        </div>
        <div className="w-full flex justify-between items-center relative top-3">
          <div>
            <div className="flex items-center text-sm space-x-4">
              {tabs.map((t) => (
                <div
                  key={t.key}
                  className={clsx({
                    'text-sm px-1 cursor-pointer': true,
                    'font-bold text-white border-b-2 border-primary-400 pb-2 relative top-1':
                      t.isActive,
                    '!text-neutral-300': !t.isActive,
                  })}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-1 border-r pr-4 border-neutral-500">
              <div className="border border-neutral-600 rounded-7xl p-1">
                <Icon name="lock" size={16} className="text-white" />
              </div>
              <div className="text-white text-sm">Private</div>
            </div>
            <div className="flex items-center space-x-1 border-r px-4 border-neutral-500">
              <div className="border border-neutral-600 rounded-7xl p-1">
                <Icon name="users" size={16} className="text-white" />
              </div>
              <div className="text-white text-sm">1 member</div>
            </div>
            <div className="flex items-center space-x-1 pl-4">
              <div className="border border-neutral-600 rounded-7xl p-1">
                <Icon name="chart" size={16} className="text-white" />
              </div>
              <div className="text-white text-sm">Sales</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
