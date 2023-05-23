import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import React, { ReactElement } from 'react';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import { Variant } from 'components/Input';
import { IGroupFieldsMappingForm } from './ConfigureLDAP';

type GroupFieldsMappingProps = {
  groupFieldsMappingData: IGroupFieldsMappingForm;
  groupFieldMappingControl: any;
  handleSubmit: any;
  onSubmit: any;
  closeModal: () => void;
  isError: boolean;
  isLoading: boolean;
};

const GroupFieldsMapping: React.FC<GroupFieldsMappingProps> = ({
  groupFieldsMappingData,
  groupFieldMappingControl,
  handleSubmit,
  closeModal,
  onSubmit,
  isError,
  isLoading,
}): ReactElement => {
  const groupFieldMappingFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'groupName',
      label: 'Group Name',
      control: groupFieldMappingControl,
      defaultValue: groupFieldsMappingData?.groupName,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'groupMemberUID',
      label: 'Group Member UID',
      control: groupFieldMappingControl,
      defaultValue: groupFieldsMappingData?.groupMemberUID,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'groupObjectFilter',
      label: 'Group Object Filter',
      control: groupFieldMappingControl,
      defaultValue: groupFieldsMappingData?.groupObjectFilter,
    },
  ];

  return (
    <form
      className="mt-8 ml-6 w-[450px] overflow-y-auto pr-6 "
      onSubmit={handleSubmit(onSubmit)}
    >
      <Layout fields={groupFieldMappingFields} />
      <Banner
        variant={BannerVariant.Error}
        title="Failed to integrate with your LDAP. Please try again."
        className={`${
          isError && !isLoading ? 'visible' : 'invisible'
        } mt-4 absolute bottom-20 left-0 right-0`}
      />
      <div className="bg-blue-50 p-0 absolute bottom-0 left-0 right-0">
        <div className="p-3 flex items-center justify-end gap-x-3">
          <Button
            className="font-bold"
            label="Cancel"
            onClick={closeModal}
            variant={ButtonVariant.Secondary}
          />
          <Button
            className="font-bold"
            label="Activate"
            variant={ButtonVariant.Primary}
            type={ButtonType.Submit}
            loading={isLoading}
          />
        </div>
      </div>
    </form>
  );
};

export default GroupFieldsMapping;
