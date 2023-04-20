import React from 'react';
import { Input, Variant } from '@auzmorui/component-library.components.input';
import { Layout, FieldType } from '@auzmorui/component-library.components.form';
import { Variant as InputVariant } from '@auzmorui/component-library.components.input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  Button,
  Variant as ButtonVariant,
} from '@auzmorui/component-library.components.button';
import { Divider } from '@auzmorui/component-library.components.divider';

export interface IAddUsersProps {}

interface IForm {
  name: string;
  email: string;
  role: string;
}

const schema = yup.object({
  name: yup.string().required('Please enter name'),
  email: yup.string().email('Please enter valid email address'),
  role: yup.string().required('Please enter role'),
});

const AddUsers: React.FC<IAddUsersProps> = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const entries = [
    {
      type: FieldType.Input,
      InputVariant: InputVariant.Text,
      className: 'w-1/3',
      placeholder: 'Enter name',
      name: 'name',
      label: 'Full Name',
      error: errors.name?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      className: 'w-1/3',
      placeholder: 'Add via email',
      name: 'email',
      label: 'Email Address',
      error: errors.email?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      className: 'w-1/3',
      placeholder: 'Select Role',
      name: 'role',
      label: 'Role',
      error: errors.email?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
  ];

  return (
    <>
      <div className="overflow-y-auto">
        <div className="flex flex-col justify-center items-center mb-3">
          <Layout className="flex mt-6 space-x-8" fields={entries} />
          <Layout className="flex mt-6 space-x-8" fields={entries} />
        </div>
        <Button
          className="flex border-none mb-6 text-primary-500"
          label="Add Another"
          leftIcon="people"
          variant={ButtonVariant.Secondary}
        />
        <div className="flex justify-center item-center mb-6">
          <Divider className="w-[95%]" />
        </div>
      </div>
    </>
  );
};

export default AddUsers;
