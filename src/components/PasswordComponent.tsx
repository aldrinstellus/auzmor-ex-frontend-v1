import React from 'react';
import { Layout } from '@auzmorui/component-library.components.form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export interface IPasswordComponentProps {
  fields: any,
}

interface IForm {
  password: string;
}

const schema = yup.object({
  password: yup.string().min(6, 'At least 6 digits'),
});

const PasswordComponent: React.FC<IPasswordComponentProps> = ({ fields }) => {

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  return (
    <form className="mt-16" onSubmit={handleSubmit(() => { })}>
      <Layout className="w-full" fields={fields} />
    </form>
  )
};

export default PasswordComponent;
