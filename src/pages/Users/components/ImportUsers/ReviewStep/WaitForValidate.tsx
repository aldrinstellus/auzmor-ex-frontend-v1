import Spinner from 'components/Spinner';
import React, { useEffect } from 'react';
import usePoller from '../usePoller';

type AppProps = {
  importId: string;
  setNextStep: (...args: any) => any;
};

const WaitForValidate: React.FC<AppProps> = ({ importId, setNextStep }) => {
  const { ready } = usePoller({ importId, action: 'validate' });

  useEffect(() => {
    if (ready) {
      setNextStep();
    }
  }, [ready]);

  return (
    <div className="p-12 flex justify-center items-center">
      <Spinner />
    </div>
  );
};

export default WaitForValidate;
