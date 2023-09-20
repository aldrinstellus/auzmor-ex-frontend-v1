import { FC } from 'react';

import Button, { Size, Variant } from 'components/Button';

import useRole from 'hooks/useRole';

interface IEmptyState {
  openModal: () => void;
}

const EmptyState: FC<IEmptyState> = ({ openModal }) => {
  const { isAdmin } = useRole();

  return (
    <div className="mt-4 w-full">
      {isAdmin ? (
        <div className="flex flex-col gap-2 text-xs w-full">
          <p className="text-center">
            Try adding apps that you will use frequently.
          </p>
          <Button
            variant={Variant.Secondary}
            size={Size.Small}
            className="py-[7px]"
            label="Add Apps"
            leftIcon="addCircle"
            leftIconClassName="text-neutral-900"
            dataTestId="app-add-app-launcher"
            onClick={openModal}
          />
          <p className="text-center">Only admins can see this.</p>
        </div>
      ) : (
        <div>Apps have not been added yet.</div>
      )}
    </div>
  );
};

export default EmptyState;
