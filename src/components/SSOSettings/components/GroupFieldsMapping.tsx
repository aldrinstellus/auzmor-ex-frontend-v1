import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';

type GroupFieldsMappingProps = {
  groupName?: string;
  groupMemberUid?: string;
  groupObjectFilter?: string;
  setData: (data: IGroupFieldsMappingForm) => void;
  closeModal: () => void;
  next: () => void;
};

export interface IGroupFieldsMappingForm {
  groupName?: string;
  groupMemberUid?: string;
  groupObjectFilter?: string;
}

const GroupFieldsMapping: React.FC<GroupFieldsMappingProps> = ({
  groupName = '',
  groupMemberUid = '',
  groupObjectFilter = '',
  setData,
  closeModal,
  next,
}): ReactElement => {
  const { control, getValues, handleSubmit } =
    useForm<IGroupFieldsMappingForm>();

  const userFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'groupName',
      label: 'Group Name',
      control,
      defaultValue: groupName,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'groupMemberUid',
      label: 'Group Member UID',
      control,
      defaultValue: groupMemberUid,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'groupObjectFilter',
      label: 'Group Object Filter',
      control,
      defaultValue: groupObjectFilter,
    },
  ];

  const onSubmit = () => {};

  return (
    <div className="min-h-[500px] flex flex-col justify-between">
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
            label="Activate"
            variant={ButtonVariant.Primary}
            type={ButtonType.Submit}
            onClick={next}
          />
        </div>
      </div>
    </div>
  );
};

export default GroupFieldsMapping;
