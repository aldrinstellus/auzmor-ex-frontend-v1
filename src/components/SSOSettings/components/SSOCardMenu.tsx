import { useMutation } from '@tanstack/react-query';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import useHover from 'hooks/useHover';
import { IdentityProvider, deleteSSO } from 'queries/organization';
import React, { ReactElement } from 'react';

type SSOCardMenuProps = {
  idp: IdentityProvider;
  onClick: any;
  refetch: any;
};

const SSOCardMenu: React.FC<SSOCardMenuProps> = ({
  idp,
  onClick,
  refetch,
}): ReactElement => {
  const deleteSSOMutation = useMutation({
    mutationKey: ['delete-sso-mutation'],
    mutationFn: deleteSSO,
    onSuccess: () => {
      console.log('Delete SSO operation successful');
      refetch();
    },
    onError: () => {
      console.log('Delete SSO operation failed');
      refetch();
    },
  });

  const [hovered, eventHandlers] = useHover();
  return (
    <div className="relative" onClick={() => {}} {...eventHandlers}>
      <div className="cursor-pointer">
        <Icon name="threeDots" />
      </div>
      {hovered && (
        <Card className="absolute">
          <p className="py-3 px-6 cursor-pointer" onClick={onClick}>
            Edit
          </p>
          <Divider />
          <p
            className="py-3 px-6 cursor-pointer"
            onClick={() => deleteSSOMutation.mutateAsync(idp)}
          >
            Deactivate
          </p>
        </Card>
      )}
    </div>
  );
};

export default SSOCardMenu;
