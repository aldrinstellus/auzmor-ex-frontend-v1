import React, { useState } from 'react';
import { Logo } from 'components/Logo';
import LoginViaCred from './components/LoginViaCred';
import LoginViaSSO from './components/LoginViaSSO';

interface ILoginProps {}

const Login: React.FC<ILoginProps> = () => {
  const [viaSSO, setViaSSO] = useState(false);
  return (
    <div className="flex h-screen w-screen">
      <div
        className="bg-[url(images/welcomeToOffice.png)] w-1/2 h-full bg-no-repeat bg-cover"
        data-testid="signin-cover-image"
      ></div>
      <div className="w-1/2 h-full flex justify-center items-center relative bg-white overflow-y-auto">
        <div className="absolute top-8 right-8" data-testid="signin-logo-image">
          <Logo />
        </div>
        {viaSSO ? (
          <LoginViaSSO setViaSSO={setViaSSO} />
        ) : (
          <LoginViaCred setViaSSO={setViaSSO} />
        )}
      </div>
    </div>
  );
};

export default Login;
