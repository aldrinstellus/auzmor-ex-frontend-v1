import React, { ReactElement } from 'react';
import NotSupported from 'images/unsupported.png';
import GreenLogo from 'images/greenLogo.png';
import { Logo } from 'components/Logo';

const Unsupported: React.FC = (): ReactElement => {
  return (
    <div className="flex items-center justify-center w-screen h-screen p-6">
      <div className="flex flex-col justify-between items-center gap-y-12">
        {/* <img src={GreenLogo} width={130} height={50} className="mb-14" /> */}
        <div className="mb-14">
          <Logo />
        </div>
        <img src={NotSupported} width={300} height={300} />
        <p className="text-sm font-semibold">
          Sorry we do not support mobile devices yet!
        </p>
      </div>
    </div>
  );
};

export default Unsupported;
