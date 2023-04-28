import React, { ReactNode } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';

export interface Discard {
  label: string;
  onCancel: () => void;
  className: string;
}
export interface Success {
  label: string;
  onSubmit: () => void;
  className: string;
}

export type ConfirmationBoxProps = {
  open: boolean;
  onClose: () => void | null;
  title: string;
  description: string | ReactNode;
  discard: Discard;
  success: Success;
};

const ConfirmationBox: React.FC<ConfirmationBoxProps> = ({
  onClose,
  open,
  title,
  description,
  discard,
  success,
}) => {
  return (
    <Modal
      wMax="max-w-md"
      title={title}
      body={
        <div className="font-medium text-sm text-neutral-500 not-italic px-6 py-6">
          {description}
        </div>
      }
      footer={
        <div className="flex flex-row-reverse px-[24px] py-[16px]">
          <Button
            onClick={success.onSubmit}
            label={success.label}
            className={`!rounded-[24px] !px-[16px] !py-[8px] !${success.className}`}
          />
          <Button
            onClick={discard.onCancel}
            label={discard.label}
            className={`!rounded-[24px] !px-[16px] !py-[8px] !mr-[12px] !border-2 !border-neutral-200  !${discard.className}`}
          />
        </div>
      }
      open={open}
      closeModal={onClose}
    />
  );
};

export default ConfirmationBox;
