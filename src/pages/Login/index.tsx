import { FC, useEffect, useState } from 'react';
import OfficeLogoSvg from 'components/Logo/images/OfficeLogo.svg';
import LoginViaCred from './components/LoginViaCred';
import LoginViaSSO from './components/LoginViaSSO';
import useAuth from 'hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { checkLogin } from 'queries/account';
import { getSubDomain, isDark } from 'utils/misc';
import { useGetSSOFromDomain } from 'queries/organization';
import { useBrandingStore } from 'stores/branding';
import clsx from 'clsx';

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
        className={`w-screen h-full absolute top-0 left-0 ${
          branding?.loginConfig?.layout === 'CENTER' &&
          'bg-welcome-to-office-large'
        } bg-no-repeat bg-cover bg-bottom`}
        data-testid="signin-cover-image"
      >
        {branding?.loginConfig?.layout === 'LEFT' && (
          <div className="w-1/2 float-right bg-welcome-to-office h-full bg-no-repeat bg-cover bg-bottom"></div>
        )}
        {branding?.loginConfig?.layout === 'RIGHT' && (
          <div className="w-1/2 float-left bg-welcome-to-office h-full bg-no-repeat bg-cover bg-bottom"></div>
        )}
      </div>
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
                <video
                  autoPlay
                  muted
                  loop
                  className="h-full w-full object-cover"
                >
                  <source src={branding?.loginConfig?.video?.original} />
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
      <>
        {branding?.loginConfig?.layout === 'RIGHT' && getBannerText()}
        <div
          className={`flex flex-col items-center bg-neutral-50 overflow-y-auto w-[50vw] h-full z-10 gap-12 py-[100px] ${
            branding?.loginConfig?.layout === 'CENTER' &&
            'min-h-[660px] !h-auto rounded-16xl w-[600px] !py-20'
          }`}
          data-testid={getDataTestId()}
        >
          <div
            className="flex justify-center items-center max-w-[250px] max-h-[150px]"
            data-testid="signin-logo-image"
          >
            <img
              src={branding?.logo?.original || OfficeLogoSvg}
              alt="Office Logo"
            />
          </div>
          {viaSSO ? (
            <LoginViaSSO setViaSSO={setViaSSO} />
          ) : (
            <LoginViaCred setViaSSO={setViaSSO} />
          )}
        </div>
        {branding?.loginConfig?.layout === 'LEFT' && getBannerText()}
      </>
    );
  };

  const getBannerText = () => {
    if (
      !!branding?.loginConfig?.text &&
      branding?.loginConfig?.backgroundType === 'COLOR' &&
      branding?.loginConfig?.layout !== 'CENTER'
    ) {
      return (
        <div className="w-[50vw] flex items-center px-14">
          <p
            className={`text-6xl font-extrabold z-10 leading-[72px] ${
              isDark(branding?.loginConfig?.color || '#777777')
                ? 'text-white'
                : 'text-neutral-900'
            }`}
            data-testid={`${getDataTestId()}-message`}
          >
            {branding?.loginConfig?.text}
          </p>
        </div>
      );
    } else {
      return <></>;
    }
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

  const getDataTestId = () => {
    return `${branding?.loginConfig?.layout?.toLowerCase()}-align-${branding?.loginConfig?.backgroundType?.toLowerCase()}`;
  };

  return <div className={containerStyle}>{setLoginForm()}</div>;
};

export default Login;
