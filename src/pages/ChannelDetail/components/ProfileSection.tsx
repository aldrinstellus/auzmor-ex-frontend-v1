import clsx from 'clsx';
import Icon from 'components/Icon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChannelVisibilityEnum, IChannel } from '../../../stores/channelStore';
import useURLParams from 'hooks/useURLParams';
import PopupMenu from 'components/PopupMenu';
import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import Button, { Size as ButtonSize } from 'components/Button';
import { twConfig } from 'utils/misc';
import useAuth from 'hooks/useAuth';
import ChannelModal from 'pages/Channels/components/ChannelModal';
import useModal from 'hooks/useModal';
import ChannelArchiveModal from 'pages/Channels/components/ChannelArchiveModal';

type ProfileSectionProps = {
  channelData: IChannel;
  activeTab: string;
  setActiveTab: (...args: any) => any;
  setActiveMenu: (...args: any) => any;
};

const ProfileSection: React.FC<ProfileSectionProps> = ({
  channelData,
  activeTab,
  setActiveTab,
  setActiveMenu,
}) => {
  const { t } = useTranslation('channelDetail');
  const { user } = useAuth();
  const { updateParam } = useURLParams();
  const [isEditModalOpen, openEditModal, closeEditModal] = useModal();
  const [isArchiveModalOpen, openArchiveModal, closeArchiveModal] = useModal();

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

  const editMenuOptions = [
    {
      icon: 'edit',
      label: 'Edit',
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: openEditModal,
      dataTestId: '',
    },
    {
      icon: 'adminOutline',
      label: 'Manage Access',
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        setActiveMenu({ accessTab: true, settingTab: false });
        setActiveTab('');
      },
      dataTestId: '',
    },
    {
      icon: 'archive',
      label: 'Archive',
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: openArchiveModal,
      dataTestId: '',
    },
    {
      renderNode: (
        <div className="text-xs  bg-blue-50 py-2 px-6 font-Medium flex items-center justify-center ">
          SECURITY & ANALYTICS
        </div>
      ),
    },
    {
      icon: 'profileAdd',
      label: 'Add Members',
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        setActiveMenu(true);
        setActiveTab('');
      },
      dataTestId: '',
    },
    {
      icon: 'setting',
      label: 'Settings',
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        setActiveMenu({ accessTab: false, settingTab: true });
        setActiveTab('');
      },
      dataTestId: '',
    },
  ];
  console.log({ channelData, user });
  return (
    <div className="h-[330px]  rounded-9xl relative mb-4">
      <div className="relative z-30">
        {channelData?.createdBy?.id === user?.id ? (
          <div className="absolute top-4 left-4">
            <div className="bg-white rounded-7xl px-3 py-1.5 text-xxs text-primary-500 font-medium">
              {t('cover.you_own_this_space')}
            </div>
          </div>
        ) : null}
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
          <div className="   cursor-pointer">
            <PopupMenu
              triggerNode={
                <div className="bg-white rounded-full  text-black">
                  <IconButton
                    icon="more"
                    variant={IconVariant.Secondary}
                    size={Size.Medium}
                    dataTestId="edit-cover-pic"
                    // onClick={() => (showEditProfile.current = false)}
                  />
                </div>
              }
              className="absolute top-12 right-4 w-48"
              menuItems={editMenuOptions}
              title={
                <div className="text-xs  bg-blue-50 py-2 px-6 font-Medium flex items-center justify-center ">
                  CHANNEL MANAGEMENT
                </div>
              }
            />
          </div>
          <div className="bg-white rounded-full  p-2 cursor-pointer">
            <Icon
              name="edit"
              size={16}
              className="text-neutral-400"
              // onClick={() => userProfileImageRef?.current?.click()}
              dataTestId="edit-profilepic"
            />
          </div>
        </div>
      </div>

      <div className="w-full h-full relative">
        <img
          id="channel-uploadcoverphoto"
          data-testid="channel-uploadedcoverphoto"
          src={channelData?.banner || require('images/channelDefaultHero.png')}
          className="rounded-9xl w-full h-full object-cover"
        />
        <div className="w-full h-full bg-gradient-to-b from-transparent to-black top-0 left-0 absolute rounded-t-9xl"></div>
      </div>

      <div className="absolute left-0 right-0 bottom-4 text-white px-6">
        <div className="flex justify-between items-center">
          <div className="mb-2 flex items-start space-x-6">
            <div className="h-14 w-14 rounded-full border-2 border-white bg-blue-300 center">
              <Icon
                name={channelData?.displayImage || 'chart'}
                className="text-white"
                size={24}
              />
            </div>
            <div className="space-y-2 text-white">
              <div className="text-2xl font-bold" data-testid="channel-name">
                {channelData?.name}
              </div>
              <div
                className="text-xs line-clamp-2 "
                data-testid="channel-description"
              >
                {channelData?.description}
              </div>
            </div>
          </div>
          <Button
            label={t('join')}
            size={ButtonSize.Small}
            dataTestId="join-channel-cta"
            className="min-w-max"
          />
        </div>
        <div className="w-full flex justify-between items-center relative mt-3">
          <div>
            <div className="flex items-center text-sm space-x-4">
              {tabs.map((t) => (
                <div
                  key={t.key}
                  className={clsx({
                    'text-sm px-1 cursor-pointer': true,
                    'font-bold text-white border-b-2 border-primary-400 pb-2 relative mt-1':
                      t.isActive,
                    '!text-neutral-300 hover:!text-white': !t.isActive,
                  })}
                  onClick={() => {
                    updateParam(`search`, '');
                    setActiveTab(t.key);
                    setActiveMenu({ accessTab: false, settingTab: false });
                  }}
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
                {channelData?.settings?.visibility ===
                ChannelVisibilityEnum.Private
                  ? t('private')
                  : t('public')}
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
                {channelData?.totalMembers === 1
                  ? `1 ${t('member')}`
                  : `${channelData.totalMembers} ${t('members')}`}
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
                {channelData?.categories
                  ?.map((category) => category.name)
                  ?.join(', ') || ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <ChannelModal
          isOpen={isEditModalOpen}
          closeModal={closeEditModal}
          channelData={channelData}
        />
      )}
      {isArchiveModalOpen && (
        <ChannelArchiveModal
          isOpen={isArchiveModalOpen}
          closeModal={closeArchiveModal}
          channelId={channelData.id}
        />
      )}
    </div>
  );
};

export default ProfileSection;
