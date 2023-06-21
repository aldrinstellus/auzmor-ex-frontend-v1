import React, { ReactElement } from 'react';
import OnboardWelcome from 'images/onboard-welcome.png';
import Button from 'components/Button';

type WelcomeScreenProps = {
  next: () => void;
  dataTestId?: string;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  next,
  dataTestId,
}): ReactElement => {
  return (
    <div className="flex flex-col min-h-full justify-between min-w-full">
      <div className="flex items-center flex-col justify-between gap-y-10 px-10 mt-6">
        <img src={OnboardWelcome} />
        <p className="font-bold text-neutral-900 text-2xl">
          Welcome to Auzmor Office
        </p>
        <p className="font-normal text-sm text-neutral-500">
          Let&rsquo;s get your profile setup so that you can jump right in and
          start using Auzmor office.
        </p>
      </div>
      <div className="bg-blue-50 rounded-b-9xl">
        <div className="p-3 flex items-center justify-between">
          <div />
          <Button
            className="font-bold"
            label={'Next'}
            onClick={next}
            dataTestId={dataTestId}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
