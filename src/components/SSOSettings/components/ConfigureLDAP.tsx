import Divider, { Variant as DividerVariant } from 'components/Divider';
import Icon from 'components/Icon';
import Link from 'components/Link';
import Modal from 'components/Modal';
import React, { ReactElement, ReactNode, useState } from 'react';
import ConnectionSettings from './ConnectionSettings';
import UserFieldsMapping from './UserFieldsMapping';
import GroupFieldsMapping from './GroupFieldsMapping';
import useCarousel from 'hooks/useCarousel';
import { ISSOSetting } from '..';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldType } from 'components/Form';
import { Variant } from 'components/Input';
import { useMutation } from '@tanstack/react-query';
import { IdentityProvider, updateSso } from 'queries/organization';

type ConfigureLDAPProps = {
  open: boolean;
  closeModal: () => void;
  refetch: any;
  ssoSetting?: ISSOSetting;
};

type LdapForm = {
  label: string;
  id: string;
  form: ReactNode;
  nextButtonText?: string;
  error?: boolean;
};

// Form interfaces for Connection Settings, User Field Mapping and Group Field Mapping forms
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

export interface IUserFieldsMappingForm {
  userName: string;
  fullName: string;
  email: string;
  title: string;
  workMobile?: string;
  userObjectFilter?: string;
}

export interface IGroupFieldsMappingForm {
  groupName?: string;
  groupMemberUID?: string;
  groupObjectFilter?: string;
}

// Schema yub objects for Connection Settings, User Field Mapping and Group Field Mapping forms

const connectionSettingsSchema = yup.object({
  hostName: yup.string().required('Required field'),
  port: yup.string().required('Required field'),
  baseDN: yup.string().required('Required field'),
  groupBaseDN: yup.string(),
  upnSuffix: yup.string().required('Required field'),
  administratorDN: yup.string().required('Required field'),
  password: yup.string().required('Required field'),
});

const userFieldMappingSchema = yup.object({
  userName: yup.string().required('Required field'),
  fullName: yup.string().required('Required field'),
  email: yup.string().email('Enter valid email').required('Required field'),
  title: yup.string().required('Required field'),
  workMobile: yup.string(),
  userObjectFilter: yup.string(),
});

const groupFieldMappingSchema = yup.object({
  groupName: yup.string(),
  groupMemberUID: yup.string(),
  groupObjectFilter: yup.string(),
});

const ConfigureLDAP: React.FC<ConfigureLDAPProps> = ({
  open,
  closeModal,
  refetch,
  ssoSetting,
}): ReactElement => {
  const [currentScreen, prev, next, setCurrentScreen] = useCarousel(0, 3);
  const [connectionSettingsError, setConnectionSettingsError] =
    useState<boolean>(false);
  const [userFieldsMappingError, setUserFieldsMappingError] =
    useState<boolean>(false);

  // Seed data for all three forms
  const connectionSettingsConfig = ssoSetting?.config?.connection;
  const userFieldMapConfig = ssoSetting?.config?.userFieldMap;
  const groupFieldMapConfig = ssoSetting?.config?.groupFieldMap;

  // FORM 1: CONNECTION SETTINGS FORM
  const [connectionSettingsData, setConnectionSettingsData] =
    useState<IConnectionSettingsForm>({
      hostName: connectionSettingsConfig?.hostName,
      port: connectionSettingsConfig?.port,
      baseDN: connectionSettingsConfig?.baseDN,
      groupBaseDN: connectionSettingsConfig?.groupBaseDN,
      upnSuffix: connectionSettingsConfig?.upnSuffix,
      administratorDN: connectionSettingsConfig?.authentication?.adminDN,
      password: connectionSettingsConfig?.authentication?.password,
      allowFallback: ssoSetting?.allowFallback,
    });

  const {
    control: connectionSettingsControl,
    getValues: connectionSettingsGetValues,
    handleSubmit: connectionSettingsHandleSubmit,
    formState: connectionSettingsFormState,
    trigger: connectionSettingsTrigger,
  } = useForm<IConnectionSettingsForm>({
    resolver: yupResolver(connectionSettingsSchema),
    mode: 'onChange',
    defaultValues: {
      hostName: connectionSettingsData?.hostName,
      port: connectionSettingsData?.port,
      baseDN: connectionSettingsData?.baseDN,
      groupBaseDN: connectionSettingsData?.groupBaseDN,
      upnSuffix: connectionSettingsData?.upnSuffix,
      administratorDN: connectionSettingsData?.administratorDN,
      password: connectionSettingsData?.password,
      allowFallback: ssoSetting?.allowFallback,
    },
  });

  const connectionSettingFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'hostName',
      label: 'Hostname*',
      control: connectionSettingsControl,
      defaultValue: connectionSettingsData?.hostName,
      error: connectionSettingsFormState.errors.hostName?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'port',
      label: 'Port*',
      control: connectionSettingsControl,
      defaultValue: connectionSettingsData?.port,
      error: connectionSettingsFormState.errors.port?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'baseDN',
      label: 'Base DN*',
      control: connectionSettingsControl,
      defaultValue: connectionSettingsData?.baseDN,
      error: connectionSettingsFormState.errors.baseDN?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'groupBaseDN',
      label: 'Group Base DN',
      control: connectionSettingsControl,
      defaultValue: connectionSettingsData?.groupBaseDN,
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
      defaultValue: connectionSettingsData?.upnSuffix,
      error: connectionSettingsFormState.errors.upnSuffix?.message,
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
      defaultValue: connectionSettingsData?.administratorDN,
      error: connectionSettingsFormState.errors.administratorDN?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Password,
      placeholder: '',
      name: 'password',
      label: 'Password*',
      control: connectionSettingsControl,
      defaultValue: connectionSettingsData?.password,
      error: connectionSettingsFormState.errors.password?.message,
    },
    {
      type: FieldType.Checkbox,
      label: 'Allow Auzmor Office to authenticate as a fallback mechanism',
      labelDescription:
        'When the LDAP is down, Auzmor Office can authenticate the user. Organization Primary Admin can control this behavior by enabling/disabling the flag.',
      name: 'allowFallback',
      control: connectionSettingsControl,
      defaultValue: connectionSettingsData?.allowFallback,
      error: connectionSettingsFormState.errors.allowFallback?.message,
    },
  ];

  const connectionSettingsOnSubmit = () => {
    setConnectionSettingsData(connectionSettingsGetValues());
    setConnectionSettingsError(false);
    next();
  };

  // -----------------------------------------------------------------------

  // FORM 2: USER FIELD MAPPING FORM
  const [userFieldsMappingData, setUserFieldsMappingData] =
    useState<IUserFieldsMappingForm>({
      userName: userFieldMapConfig?.userName,
      fullName: userFieldMapConfig?.fullName,
      email: userFieldMapConfig?.email,
      title: userFieldMapConfig?.title,
      workMobile: userFieldMapConfig?.workMobile,
      userObjectFilter: userFieldMapConfig?.userObjectFilter,
    });

  const {
    control: userFieldMappingControl,
    getValues: userFieldMappingGetValues,
    handleSubmit: userFieldMappingHandleSubmit,
    formState: userFieldMappingFormState,
    trigger: userFieldMappingTrigger,
  } = useForm<IUserFieldsMappingForm>({
    resolver: yupResolver(userFieldMappingSchema),
    mode: 'onChange',
    defaultValues: {
      userName: userFieldsMappingData?.userName,
      fullName: userFieldsMappingData?.fullName,
      email: userFieldsMappingData?.email,
      title: userFieldsMappingData?.title,
      workMobile: userFieldsMappingData?.workMobile,
      userObjectFilter: userFieldsMappingData?.userObjectFilter,
    },
  });

  const userFieldMappingFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'userName',
      label: 'User Name*',
      control: userFieldMappingControl,
      defaultValue: userFieldsMappingData?.userName,
      error: userFieldMappingFormState.errors.userName?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'fullName',
      label: 'Full Name*',
      control: userFieldMappingControl,
      defaultValue: userFieldsMappingData?.fullName,
      error: userFieldMappingFormState.errors.fullName?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'email',
      label: 'Email*',
      control: userFieldMappingControl,
      defaultValue: userFieldsMappingData?.email,
      error: userFieldMappingFormState.errors.email?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'title',
      label: 'Title*',
      control: userFieldMappingControl,
      defaultValue: userFieldsMappingData?.title,
      error: userFieldMappingFormState.errors.title?.message,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'workMobile',
      label: 'Work Mobile',
      control: userFieldMappingControl,
      defaultValue: userFieldsMappingData?.workMobile,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'userObjectFilter',
      label: 'User Object Filter',
      control: userFieldMappingControl,
      defaultValue: userFieldsMappingData?.userObjectFilter,
    },
  ];

  const userFieldMappingOnSubmit = () => {
    setUserFieldsMappingData(userFieldMappingGetValues());
    setUserFieldsMappingError(false);
    next();
  };

  // -----------------------------------------------------------------------

  // FORM 2: GROUP FIELD MAPPING FORM
  const [groupFieldsMappingData, setGroupFieldsMappingData] =
    useState<IGroupFieldsMappingForm>({
      groupName: groupFieldMapConfig?.groupName,
      groupMemberUID: groupFieldMapConfig?.groupMemberUID,
      groupObjectFilter: groupFieldMapConfig?.groupObjectFilter,
    });

  const {
    control: groupFieldMappingControl,
    getValues: groupFieldMappingGetValues,
    handleSubmit: groupFieldMappingHandleSubmit,
  } = useForm<IGroupFieldsMappingForm>({
    resolver: yupResolver(groupFieldMappingSchema),
    mode: 'onChange',
    defaultValues: {
      groupName: groupFieldsMappingData?.groupName,
      groupMemberUID: groupFieldsMappingData?.groupMemberUID,
      groupObjectFilter: groupFieldsMappingData?.groupObjectFilter,
    },
  });

  const groupFieldMappingFields = [
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'groupName',
      label: 'Group Name',
      control: groupFieldMappingControl,
      defaultValue: groupFieldsMappingData?.groupName,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'groupMemberUID',
      label: 'Group Member UID',
      control: groupFieldMappingControl,
      defaultValue: groupFieldsMappingData?.groupMemberUID,
    },
    {
      type: FieldType.Input,
      variant: Variant.Text,
      placeholder: '',
      name: 'groupObjectFilter',
      label: 'Group Object Filter',
      control: groupFieldMappingControl,
      defaultValue: groupFieldsMappingData?.groupObjectFilter,
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

  const {
    isError: groupFieldMappingError,
    isLoading: groupFieldMappingLoading,
  } = updateSsoMutation;

  const checkIfFormsAreValid = async () => {
    if (
      connectionSettingsData.hostName === undefined ||
      connectionSettingsData.port === undefined ||
      connectionSettingsData.baseDN === undefined ||
      connectionSettingsData.upnSuffix === undefined ||
      connectionSettingsData.administratorDN === undefined ||
      connectionSettingsData.password === undefined ||
      userFieldsMappingData.email === undefined ||
      userFieldsMappingData.fullName === undefined ||
      userFieldsMappingData.userName === undefined ||
      userFieldsMappingData.title === undefined
    ) {
      await connectionSettingsTrigger();
      await userFieldMappingTrigger();
      return false;
    }
    return true;
  };

  const groupFieldMappingOnSubmit = async () => {
    if (await checkIfFormsAreValid()) {
      console.log('inside ifff');
      setConnectionSettingsError(false);
      setUserFieldsMappingError(false);
      setGroupFieldsMappingData(groupFieldMappingGetValues());

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

      updateSsoMutation.mutateAsync({
        idp: IdentityProvider.CUSTOM_LDAP,
        formData,
      });
    } else {
      setConnectionSettingsError(true);
      connectionSettingsTrigger();
      setUserFieldsMappingError(true);
      userFieldMappingTrigger();
    }
  };

  const ldapForms = [
    {
      label: 'Connection Settings',
      id: 'connection-settings',
      form: (
        <ConnectionSettings
          connectionSettings={connectionSettingFields}
          userSettings={userSettingFields}
          authenticationSettings={authenticationSettingFields}
          closeModal={closeModal}
          isError={Object.keys(connectionSettingsFormState.errors).length > 0}
          handleSubmit={connectionSettingsHandleSubmit}
          onSubmit={connectionSettingsOnSubmit}
        />
      ),
      error: connectionSettingsError,
    },
    {
      label: 'User Fields Mapping',
      id: 'user-fields-mapping',
      form: (
        <UserFieldsMapping
          userFieldMappingFields={userFieldMappingFields}
          closeModal={closeModal}
          handleSubmit={userFieldMappingHandleSubmit}
          onSubmit={userFieldMappingOnSubmit}
          isError={Object.keys(userFieldMappingFormState.errors).length > 0}
        />
      ),
      error: userFieldsMappingError,
    },
    {
      label: 'Group Fields Mapping',
      id: 'group-fields-mapping',
      form: (
        <GroupFieldsMapping
          groupFieldMappingFields={groupFieldMappingFields}
          closeModal={closeModal}
          handleSubmit={groupFieldMappingHandleSubmit}
          onSubmit={groupFieldMappingOnSubmit}
          isError={groupFieldMappingError}
          isLoading={groupFieldMappingLoading}
        />
      ),
      nextButtonText: 'Activate',
    },
  ] as LdapForm[];

  return (
    <Modal open={open} className="max-w-[700px] max-h-[600px]">
      {/* Header */}
      <div className="relative h-full">
        <div className="flex items-start justify-between absolute top-0 left-0 right-0">
          <div className="p-4">
            <p className="font-extrabold text-black text-lg">
              Active Directory
            </p>
            <p className="font-normal text-neutral-500 text-sm flex items-center gap-x-1">
              Seamlessly control access to anyone in your organization.
              <Link label="Learn more." to="#" />
            </p>
          </div>
          <Icon
            className="p-4"
            onClick={closeModal}
            name="close"
            hover={false}
            stroke="#000"
          />
        </div>

        {/* Content */}
        <Divider className="!bg-neutral-100" />
        <div className="flex flex-col justify-between h-[560px] pt-20">
          <div className="flex">
            <div className="flex flex-col min-h-fit justify-between min-w-fit">
              <div>
                {ldapForms &&
                  ldapForms.map((form, index) => (
                    <div key={form.id}>
                      <div
                        className={`${
                          ldapForms[currentScreen].id === form.id
                            ? 'bg-primary-50'
                            : 'hover:bg-primary-50 cursor-pointer'
                        }`}
                        onClick={() => setCurrentScreen(index)}
                      >
                        <p className="flex items-center font-medium text-sm text-neutral-900 px-6 py-4">
                          {form.label}
                          <div
                            className={`${
                              form.error ? 'visible' : 'invisible'
                            }`}
                          >
                            <Icon
                              className="pl-1"
                              name="infoCircle"
                              stroke="red"
                              hover={false}
                            />
                          </div>
                        </p>
                      </div>
                      {index !== ldapForms.length - 1 && (
                        <Divider className="!bg-gray-100" />
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <Divider
              className="!bg-gray-100"
              variant={DividerVariant.Vertical}
            />
            {ldapForms[currentScreen].form}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfigureLDAP;
