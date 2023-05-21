import { yupResolver } from '@hookform/resolvers/yup';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

type ConnectionSettingsProps = {
  hostName?: string;
  port?: string;
  baseDN?: string;
  groupBaseDN?: string;
  upnSuffix?: string;
  administratorDN?: string;
  password?: string;
  allowFallback?: boolean;
  setData: (data: IConnectionSettingsForm) => void;
  setError: (error: boolean) => void;
  closeModal: () => void;
  next: () => void;
};

export interface IConnectionSettingsForm {
  hostName: string;
  port: string;
  baseDN: string;
  groupBaseDN?: string;
  upnSuffix: string;
  administratorDN: string;
  password: string;
  allowFallback?: boolean;
}

const schema = yup.object({
  hostName: yup.string().required('Required field'),
  port: yup.string().required('Required field'),
  baseDN: yup.string().required('Required field'),
  groupBaseDN: yup.string(),
  upnSuffix: yup.string().required('Required field'),
  administratorDN: yup.string().required('Required field'),
  password: yup.string().required('Required field'),
});

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({
  hostName = '',
  port = '',
  baseDN = '',
  groupBaseDN = '',
  upnSuffix = '',
  administratorDN = '',
  password = '',
  allowFallback = false,
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
  } = useForm<IConnectionSettingsForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      hostName,
      port,
      baseDN,
      groupBaseDN,
      upnSuffix,
      administratorDN,
      password,
      allowFallback,
    },
  });

  const connectionSettingFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'hostName',
      label: 'Hostname*',
      control,
      defaultValue: hostName,
      error: errors.hostName?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'port',
      label: 'Port*',
      control,
      defaultValue: port,
      error: errors.port?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'baseDN',
      label: 'Base DN*',
      control,
      defaultValue: baseDN,
      error: errors.baseDN?.message,
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
      error: errors.upnSuffix?.message,
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
      error: errors.administratorDN?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Password,
      placeholder: '',
      name: 'password',
      label: 'Password*',
      control,
      defaultValue: password,
      error: errors.password?.message,
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
    setError(false);
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 ml-6 max-h-[400px] w-[450px] overflow-y-auto pr-6 pb-12">
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

export default ConnectionSettings;
