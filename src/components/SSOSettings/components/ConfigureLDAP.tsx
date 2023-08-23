import Divider, { Variant as DividerVariant } from 'components/Divider';
import Icon from 'components/Icon';
import Link from 'components/Link';
import Modal from 'components/Modal';
import React, { ReactElement, ReactNode, useRef, useState } from 'react';
import ConnectionSettings from './ConnectionSettings';
import UserFieldsMapping from './UserFieldsMapping';
import GroupFieldsMapping from './GroupFieldsMapping';
import useCarousel from 'hooks/useCarousel';
import { ISSOSetting } from '..';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { IdentityProvider, updateSso } from 'queries/organization';
import queryClient from 'utils/queryClient';

type ConfigureLDAPProps = {
  open: boolean;
  closeModal: () => void;
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
  email: yup.string().required('Required field'),
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
  ssoSetting,
}): ReactElement => {
  const [currentScreen, prev, next, setCurrentScreen] = useCarousel(0, 3);
  const [connectionSettingsError, setConnectionSettingsError] =
    useState<boolean>(false);
  const [userFieldsMappingError, setUserFieldsMappingError] =
    useState<boolean>(false);
  const groupFieldMappingRef = useRef<IGroupFieldsMappingForm>();

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

  const updateSsoMutation = useMutation({
    mutationKey: ['update-sso-mutation-ldap'],
    mutationFn: updateSso,
    onError: (error: any) => {
      console.log('Error while updating LDAP: ', error);
    },
    onSuccess: async (response: any) => {
      console.log('Updated LDAP successfully', response);
      await queryClient.invalidateQueries(['get-sso']);
      closeModal();
    },
  });

  const {
    isError: groupFieldMappingError,
    isLoading: groupFieldMappingLoading,
  } = updateSsoMutation;

  const checkIfFormsAreValid = () => {
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
      return false;
    }
    return true;
  };

  const groupFieldMappingOnSubmit = async () => {
    groupFieldMappingRef.current = groupFieldMappingGetValues();
    configureLDAP();
  };

  const configureLDAP = async () => {
    if (checkIfFormsAreValid()) {
      setConnectionSettingsError(false);
      setUserFieldsMappingError(false);

      const formData = new FormData();

      formData.append('active', 'true');
      formData.append(
        'allowFallback',
        String(connectionSettingsData.allowFallback || false),
      );

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

      if (groupFieldMappingRef.current?.groupName) {
        console.log('Not working?');
        formData.append(
          'config[groupFieldMap][groupName]',
          groupFieldMappingRef.current?.groupName,
        );
      }
      if (groupFieldMappingRef.current?.groupMemberUID) {
        formData.append(
          'config[groupFieldMap][groupMemberUID]',
          groupFieldMappingRef.current?.groupMemberUID,
        );
      }
      if (groupFieldMappingRef.current?.groupObjectFilter) {
        formData.append(
          'config[groupFieldMap][groupObjectFilter]',
          groupFieldMappingRef.current?.groupObjectFilter,
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
          connectionSettingsData={connectionSettingsData}
          connectionSettingsControl={connectionSettingsControl}
          connectionSettingsFormState={connectionSettingsFormState}
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
          userFieldsMappingData={userFieldsMappingData}
          userFieldMappingControl={userFieldMappingControl}
          userFieldMappingFormState={userFieldMappingFormState}
          closeModal={closeModal}
          isError={Object.keys(userFieldMappingFormState.errors).length > 0}
          handleSubmit={userFieldMappingHandleSubmit}
          onSubmit={userFieldMappingOnSubmit}
        />
      ),
      error: userFieldsMappingError,
    },
    {
      label: 'Group Fields Mapping',
      id: 'group-fields-mapping',
      form: (
        <GroupFieldsMapping
          groupFieldsMappingData={groupFieldsMappingData}
          groupFieldMappingControl={groupFieldMappingControl}
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
            color="#000"
          />
        </div>
        {/* Content */}
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
                              color="red"
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
