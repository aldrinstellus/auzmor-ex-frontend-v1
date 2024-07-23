import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import { FC, ReactElement } from 'react';

type ConnectionSettingsProps = {
  connectionSettingsControl: any;
  connectionSettingsFormState: any;
  handleSubmit: any;
  onSubmit: any;
  closeModal: () => void;
  isError: boolean;
};

const ConnectionSettings: FC<ConnectionSettingsProps> = ({
  connectionSettingsControl,
  connectionSettingsFormState,
  handleSubmit,
  onSubmit,
  closeModal,
  isError,
}): ReactElement => {
  const connectionSettingFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'hostName',
      label: 'Hostname*',
      control: connectionSettingsControl,
      error: connectionSettingsFormState.errors.hostName?.message,
      dataTestId: 'sso-config-ad-hostname',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'port',
      label: 'Port*',
      control: connectionSettingsControl,
      error: connectionSettingsFormState.errors.port?.message,
      dataTestId: 'sso-config-ad-port',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'baseDN',
      label: 'Base DN*',
      control: connectionSettingsControl,
      error: connectionSettingsFormState.errors.baseDN?.message,
      dataTestId: 'sso-config-ad-basedn',
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'groupBaseDN',
      label: 'Group Base DN',
      control: connectionSettingsControl,
      dataTestId: 'sso-config-ad-groupbasedn',
    },
  ];

  const userSettingFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'upnSuffix',
      label: 'UPN Suffix*',
      control: connectionSettingsControl,
      error: connectionSettingsFormState.errors.upnSuffix?.message,
      dataTestId: 'sso-config-ad-upnsuffix',
    },
  ];

  const authenticationSettingFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'administratorDN',
      label: 'Administrator DN*',
      control: connectionSettingsControl,
      error: connectionSettingsFormState.errors.administratorDN?.message,
      dataTestId: 'sso-config-ad-administratordn',
    },
    {
      type: FieldType.Input,
      variant: Variant.Password,
      placeholder: '',
      name: 'password',
      label: 'Password*',
      control: connectionSettingsControl,
      error: connectionSettingsFormState.errors.password?.message,
      dataTestId: 'sso-config-ad-password',
    },
    {
      type: FieldType.Checkbox,
      label: 'Allow Auzmor Office to authenticate as a fallback mechanism',
      labelDescription:
        'When the LDAP is down, Auzmor Office can authenticate the user. Organization Primary Admin can control this behavior by enabling/disabling the flag.',
      name: 'allowFallback',
      control: connectionSettingsControl,
      error: connectionSettingsFormState.errors.allowFallback?.message,
      dataTestId: 'sso-config-ad-allowfallback',
    },
  ];
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
        <Layout fields={authenticationSettingFields} />
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
              dataTestId="sso-config-ad-cta-cancel"
            />
            <Button
              className="font-bold"
              label="Continue"
              variant={ButtonVariant.Primary}
              type={ButtonType.Submit}
              disabled={isError}
              dataTestId="sso-config-ad-cta-continue"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ConnectionSettings;
