import { useEffect } from 'react';
import { Success } from 'components/Logo';
import Layout, { FieldType } from 'components/Form';
import Button, { Size, Type } from 'components/Button';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { resetPassword, useTokenValidation } from 'queries/account';
import PasswordExpiry from 'pages/PasswordExpiry';
import clsx from 'clsx';
import PageLoader from 'components/PageLoader';
import { getSubDomain, isDark } from 'utils/misc';
import { useGetSSOFromDomain } from 'queries/organization';
import { useBrandingStore } from 'stores/branding';
import OfficeLogoSvg from 'components/Logo/images/OfficeLogo.svg';

interface IForm {
  newPassword: string;
  password: string;
  token: any;
}

const schema = yup.object({
  newPassword: yup.string().required(),
  password: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
  token: yup.string(),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const token = searchParams.get('token');

  const { data, isLoading } = useTokenValidation(token || '');

  const domain = getSubDomain(window.location.host);
  const { isFetching: isDomainInfoLoading } = useGetSSOFromDomain(
    domain,
    domain !== '' ? true : false,
  );
  const branding = useBrandingStore((state) => state.branding);

  const resetPasswordMutation = useMutation((formData: any) =>
    resetPassword(formData),
  );

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      newPassword: '',
      password: '',
      token,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    resetPasswordMutation.reset();
  }, [watch('newPassword'), watch('password')]);

  const passwordField = [
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-full',
      placeholder: 'Enter password',
      name: 'newPassword',
      label: 'New Password',
      rightIcon: 'people',
      error: errors.newPassword?.message,
      setError,
      control,
      onChange: (_e: any) => {
        // const value = e.target.value;
      },
      dataTestId: 'new-password',
      inputClassName: 'h-[44px]',
    },

    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      className: 'w-full',
      placeholder: 'Re-enter Password',
      name: 'password',
      label: 'Confirm Password',
      rightIcon: 'people',
      error: errors.password?.message,
      control,
      dataTestId: 'confirm-password',
      showChecks: false,
      inputClassName: 'h-[44px]',
    },
  ];

  const onSubmit = (formData: IForm) => {
    resetPasswordMutation.mutate({
      password: formData.password,
      token: formData.token,
    });
  };

  const resetPasswordContainerStyles = clsx(
    { 'w-full': true },
    { 'max-w-[440px]': !!data },
    { 'h-full': true },
  );

  if (isLoading || isDomainInfoLoading) {
    return <PageLoader />;
  }

  const getBackground = () => {
    const defaultBackground = (
      <div
        className={`w-screen h-full absolute top-0 left-0 ${
          branding?.loginConfig?.layout === 'CENTER' &&
          'bg-welcome-to-office-large'
        } bg-no-repeat bg-cover bg-bottom`}
        data-testid="signin-cover-image"
      >
        {branding?.loginConfig?.layout === 'LEFT' && (
          <div className="w-1/2 float-right bg-welcome-to-office h-full"></div>
        )}
        {branding?.loginConfig?.layout === 'RIGHT' && (
          <div className="w-1/2 float-left bg-welcome-to-office h-full"></div>
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

  const getResetForm = () => {
    return (
      <>
        {branding?.loginConfig?.layout === 'RIGHT' && getBannerText()}
        <div
          className={`flex flex-col items-center bg-neutral-50 overflow-y-auto w-[50vw] h-full z-10 gap-12 py-[100px] ${
            branding?.loginConfig?.layout === 'CENTER' &&
            'min-h-[660px] !h-auto rounded-16xl w-[600px] !py-20'
          }`}
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
          <div className={resetPasswordContainerStyles}>
            {isLoading ? (
              <PageLoader />
            ) : (
              <>
                {!!data ? (
                  <div className="w-[440px]">
                    {resetPasswordMutation.isSuccess ? (
                      <div className="text-center flex flex-col space-y-5 h-full justify-center items-center">
                        <Success />
                        <div className="text-neutral-900 font-bold">
                          Password has been successfully reset
                        </div>
                        <Button
                          label={'Sign In Now'}
                          className="w-full mt-5 rounded-7xl"
                          size={Size.Large}
                          onClick={() => navigate('/login')}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="font-bold text-neutral-900 text-2xl">
                          Reset Password
                        </div>
                        <form
                          className="mt-5"
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <Layout
                            fields={passwordField}
                            className="space-y-5"
                          />
                          <Button
                            type={Type.Submit}
                            label={'Reset Password'}
                            className="w-full mt-5 rounded-7xl"
                            loading={resetPasswordMutation.isLoading}
                            disabled={!isValid || !!errors?.password?.type}
                            size={Size.Large}
                          />
                        </form>
                      </>
                    )}
                  </div>
                ) : (
                  <PasswordExpiry />
                )}
              </>
            )}
          </div>
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
        {getBackground()}
        {getResetForm()}
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

export default ResetPassword;
