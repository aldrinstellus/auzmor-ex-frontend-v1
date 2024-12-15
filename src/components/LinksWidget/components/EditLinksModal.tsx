import { FC, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Icon from 'components/Icon';
import Button, { Size, Variant } from 'components/Button';

import useModal from 'hooks/useModal';
import AddLinkModal from './AddLinkModal';
import { IChannelLink } from 'stores/channelStore';
import { useTranslation } from 'react-i18next';
import { Reorder, useDragControls } from 'framer-motion';
import { isTrim } from 'pages/ChannelDetail/components/utils';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

interface IEditLinksModalProps {
  open: boolean;
  closeModal: () => void;
  channelId: string;
  isEditMode: boolean;
  links?: IChannelLink[];
}

type IChannelLinkDetails = IChannelLink & {
  isCreateMode: boolean;
  index: number;
};

const EditLinksModal: FC<IEditLinksModalProps> = ({
  open,
  closeModal,
  channelId,
  isEditMode,
  links = [],
}) => {
  const queryClient = useQueryClient();
  const [openAddLink, openAddLinkModal, closeAddLinkModal] = useModal(
    false,
    false,
  );
  const controls = useDragControls();
  const [draftLinks, setDraftLinks] = useState<IChannelLink[]>(links);
  const { getApi } = usePermissions();
  useEffect(() => {
    setDraftLinks(links);
  }, [links]);
  const [linkDetails, setLinkDetails] = useState<IChannelLinkDetails>();

  const { t } = useTranslation('channelLinksWidget', {
    keyPrefix: 'editLinksModal',
  });

  const updateChannelLinksIndex = getApi(ApiEnum.UpdateChannelLinks);
  const updateLinksMutation = useMutation({
    mutationKey: ['update-channel-links-index'],
    mutationFn: (payload: IChannelLink[]) => {
      return updateChannelLinksIndex(channelId, { links: payload });
    },
    onError: (error: any) => console.log(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['channel-links-widget']);
      successToastConfig({});
      closeModal();
    },
  });

  const deleteChannelLink = getApi(ApiEnum.DeleteChannelLink);
  const deleteChannelMutation = useMutation({
    mutationKey: ['delete-channel-link'],
    mutationFn: (payload: { id: string; linkId: string }) =>
      deleteChannelLink(payload),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: () => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: () => {
      queryClient.invalidateQueries(['channel-links-widget']);
    },
  });

  function findChangedIndexes(original: any[], reordered: any[]) {
    // Create a map to store the new index for each id
    const idToIndexMap = new Map(
      reordered.map((link, index) => [link.id, index + 1]), // index + 1 to match the index starting from 1
    );
    // Loop through the original array to find changed and unchanged elements
    const result: any[] = original.map((link) => {
      const newIndex = idToIndexMap.get(link.id);
      return {
        ...link,
        index: newIndex, // new index in the reordered array
        sequence: link.sequence, // original sequence
        changed: newIndex !== link.sequence, // flag to indicate if the sequence has changed
      };
    });
    return result;
  }

  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[638px]">
      <Header
        title={isEditMode ? t('title.updateMode') : t('title.viewMode')}
        onClose={() => closeModal()}
        closeBtnDataTestId="edit-links-close"
      />
      <div className="flex flex-col w-full max-h-[420px] min-h-[210px] p-4 gap-6 overflow-y-auto">
        {draftLinks.length > 0 && !openAddLink ? (
          <Reorder.Group
            axis="y"
            values={draftLinks}
            onReorder={setDraftLinks}
            className="flex justify-start flex-col gap-2"
          >
            {draftLinks?.map((link, index) => (
              <Reorder.Item
                value={link}
                key={link.id}
                className={`flex justify-between items-center gap-x-3 py-2 px-4 border-1 rounded-22xl border-neutral-200 group hover:shadow-xl ${
                  !isEditMode && 'cursor-pointer'
                }`}
                onClick={() => {
                  if (isEditMode) return;
                  const linkUrl = link.url.startsWith('http')
                    ? link.url
                    : `https://${link.url}`;
                  window.open(linkUrl, '_blank');
                }}
                dragControls={controls}
              >
                <div className="flex w-fit justify-start items-center gap-x-3">
                  <Icon
                    name={isEditMode ? 'reorder' : 'link'}
                    size={16}
                    className="m-1 cursor-grab"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-900 font-bold">
                      {link.title}
                    </span>
                    {isEditMode && (
                      <span className="text-sm text-neutral-500 font-medium underline">
                        <a href={link.url} target="#">
                          {isTrim(link.url, 60)}
                        </a>
                      </span>
                    )}
                  </div>
                </div>
                {isEditMode ? (
                  <div className="flex justify-start items-center gap-x-3">
                    <Icon
                      name="edit"
                      size={20}
                      className="hidden group-hover:block"
                      onClick={() => {
                        setLinkDetails({ ...link, index, isCreateMode: false });
                        openAddLinkModal();
                      }}
                    />
                    <Icon
                      name="delete"
                      size={20}
                      className="hidden hover:text-red-500 group-hover:text-red-500 group-hover:block"
                      onClick={() => {
                        setDraftLinks(
                          draftLinks.filter(
                            (_, draftIndex) => draftIndex !== index,
                          ),
                        );
                        deleteChannelMutation.mutate({
                          id: channelId,
                          linkId: link.id || '',
                        });
                      }}
                    />
                  </div>
                ) : (
                  <Icon
                    name="linearRightArrow"
                    className="hidden group-hover:block"
                    size={20}
                  />
                )}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div className="flex items-center justify-center flex-auto">
            {t('noLinksMessage')}
          </div>
        )}
      </div>

      {/* Footer */}
      {isEditMode && (
        <div className="flex justify-between items-center px-6 py-4 bg-blue-50 rounded-b-9xl">
          <Button
            leftIcon="addCircle"
            label={t('addLinkCTA')}
            variant={Variant.Secondary}
            onClick={() => {
              setLinkDetails({
                isCreateMode: true,
                index: draftLinks.length,
                title: '',
                url: '',
              });
              openAddLinkModal();
            }}
            className="border-0 !bg-transparent !px-0 !py-1"
            labelClassName="text-neutral-500 hover:text-primary-500 group-hover:text-primary-500"
            iconColor="text-neutral-500"
            leftIconSize={20}
            dataTestId=""
          />
          <div className="flex">
            <Button
              label={t('cancelCTA')}
              size={Size.Small}
              variant={Variant.Secondary}
              onClick={closeModal}
              className="mr-4"
              dataTestId="edit-links-back"
            />
            <Button
              label={t('saveCTA')}
              size={Size.Small}
              variant={Variant.Primary}
              loading={updateLinksMutation.isLoading}
              onClick={() => {
                const payload = findChangedIndexes(links, draftLinks);
                updateLinksMutation.mutate(payload);
              }}
              dataTestId="edit-link-cta"
            />
          </div>
        </div>
      )}
      {openAddLink && (
        <AddLinkModal
          open={openAddLink}
          channelId={channelId}
          closeModal={() => {
            closeAddLinkModal();
            setLinkDetails(undefined);
          }}
          isEditMode={isEditMode}
          isCreateMode={linkDetails?.isCreateMode}
          linkDetails={linkDetails}
        />
      )}
    </Modal>
  );
};

export default EditLinksModal;
