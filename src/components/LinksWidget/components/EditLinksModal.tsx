import { FC, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Icon from 'components/Icon';
import Button, { Size, Variant } from 'components/Button';

import useModal from 'hooks/useModal';
import AddLinkModal from './AddLinkModal';
import { IChannelLink } from 'stores/channelStore';
import { updateChannelLinks } from 'queries/channel';

interface IEditLinksModalProps {
  open: boolean;
  closeModal: () => void;
  channelId: string;
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
  links = [],
}) => {
  const queryClient = useQueryClient();
  const [openAddLink, openAddLinkModal, closeAddLinkModal] = useModal(
    false,
    false,
  );
  const [draftLinks, setDraftLinks] = useState<IChannelLink[]>(links);
  const [linkDetails, setLinkDetails] = useState<IChannelLinkDetails>();

  const updateLinksMutation = useMutation({
    mutationKey: ['update-channel-links'],
    mutationFn: (payload: IChannelLink[]) => {
      return updateChannelLinks(channelId, { links: payload });
    },
    onError: (error: any) => console.log(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['channel-links-widget']);
      closeModal();
    },
  });

  useEffect(() => {
    if (links.length === 0) {
      setLinkDetails({
        isCreateMode: true,
        index: 0,
        title: '',
        url: '',
      });
      openAddLinkModal();
    }
  }, [links]);

  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[638px]">
      <Header
        title="Edit Links"
        onClose={() => closeModal()}
        closeBtnDataTestId="edit-links-close"
      />

      <div className="flex flex-col w-full max-h-[420px] p-4 gap-6 overflow-y-auto">
        {draftLinks.length > 0 && !openAddLink ? (
          <div className="flex justify-start flex-col gap-2">
            {draftLinks?.map((link, index) => (
              <div
                className="flex justify-between items-center gap-x-3 py-2 px-4 border-1 rounded-22xl border-neutral-200 group hover:shadow-xl"
                key={index}
              >
                <div className="flex justify-start items-center gap-x-3">
                  <Icon name="reorder" size={16} className="m-1" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{link.title}</span>
                    <span className="text-sm font-medium text-ellipsis text-blue-500 underline">
                      <a href={link.url}>{link.url}</a>
                    </span>
                  </div>
                </div>
                <Icon
                  name="edit"
                  size={20}
                  className="hidden group-hover:block"
                  onClick={() => {
                    setLinkDetails({ ...link, index, isCreateMode: false });
                    openAddLinkModal();
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4 bg-blue-50 rounded-b-9xl">
        <Button
          leftIcon="addCircle"
          label="Add Link"
          variant={Variant.Primary}
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
          labelClassName="text-primary-700 hover:text-primary-500 group-hover:text-primary-500"
          iconColor="text-primary-700"
          leftIconSize={20}
          dataTestId=""
        />
        <div className="flex">
          <Button
            label="Cancel"
            size={Size.Small}
            variant={Variant.Secondary}
            onClick={closeModal}
            className="mr-4"
            dataTestId="edit-links-back"
          />
          <Button
            label="Save Changes"
            size={Size.Small}
            variant={Variant.Primary}
            loading={updateLinksMutation.isLoading}
            onClick={() => updateLinksMutation.mutate(draftLinks)}
            dataTestId="edit-link-cta"
          />
        </div>
      </div>

      {openAddLink && (
        <AddLinkModal
          open={openAddLink}
          closeModal={() => {
            closeAddLinkModal();
            setLinkDetails(undefined);
            if (draftLinks.length === 0) closeModal();
          }}
          isCreateMode={linkDetails?.isCreateMode}
          linkDetails={linkDetails}
          setLinkDetails={(link) => {
            setDraftLinks(
              linkDetails?.isCreateMode
                ? [...draftLinks, link]
                : draftLinks.map((item, index) =>
                    index === linkDetails?.index ? link : item,
                  ),
            );
            setLinkDetails(undefined);
            closeAddLinkModal();
          }}
        />
      )}
    </Modal>
  );
};

export default EditLinksModal;
