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
  userName?: string;
  fullName?: string;
  email?: string;
  title?: string;
  workMobile?: string;
  userObjectFilter?: string;
  setData: (data: IUserFieldsMappingForm) => void;
  setError: (error: boolean) => void;
  closeModal: () => void;
  next: () => void;
};

export interface IUserFieldsMappingForm {
  userName: string;
  fullName: string;
  email: string;
  title: string;
  workMobile?: string;
  userObjectFilter?: string;
}

const schema = yup.object({
  userName: yup.string().required('Required field'),
  fullName: yup.string().required('Required field'),
  email: yup.string().email('Enter valid email').required('Required field'),
  title: yup.string().required('Required field'),
  workMobile: yup.string(),
  userObjectFilter: yup.string(),
});

const UserFieldsMapping: React.FC<UserFieldsMappingProps> = ({
  userName = '',
  fullName = '',
  email = '',
  title = '',
  workMobile = '',
  userObjectFilter = '',
  setData,
  setError,
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
    mode: 'onChange',
    defaultValues: {
      userName,
      fullName,
      email,
      title,
      workMobile,
      userObjectFilter,
    },
  });

  const userFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'userName',
      label: 'User Name*',
      control,
      defaultValue: userName,
      error: errors.userName?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'fullName',
      label: 'Full Name*',
      control,
      defaultValue: fullName,
      error: errors.fullName?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'email',
      label: 'Email*',
      control,
      defaultValue: email,
      error: errors.email?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'title',
      label: 'Title*',
      control,
      defaultValue: title,
      error: errors.title?.message,
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
    setError(false);
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 ml-6 max-h-[400px] w-[450px] overflow-y-auto pb-12 pr-6">
        <Layout fields={userFields} />
      </div>

      <div className="bg-blue-50 mt-4 p-0 absolute bottom-0 left-0 right-0">
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
            disabled={Object.keys(errors).length > 0}
          />
        </div>
      </div>
    </form>
  );
};

export default UserFieldsMapping;
