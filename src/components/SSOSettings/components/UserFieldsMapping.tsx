import { yupResolver } from '@hookform/resolvers/yup';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

type UserFieldsMappingProps = {
  username: string;
  fullName: string;
  email: string;
  title: string;
  workMobile?: string;
  userObjectFilter?: string;
  setData: (data: IUserFieldsMappingForm) => void;
  closeModal: () => void;
  next: () => void;
};

export interface IUserFieldsMappingForm {
  username: string;
  fullName: string;
  email: string;
  title: string;
  workMobile?: string;
  userObjectFilter?: string;
}

const schema = yup.object({
  username: yup.string().required('Required field'),
  fullName: yup.string().required('Required field'),
  email: yup.string().required('Required field'),
  title: yup.string().required('Required field'),
  workMobile: yup.string(),
  userObjectFilter: yup.string(),
});

const UserFieldsMapping: React.FC<UserFieldsMappingProps> = ({
  username = '',
  fullName = '',
  email = '',
  title = '',
  workMobile = '',
  userObjectFilter = '',
  setData,
  closeModal,
  next,
}): ReactElement => {
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IUserFieldsMappingForm>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const userFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'username',
      label: 'User Name*',
      control,
      defaultValue: username,
      error: errors.username && 'User Name is required',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'fullName',
      label: 'Full Name*',
      control,
      defaultValue: fullName,
      error: errors.fullName && 'Full Name is required',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'email',
      label: 'Email*',
      control,
      defaultValue: email,
      error: errors.email && 'Email is required',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'title',
      label: 'Title*',
      control,
      defaultValue: title,
      error: errors.email && 'Title is required',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'workMobile',
      label: 'Work Mobile',
      control,
      defaultValue: workMobile,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'userObjectFilter',
      label: 'User Object Filter',
      control,
      defaultValue: userObjectFilter,
    },
  ];

  const onSubmit = () => {
    setData(getValues());
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 ml-6 max-h-[400px] w-[450px] overflow-y-auto">
        <Layout fields={userFields} />
      </div>

      <div className="bg-blue-50 mt-4 p-0">
        <div className="p-3 flex items-center justify-end gap-x-3">
          <Button
            className="font-bold"
            label="Cancel"
            onClick={closeModal}
            variant={ButtonVariant.Secondary}
          />
          <Button
            className="font-bold"
            label="Continue"
            variant={ButtonVariant.Primary}
            type={ButtonType.Submit}
          />
        </div>
      </div>
    </form>
  );
};

export default UserFieldsMapping;
