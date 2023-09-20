import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Modal from 'components/Modal';
import { UserStatus, updateStatus } from 'queries/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { FC } from 'react';
export interface IReactivatePeopleProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  userId: string;
}

const DeactivatePeople: FC<IReactivatePeopleProps> = ({
  open,
  // openModal,
  closeModal,
  userId,
}) => {
  const queryClient = useQueryClient();
  const updateUserStatusMutation = useMutation({
    mutationFn: updateStatus,
    mutationKey: ['update-user-status'],
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
      queryClient.invalidateQueries(['users']);
      toast(<SuccessToast content={`User has been deactivated`} />, {
        closeButton: (
          <Icon name="closeCircleOutline" color="text-primary-500" size={20} />
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
      });
    },
  });

  const Header: FC = () => (
    <div className="flex flex-wrap items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        Deactivate User?
      </div>
      <IconButton
        onClick={closeModal}
        icon={'close'}
        dataTestId="deactivate-user-close"
        className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
        variant={IconVariant.Primary}
      />
    </div>
  );

  const Footer: FC = () => (
    <div className="flex justify-end space-x-3 items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
      <Button
        variant={ButtonVariant.Secondary}
        size={Size.Small}
        label={'Cancel'}
        dataTestId="cancel-cta"
        onClick={closeModal}
      />
      <Button
        label={'Deactivate'}
        className="bg-primary-500 !text-white flex"
        loading={updateUserStatusMutation.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="Deactivate"
        onClick={() => {
          updateUserStatusMutation.mutate({
            id: userId,
            status: UserStatus.Inactive,
          });
          closeModal();
        }}
      />
    </div>
  );
  return (
    <Modal
      open={open}
      className="max-w-md"
      dataTestId="deactivate-confirm-modal"
    >
      <Header />
      <div className="text-sm font-medium text-[#171717] mx-4 mt-3 mb-4">
        Are you sure you want to deactivate this account?
        <br /> All the data associated with this account will be removed.
      </div>
      <Footer />
    </Modal>
  );
};

export default DeactivatePeople;
