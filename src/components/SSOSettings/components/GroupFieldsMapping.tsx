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
import Banner, { Variant as BannerVariant } from 'components/Banner';

const schema = yup.object({
  groupName: yup.string(),
  groupMemberUID: yup.string(),
  groupObjectFilter: yup.string(),
});

type GroupFieldsMappingProps = {
  groupName?: string;
  groupMemberUID?: string;
  groupObjectFilter?: string;
  closeModal: () => void;
  setData: (data: IGroupFieldsMappingForm) => void;
  // The form data from the previous forms.
  connectionSettingsData?: IConnectionSettingsForm;
  userFieldsMappingData?: IUserFieldsMappingForm;
  setConnectionSettingsError: (error: boolean) => void;
  setUserFieldsMappingError: (error: boolean) => void;
  refetch: any;
};

export interface IGroupFieldsMappingForm {
  groupName?: string;
  groupMemberUID?: string;
  groupObjectFilter?: string;
}

const GroupFieldsMapping: React.FC<GroupFieldsMappingProps> = ({
  groupName = '',
  groupMemberUID = '',
  groupObjectFilter = '',
  closeModal,
  setData,
  connectionSettingsData,
  userFieldsMappingData,
  setConnectionSettingsError,
  setUserFieldsMappingError,
  refetch,
}): ReactElement => {
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IGroupFieldsMappingForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      groupName,
      groupMemberUID,
      groupObjectFilter,
    },
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
      name: 'groupMemberUID',
      label: 'Group Member UID',
      control,
      defaultValue: groupMemberUID,
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
      console.log('Error while updating LDAP: ', error);
    },
    onSuccess: (response: any) => {
      console.log('Updated LDAP successfully', response);
      refetch();
      closeModal();
    },
  });

  const { isLoading, isError } = updateSsoMutation;

  const onSubmit = async () => {
    if (
      connectionSettingsData !== undefined &&
      userFieldsMappingData !== undefined
    ) {
      setConnectionSettingsError(false);
      setUserFieldsMappingError(false);
      const groupFieldsMappingData: IGroupFieldsMappingForm = getValues();
      setData(groupFieldsMappingData);

      const formData = new FormData();

      formData.append('active', 'true');

      // Connection settings data
      formData.append(
        'config[connection][hostName]',
        connectionSettingsData.hostName,
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
        userFieldsMappingData.userName,
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
      if (groupFieldsMappingData.groupMemberUID) {
        formData.append(
          'config[groupFieldMap][groupMemberUID]',
          groupFieldsMappingData.groupMemberUID,
        );
      }
      if (groupFieldsMappingData.groupObjectFilter) {
        formData.append(
          'config[groupFieldMap][groupObjectFilter]',
          groupFieldsMappingData.groupObjectFilter,
        );
      }

      const data = await updateSsoMutation.mutateAsync({
        idp: IdentityProvider.CUSTOM_LDAP,
        formData,
      });
    } else {
      setConnectionSettingsError(true);
      setUserFieldsMappingError(true);
    }
  };

  return (
    <form
      className="mt-8 ml-6 w-[450px] overflow-y-auto pr-6 "
      onSubmit={handleSubmit(onSubmit)}
    >
      <Layout fields={userFields} />
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
