import { yupResolver } from '@hookform/resolvers/yup';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Variant as InputVariant } from 'components/Input';
import Button, { Type as ButtonType, Size } from 'components/Button';
import 'utils/custom-yup-validators/email/validateEmail';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

export interface ILoginViaSSOProps {
  setViaSSO: (flag: boolean) => void;
}

interface IForm {
  email: string;
}

const schema = yup.object({
  email: yup.string().required('Required field').validateEmail(),
});

const LoginViaSSO: FC<ILoginViaSSOProps> = ({ setViaSSO }) => {
  const {
    watch,
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const email = watch('email');
  const { t } = useTranslation('auth', { keyPrefix: 'loginSso' });
  const { getApi } = usePermissions();
  const useLoginViaSSO = getApi(ApiEnum.LoginSSO);
  const { refetch, isFetching, error } = useLoginViaSSO(
    { email },
    {
      enabled: false,
      onError: (error: any) => {
        if (error.response.data.errors.length) {
          setError('email', {
            type: 'custom',
            message: error.response.data.errors[0].message,
          });
        }
      },
      onSuccess: (data: any) => {
        if (data && data.redirectUrl) {
          window.location = data.redirectUrl;
        }
      },
    },
  );

  const onSubmit = (_formData: IForm) => {
    refetch();
  };

  const getDataTestIdForValidationErrors = () => {
    if (!error || !!!(error as any)?.response) {
      return '';
    }
    const errorCode = (error as any).response.data.errors[0].code;
    if (errorCode === 'USER_IS_DEACTIVATED') {
      return 'sso-deleted-email-msg';
    } else if (errorCode === 'USER_EMAIL_NOT_FOUND') {
      return 'sso-invalid-email-msg';
    } else if (errorCode === 'USER_IS_NOT_ACTIVE') {
      return 'sso-inactive-email-msg';
    } else if (errorCode === 'SSO_DISABLED') {
      return 'sso-email-not-provisioned-msg';
    }
  };

  const fields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: t('emailPlaceholder'),
      name: 'email',
      label: t('emailLabel'),
      error: errors.email?.message,
      dataTestId: 'sso-email',
      errorDataTestId: getDataTestIdForValidationErrors(),
      control,
    },
  ];

  return (
    <div className="w-full max-w-[440px] relative h-full">
      <div className="font-extrabold text-neutral-900 text-2xl leading-[40px]">
        {t('title')}
      </div>
      <p className="text-neutral-500 font-medium text-xs mt-1">
        {t('subtitle')}
      </p>
      <form
        className="mt-5"
        onSubmit={handleSubmit(onSubmit)}
        data-testid="sso-signin-form"
      >
        <Layout fields={fields} className="space-y-5" />

        <Button
          dataTestId="sso-signin-btn"
          label={t('signInButton')}
          className="w-full mt-5 rounded-7xl"
          disabled={!isValid || isFetching}
          size={Size.Large}
          type={ButtonType.Submit}
        />
      </form>
      <div className="absolute bottom-0 flex justify-center w-full">
        <div className="text-sm font-normal">
          {t('rememberPassword')}
          <span
            className="text-primary-500 font-bold cursor-pointer"
            onClick={() => setViaSSO(false)}
            data-testid="sso-signin-cta"
          >
            {t('signInLink')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginViaSSO;
