import React, { ReactElement } from 'react';
import NotSupported from 'images/unsupported.png';
import GreenLogo from 'images/greenLogo.png';

const Unsupported: React.FC = (): ReactElement => {
  return (
    <div className="flex items-center justify-center w-screen h-screen p-6">
      <div className="flex flex-col justify-between items-center">
        <img src={GreenLogo} width={300} height={300} />
        <img src={NotSupported} width={600} height={600} />
        <p className="text-base font-semibold">
          Sorry we do not support mobile devices yet!
        </p>
      </div>
    </div>
  );
};

export default Unsupported;
