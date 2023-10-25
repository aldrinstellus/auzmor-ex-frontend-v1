import { FC, ReactNode } from 'react';
import Modal from 'components/Modal';
import Button, { Variant } from 'components/Button';
import Header from 'components/ModalHeader';

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
  dataTestId?: string;
};

const ConfirmationBox: FC<ConfirmationBoxProps> = ({
  onClose,
  open,
  title,
  description,
  discard,
  success,
  isLoading = false,
  dataTestId,
}) => {
  if (!open) {
    return null;
  }

  return (
    <Modal
      open={open}
      closeModal={() => (isLoading ? null : onClose())}
      className="max-w-md"
    >
      <div data-testid={`${dataTestId}-confirmation-window`}>
        <Header title={title} onClose={onClose} />
        <div className="font-normal text-sm text-neutral-900 not-italic p-6">
          {description}
        </div>
        <div className="flex flex-row-reverse px-6 py-4 bg-blue-50 rounded-b-9xl">
          <Button
            onClick={success.onSubmit}
            label={success.label}
            variant={Variant.Danger}
            loading={isLoading}
            dataTestId={`${dataTestId}-delete`}
          />
          <Button
            onClick={discard.onCancel}
            label={discard.label}
            disabled={isLoading}
            variant={Variant.Secondary}
            dataTestId={`${dataTestId}-close`}
            className="mr-3"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationBox;
