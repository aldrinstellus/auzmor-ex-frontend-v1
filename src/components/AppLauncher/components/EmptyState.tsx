import { FC } from 'react';

import Button, { Size, Variant } from 'components/Button';

import useRole from 'hooks/useRole';
import { Link } from 'react-router-dom';

interface IEmptyState {
  openModal: () => void;
}

const EmptyState: FC<IEmptyState> = () => {
  const { isAdmin } = useRole();

  return (
    <div className="mt-4 w-full">
      {isAdmin ? (
        <div className="flex flex-col gap-2 text-xs w-full">
          <p className="text-center">
            There is no app found in your organization right now.
          </p>
          <Link to="/apps" className="w-full">
            <Button
              variant={Variant.Secondary}
              size={Size.Small}
              className="py-[7px] w-full"
              label="Add Apps"
              leftIcon="addCircle"
              leftIconClassName="text-neutral-900"
              dataTestId="app-add-app-launcher"
              // onClick={openModal}
            />
          </Link>
          <p className="text-center">Only admins can see this.</p>
        </div>
      ) : (
        <div>Apps have not been added yet.</div>
      )}
    </div>
  );
};

export default EmptyState;
