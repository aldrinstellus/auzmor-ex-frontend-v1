import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';

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
  const { control, getValues, handleSubmit } =
    useForm<IUserFieldsMappingForm>();

  const userFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'username',
      label: 'User Name*',
      control,
      defaultValue: username,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'fullName',
      label: 'Full Name*',
      control,
      defaultValue: fullName,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'email',
      label: 'Email*',
      control,
      defaultValue: email,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'title',
      label: 'Title*',
      control,
      defaultValue: title,
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

  const onSubmit = () => {};

  return (
    <div>
      <form
        className="mt-8 ml-6 max-h-[400px] w-[450px] overflow-y-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Layout fields={userFields} />
      </form>
      <div className="bg-blue-50 mt-4 p-0">
        <div className="p-3 flex items-center justify-end gap-x-3">
          <Button
            className="font-bold"
            label="Cancel"
            onClick={closeModal}
            variant={ButtonVariant.Primary}
          />
          <Button
            className="font-bold"
            label="Continue"
            variant={ButtonVariant.Primary}
            type={ButtonType.Submit}
            onClick={next}
          />
        </div>
      </div>
    </div>
  );
};

export default UserFieldsMapping;
