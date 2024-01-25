import useRole from 'hooks/useRole';
import Button, { Size, Variant } from 'components/Button';
import { FC } from 'react';

interface EmptyStateProps {
  openModal?: () => void;
}

const EmptyState: FC<EmptyStateProps> = ({ openModal }) => {
  const { isAdmin } = useRole();
  const showAddLinks = isAdmin && !!openModal;

  return (
    <div className="w-full text-xs font-normal text-neutral-500">
      {showAddLinks ? (
        <div className="flex flex-col gap-2">
          <p className="text-center">
            Links have not been added yet. Add important links for members to
            see
          </p>
          <Button
            variant={Variant.Primary}
            size={Size.Small}
            className="py-[7px] w-full"
            label="Add links"
            leftIcon="addCircle"
            leftIconClassName="!text-white"
            dataTestId="app-add-app-launcher"
            onClick={openModal}
          />
          <p className="text-center">Only admins can see this.</p>
        </div>
      ) : (
        <div>Links have not been added yet.</div>
      )}
    </div>
  );
};

export default EmptyState;
