import { ChangeEvent, FC, useEffect } from 'react';
import { Logo } from 'components/Logo';
import { Success } from 'components/Logo';
import Layout, { FieldType } from 'components/Form';
import Button, { Size, Type } from 'components/Button';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from 'queries/account';
import 'utils/custom-yup-validators/email/validateEmail';

interface IForgotPasswordProps {}

interface IForm {
  email: string;
}

const schema = yup.object({
  email: yup.string().required().validateEmail(),
});

const ForgotPassword: FC<IForgotPasswordProps> = () => {
  const navigate = useNavigate();

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
      placeholder: 'Enter your email address / username',
      name: 'email',
      label: 'Work Email / Username',
      error: errors.email?.message,
      control,
      getValues,
      onChange: (_data: string, _e: ChangeEvent) => {},
    },
  ];

  const onSubmit = (formData: IForm) => {
    forgotPasswordMutation.mutate(formData);
  };

  return (
    <div className="flex h-screen w-screen">
      <div
        className="w-[49.3vw] h-full bg-welcome-to-office bg-no-repeat bg-cover bg-bottom"
        data-testid="forgot-password-cover-image"
      />

      <div className="flex-1 h-full flex justify-center relative bg-white overflow-y-auto">
        <div
          className="absolute top-[4.55vh] right-[3.5vw]"
          data-testid="forgot-password-logo-image"
        >
          <Logo />
        </div>
        <div className="pt-[6.5px] 3xl:pt-[63px] mr-[60px] ml-[8.5px] w-[414px] h-full">
          <div className="w-full max-w-[414px]">
            {forgotPasswordMutation.isSuccess ? (
              <div className="h-full pt-[270px] flex flex-col justify-center">
                <div
                  className="text-center flex justify-center items-center flex-col space-y-9"
                  data-testid="forgot-password-success-message"
                >
                  <Success />
                  <div>
                    Email has been sent to
                    <b>{getValues().email}</b> with instructions on resetting
                    your password.
                  </div>
                </div>
                <Button
                  label={'Back to Sign In'}
                  className="w-full mt-8"
                  onClick={() => navigate('/login')}
                  size={Size.Large}
                />
              </div>
            ) : (
              <div className="mt-20">
                <div className="font-extrabold text-neutral-900 text-4xl">
                  Forgot Password
                </div>
                <form
                  className="mt-32"
                  onSubmit={handleSubmit(onSubmit)}
                  data-testid="forgot-password-form"
                >
                  <Layout fields={fields} />
                  <Button
                    type={Type.Submit}
                    label={'Reset Via Email'}
                    loading={forgotPasswordMutation.isLoading}
                    className="w-full mt-8"
                    size={Size.Large}
                    disabled={!isValid}
                    data-testid="forgot-password-submit"
                  />
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
