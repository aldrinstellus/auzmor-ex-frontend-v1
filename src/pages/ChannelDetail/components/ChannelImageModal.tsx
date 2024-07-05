import React, { FC, useState, useRef, useEffect } from 'react';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { IChannel } from 'stores/channelStore';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Icon from 'components/Icon';
import clsx from 'clsx';
import { channelCoverImages, channelCoverLogo } from './utils/ChannelImages';
import { useUpload } from 'hooks/useUpload';
import { useMutation } from '@tanstack/react-query';
import { updateChannel } from 'queries/channel';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { EntityType } from 'queries/files';
import queryClient from 'utils/queryClient';
import { toBlob } from 'html-to-image';

type AppProps = {
  open: boolean;
  closeModal: () => void;
  channelData: IChannel;
  channelId: string;
  isCoverImg: boolean;
};

const ChannelImageModal: FC<AppProps> = ({
  open,
  closeModal,
  channelId,
  isCoverImg,
}) => {
  const channelImages = isCoverImg ? channelCoverImages : channelCoverLogo;
  const [selectedImageId, setSelectedImageId] = useState<number>(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isFile, setIsFile] = useState<boolean>(false);
  const handleImageClick = (id: number) => {
    setSelectedImageId(id);
  };

  const updateChannelMutation = useMutation({
    mutationFn: (data: any) => updateChannel(channelId, data),
    mutationKey: ['update-channel-name-mutation'],
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: async (_response: any) => {
      successToastConfig({
        content: `${
          isCoverImg ? 'Cover' : 'Profile'
        } Picture Updated Successfully`,
      });
      setIsFile(false);
      closeModal();
      if (channelId) {
        await queryClient.invalidateQueries(['channel']);
      }
    },
  });

  const { uploadMedia } = useUpload();
  const uploadMediaFn = async () => {
    setIsFile(true);
    if (isCoverImg) {
      const selectedImage = channelCoverImages[selectedImageId].banner;
      const img = new Image();
      img.src = selectedImage;
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        // as per banner size
        canvas.width = 1328;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(async (blob) => {
            if (blob) {
              const file = new File([blob], 'cover.png', {
                type: blob.type,
              });

              const profileImageUploadResponse = await uploadMedia(
                [file],
                EntityType.UserCoverImage,
              );

              if (profileImageUploadResponse) {
                updateChannelMutation.mutate({
                  bannerUrl: profileImageUploadResponse[0].original,
                });
              }
            }
          }, 'image/png');
        }
      };
      img.onerror = (error) => {
        console.error('Image load error: ', error);
      };
    } else {
      if (imageRef.current) {
        const newFile = await toBlob(imageRef.current, {
          canvasHeight: imageRef.current.height,
          canvasWidth: imageRef.current.width,
        });

        if (newFile) {
          const profileImageUploadResponse = await uploadMedia(
            [
              new File([newFile], 'logo.png', {
                type: newFile.type,
              }),
            ],
            EntityType.UserProfileImage,
          );

          if (profileImageUploadResponse) {
            updateChannelMutation.mutate({
              displayImageUrl: profileImageUploadResponse[0].original,
            });
          }
        }
      }
    }
  };

  const loading = isFile || updateChannelMutation.isLoading;

  useEffect(() => {
    if (open) {
      setSelectedImageId(0);
    }
  }, [open]);

  return (
    <Modal open={open} className="max-w-[638px] ">
      <Header
        title={
          <span className="text-primary-500">
            Choose channel {isCoverImg ? 'cover' : 'profile'} photo
          </span>
        }
        closeBtnDataTestId={`-close`}
        onClose={closeModal}
      />
      <div className="  flex justify-center  mb-2">
        <div
          className={`inline-grid ${
            isCoverImg ? 'grid-cols-2' : 'grid-cols-3'
          } gap-4`}
        >
          {channelImages.map((item) => (
            <div
              key={item.id}
              className={clsx(
                `relative  cursor-pointer  border-1 border-neutral-200 ${
                  isCoverImg ? 'rounded-[12px]' : 'rounded-full'
                }  w-full h-full  `,

                { 'border-primary-500': item.id === selectedImageId },
              )}
              tabIndex={0}
              onClick={() => handleImageClick(item.id)}
            >
              {item.id === selectedImageId && (
                <Icon
                  name="tickCircle"
                  className={`absolute ${
                    isCoverImg ? 'right-2 top-2' : '   right-6 '
                  }`}
                  color="text-primary-500"
                  hover
                />
              )}
              <img
                src={item.image}
                alt={`${item.id} Image`}
                ref={item.id === selectedImageId ? imageRef : null}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-19xl">
        <div className="flex">
          <Button
            variant={ButtonVariant.Secondary}
            label="Cancel"
            className="mr-3"
            onClick={closeModal}
            dataTestId={`-cancel`}
          />
          <Button
            label="Select photo"
            loading={loading}
            onClick={uploadMediaFn}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ChannelImageModal;
