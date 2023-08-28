import React, { useEffect, useState } from 'react';
import { Logo } from 'components/Logo';
import WelcomeOffice from 'images/welcomeToOffice.png';
import LoginViaCred from './components/LoginViaCred';
import LoginViaSSO from './components/LoginViaSSO';
import useAuth from 'hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { checkLogin } from 'queries/account';
import { getSubDomain } from 'utils/misc';

interface ILoginProps {}

const Login: React.FC<ILoginProps> = () => {
  const [viaSSO, setViaSSO] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const domain = getSubDomain(window.location.host);

  const checkLoginMutation = useMutation(() => checkLogin(), {
    onSuccess: (data) => {
      if (data?.data?.code === 200) {
        return window.location.replace(data?.data?.result?.data?.redirectUrl);
      }
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setLoading(false);
      return;
    }
    if (!user && !domain) {
      checkLoginMutation.mutate();
    } else {
      setLoading(false);
    }
  }, [domain, user]);

  if (user) {
    return <Navigate to="/feed" />;
  }

  if (loading) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen">
      <div
        className="w-[710px] bg-welcome-to-office"
        data-testid="signin-cover-image"
      />

      <div className="flex-1 h-full flex justify-center items-center relative bg-white overflow-y-auto">
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
