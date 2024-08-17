import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import { FC, ReactElement } from 'react';

type UserFieldsMappingProps = {
  userFieldMappingControl: any;
  userFieldMappingFormState: any;
  handleSubmit: any;
  onSubmit: any;
  closeModal: () => void;
  isError: boolean;
};

const UserFieldsMapping: FC<UserFieldsMappingProps> = ({
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
      dataTestId: 'sso-config-ad-workmobile',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'userObjectFilter',
      label: 'User Object Filter',
      control: userFieldMappingControl,
      dataTestId: 'sso-config-ad-userobjectfilter',
    },
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 ml-6 max-h-[400px] w-[450px] overflow-y-auto pb-12 pr-6">
        <Layout fields={userFieldMappingFields} />
      </div>

      <div className="bg-blue-50 mt-4 p-0 absolute bottom-0 left-0 right-0 rounded-b-9xl">
        <div className="p-3 flex items-center justify-between gap-x-3">
          <p className="py-4 text-xs text-neutral-900">* Required field</p>
          <div className="flex gap-3">
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
      </div>
    </form>
  );
};

export default UserFieldsMapping;
