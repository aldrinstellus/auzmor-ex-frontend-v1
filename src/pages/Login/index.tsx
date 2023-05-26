import React, { useState } from 'react';
import { Logo } from 'components/Logo';
import WelcomeOffice from 'images/welcomeToOffice.png';
import LoginViaCred from './components/LoginViaCred';
import LoginViaSSO from './components/LoginViaSSO';

interface ILoginProps {}

const Login: React.FC<ILoginProps> = () => {
  const [viaSSO, setViaSSO] = useState(false);
  return (
    <div className="flex h-screen w-screen">
      <img
        src={WelcomeOffice}
        className="h-full w-[48%]"
        data-testid="signin-cover-image"
        alt="Welcome to Auzmor Office"
      />
      <div className="w-[52%] h-full flex justify-center items-center relative bg-white overflow-y-auto">
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
