import { useMutation } from '@tanstack/react-query';
import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import useHover from 'hooks/useHover';
import useModal from 'hooks/useModal';
import { IdentityProvider, deleteSSO } from 'queries/organization';
import React, { ReactElement } from 'react';
import queryClient from 'utils/queryClient';

type SSOCardMenuProps = {
  idp: IdentityProvider;
  name: string;
  onClick: any;
};

const SSOCardMenu: React.FC<SSOCardMenuProps> = ({
  idp,
  name,
  onClick,
}): ReactElement => {
  const deleteSSOMutation = useMutation({
    mutationKey: ['delete-sso-mutation'],
    mutationFn: deleteSSO,
    onSuccess: async () => {
      console.log('Delete SSO operation successful');
      await queryClient.invalidateQueries(['get-sso']);
      closeModal();
    },
    onError: async () => {
      console.log('Delete SSO operation failed');
      await queryClient.invalidateQueries(['get-sso']);
    },
  });

  const { isLoading } = deleteSSOMutation;

  const [hovered, eventHandlers] = useHover();
  const [open, openModal, closeModal] = useModal();
  return (
    <div>
      <div className="relative" onClick={() => {}} {...eventHandlers}>
        <div className="cursor-pointer">
          <Icon name="threeDots" />
        </div>
        {hovered && (
          <Card className="absolute">
            <p
              className="py-3 px-6 cursor-pointer hover:bg-primary-50"
              onClick={onClick}
            >
              Edit
            </p>
            <Divider />
            <p
              className="py-3 px-6 cursor-pointer hover:bg-primary-50"
              onClick={openModal}
            >
              Deactivate
            </p>
          </Card>
        )}
      </div>
      <Modal open={open}>
        <div className="flex items-center justify-between p-4">
          <p className="font-bold text-lg text-gray-900">Deactivate?</p>
          <Icon name="close" hover={false} onClick={closeModal} />
        </div>
        <Divider />
        <p className="p-4">Do you wish to deactivate {name}?</p>
        <div className="flex min-w-full items-center justify-end gap-x-3 p-4">
          <Button
            variant={Variant.Secondary}
            label="Cancel"
            onClick={closeModal}
          />
          <Button
            variant={Variant.Danger}
            label="Deactivate"
            onClick={() => deleteSSOMutation.mutateAsync(idp)}
            loading={isLoading}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SSOCardMenu;
