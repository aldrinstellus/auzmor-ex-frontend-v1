import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant } from 'components/Input';
import React from 'react';
import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { IAddAppForm } from './AddApp';
import UploadIconButton from './UploadIconButton';
import Button, { Variant } from 'components/Button';

type AppDetailsFormProps = {
  control: Control<IAddAppForm, any>;
  errors: FieldErrors<IAddAppForm>;
  defaultValues?: IAddAppForm;
  setValue: UseFormSetValue<IAddAppForm>;
};

const AppDetailsForm: React.FC<AppDetailsFormProps> = ({
  control,
  errors,
  defaultValues,
  setValue,
}) => {
  const urlField = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter URL',
      name: 'url',
      label: 'URL *',
      control: control,
      defaultValue: defaultValues?.url,
      error: errors.url?.message,
      dataTestId: 'sso-config-ad-hostname',
    },
  ];

  const appFields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter label',
      name: 'label',
      label: 'Label *',
      control: control,
      defaultValue: defaultValues?.label,
      error: errors.label?.message,
      dataTestId: 'sso-config-ad-hostname',
    },
    {
      type: FieldType.TextArea,
      name: 'description',
      label: 'Short description',
      placeholder: 'Enter description',
      defaultValue: defaultValues?.description,
      dataTestId: 'about-me-edit-text',
      control,
      className: 'resize-none',
      rows: 3,
      maxLength: 300,
      showCounter: true,
    },
    {
      type: FieldType.CreatableSearch,
      variant: InputVariant.Text,
      placeholder: 'Select category',
      name: 'category',
      label: 'Category',
      control: control,
      defaultValue: defaultValues?.category,
      error: errors.category?.message,
      dataTestId: 'sso-config-ad-hostname',
    },
  ];

  return (
    <div className="py-3">
      <div className="pt-3">
        <Layout fields={urlField} />
      </div>
      <div className="flex justify-between gap-x-6 pt-6">
        <Layout fields={appFields} className="w-full flex flex-col gap-y-6" />
        <div className="w-full">
          <UploadIconButton setValue={setValue} />
          <div className="pt-6">
            <p className="text-neutral-900 font-bold pb-2">Audience</p>
            <Button variant={Variant.Secondary} label="Everyone" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetailsForm;
