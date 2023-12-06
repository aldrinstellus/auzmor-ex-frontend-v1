import { FC, useEffect } from 'react';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { Size, Type as ButtonType } from 'components/Button';
import { useMutation } from '@tanstack/react-query';
import { getSubDomain, redirectWithToken } from 'utils/misc';
import { signup } from 'queries/account';
import { useDebounce } from 'hooks/useDebounce';
import { useDomainExists, useIsUserExistOpen } from 'queries/users';
import 'utils/custom-yup-validators/email/validateEmail';
import { Navigate } from 'react-router-dom';
import { useGetSSOFromDomain } from 'queries/organization';
import { useBrandingStore } from 'stores/branding';
import OfficeLogoSvg from 'components/Logo/images/OfficeLogo.svg';
import clsx from 'clsx';

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

const schema = yup.object({
  fullName: yup.string().required('Required Field'),
  workEmail: yup
    .string()
    .required('Required field')
    .validateEmail('The email address you entered is invalid'),
  orgName: yup
    .string()
    .required('Required field')
    .min(3, 'The minimum length required is 3 characters for company name')
    .max(63, 'The maximum length allowed is 100 characters for company name'),
  domain: yup
    .string()
    .min(3, 'The minimum length required is 3 characters for domain name')
    .max(63, 'The maximum length allowed is 63 characters for domain name')
    .matches(
      /^(?!-)(?!.*-$)/,
      'Hyphens cannot be used at the beginning and the end of a domain name',
    )
    .matches(
      /^(?!.*--).*$/,
      'Two hyphens cannot appear together in the domain name',
    )
    .matches(
      /^[a-zA-Z0-9-]+$/,
      'Spaces and special characters (such as ! $,&,_ and so on) cannot appear in the domain name',
    )
    .required('Required field'),
  password: yup.string().required('Required field'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Required field'),
  privacyPolicy: yup.boolean().required('Required field').oneOf([true]),
});

export interface ISignupProps {}

export interface IValidationErrors {
  isError: boolean;
  isLoading: boolean;
}

const Signup: FC<ISignupProps> = () => {
  const signupMutation = useMutation(
    (formData: IForm) =>
      signup({ ...formData, domain: formData.domain.toLowerCase() }),
    {
      onSuccess: (data) =>
        redirectWithToken({
          redirectUrl: data.result.data.redirectUrl,
          token: data.result.data.uat,
          showOnboard: true,
        }),
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
      placeholder: 'Enter your name',
      name: 'fullName',
      label: 'Full Name*',
      error: errors.fullName?.message,
      dataTestId: 'sign-up-fullname',
      errorDataTestId: 'signup-error-msg',
      control,
      inputClassName: 'h-[44px]',
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter your email address',
      name: 'workEmail',
      label: 'Work Email*',
      error: errors.workEmail?.message || errors.workEmail?.types?.exists,
      dataTestId: 'sign-up-email',
      errorDataTestId: 'signup-error-msg',
      control,
      inputClassName: 'h-[44px]',
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter your Company name',
      name: 'orgName',
      label: 'Company Name*',
      error: errors.orgName?.message,
      dataTestId: 'sign-up-orgname',
      errorDataTestId: 'signup-error-msg',
      control,
      inputClassName: 'h-[44px]',
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter domain',
      rightElement: (
        <div
          className="text-sm font-medium text-neutral-500"
          data-testId="sign-up-domain"
        >
          .office.auzmor.com
        </div>
      ),
      name: 'domain',
      label: 'Domain*',
      error: errors.domain?.message || errors.domain?.types?.domainExists,
      dataTestId: 'sign-up-domain',
      errorDataTestId: 'signup-error-msg',
      control,
      inputClassName: 'h-[44px]',
    },
    {
      type: FieldType.Password,
      InputVariant: InputVariant.Password,
      placeholder: 'Enter password',
      name: 'password',
      label: 'Password*',
      rightIcon: 'people',
      error: errors.password?.message,
      setError,
      dataTestId: 'sign-up-password',
      errorDataTestId: 'signup-error-msg',
      control,
      getValues,
      onChange: () => {},
      inputClassName: 'h-[44px]',
    },
    {
      type: FieldType.Password,
      placeholder: 'Re-Enter password',
      name: 'confirmPassword',
      label: 'Confirm Password*',
      rightIcon: 'people',
      error: errors.confirmPassword?.message,
      dataTestId: 'sign-up-confirm-password',
      control,
      showChecks: false,
      errorDataTestId: 'signup-error-msg',
      inputClassName: 'h-[44px]',
    },
    {
      type: FieldType.Checkbox,
      label: (
        <div data-testId="sign-up-checkbox">
          By Signing up you are agreeing to Auzmor Office’s{' '}
          <span className="text-primary-500">
            <a href="https://www.auzmor.com/tc">Terms of Use</a>
          </span>{' '}
          and{' '}
          <span className="text-primary-500">
            <a href="https://www.auzmor.com/privacy-policy">Privacy Policy</a>
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
          exists:
            'The login email already exists. Please try a different email address.',
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
          domainExists: 'Domain name is already taken',
        },
      });
    }
  }, [isDomainLoading, isDomainData, signupMutation.error]);

  if (
    process.env.NODE_ENV !== 'development' &&
    process.env.REACT_APP_BASE_URL !== window.location.origin
  ) {
    return <Navigate to="/feed" />;
  }

  if (isDomainInfoLoading) {
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

  const getSignupForm = () => {
    return (
      <>
        {branding?.loginConfig?.layout === 'RIGHT' && getLoginText()}
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
          <div className="max-w-[440px]">
            <div className="font-bold text-neutral-900 text-2xl">Sign Up</div>
            <form
              className="mt-4"
              onSubmit={handleSubmit(onSubmit)}
              data-testid="signup-form"
            >
              <Layout fields={fields} className="space-y-4" />
              <Button
                dataTestId="sign-up-btn"
                label={'Sign Up'}
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
        {branding?.loginConfig?.layout === 'LEFT' && getLoginText()}
      </>
    );
  };

  const getLoginText = () => {
    if (
      !!branding?.loginConfig?.text &&
      branding?.loginConfig?.backgroundType === 'COLOR' &&
      branding?.loginConfig?.layout !== 'CENTER'
    ) {
      return (
        <div className="w-[50vw] flex items-center px-14">
          <p
            className="text-white text-6xl font-extrabold z-10 leading-[72px]"
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
