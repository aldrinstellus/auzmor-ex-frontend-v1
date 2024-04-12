import clsx from 'clsx';
import Button, { Size } from 'components/Button';
import Icon from 'components/Icon';
import React from 'react';
import { useTranslation } from 'react-i18next';

type AppProps = {
  activeTab: string;
  setActiveTab: (...args: any) => any;
};

const ProfileSection: React.FC<AppProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation('channelDetail');

  const tabs = [
    {
      label: t('cover.tab_home'),
      key: 'home',
      isActive: activeTab === 'home',
    },
    {
      label: t('cover.tab_document'),
      key: 'document',
      isActive: activeTab === 'document',
    },
    {
      label: t('cover.tab_members'),
      key: 'members',
      isActive: activeTab === 'members',
    },
  ];

  return (
    <div className="h-[330px] rounded-9xl relative mb-4">
      <div className="absolute top-4 left-4">
        <div className="bg-white rounded-7xl px-3 py-1.5 text-xxs text-primary-500 font-medium">
          {t('cover.you_own_this_space')}
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
            dataTestId="channel-editcoverpic-icon"
          />
        </div>
      </div>
      <div data-testid="channel-uploadedcoverphoto">
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
              <div className="text-2xl font-bold" data-testid="channel-name">
                Sales
              </div>
              <div className="text-xs" data-testid="channel-description">
                This is a private space for sales
              </div>
            </div>
          </div>
          <Button
            label={t('join')}
            size={Size.Small}
            dataTestId="join-channel-cta"
          />
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
                    '!text-neutral-300 hover:!text-white': !t.isActive,
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
              <div className="text-white text-sm" data-testid="channel-privacy">
                {t('private')}
              </div>
            </div>
            <div className="flex items-center space-x-1 border-r px-4 border-neutral-500">
              <div className="border border-neutral-600 rounded-7xl p-1">
                <Icon name="users" size={16} className="text-white" />
              </div>
              <div
                className="text-white text-sm"
                data-testid="channel-membercount"
              >
                1 {t('member')}
              </div>
            </div>
            <div className="flex items-center space-x-1 pl-4">
              <div className="border border-neutral-600 rounded-7xl p-1">
                <Icon name="chart" size={16} className="text-white" />
              </div>
              <div
                className="text-white text-sm"
                data-testid="channel-category"
              >
                Sales
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
