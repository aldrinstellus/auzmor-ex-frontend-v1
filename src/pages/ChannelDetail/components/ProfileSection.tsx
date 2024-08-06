import Icon from 'components/Icon';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CHANNEL_ROLE,
  ChannelVisibilityEnum,
  useChannelStore,
} from '../../../stores/channelStore';
import PopupMenu from 'components/PopupMenu';
import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import Button, { Variant } from 'components/Button';
import {
  clearInputValue,
  getBlobUrl,
  getChannelCoverImage,
  getChannelLogoImage,
  twConfig,
} from 'utils/misc';
import ChannelModal from 'pages/Channels/components/ChannelModal';
import useModal from 'hooks/useModal';
import ChannelArchiveModal from 'pages/Channels/components/ChannelArchiveModal';
import Tabs, { ITab } from 'components/Tabs';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  deleteJoinChannelRequest,
  inviteYourSelf,
  joinChannelRequest,
  leaveChannel,
  updateBookmarkChannel,
  updateChannel,
} from 'queries/channel';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import queryClient from 'utils/queryClient';
import { IUpdateProfileImage } from 'pages/UserDetail';
import EditImageModal from 'components/EditImageModal';
import { EntityType } from 'queries/files';
import Avatar from 'components/Avatar';
import ChannelImageModal from './ChannelImageModal';
import AddChannelMembersModal from './AddChannelMembersModal';
import { useChannelRole } from 'hooks/useChannelRole';
import Truncate from 'components/Truncate';
import useAuth from 'hooks/useAuth';
import { ChannelDetailTabsEnum } from '..';

type ProfileSectionProps = {
  tabs?: ITab[];
  activeTab?: ChannelDetailTabsEnum;
};

export enum TabStatus {
  Active = 'active',
  InActive = 'inactive',
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  tabs = [],
  activeTab,
}) => {
  const { channelId = '' } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation('channelDetail');
  const { t: tc } = useTranslation('channels');
  const [isEditModalOpen, openEditModal, closeEditModal] = useModal();
  const [isChannelImageOpen, openChannelImageModal, closeChannelImageModal] =
    useModal();
  const [isCoverImg, setIsCoverImage] = useState(true);
  const [isArchiveModalOpen, openArchiveModal, closeArchiveModal] = useModal();
  const navigate = useNavigate();

  const { isChannelOwner, isChannelJoined, isChannelAdmin, isAdmin } =
    useChannelRole(channelId);

  const channelCoverImageRef = useRef<HTMLInputElement>(null);
  const showEditProfile = useRef<boolean>(true);
  const [coverImageName, setCoverImageName] = useState<string>('');
  const updateChannelStore = useChannelStore((state) => state.updateChannel);
  const channelData = useChannelStore((state) => state.channels)[channelId];

  // visibility flags
  const isChannelPrivate =
    channelData?.settings?.visibility === ChannelVisibilityEnum.Private;
  const isChannelPublic =
    channelData?.settings?.visibility === ChannelVisibilityEnum.Public;

  const [openEditImage, openEditImageModal, closeEditImageModal] = useModal(
    undefined,
    false,
  );
  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);

  const [file, setFile] = useState<IUpdateProfileImage | Record<string, any>>(
    {},
  );

  const getBlobFile = file?.profileImage
    ? getBlobUrl(file?.profileImage)
    : file?.coverImage && getBlobUrl(file?.coverImage);

  const showRequestBtn =
    isChannelPrivate && !isChannelJoined && !!!channelData?.joinRequest;
  const showJoinChannelBtn =
    isChannelPublic && !isChannelJoined && !!!channelData.joinRequest;
  const showWithdrawBtn =
    isChannelPrivate && !isChannelJoined && !!channelData?.joinRequest;

  const showInviteYourSelf = isChannelPrivate && !isChannelJoined && isAdmin;

  const inviteYourselfMutation = useMutation({
    mutationKey: ['add-channel-members', channelData.id],
    mutationFn: () =>
      inviteYourSelf(channelData.id, {
        users: [{ id: user!.id, role: CHANNEL_ROLE.Admin }],
      }),
    onError: () => {
      failureToastConfig({
        content: t('addChannelMembers.failure'),
      });
    },
    onSuccess: () => {
      successToastConfig({
        content: t('addChannelMembers.success'),
      });
      queryClient.invalidateQueries(['channel']);
    },
  });

  const updateBookmarkMutation = useMutation({
    mutationKey: ['update-channel-bookmark'],
    mutationFn: updateBookmarkChannel,
    onMutate: ({ bookmark }) => {
      updateChannelStore(channelId, {
        ...channelData,
        member: { ...channelData.member, bookmarked: bookmark },
      });
      return { channelData };
    },
    onError: (error, variables, context) => {
      if (context?.channelData) {
        updateChannelStore(channelId, context.channelData);
      }
      failureToastConfig({
        content: `Error Updating bookmark`,
        dataTestId: 'channel-bookmark-toaster',
      });
    },
  });

  const deleteCoverImageMutation = useMutation({
    mutationKey: ['update-users-cover-image'],
    mutationFn: (data: any) => updateChannel(channelId, data),
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['channel']);
    },
  });

  const leaveChannelMutation = useMutation({
    mutationKey: ['leave-channel-member'],
    mutationFn: (channelId: string) => leaveChannel(channelId),
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['channel']);
      navigate('/channels');
    },
  });

  // Join public/private channel request mutation
  const joinChannelMutation = useMutation({
    mutationKey: ['join-public-channel-request'],
    mutationFn: (channelId: string) => joinChannelRequest(channelId),
    onError: () =>
      failureToastConfig({
        content: tc('joinRequestError'),
      }),
    onSuccess: async () => {
      successToastConfig({
        content:
          channelData.settings?.visibility === ChannelVisibilityEnum.Private
            ? tc('joinPrivateChannelRequestSuccess')
            : tc('joinPublicChannelRequestSuccess'),
      });
      await queryClient.invalidateQueries(['channel'], { exact: false });
    },
  });

  // Withdraw join request
  const withdrawJoinChannelRequest = useMutation({
    mutationKey: ['withdraw-join-request'],
    mutationFn: (joinId: string) =>
      deleteJoinChannelRequest(channelData.id, joinId),
    onError: () =>
      failureToastConfig({
        content: tc('withdrawRequestError'),
      }),
    onSuccess: async () => {
      successToastConfig({ content: tc('withdrawRequestSuccess') });
      await queryClient.invalidateQueries(['channel'], { exact: false });
      updateChannelStore(channelData.id, {
        ...channelData,
        joinRequest: null,
      });
    },
  });

  const coverImageOption = [
    {
      icon: 'exportOutline',
      label: t('uploadPhoto'),
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        channelCoverImageRef?.current?.click();
      },
      dataTestId: 'edit-coverpic-upload',
      hidden: false,
    },
    {
      icon: 'maximizeOutline',
      label: t('reposition'),
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        openEditImageModal();
      },
      dataTestId: 'edit-coverpic-reposition',
      hidden: channelData?.banner == null,
    },
    {
      icon: 'gallery',
      label: t('chooseFromIllustration'),
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        setIsCoverImage(true);
        openChannelImageModal();
      },
      dataTestId: 'edit-coverpic-reposition',
      hidden: false,
    },
    {
      icon: 'trashOutline',
      label: t('deletePhoto'),
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        if (file?.coverImage) {
          if (file?.profileImage) {
            setFile({
              profileImage: file?.profileImage,
            });
          } else {
            setFile({});
          }
        }
        deleteCoverImageMutation.mutate({
          bannerUrl: '',
        });
      },
      dataTestId: 'edit-coverpic-deletepost',
      hidden: channelData?.banner == null,
    },
  ].filter((option) => option.hidden !== true);

  const handleTabChange = (index: any) => {
    if (index === 0) {
      navigate(`/channels/${channelData?.id}`);
    } else if (index === 1) {
      if (!isChannelJoined && isChannelPublic) {
        navigate(`/channels/${channelData?.id}/members?type=${'All_Members'}`);
      } else {
        navigate(`/channels/${channelData?.id}/documents`);
      }
    } else if (index === 2) {
      navigate(`/channels/${channelData?.id}/members?type=${'All_Members'}`);
    } else if (index === 3) {
      navigate(`/channels/${channelData?.id}/settings`);
    } else if (index === 4) {
      navigate(`/channels/${channelData?.id}/manage-access`);
    }
  };
  const editMenuOptions = [
    {
      icon: 'edit',
      label: t('edit'),
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: openEditModal,
      dataTestId: '',
      hidden: !isChannelAdmin,
    },
    {
      icon: 'adminOutline',
      label: t('tabs.manageAccess'),
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        navigate(`/channels/${channelData?.id}/manage-access`);
      },
      dataTestId: '',
      hidden: !isChannelAdmin,
    },
    {
      icon: 'archive',
      label: t('tabs.archive'),
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: openArchiveModal,
      dataTestId: '',
      hidden: !isChannelAdmin,
    },
    {
      renderNode: (
        <div
          className={`text-xs ${
            !isChannelJoined ? 'hidden' : ' py-2 px-6'
          } bg-blue-50 font-Medium flex items-center justify-center cursor-default`}
        >
          {t('securityAndAnalytics')}
        </div>
      ),
    },
    {
      icon: 'profileAdd',
      label: t('addMembers'),
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        openAddMemberModal();
      },
      dataTestId: '',
      hidden: !isChannelAdmin,
    },
    {
      icon: 'setting',
      label: t('settings'),
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        navigate(`/channels/${channelData?.id}/settings`);
      },
      dataTestId: '',
      hidden: !isChannelJoined,
    },
    {
      icon: 'logout',
      label: t('leaveChannel'),
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        leaveChannelMutation.mutate(channelId);
      },
      dataTestId: '',
      hidden: !isChannelJoined,
    },
  ].filter((item) => !item.hidden);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files?.length) {
      const selectedFile = files[0];
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/webp',
      ];

      if (!validImageTypes.includes(selectedFile.type)) {
        failureToastConfig({
          content: `File type not supported. Upload a supported file content`,
        });
        return;
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        failureToastConfig({
          content: 'The file size should not exceed 50MB.',
        });
        return;
      }

      setFile({
        ...file,
        coverImage: selectedFile,
      });
      setCoverImageName(selectedFile.name);
      openEditImageModal();
    }
  };

  const getActiveTabIndex = () => {
    const index = tabs.findIndex(
      (tab: Record<string, any>) => tab.id === activeTab,
    );
    if (index < 0) {
      return 0;
    }
    return index;
  };
  return (
    <div className="  rounded-9xl relative mb-4">
      <div className="relative z-30">
        {isChannelOwner ? (
          <div className="absolute top-4 left-4">
            <div className="bg-white rounded-7xl px-3 py-1.5 text-xxs text-primary-500 font-medium">
              {t('cover.you_own_this_space')}
            </div>
          </div>
        ) : null}

        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {channelData?.member && (
            <IconButton
              icon={channelData?.member?.bookmarked ? 'star' : 'starOutline'}
              variant={IconVariant.Secondary}
              className="bg-white"
              onClick={() =>
                updateBookmarkMutation.mutate({
                  memberId: channelData?.member.id,
                  channelId,
                  bookmark: !!!channelData?.member?.bookmarked,
                })
              }
            />
          )}
          <div className="cursor-pointer">
            {isChannelJoined && (
              <PopupMenu
                triggerNode={
                  <div className="bg-white rounded-full  text-black">
                    <IconButton
                      icon="more"
                      variant={IconVariant.Secondary}
                      size={Size.Medium}
                      dataTestId="edit-cover-pic"
                    />
                  </div>
                }
                className="absolute top-12 right-4 w-48"
                menuItems={editMenuOptions}
                title={
                  <>
                    {isChannelAdmin && (
                      <div className="text-xs bg-blue-50 py-2 px-6 font-Medium flex items-center justify-center ">
                        {t('channelManageMent')}
                      </div>
                    )}
                  </>
                }
              />
            )}
          </div>
          <div className="cursor-pointer">
            {isChannelAdmin && (
              <PopupMenu
                triggerNode={
                  <div className="bg-white rounded-full text-black">
                    <IconButton
                      icon="edit"
                      variant={IconVariant.Secondary}
                      size={Size.Medium}
                      dataTestId="edit-cover-pic"
                      onClick={() => (showEditProfile.current = false)}
                    />
                  </div>
                }
                className="absolute top-12 right-4"
                menuItems={coverImageOption}
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-full relative">
        {
          <img
            className="object-cover  object-center w-full rounded-t-9xl "
            src={getChannelCoverImage(channelData)}
            alt={'Channel Cover Picture Profile'}
            data-testid="channel-cover-pic"
          />
        }
        <div className="w-full h-full bg-gradient-to-b from-transparent to-black top-0 left-0 absolute rounded-t-9xl"></div>
      </div>
      <div className="absolute left-0 right-0 bottom-4 text-white ">
        <div className="flex items-center justify-between mx-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar
                image={getChannelLogoImage(channelData)}
                size={56}
                dataTestId={'edit-profile-pic'}
              />
              {isChannelAdmin && (
                <IconButton
                  icon="edit"
                  color="text-black"
                  onClick={() => {
                    setIsCoverImage(false);
                    openChannelImageModal();
                  }}
                  className="absolute !bg-white rounded-full p-[5px] cursor-pointer -top-2 -right-1 hover:!bg-white"
                  dataTestId="edit-profilepic"
                />
              )}
            </div>

            <div
              className={`flex flex-col  ${channelData?.description && 'h-14'}`}
            >
              <Truncate
                toolTipTextClassName="w-64"
                text={channelData?.name || ''}
                className="text-2xl font-bold "
                data-testid="channel-name"
              />
              <Truncate
                toolTipTextClassName="w-64"
                text={channelData?.description || ''}
                className="text-xs  "
                data-testid="channel-description"
              />
            </div>
          </div>
          <div className="flex gap-4">
            {showInviteYourSelf && (
              <Button
                label={t('joinDirectly')}
                dataTestId="invite-your-self-channel-cta"
                className="min-w-max !bg-transparent text-white"
                variant={Variant.Secondary}
                loading={inviteYourselfMutation.isLoading}
                onClick={() => inviteYourselfMutation.mutate()}
              />
            )}
            {showJoinChannelBtn && (
              <Button
                label={t('join')}
                dataTestId="join-channel-cta"
                className="min-w-max "
                loading={joinChannelMutation.isLoading}
                onClick={() => joinChannelMutation.mutate(channelData.id)}
              />
            )}
            {showRequestBtn && (
              <Button
                label={tc('privateChannel.joinRequestCTA')}
                variant={Variant.Primary}
                onClick={() => joinChannelMutation.mutate(channelData.id)}
                loading={joinChannelMutation.isLoading}
                data-testid={'channel-request-to-join'}
              />
            )}
            {showWithdrawBtn && (
              <Button
                label={tc('privateChannel.withdrawRequestCTA')}
                variant={Variant.Danger}
                onClick={() =>
                  withdrawJoinChannelRequest.mutate(
                    channelData.joinRequest!.id!,
                  )
                }
                loading={withdrawJoinChannelRequest.isLoading}
                data-testid={'channel-withdraw-request'}
              />
            )}
          </div>
        </div>
        <div className="relative mt-3">
          <div className="absolute  text-neutral-900 w-full top-0">
            <Tabs
              tabs={tabs}
              tabSwitcherClassName="!p-1 "
              showUnderline={false}
              itemSpacing={1}
              tabContentClassName="mt-8 mb-32"
              className="w-full flex mx-8"
              onTabChange={handleTabChange}
              activeTabIndex={getActiveTabIndex()}
            />
          </div>
          <div className="justify-end pr-8 flex items-center">
            <div className="flex items-center space-x-1 border-r pr-4 border-neutral-500">
              <div className="flex items-center border border-neutral-600 rounded-7xl w-6 h-6 justify-center">
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
              <div className="flex items-center border border-neutral-600 rounded-7xl w-6 h-6 justify-center">
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
              <div className="flex items-center border border-neutral-600 rounded-7xl w-6 h-6 justify-center">
                <Icon name="chart" size={16} className="text-white" />
              </div>
              <div
                className="text-white text-sm"
                data-testid="channel-category"
              >
                {channelData?.categories
                  ?.map((category: any) => (
                    <Truncate key={category?.id} text={category.name || ''} />
                  ))
                  ?.map((truncateComponent) => truncateComponent.props.text)
                  ?.join(', ') || ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openEditImage && (
        <EditImageModal
          channelId={channelId}
          title={getBlobFile ? 'Apply Changes' : 'Reposition'}
          openEditImage={openEditImage}
          closeEditImageModal={closeEditImageModal}
          image={getBlobFile || channelData?.banner?.original}
          userCoverImageRef={channelCoverImageRef}
          setImageFile={setFile}
          imageFile={file}
          imageName={coverImageName}
          fileEntityType={
            file?.profileImage
              ? EntityType?.UserProfileImage
              : EntityType?.UserCoverImage
          }
          aspectRatio={4.024}
        />
      )}

      {isChannelAdmin && (
        <div>
          <input
            id="file-input"
            type="file"
            ref={channelCoverImageRef}
            className="hidden"
            accept="image/*"
            multiple={false}
            data-testid="edit-profile-coverpic"
            onClick={clearInputValue}
            onChange={handleFileChange}
          />
        </div>
      )}
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
      {isChannelImageOpen && (
        <ChannelImageModal
          isCoverImg={isCoverImg}
          channelId={channelId}
          open={isChannelImageOpen}
          closeModal={closeChannelImageModal}
          channelData={channelData}
        />
      )}
      {showAddMemberModal && channelData && (
        <AddChannelMembersModal
          open={showAddMemberModal}
          closeModal={closeAddMemberModal}
          channelData={channelData}
        />
      )}
    </div>
  );
};

export default ProfileSection;
