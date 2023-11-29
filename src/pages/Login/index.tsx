import { FC, useEffect, useState } from 'react';
import { Logo } from 'components/Logo';
import LoginViaCred from './components/LoginViaCred';
import LoginViaSSO from './components/LoginViaSSO';
import useAuth from 'hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { checkLogin } from 'queries/account';
import { getSubDomain } from 'utils/misc';
import { useGetSSOFromDomain } from 'queries/organization';
import { useBrandingStore } from 'stores/branding';
import clsx from 'clsx';
import Card from 'components/Card';

interface ILoginProps {}

const Login: FC<ILoginProps> = () => {
  const [viaSSO, setViaSSO] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const domain = getSubDomain(window.location.host);
  const { isFetching: isDomainInfoLoading } = useGetSSOFromDomain(
    domain,
    domain !== '' ? true : false,
  );
  const branding = useBrandingStore((state) => state.branding);
  console.log(branding);

  const checkLoginMutation = useMutation(checkLogin, {
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

  if (loading || isDomainInfoLoading) {
    return null;
  }

  const getLoginBackground = () => {
    const defaultBackground = (
      <div
        className="w-[40vw] h-full bg-welcome-to-office bg-no-repeat bg-cover bg-bottom"
        data-testid="signin-cover-image"
      />
    );
    if (branding?.loginConfig) {
      switch (branding?.loginConfig?.backgroundType) {
        case 'IMAGE':
          if (branding?.loginConfig?.image?.original) {
            return (
              <div
                className="w-full h-full absolute top-0 left-0 bg-no-repeat bg-cover"
                style={{
                  backgroundImage: `url(${branding?.loginConfig?.image?.original})`,
                }}
              ></div>
            );
          } else {
            return defaultBackground;
          }
        case 'VIDEO':
          if (branding?.loginConfig?.video?.original) {
            return (
              <div className="w-full h-full absolute top-0 left-0 bg-no-repeat bg-cover">
                <video autoPlay muted loop className="h-full w-full">
                  <source
                    src={branding?.loginConfig?.video?.original}
                    type="video/mp4"
                  />
                </video>
              </div>
            );
          } else {
            return defaultBackground;
          }
        case 'COLOR':
          if (branding?.loginConfig?.color) {
            return (
              <div
                className="w-full h-full absolute top-0 left-0"
                style={{ backgroundColor: branding?.loginConfig?.color }}
              />
            );
          } else {
            return defaultBackground;
          }
        default:
          return defaultBackground;
      }
    } else {
      return defaultBackground;
    }
  };

  const getLoginForm = () => {
    return (
      <div
        className={`flex flex-col items-center bg-neutral-50 overflow-y-auto w-[60vw] h-full z-10 gap-8 pt-20 ${
          branding?.loginConfig?.layout === 'CENTER' && '!h-[94vh] rounded-9xl'
        }`}
      >
        <div data-testid="signin-logo-image">
          <Logo />
        </div>
        <Card className="!min-w-[440px] shadow-lg border border-neutral-100 p-5">
          {viaSSO ? (
            <LoginViaSSO setViaSSO={setViaSSO} />
          ) : (
            <LoginViaCred setViaSSO={setViaSSO} />
          )}
        </Card>
      </div>
    );
  };

  const setLoginForm = () => {
    return (
      <>
        {getLoginBackground()}
        {getLoginForm()}
      </>
    );
  };

  const containerStyle = clsx({
    'flex h-screen w-screen relative': true,
    'justify-center items-center': branding?.loginConfig?.layout === 'CENTER',
    'justify-end': branding?.loginConfig?.layout === 'RIGHT',
    'justify-start': branding?.loginConfig?.layout === 'LEFT',
  });

  return <div className={containerStyle}>{setLoginForm()}</div>;
};

export default Login;
