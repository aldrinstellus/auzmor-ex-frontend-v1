import { FC, useEffect } from 'react';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { Size, Type as ButtonType } from 'components/Button';
import { Logo } from 'components/Logo';
import WelcomeOffice from 'images/welcomeToOffice.png';
import { useMutation } from '@tanstack/react-query';
import { redirectWithToken } from 'utils/misc';
import { signup } from 'queries/account';
import { useDebounce } from 'hooks/useDebounce';
import { useDomainExists, useIsUserExistOpen } from 'queries/users';
import 'utils/custom-yup-validators/email/validateEmail';
import { Navigate } from 'react-router-dom';

interface IForm {
  fullName: string;
  workEmail: string;
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
  domain: yup
    .string()
    .min(3, 'The minimum length required is 3 characters for domain name')
    .max(63, 'The maximum length required is 63 characters for domain name')
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
    watch('domain'),
    watch('password'),
    watch('confirmPassword'),
    watch('privacyPolicy'),
  ]);

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

  return (
    <div className="flex h-screen w-screen">
      <img
        src={WelcomeOffice}
        className="h-full w-[48%]"
        data-testid="signup-cover-image"
        alt="Welcome to Auzmor Office"
      />
      <div className="w-[52%] h-full flex justify-center items-center relative bg-white overflow-y-auto">
        <div className="absolute top-8 right-8" data-testid="signup-logo-image">
          <Logo />
        </div>
        <div className="pt-8 w-full h-full max-w-[440px]">
          <div className="font-extrabold text-neutral-900 text-4xl">
            Sign Up
          </div>
          <form
            className="mt-12"
            onSubmit={handleSubmit(onSubmit)}
            data-testid="signup-form"
          >
            <Layout fields={fields} />
            <Button
              dataTestId="sign-up-btn"
              label={'Sign Up'}
              disabled={
                !isValid || !!errors?.password?.type || signupMutation.isLoading
              }
              className="w-full mt-8"
              type={ButtonType.Submit}
              size={Size.Large}
              loading={signupMutation.isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
