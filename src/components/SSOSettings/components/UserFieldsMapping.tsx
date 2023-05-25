import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import React, { ReactElement } from 'react';
import { IUserFieldsMappingForm } from './ConfigureLDAP';

type UserFieldsMappingProps = {
  userFieldsMappingData: IUserFieldsMappingForm;
  userFieldMappingControl: any;
  userFieldMappingFormState: any;
  handleSubmit: any;
  onSubmit: any;
  closeModal: () => void;
  isError: boolean;
};

const UserFieldsMapping: React.FC<UserFieldsMappingProps> = ({
  userFieldsMappingData,
  userFieldMappingControl,
  userFieldMappingFormState,
  handleSubmit,
  onSubmit,
  closeModal,
  isError,
}): ReactElement => {
  const userFieldMappingFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'userName',
      label: 'User Name*',
      control: userFieldMappingControl,
      defaultValue: userFieldsMappingData?.userName,
      error: userFieldMappingFormState.errors.userName?.message,
      dataTestId: 'sso-config-ad-username',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'fullName',
      label: 'Full Name*',
      control: userFieldMappingControl,
      defaultValue: userFieldsMappingData?.fullName,
      error: userFieldMappingFormState.errors.fullName?.message,
      dataTestId: 'sso-config-ad-fullname',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'email',
      label: 'Email*',
      control: userFieldMappingControl,
      defaultValue: userFieldsMappingData?.email,
      error: userFieldMappingFormState.errors.email?.message,
      dataTestId: 'sso-config-ad-email',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'title',
      label: 'Title*',
      control: userFieldMappingControl,
      defaultValue: userFieldsMappingData?.title,
      error: userFieldMappingFormState.errors.title?.message,
      dataTestId: 'sso-config-ad-title',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'workMobile',
      label: 'Work Mobile',
      control: userFieldMappingControl,
      defaultValue: userFieldsMappingData?.workMobile,
      dataTestId: 'sso-config-ad-workmobile',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'userObjectFilter',
      label: 'User Object Filter',
      control: userFieldMappingControl,
      defaultValue: userFieldsMappingData?.userObjectFilter,
      dataTestId: 'sso-config-ad-userobjectfilter',
    },
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 ml-6 max-h-[400px] w-[450px] overflow-y-auto pb-12 pr-6">
        <Layout fields={userFieldMappingFields} />
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
            disabled={isError}
          />
        </div>
      </div>
    </form>
  );
};

export default UserFieldsMapping;
