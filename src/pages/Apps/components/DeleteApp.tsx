import React from 'react';
import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Modal from 'components/Modal';
import { useMutation } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import FailureToast from 'components/Toast/variants/FailureToast';
import { toast } from 'react-toastify';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { deleteApp } from 'queries/apps';

export interface IDeleteAppProps {
  open: boolean;
  closeModal: (param?: any) => void;
  appId: string;
}

const DeleteApp: React.FC<IDeleteAppProps> = ({ open, closeModal, appId }) => {
  const deleteAppMutation = useMutation({
    mutationKey: ['delete-app', appId],
    mutationFn: deleteApp,
    onError: (error) => {
      closeModal(true);
      toast(<FailureToast content="Error deleting the app" dataTestId="" />, {
        closeButton: (
          <Icon
            name="closeCircleOutline"
            color={twConfig.theme.colors.red['500']}
            size={20}
          />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.red['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
      });
    },
    onSuccess: (data, variables, context) => {
      closeModal(true);
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      toast(
        <SuccessToast
          content="App has been deleted successfully"
          dataTestId="app-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color={twConfig.theme.colors.primary['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
  });

  const Header: React.FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        Delete App?
      </div>
      <IconButton
        onClick={() => closeModal()}
        icon={'close'}
        dataTestId="close-app-modal"
        className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
        variant={IconVariant.Primary}
      />
    </div>
  );

  const Footer: React.FC = () => (
    <div className="flex justify-end space-x-3 items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
      <Button
        variant={ButtonVariant.Secondary}
        size={Size.Small}
        label={'Cancel'}
        dataTestId="delete-app-cancel"
        onClick={closeModal}
      />
      <Button
        label={'Delete'}
        className="!bg-red-500 !text-white flex"
        loading={deleteAppMutation.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="delete-app-delete"
        onClick={() => deleteAppMutation.mutate(appId)}
      />
    </div>
  );
  return (
    <Modal open={open} className="max-w-sm">
      <Header />
      <div className="text-sm font-medium text-neutral-500 mx-6 mt-6 mb-8">
        Are you sure you want to delete this app?
        <br /> This cannot be undone.
      </div>
      <Footer />
    </Modal>
  );
};

export default DeleteApp;
