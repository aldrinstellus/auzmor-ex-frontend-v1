import { FC, useEffect } from 'react';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { Size, Type as ButtonType } from 'components/Button';
import { Logo } from 'components/Logo';
import { useMutation } from '@tanstack/react-query';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { acceptInviteSetPassword, useVerifyInviteLink } from 'queries/users';
import PageLoader from 'components/PageLoader';
import InviteLinkExpired from './components/InviteLinkExpired';
import useAuth from 'hooks/useAuth';
import { useNavigateWithToken } from 'hooks/useNavigateWithToken';
import { usePageTitle } from 'hooks/usePageTitle';
import { useTranslation } from 'react-i18next';

interface IForm {
  workEmail: string;
  password: string;
  confirmPassword: string;
  privacyPolicy: boolean;
}

const schema = yup.object({
  workEmail: yup.string(),
  password: yup
    .string()
    .min(6, 'Password should be atleast 6 characters')
    .required('Required field'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Required field'),
  privacyPolicy: yup.boolean().required('Required field').oneOf([true]),
});

export interface IAcceptInviteProps {}

const AcceptInvite: FC<IAcceptInviteProps> = () => {
  usePageTitle('acceptInvite');
  const { t } = useTranslation('acceptInvite', {
    keyPrefix: 'acceptInvite',
  });
  const [searchParams, _] = useSearchParams();
  const token = searchParams.get('token');
  const orgId = searchParams.get('orgId');
  const { setUser, showOnboard, setShowOnboard } = useAuth();
  const navigate = useNavigate();
  const navigateWithToken = useNavigateWithToken();

  const { data, isLoading, isError, error } = useVerifyInviteLink({
    token,
    orgId,
  });

  const acceptInviteMutation = useMutation({
    mutationFn: acceptInviteSetPassword,
    mutationKey: ['accept-invite-mutation'],
    onSuccess: (data) =>
      navigateWithToken(
        data.result.data.uat,
        data.result.data.redirectUrl,
        setUser,
        navigate,
        setShowOnboard,
        showOnboard,
      ),
    onError: () => {},
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      workEmail: data?.result?.data?.email,
    },
  });

  useEffect(() => {
    acceptInviteMutation.reset();
  }, [watch('password'), watch('confirmPassword'), watch('privacyPolicy')]);

  const fields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: t('emailPlaceholder'),
      name: 'workEmail',
      label: t('emailLabel'),
      error: errors.workEmail?.message,
      dataTestId: 'signup-work-email',
      control,
      disabled: true,
      className:
        'text-neutral-400 disabled:border-none disabled:bg-neutral-200',
      inputClassName: 'h-[44px]',
    },
    {
      type: FieldType.Password,
      placeholder: t('passwordPlaceholder'),
      name: 'password',
      label: t('passwordLabel'),
      rightIcon: 'people',
      error: errors.password?.message,
      dataTestId: 'signup-work-password',
      control,
      inputClassName: 'h-[44px]',
    },
    {
      type: FieldType.Password,
      placeholder: t('confirmPasswordPlaceholder'),
      name: 'confirmPassword',
      label: t('confirmPasswordLabel'),
      rightIcon: 'people',
      error: errors.confirmPassword?.message,
      dataTestId: 'signup-work-re-password',
      control,
      showChecks: false,
      inputClassName: 'h-[44px]',
    },
    {
      type: FieldType.Checkbox,
      label: (
        <div data-testId="sign-up-checkbox">
          {t('agreementText')}{' '}
          <span className="text-primary-500">
            <a href={t('termsOfUseLink')}>{t('termsOfUse')}</a>
          </span>{' '}
          {t('and')}{' '}
          <span className="text-primary-500">
            <a href={t('privacyPolicyLink')}>{t('privacyPolicy')}</a>
          </span>
        </div>
      ),
      name: 'privacyPolicy',
      error: errors.privacyPolicy?.message,
      dataTestId: 'signup-work-privacy',
      control,
    },
  ];

  const onSubmit = (formData: IForm) =>
    acceptInviteMutation.mutate({ password: formData.password, token, orgId });

  // If a redirectUrl is present in the response of the verify invite link API,
  // we must redirect the user to that page because the user needs to get Auth'd by either SSO or LDAP
  if (data?.result?.data?.redirectUrl) {
    return window.location.replace(data.result.data.redirectUrl) as any;
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen">
        <PageLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <InviteLinkExpired
        message={(error as any).response.data.errors[0].message}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen">
      <div
        className="w-[49.3vw] h-full bg-welcome-to-office bg-no-repeat bg-cover bg-bottom"
        data-testid="signup-cover-image"
      />
      <div className="flex-1 flex justify-center items-center relative bg-white h-full overflow-y-auto">
        <div className="absolute top-[4.55vh] right-[3.5vw]">
          <Logo />
        </div>
        <div className="pt-[86px] 3xl:pt-[154px] mr-[60px] w-full max-w-[414px] h-full">
          <div className="font-extrabold text-neutral-900 text-4xl">
            {t('signUp')}
          </div>
          <form className="mt-14" onSubmit={handleSubmit(onSubmit)}>
            {!!acceptInviteMutation.isError && (
              <div className="mb-8">
                <Banner
                  title={
                    acceptInviteMutation.error?.toString() ||
                    t('somethingWentWrong')
                  }
                  variant={BannerVariant.Error}
                />
              </div>
            )}
            <Layout fields={fields} />
            <p className="py-4 text-xs text-neutral-900">
              {t('requiredField')}
            </p>
            <Button
              label={t('signUp')}
              disabled={!isValid}
              className="w-full mt-8"
              type={ButtonType.Submit}
              size={Size.Large}
              loading={acceptInviteMutation.isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
