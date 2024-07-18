import Icon from 'components/Icon';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import ChannelModal from 'pages/Channels/components/ChannelModal';
import useModal from 'hooks/useModal';
import { IChannel } from 'stores/channelStore';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import AddChannelMembersModal from '../AddChannelMembersModal';
import PopupMenu from 'components/PopupMenu';
import { clearInputValue, getBlobUrl, twConfig } from 'utils/misc';
import ChannelImageModal from '../ChannelImageModal';
import { useParams, useSearchParams } from 'react-router-dom';
import { IUpdateProfileImage } from 'pages/UserDetail';
import EditImageModal from 'components/EditImageModal';
import { EntityType } from 'queries/files';

type AppProps = {
  channelData: IChannel;
};

const FinishSetup: FC<AppProps> = ({ channelData }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSettingUp, setShowSettingUp] = useState<boolean>(
    searchParams.get('showWelcome') === 'true',
  );

  const handleClose = () => {
    setShowSettingUp(false);
  };

  useEffect(() => {
    if (showSettingUp) {
      searchParams.delete('showWelcome');
      setSearchParams(searchParams, { replace: true });
    }
  }, [showSettingUp, searchParams, setSearchParams]);

  const { t } = useTranslation('channelDetail');
  const { channelId = '' } = useParams();
  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);
  const [isEditModalOpen, openEditModal, closeEditModal] = useModal(false);
  const isOwnerOrAdmin = channelData?.member?.role;

  const [isChannelImageOpen, openChannelImageModal, closeChannelImageModal] =
    useModal();
  const channelCoverImageRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<IUpdateProfileImage | Record<string, any>>(
    {},
  );
  const [coverImageName, setCoverImageName] = useState<string>('');

  const [openEditImage, openEditImageModal, closeEditImageModal] = useModal(
    undefined,
    false,
  );
  const getBlobFile = file?.profileImage
    ? getBlobUrl(file?.profileImage)
    : file?.coverImage && getBlobUrl(file?.coverImage);
  const steps = useMemo(
    () => [
      {
        key: 'cover_photo',
        label: t('setup.cover_photo'),
        completed: !!channelData?.banner?.original,
        icon: 'image',
        onClick: () => {},
        dataTestId: 'add-coverphoto',
      },
      {
        key: 'description',
        label: t('setup.description'),
        completed: !!channelData?.description,
        icon: 'image',
        onClick: openEditModal,
        dataTestId: 'add-description',
      },
      {
        key: 'invite',
        label: t('setup.invite'),
        completed: channelData?.totalMembers > 1,
        icon: 'image',
        dataTestId: 'invite-member',
        onClick: openAddMemberModal,
      },
    ],
    [channelData, openEditModal, openAddMemberModal],
  );

  const coverImageOption = [
    {
      icon: 'exportOutline',
      label: 'Upload a photo',
      onClick: () => {
        channelCoverImageRef?.current?.click();
      },
      dataTestId: 'edit-coverpic-upload',
    },
    {
      icon: 'gallery',
      label: 'Choose from illustration',
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        openChannelImageModal();
      },
      dataTestId: 'edit-coverpic-reposition',
    },
  ];

  useEffect(() => {
    if (steps.every((step) => step.completed)) {
      setShowSettingUp(false);
    }
  }, [steps]);

  if (!showSettingUp) {
    return null;
  }

  return (
    <>
      <div
        className="bg-white rounded-9xl p-6 mt-6"
        data-testid="channel-settingup-steps-post"
      >
        <div className="flex justify-between">
          <div className="font-bold text-neutral-900">{t('setup.title')}</div>
          <Icon
            onClick={handleClose}
            name="close"
            size={20}
            dataTestId="channel-settingpost-crossicon"
          />
        </div>
        <div>
          <div className="mt-2 text-sm text-neutral-400">
            <span className="!text-primary-500 font-semibold">
              {steps.filter((s) => s.completed).length} {t('setup.of')}{' '}
              {steps.length}
            </span>{' '}
            {t('setup.steps_completed')}
          </div>
          <div className="mt-2 ">
            {steps.map((step: any) => (
              <div
                key={step.key}
                className={clsx(
                  {
                    'border rounded-19xl px-5 py-3 mb-2 font-medium flex justify-between':
                      true,
                  },
                  {
                    'bg-primary-50 text-neutral-500 line-through':
                      step.completed,
                  },
                  {
                    'text-neutral-900 cursor-pointer': !step.completed,
                  },
                )}
                onClick={() => {
                  if (!step.completed) {
                    step?.onClick();
                  }
                }}
                data-testid={`channel-${step.dataTestId}-step`}
              >
                {step.key === 'cover_photo' ? (
                  <div className="relative w-full">
                    <PopupMenu
                      triggerNode={
                        <>
                          <div className="flex items-center space-x-2">
                            <Icon name={step.icon} size={16} />
                            <div className="text-sm ">{step.label}</div>
                          </div>
                          {step.completed && (
                            <div className="absolute right-0 top-0">
                              <Icon
                                name="tickCircle"
                                className="text-primary-500"
                                size={16}
                                dataTestId={`channel-${step.dataTestId}-greenmark`}
                              />
                            </div>
                          )}
                        </>
                      }
                      disabled={step.completed}
                      className="absolute !w-80 top-0 right-0 left-0"
                      menuItems={coverImageOption}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <Icon name={step.icon} size={16} />
                      <div className="text-sm ">{step.label}</div>
                    </div>
                    {step.completed && (
                      <Icon
                        name="tickCircle"
                        className="text-primary-500"
                        size={16}
                        dataTestId={`channel-${step.dataTestId}-greenmark`}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
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
      {isOwnerOrAdmin && (
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
            onChange={(e) => {
              if (e.target.files?.length) {
                setFile({
                  ...file,
                  coverImage: Array.prototype.slice.call(e.target.files)[0],
                });
                setCoverImageName(e?.target?.files[0]?.name);
                openEditImageModal();
              }
            }}
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
      {showAddMemberModal && channelData && (
        <AddChannelMembersModal
          open={showAddMemberModal}
          closeModal={closeAddMemberModal}
          channelData={channelData}
        />
      )}
      {isChannelImageOpen && (
        <ChannelImageModal
          isCoverImg={true}
          channelId={channelId}
          open={isChannelImageOpen}
          closeModal={closeChannelImageModal}
          channelData={channelData}
        />
      )}
    </>
  );
};

export default FinishSetup;
