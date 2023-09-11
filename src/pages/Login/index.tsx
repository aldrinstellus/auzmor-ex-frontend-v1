import React, { useEffect, useState } from 'react';
import { Logo } from 'components/Logo';
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
        className="w-[49.3vw] h-full bg-welcome-to-office bg-no-repeat bg-cover bg-bottom"
        data-testid="signin-cover-image"
      />

      <div className="flex-1 h-full flex justify-center items-center relative bg-white overflow-y-auto">
        <div
          className="absolute top-[4.55vh] right-[3.5vw]"
          data-testid="signin-logo-image"
        >
          <Logo />
        </div>
        <div className="pt-[86px] 3xl:pt-[154px] mr-[60px] w-[414px] h-full">
          {viaSSO ? (
            <LoginViaSSO setViaSSO={setViaSSO} />
          ) : (
            <LoginViaCred setViaSSO={setViaSSO} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
