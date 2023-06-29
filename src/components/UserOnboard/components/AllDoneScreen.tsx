import React, { ReactElement } from 'react';
import OnboardFinish from 'images/onboard-finish.png';
import Button from 'components/Button';

type AllDoneScreenProps = {
  closeModal: any;
};

const AllDoneScreen: React.FC<AllDoneScreenProps> = ({
  closeModal,
}): ReactElement => {
  return (
    <div className="flex flex-col min-h-full justify-between min-w-full">
      <div className="flex items-center flex-col justify-between gap-y-4 px-10 mt-6">
        <img src={OnboardFinish} />
        <p className="font-bold text-neutral-900 text-2xl mt-8">All Done!</p>
        <p className="font-normal text-sm text-neutral-500">
          You are all set to start using Auzmor office
        </p>
      </div>
      <div className="bg-blue-50 rounded-b-9xl">
        <div className="p-3 flex items-center justify-between">
          <div />
          <Button
            className="font-bold"
            label="Launch Auzmor Office"
            onClick={closeModal}
            dataTestId="launch-auzmor-office-btn"
          />
        </div>
      </div>
    </div>
  );
};

export default AllDoneScreen;
