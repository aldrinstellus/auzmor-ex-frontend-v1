import { ChangeEvent, FC, useEffect } from 'react';
import OfficeLogoSvg from 'components/Logo/images/OfficeLogo.svg';
import Layout, { FieldType } from 'components/Form';
import Button, { Size, Type } from 'components/Button';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useNavigate from 'hooks/useNavigation';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from 'queries/account';
import 'utils/custom-yup-validators/email/validateEmail';
import { useBrandingStore } from 'stores/branding';
import { getSubDomain, isDark } from 'utils/misc';
import { useGetSSOFromDomain } from 'queries/organization';
import clsx from 'clsx';
import { usePageTitle } from 'hooks/usePageTitle';
import { useTranslation } from 'react-i18next';
import { Success } from 'components/Logo';

interface IForgotPasswordProps {}

interface IForm {
  email: string;
}

const schema = yup.object({
  email: yup.string().required().validateEmail(),
});

const ForgotPassword: FC<IForgotPasswordProps> = () => {
  usePageTitle('forgotPassword');
  const navigate = useNavigate();
  const { t } = useTranslation('auth', { keyPrefix: 'forgotPassword' });
  const forgotPasswordMutation = useMutation((formData: any) =>
    forgotPassword(formData),
  );

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    forgotPasswordMutation.reset();
  }, [watch('email')]);

  const fields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      className: 'w-full',
      placeholder: t('placeholder'),
      name: 'email',
      label: t('label'),
      error: errors.email?.message,
      control,
      getValues,
      onChange: (_data: string, _e: ChangeEvent) => {},
    },
  ];

  const onSubmit = (formData: IForm) => {
    forgotPasswordMutation.mutate(formData);
  };

  const domain = getSubDomain(window.location.host);
  const { isFetching } = useGetSSOFromDomain(
    domain,
    domain !== '' ? true : false,
  );
  const branding = useBrandingStore((state) => state.branding);

  if (isFetching) {
    return null;
  }

  const getBackground = () => {
    const defaultBackground = (
      <div
        className={`w-1/2 h-full absolute top-0 ${
          branding?.loginConfig?.layout === 'CENTER' &&
          'bg-welcome-to-office-large w-screen'
        } bg-no-repeat bg-cover bg-bottom ${
          branding?.loginConfig?.layout === 'LEFT' && 'right-0'
        } ${branding?.loginConfig?.layout === 'RIGHT' && 'left-0'}`}
        data-testid="signin-cover-image"
      >
        {branding?.loginConfig?.layout === 'LEFT' && (
          <div className="w-full float-right bg-welcome-to-office h-full bg-no-repeat bg-cover bg-bottom"></div>
        )}
        {branding?.loginConfig?.layout === 'RIGHT' && (
          <div className="w-full float-left bg-welcome-to-office h-full bg-no-repeat bg-cover bg-bottom"></div>
        )}
      </div>
    );
    if (branding?.loginConfig) {
      switch (branding?.loginConfig?.backgroundType) {
        case 'IMAGE':
          if (branding?.loginConfig?.image?.original) {
            return (
              <div
                className={`h-full absolute top-0 bg-no-repeat bg-cover ${
                  branding?.loginConfig?.layout === 'LEFT' && '!right-0 w-1/2'
                } ${
                  branding?.loginConfig?.layout === 'RIGHT' && '!left-0 w-1/2'
                } ${
                  branding?.loginConfig?.layout === 'CENTER' &&
                  'w-screen left-0'
                }`}
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
              <div
                className={`h-full absolute top-0 bg-no-repeat bg-cover ${
                  branding?.loginConfig?.layout === 'LEFT' && '!right-0 w-1/2'
                } ${
                  branding?.loginConfig?.layout === 'RIGHT' && '!left-0 w-1/2'
                } ${
                  branding?.loginConfig?.layout === 'CENTER' &&
                  'w-screen left-0'
                }`}
              >
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
                className={`h-full absolute top-0 bg-no-repeat bg-cover ${
                  branding?.loginConfig?.layout === 'LEFT' && '!right-0 w-1/2'
                } ${
                  branding?.loginConfig?.layout === 'RIGHT' && '!left-0 w-1/2'
                } ${
                  branding?.loginConfig?.layout === 'CENTER' &&
                  'w-screen left-0'
                }`}
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

  const getForgotPasswordForm = () => {
    return (
      <>
        {branding?.loginConfig?.layout === 'RIGHT' && getBannerText()}
        <div
          className={`flex flex-col items-center justify-center bg-neutral-50 overflow-y-auto w-[50vw] h-full z-10 gap-12 py-[100px] ${
            branding?.loginConfig?.layout === 'CENTER' &&
            'min-h-[660px] !h-auto rounded-16xl w-[600px] !py-20'
          }`}
          data-testid={getDataTestId()}
        >
          <div
            className="flex justify-center items-center min-w-[55px] max-w-[300px] min-h-[50px] object-contain"
            data-testid="signin-logo-image"
          >
            <img
              src={branding?.logo?.original || OfficeLogoSvg}
              alt="Office Logo"
              className="h-full"
            />
          </div>
          <div className="w-full max-w-[440px]">
            {forgotPasswordMutation.isSuccess ? (
              <div className="h-full flex flex-col justify-center">
                <div
                  className="text-center flex justify-center items-center flex-col space-y-9"
                  data-testid="forgot-password-success-message"
                >
                  <Success />
                  <div>
                    {t('successMessage')} <b>{getValues().email}</b>{' '}
                    {t('successMessage2')}
                  </div>
                </div>
                <Button
                  label={t('backToSignInLabel')}
                  className="w-full mt-5 rounded-7xl"
                  onClick={() => navigate('/login')}
                  size={Size.Large}
                />
              </div>
            ) : (
              <>
                <div className="font-bold text-neutral-900 text-2xl">
                  {t('title')}
                </div>
                <form
                  className="mt-5"
                  onSubmit={handleSubmit(onSubmit)}
                  data-testid="forgot-password-form"
                >
                  <Layout fields={fields} className="space-y-5" />
                  <Button
                    type={Type.Submit}
                    label={t('submitLabel')}
                    loading={forgotPasswordMutation.isLoading}
                    className="w-full mt-5 rounded-7xl"
                    size={Size.Large}
                    disabled={!isValid}
                    data-testid="forgot-password-submit"
                  />
                </form>
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
        <div className="w-[50vw] flex items-center justify-center">
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

  const setForgotPasswordForm = () => {
    return (
      <>
        {getBackground()}
        {getForgotPasswordForm()}
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

  return <div className={containerStyle}>{setForgotPasswordForm()}</div>;
};

export default ForgotPassword;
