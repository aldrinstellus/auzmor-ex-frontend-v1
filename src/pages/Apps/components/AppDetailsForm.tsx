import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant } from 'components/Input';
import React from 'react';
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { IAddAppForm } from './AddApp';
import UploadIconButton from './UploadIconButton';
import Button, { Variant } from 'components/Button';
import { App, CategoryType } from 'queries/apps';

type AppDetailsFormProps = {
  control: Control<IAddAppForm, any>;
  errors: FieldErrors<IAddAppForm>;
  defaultValues: UseFormGetValues<IAddAppForm>;
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
      defaultValue: defaultValues()?.url,
      error: errors.url?.message,
      dataTestId: 'add-app-url',
      errorDataTestId: 'add-app-url-invalid-error',
      inputClassName:
        errors.url || !defaultValues()?.url ? '' : 'text-blue-500 underline',
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
      defaultValue: defaultValues()?.label,
      error: errors.label?.message,
      errorDataTestId: 'add-app-label-empty-error',
      dataTestId: 'add-app-label',
    },
    {
      type: FieldType.TextArea,
      name: 'description',
      label: 'Short description',
      placeholder: 'Enter description',
      defaultValue: defaultValues()?.description,
      error: errors.description?.message,
      maxLength: 300,
      disableMaxLength: true,
      errorDataTestId: 'add-app-exceed-description',
      dataTestId: 'about-app-description',
      control,
      className: 'resize-none rounded-9xl',
      rows: 3,
      showCounter: true,
    },
    {
      type: FieldType.CreatableSearch,
      variant: InputVariant.Text,
      placeholder: 'Select category',
      name: 'category',
      label: 'Category',
      control: control,
      defaultValue: defaultValues()?.category?.label,
      categoryType: CategoryType.APP,
      dataTestId: 'add-app-category',
      addItemDataTestId: 'add-app-add-category',
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
          <UploadIconButton setValue={setValue} icon={defaultValues()?.icon} />
          <div className="pt-6">
            <p className="text-neutral-900 font-bold pb-1 text-sm">Audience</p>
            <Button variant={Variant.Secondary} label="Everyone" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetailsForm;
