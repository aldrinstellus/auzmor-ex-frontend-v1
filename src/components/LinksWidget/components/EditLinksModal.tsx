import { FC } from 'react';

import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Button, { Variant } from 'components/Button';

import useModal from 'hooks/useModal';
import AddLinkModal from './AddLinkModal';

interface IEditLinksModalProps {
  open: boolean;
  closeModal: () => void;
  links?: string[];
}

const EditLinksModal: FC<IEditLinksModalProps> = ({
  open,
  closeModal,
  links = [],
}) => {
  const [openAddLink, openAddLinkModal, closeAddLinkModal] = useModal();
  const link = 'abc';
  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[638px]">
      <Header
        title="Edit Links"
        onClose={() => closeModal()}
        closeBtnDataTestId="edit-links-close"
      />

      <div className="flex flex-col w-full max-h-[400px] p-6 gap-6 overflow-y-auto">
        {links.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {links?.map(({ id }: any) => id)}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          leftIcon="addCircle"
          label="Add Link"
          leftIconClassName="!text-white"
          variant={Variant.Primary}
          onClick={openAddLinkModal}
          className=""
          dataTestId=""
        />
        <div className="flex">
          <Button
            label="Cancel"
            variant={Variant.Secondary}
            onClick={closeModal}
            className="mr-4"
            dataTestId="edit-links-back"
          />
          <Button
            label="Save Changes"
            variant={Variant.Primary}
            // onClick={handleSubmit(onSubmit)}
            dataTestId="edit-link-cta"
          />
        </div>
      </div>

      {openAddLink && (
        <AddLinkModal
          open={openAddLink}
          closeModal={closeAddLinkModal}
          link={link}
        />
      )}
    </Modal>
  );
};

export default EditLinksModal;
