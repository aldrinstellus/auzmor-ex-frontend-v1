import { useMutation } from '@tanstack/react-query';
import { login } from 'queries/account';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
  Size,
} from 'components/Button';
import { getSubDomain, readFirstAxiosError } from 'utils/misc';
import { Link, useNavigate } from 'react-router-dom';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import { useGetSSOFromDomain } from 'queries/organization';
import { useLoginViaSSO } from 'queries/auth';
import 'utils/custom-yup-validators/email/validateEmail';
import { FC } from 'react';
import useAuth from 'hooks/useAuth';
import { useNavigateWithToken } from 'hooks/useNavigateWithToken';

export interface ILoginViaCredProps {
  setViaSSO: (flag: boolean) => void;
}

interface IForm {
  email: string;
  password: string;
  domain?: string;
}

const schema = yup.object({
  email: yup
    .string()
    .required('Required field')
    .validateEmail(
      'Invalid email address. Please enter a valid email address.',
    ),
  password: yup.string().required('Required field'),
  domain: yup.string(),
});

const LoginViaCred: FC<ILoginViaCredProps> = ({ setViaSSO }) => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const navigateWithToken = useNavigateWithToken();
  const loginMutation = useMutation((formData: IForm) => login(formData), {
    onSuccess: (data) =>
      navigateWithToken(
        data.result.data.uat,
        data.result.data.redirectUrl,
        setUser,
        navigate,
      ),
  });

  const domain = getSubDomain(window.location.host);
  const { data } = useGetSSOFromDomain(domain, domain !== '' ? true : false);

  const { refetch } = useLoginViaSSO(
    { domain },
    {
      enabled: false,
      onSuccess: (data: any) => {
        if (data && data.redirectUrl) {
          window.location = data.redirectUrl;
        }
      },
    },
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    defaultValues: { domain },
    mode: 'onChange',
  });

  const onSubmit = (formData: IForm) => {
    loginMutation.mutate({ ...formData, domain });
  };

  const fields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter your email address / username',
      name: 'email',
      label: 'Work Email / Username',
      error: errors.email?.message || loginMutation.isError,
      dataTestId: 'signin-email',
      errorDataTestId: 'signin-invalid-email-format-msg',
      control,
      inputClassName: 'h-[44px]',
    },
    {
      type: FieldType.Password,
      placeholder: 'Enter password',
      name: 'password',
      label: 'Password',
      rightIcon: 'people',
      error: errors.password?.message || loginMutation.isError,
      dataTestId: 'signin-password',
      control,
      showChecks: false,
      inputClassName: 'h-[44px]',
    },
  ];

  return (
    <div className="w-full max-w-[440px]">
      <div className="font-extrabold text-neutral-900 text-2xl">Signin</div>
      <div className="text-neutral-500 text-xs font-medium mt-1">
        Hi, enter your details to get signed in to your account
      </div>
      <form
        className="mt-5"
        onSubmit={handleSubmit(onSubmit)}
        data-testid="signin-form"
      >
        {!!loginMutation.isError && (
          <div className="mb-5">
            <Banner
              dataTestId="signin-error-message"
              title={
                readFirstAxiosError(loginMutation.error) ||
                'Email address or password is incorrect'
              }
              variant={BannerVariant.Error}
            />
          </div>
        )}

        <Layout fields={fields} className="space-y-5" />
        <div
          className="flex justify-end mt-1"
          data-testId="signin-forgot-password"
        >
          <Link to="/forgot-password">
            <div className="font-bold text-xs leading-[18px]">
              Forgot Password?
            </div>
          </Link>
        </div>
        <Button
          dataTestId="signin-btn"
          label={'Sign In'}
          className="w-full mt-5 !rounded-7xl"
          disabled={!isValid}
          size={Size.Large}
          type={ButtonType.Submit}
          loading={loginMutation.isLoading}
        />
      </form>
      {((data?.result?.data?.sso?.active &&
        data?.result?.data?.sso?.idp !== 'CUSTOM_LDAP') ||
        !!!domain) && (
        <Button
          dataTestId="signin-sso-cta"
          label={'Sign In via SSO'}
          variant={ButtonVariant.Secondary}
          size={Size.Large}
          className="w-full mt-5 h-[44px] !rounded-7xl"
          disabled={loginMutation.isLoading}
          onClick={() => {
            if (domain) {
              refetch();
            } else {
              setViaSSO(true);
            }
          }}
        />
      )}
    </div>
  );
};

export default LoginViaCred;
