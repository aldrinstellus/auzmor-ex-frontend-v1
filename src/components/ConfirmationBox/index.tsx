import React, { ReactNode } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Spinner from 'components/Spinner';

export interface Discard {
  label: string;
  onCancel: () => void;
  className: string;
}
export interface Success {
  label: string;
  onSubmit: () => any;
  className: string;
}

export type ConfirmationBoxProps = {
  open: boolean;
  onClose: () => void | null;
  title: string;
  description: string | ReactNode;
  discard: Discard;
  success: Success;
  isLoading?: boolean;
};

const ConfirmationBox: React.FC<ConfirmationBoxProps> = ({
  onClose,
  open,
  title,
  description,
  discard,
  success,
  isLoading = false,
}) => {
  return (
    <Modal
      open={open}
      closeModal={() => (isLoading ? null : onClose())}
      className="max-w-md"
    >
      <div>
        <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
          {title}
        </div>
        <div className="font-medium text-sm text-neutral-500 not-italic px-4">
          {description}
        </div>
        <div className="flex flex-row-reverse px-4 pt-6 pb-4">
          <Button
            onClick={success.onSubmit}
            label={success.label}
            className={`!rounded-6 !px-4 !py-2 !${success.className}`}
            loading={isLoading}
          />
          <Button
            onClick={discard.onCancel}
            label={discard.label}
            disabled={isLoading}
            className={`!rounded-17xl !px-4 !py-2 !mr-3 !border-2 !border-neutral-200 !${discard.className}`}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationBox;
