import { FC, useEffect } from 'react';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { Size, Type as ButtonType } from 'components/Button';
import { useMutation } from '@tanstack/react-query';
import { getSubDomain, isDark } from 'utils/misc';
import { signup } from 'queries/account';
import { useDebounce } from 'hooks/useDebounce';
import { useDomainExists, useIsUserExistOpen } from 'queries/users';
import 'utils/custom-yup-validators/email/validateEmail';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGetSSOFromDomain } from 'queries/organization';
import { useBrandingStore } from 'stores/branding';
import OfficeLogoSvg from 'components/Logo/images/OfficeLogo.svg';
import clsx from 'clsx';
import useAuth from 'hooks/useAuth';
import { useNavigateWithToken } from 'hooks/useNavigateWithToken';
import { usePageTitle } from 'hooks/usePageTitle';
import { useTranslation } from 'react-i18next';

interface IForm {
  fullName: string;
  workEmail: string;
  orgName: string;
  domain: string;
  password: string;
  confirmPassword: string;
  privacyPolicy: boolean;
  customError?: string;
}

export interface ISignupProps {}

export interface IValidationErrors {
  isError: boolean;
  isLoading: boolean;
}

const Signup: FC<ISignupProps> = () => {
  usePageTitle('signup');
  const { t } = useTranslation('auth', { keyPrefix: 'signUp' });
  const { setUser, setShowOnboard } = useAuth();
  const navigate = useNavigate();
  const navigateWithToken = useNavigateWithToken();
  const schema = yup.object({
    fullName: yup
      .string()
      .required(t('fullNameError.required'))
      .min(3, t('fullNameError.minLength')),
    workEmail: yup
      .string()
      .required(t('workEmailError.required'))
      .validateEmail(t('workEmailError.invalid')),
    orgName: yup
      .string()
      .required(t('orgNameError.required'))
      .min(3, t('orgNameError.minLength'))
      .max(63, t('orgNameError.maxLength')),
    domain: yup
      .string()
      .min(3, t('domainError.minLength'))
      .max(63, t('domainError.maxLength'))
      .matches(/^(?!-)(?!.*-$)/, t('domainError.hyphenStartEnd'))
      .matches(/^(?!.*--).*$/, t('domainError.doubleHyphen'))
      .matches(/^[a-zA-Z0-9-]+$/, t('domainError.invalid'))
      .required(t('domainError.required')),
    password: yup.string().required(t('passwordError.required')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('confirmPasswordError.mismatch'))
      .required(t('confirmPasswordError.required')),
    privacyPolicy: yup
      .boolean()
      .required(t('privacyPolicyError'))
      .oneOf([true]),
  });
  const signupMutation = useMutation(
    (formData: IForm) =>
      signup({ ...formData, domain: formData.domain.toLowerCase() }),
    {
      onSuccess: (data) =>
        navigateWithToken(
          data.result.data.uat,
          data.result.data.redirectUrl,
          setUser,
          navigate,
          setShowOnboard,
        ),
      onError: (_data: any) => {},
    },
  );

  const {
    watch,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
    setError,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      workEmail: '',
      orgName: '',
      password: '',
      confirmPassword: '',
      domain: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    signupMutation.reset();
  }, [
    watch('fullName'),
    watch('workEmail'),
    watch('orgName'),
    watch('domain'),
    watch('password'),
    watch('confirmPassword'),
    watch('privacyPolicy'),
  ]);

  const domain = getSubDomain(window.location.host);
  const { isFetching: isDomainInfoLoading } = useGetSSOFromDomain(
    domain,
    domain !== '' ? true : false,
  );
  const branding = useBrandingStore((state) => state.branding);
  const fields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      error: errors.fullName?.message,
      dataTestId: 'sign-up-fullname',
      errorDataTestId: 'signup-error-msg',
      control,
      inputClassName: 'h-[44px]',
      label: t('fullName'),
      name: 'fullName',
      placeholder: t('fullNamePlaceholder'),
      autoComplete: 'name',
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      name: 'workEmail',
      error: errors.workEmail?.message || errors.workEmail?.types?.exists,
      dataTestId: 'sign-up-email',
      errorDataTestId: 'signup-error-msg',
      control,
      label: t('workEmail'),
      placeholder: t('workEmailPlaceholder'),
      autoComplete: 'email',
      inputClassName: 'h-[44px]',
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      name: 'orgName',
      dataTestId: 'sign-up-orgname',
      errorDataTestId: 'signup-error-msg',
      control,
      inputClassName: 'h-[44px]',
      label: t('orgName'),
      placeholder: t('orgNamePlaceholder'),
      autoComplete: 'organization',
      error: errors?.orgName?.message,
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      rightElement: (
        <div
          className="text-sm font-medium text-neutral-500"
          data-testId="sign-up-domain"
        >
          {t('domainSuffix')}
        </div>
      ),
      name: 'domain',
      error: errors.domain?.message || errors.domain?.types?.domainExists,
      dataTestId: 'sign-up-domain',
      errorDataTestId: 'signup-error-msg',
      control,
      inputClassName: 'h-[44px]',
      label: t('domain'),
      placeholder: t('domainPlaceholder'),
    },
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      name: 'password',
      rightIcon: 'people',
      error: errors.password?.message,
      setError,
      dataTestId: 'sign-up-password',
      errorDataTestId: 'signup-error-msg',
      control,
      getValues,
      onChange: () => {},
      inputClassName: 'h-[44px]',
      label: t('password'),
      placeholder: t('passwordPlaceholder'),
      autoComplete: 'new-password',
    },
    {
      type: FieldType.Password,
      name: 'confirmPassword',
      rightIcon: 'people',
      error: errors.confirmPassword?.message,
      dataTestId: 'sign-up-confirm-password',
      control,
      showChecks: false,
      errorDataTestId: 'signup-error-msg',
      inputClassName: 'h-[44px]',
      label: t('confirmPassword'),
      placeholder: t('confirmPasswordPlaceholder'),
      autoComplete: 'new-password',
    },
    {
      type: FieldType.Checkbox,
      label: (
        <div data-testId="sign-up-checkbox">
          {t('privacyPolicy')}{' '}
          <span className="text-primary-500">
            <a href="https://www.auzmor.com/tc">{t('termsOfUse')}</a>
          </span>{' '}
          {t('and')}{' '}
          <span className="text-primary-500">
            <a href="https://www.auzmor.com/privacy-policy">
              {t('privacyPolicyHeader')}
            </a>
          </span>
        </div>
      ),
      name: 'privacyPolicy',
      error: errors.privacyPolicy?.message,
      dataTestId: 'sign-up-checkbox',
      errorDataTestId: 'signup-error-msg',
      control,
    },
  ];

  const onSubmit = (formData: IForm) => {
    signupMutation.mutate(formData);
  };

  const debouncedEmailValue = useDebounce(getValues().workEmail, 500);
  const { isLoading: isEmailLoading, data: isEmailData } =
    useIsUserExistOpen(debouncedEmailValue);

  const debouncedDomainValue = useDebounce(getValues().domain, 500);
  const { isLoading: isDomainLoading, data: isDomainData } =
    useDomainExists(debouncedDomainValue);

  useEffect(() => {
    if (
      isEmailData?.result?.data?.exists ||
      signupMutation.error?.response?.data?.errors[0]?.code ===
        'USER_ALREADY_EXISTS'
    ) {
      setError('workEmail', {
        types: {
          exists: t('workEmailError.exists'),
        },
      });
    }
  }, [isEmailLoading, isEmailData, signupMutation.error]);

  useEffect(() => {
    if (
      isDomainData?.data?.exists ||
      signupMutation.error?.response?.data?.errors[0]?.code ===
        'DUPLICATE_DOMAIN'
    ) {
      setError('domain', {
        types: {
          domainExists: t('domainError.domainExists'),
        },
      });
    }
  }, [isDomainLoading, isDomainData, signupMutation.error]);

  if (
    process.env.NODE_ENV !== 'development' &&
    process.env.REACT_APP_OFFICE_BASE_URL !== window.location.origin
  ) {
    return <Navigate to="/feed" />;
  }

  if (isDomainInfoLoading) {
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

  const getSignupForm = () => {
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
          <div className="max-w-[440px]">
            <div className="font-bold text-neutral-900 text-2xl">
              {t('title')}
            </div>
            <form
              className="mt-4"
              onSubmit={handleSubmit(onSubmit)}
              data-testid="signup-form"
            >
              <Layout fields={fields} className="space-y-4" />
              <p className="py-4 text-xs text-neutral-900">
                {t('requiredFieldNote')}
              </p>
              <Button
                dataTestId="sign-up-btn"
                label={t('submitButtonLabel')}
                disabled={
                  !isValid ||
                  !!errors?.password?.type ||
                  signupMutation.isLoading
                }
                className="w-full mt-4 rounded-7xl"
                type={ButtonType.Submit}
                size={Size.Large}
                loading={signupMutation.isLoading}
              />
            </form>
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

  const setLoginForm = () => {
    return (
      <>
        {getBackground()}
        {getSignupForm()}
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

export default Signup;
