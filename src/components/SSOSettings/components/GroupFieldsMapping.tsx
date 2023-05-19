import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { IConnectionSettingsForm } from './ConnectionSettings';
import { IUserFieldsMappingForm } from './UserFieldsMapping';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { updateSso } from 'queries/organization';
import { IdentityProvider } from 'queries/organization';

const schema = yup.object({
  groupName: yup.string(),
  groupMemberUid: yup.string(),
  groupObjectFilter: yup.string(),
});

type GroupFieldsMappingProps = {
  groupName?: string;
  groupMemberUid?: string;
  groupObjectFilter?: string;
  closeModal: () => void;
  next: () => void;
  // The form data from the previous forms.
  connectionSettingsData?: IConnectionSettingsForm;
  userFieldsMappingData?: IUserFieldsMappingForm;
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
  closeModal,
  next,
  connectionSettingsData,
  userFieldsMappingData,
}): ReactElement => {
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IGroupFieldsMappingForm>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

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

  const updateSsoMutation = useMutation({
    mutationKey: ['update-sso-mutation-ldap'],
    mutationFn: updateSso,
    onError: (error: any) => {
      console.log('Error while updating sso: ', error);
    },
    onSuccess: (response: any) => {
      console.log('Updated sso successfully', response);
    },
  });

  const onSubmit = async () => {
    console.log({ connectionSettingsData, userFieldsMappingData });
    if (
      connectionSettingsData !== undefined &&
      userFieldsMappingData !== undefined
    ) {
      const groupFieldsMappingData: IGroupFieldsMappingForm = getValues();
      const ldapFormData = {
        connection: connectionSettingsData,
        userFieldMap: userFieldsMappingData,
        groupFieldMap: groupFieldsMappingData,
      };
      const formData = new FormData();

      formData.append('active', 'true');

      // Connection settings data
      formData.append(
        'config[connection][hostName]',
        connectionSettingsData.hostname,
      );
      formData.append('config[connection][port]', connectionSettingsData.port);
      formData.append(
        'config[connection][baseDN]',
        connectionSettingsData.baseDN,
      );
      if (connectionSettingsData.groupBaseDN) {
        formData.append(
          'config[connection][groupBaseDN]',
          connectionSettingsData.groupBaseDN,
        );
      }
      formData.append(
        'config[connection][upnSuffix]',
        connectionSettingsData.upnSuffix,
      );
      formData.append(
        'config[connection][authentication][adminDN]',
        connectionSettingsData.administratorDN,
      );
      formData.append(
        'config[connection][authentication][password]',
        connectionSettingsData.password,
      );

      // UserFieldMap data
      formData.append(
        'config[userFieldMap][userName]',
        userFieldsMappingData.username,
      );
      formData.append(
        'config[userFieldMap][fullName]',
        userFieldsMappingData.fullName,
      );
      formData.append(
        'config[userFieldMap][email]',
        userFieldsMappingData.email,
      );
      formData.append(
        'config[userFieldMap][title]',
        userFieldsMappingData.title,
      );
      if (userFieldsMappingData.workMobile) {
        formData.append(
          'config[userFieldMap][workMobile]',
          userFieldsMappingData.workMobile,
        );
      }
      if (userFieldsMappingData.userObjectFilter) {
        formData.append(
          'config[userFieldMap][userObjectFilter]',
          userFieldsMappingData.userObjectFilter,
        );
      }

      if (groupFieldsMappingData.groupName) {
        formData.append(
          'config[groupFieldMap][groupName]',
          groupFieldsMappingData.groupName,
        );
      }
      if (groupFieldsMappingData.groupMemberUid) {
        formData.append(
          'config[groupFieldMap][groupMemberUID]',
          groupFieldsMappingData.groupMemberUid,
        );
      }
      if (groupFieldsMappingData.groupObjectFilter) {
        formData.append(
          'config[groupFieldMap][groupObjectFilter]',
          '(objectclass=group)',
        );
      }

      const data = await updateSsoMutation.mutateAsync({
        idp: IdentityProvider.CUSTOM_LDAP,
        formData,
      });
    }
  };

  return (
    <form
      className="mt-8 ml-6 w-[450px] overflow-y-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col justify-between">
        <Layout fields={userFields} />
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
              label="Activate"
              variant={ButtonVariant.Primary}
              type={ButtonType.Submit}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default GroupFieldsMapping;
