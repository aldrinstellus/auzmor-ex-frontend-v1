import { FC } from 'react';

import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Button, { Variant } from 'components/Button';

interface IAddLinksModalProps {
  open: boolean;
  closeModal: () => void;
  link?: string;
}

const AddLinkModal: FC<IAddLinksModalProps> = ({
  open,
  closeModal,
  link = '',
}) => {
  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[638px]">
      <Header
        title="Add link"
        onClose={() => closeModal()}
        closeBtnDataTestId="add-link-close"
      />

      <div className="flex flex-col w-full max-h-[400px] p-6 gap-6 overflow-y-auto">
        {link}
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label="Cancel"
          variant={Variant.Secondary}
          onClick={closeModal}
          className="mr-4"
          dataTestId="add-link-back"
        />
        <Button
          label="Add Link"
          variant={Variant.Primary}
          // onClick={handleSubmit(onSubmit)}
          dataTestId="add-link-cta"
        />
      </div>
    </Modal>
  );
};

export default AddLinkModal;
