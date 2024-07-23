import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant } from 'components/Input';
import { Control, FieldErrors } from 'react-hook-form';
import { IAddAppForm } from './AddApp';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type AppCredentialsFormProps = {
  control: Control<IAddAppForm, any>;
  errors: FieldErrors<IAddAppForm>;
  defaultValues?: IAddAppForm;
};

const AppCredentialsForm: FC<AppCredentialsFormProps> = ({
  control,
  errors,
  defaultValues,
}) => {
  const { t } = useTranslation('appLauncher', {
    keyPrefix: 'appCredentialsForm',
  });
  const appCredentialFields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: t('acsUrlPlaceholder'),
      name: 'acsUrl',
      label: t('acsUrlLabel'),
      control: control,
      error: errors.acsUrl?.message,
      dataTestId: 'app-credentials-acs-url',
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: t('entityIdPlaceholder'),
      name: 'entityId',
      label: t('entityIdLabel'),
      control: control,
      error: errors.entityId?.message,
      dataTestId: 'app-credentials-entity-id',
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: t('relayStatePlaceholder'),
      name: 'relayState',
      label: t('relayStateLabel'),
      control: control,
      error: errors.relayState?.message,
      dataTestId: 'app-credentials-relay-state',
    },
  ];

  return (
    <div>
      {defaultValues?.label && (
        <div className="text-neutral-900 font-bold bg-orange-50 py-3 px-4">
          {t('credentialsHeader', { appName: defaultValues.label })}
        </div>
      )}
      <p className="text-neutral-500 py-6">{t('credentialsDescription')}</p>
      <Layout fields={appCredentialFields} />
    </div>
  );
};

export default AppCredentialsForm;
