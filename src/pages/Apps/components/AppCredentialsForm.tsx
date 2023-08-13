import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant } from 'components/Input';
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { IAddAppForm } from './AddApp';

type AppCredentialsFormProps = {
  control: Control<IAddAppForm, any>;
  errors: FieldErrors<IAddAppForm>;
  defaultValues?: IAddAppForm;
};

const AppCredentialsForm: React.FC<AppCredentialsFormProps> = ({
  control,
  errors,
  defaultValues,
}) => {
  const appCredentialFields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter ACS URL',
      name: 'acsUrl',
      label: 'ACS URL',
      control: control,
      defaultValue: defaultValues?.acsUrl,
      error: errors.acsUrl?.message,
      dataTestId: 'sso-config-ad-hostname',
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter Entity ID',
      name: 'entityId',
      label: 'Entity ID',
      control: control,
      defaultValue: defaultValues?.entityId,
      error: errors.entityId?.message,
      dataTestId: 'sso-config-ad-hostname',
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter Relay State',
      name: 'relayState',
      label: 'Relay State/Start URL',
      control: control,
      defaultValue: defaultValues?.relayState,
      error: errors.relayState?.message,
      dataTestId: 'sso-config-ad-hostname',
    },
  ];

  return (
    <div>
      {defaultValues?.label && (
        <div className="text-neutral-900 font-bold bg-orange-50 py-3 px-4">
          {defaultValues.label} app credentials
        </div>
      )}
      <p className="text-neutral-500 py-6">
        Below are credentials that allows you to access Auzmor Office APIs
      </p>
      <Layout fields={appCredentialFields} />
    </div>
  );
};

export default AppCredentialsForm;
