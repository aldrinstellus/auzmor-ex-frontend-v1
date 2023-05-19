import { yupResolver } from '@hookform/resolvers/yup';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import React, { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

type ConnectionSettingsProps = {
  hostname: string;
  port: string;
  baseDN: string;
  groupBaseDN?: string;
  upnSuffix: string;
  administratorDN: string;
  password: string;
  allowFallback?: boolean;
  setData: (data: IConnectionSettingsForm) => void;
  closeModal: () => void;
  next: () => void;
};

export interface IConnectionSettingsForm {
  hostname: string;
  port: string;
  baseDN: string;
  groupBaseDN?: string;
  upnSuffix: string;
  administratorDN: string;
  password: string;
  allowFallback?: boolean;
}

const schema = yup.object({
  hostname: yup.string().required('Required field'),
  port: yup.string().required('Required field'),
  baseDN: yup.string().required('Required field'),
  groupBaseDN: yup.string(),
  upnSuffix: yup.string().required('Required field'),
  administratorDN: yup.string().required('Required field'),
  password: yup.string().required('Required field'),
});

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({
  hostname = '',
  port = '',
  baseDN = '',
  groupBaseDN = '',
  upnSuffix = '',
  administratorDN = '',
  password = '',
  allowFallback = false,
  setData,
  closeModal,
  next,
}): ReactElement => {
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IConnectionSettingsForm>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const connectionSettingFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'hostname',
      label: 'Hostname*',
      control,
      defaultValue: hostname,
      error: errors.hostname && 'Hostname is required',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'port',
      label: 'Port*',
      control,
      defaultValue: port,
      error: errors.port && 'Port is required',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'baseDN',
      label: 'Base DN*',
      control,
      defaultValue: baseDN,
      error: errors.baseDN && 'Base DN is required',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'groupBaseDN',
      label: 'Group Base DN',
      control,
      defaultValue: groupBaseDN,
    },
  ];

  const userSettingFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'upnSuffix',
      label: 'UPN Suffix*',
      control,
      defaultValue: upnSuffix,
      error: errors.upnSuffix && 'UPN Suffix is required',
    },
  ];

  const authenticationFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'administratorDN',
      label: 'Administrator DN*',
      control,
      defaultValue: administratorDN,
      error: errors.administratorDN && 'Administrator DN is required',
    },
    {
      type: FieldType.Input,
      variant: Variant.Password,
      placeholder: '',
      name: 'password',
      label: 'Password*',
      control,
      defaultValue: password,
      error: errors.password && 'Password is required',
    },
    {
      type: FieldType.Checkbox,
      label: 'Allow Auzmor Office to authenticate as a fallback mechanism',
      labelDescription:
        'When the LDAP is down, Auzmor Office can authenticate the user. Organization Primary Admin can control this behavior by enabling/disabling the flag.',
      name: 'allowFallback',
      control,
      defaultValue: allowFallback,
    },
  ];

  const onSubmit = () => {
    setData(getValues());
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 ml-6 max-h-[400px] w-[450px] overflow-y-auto">
        <Layout fields={connectionSettingFields} />
        <Divider className="mt-6 mb-4 !bg-neutral-100" />
        <p className="mb-6 text-neutral-900 font-bold text-base">
          User Setting:
        </p>
        <Divider className="mt-6 mb-4 !bg-neutral-100" />
        <Layout fields={userSettingFields} />
        <Divider className="mt-6 mb-4 !bg-neutral-100" />
        <p className="mb-6 text-neutral-900 font-bold text-base">
          Authentication:
        </p>
        <Divider className="mt-6 mb-4 !bg-neutral-100" />
        <Layout fields={authenticationFields} />
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

export default ConnectionSettings;
