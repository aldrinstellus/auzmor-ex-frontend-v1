import Divider, { Variant } from 'components/Divider';
import Icon from 'components/Icon';
import Link from 'components/Link';
import Modal from 'components/Modal';
import React, { ReactElement, ReactNode, useState } from 'react';
import ConnectionSettings, {
  IConnectionSettingsForm,
} from './ConnectionSettings';
import UserFieldsMapping, { IUserFieldsMappingForm } from './UserFieldsMapping';
import GroupFieldsMapping, {
  IGroupFieldsMappingForm,
} from './GroupFieldsMapping';
import useCarousel from 'hooks/useCarousel';
import { ISSOSetting } from '..';

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

const ConfigureLDAP: React.FC<ConfigureLDAPProps> = ({
  open,
  closeModal,
  refetch,
  ssoSetting,
}): ReactElement => {
  const [currentScreen, prev, next, setCurrentScreen] = useCarousel(0, 3);
  // Data from all three forms

  const connectionSettingsConfig = ssoSetting?.config?.connection;
  const userFieldMapConfig = ssoSetting?.config?.userFieldMap;
  const groupFieldMapConfig = ssoSetting?.config?.groupFieldMap;

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

  const [userFieldsMappingData, setUserFieldsMappingData] =
    useState<IUserFieldsMappingForm>({
      userName: userFieldMapConfig?.userName,
      fullName: userFieldMapConfig?.fullName,
      email: userFieldMapConfig?.email,
      title: userFieldMapConfig?.title,
      workMobile: userFieldMapConfig?.workMobile,
      userObjectFilter: userFieldMapConfig?.userObjectFilter,
    });

  const [groupFieldsMappingData, setGroupFieldsMappingData] =
    useState<IGroupFieldsMappingForm>({
      groupName: groupFieldMapConfig?.groupName,
      groupMemberUID: groupFieldMapConfig?.groupMemberUID,
      groupObjectFilter: groupFieldMapConfig?.groupObjectFilter,
    });

  const [connectionSettingsError, setConnectionSettingsError] =
    useState<boolean>(false);
  const [userFieldsMappingError, setUserFieldsMappingError] =
    useState<boolean>(false);

  const ldapForms = [
    {
      label: 'Connection Settings',
      id: 'connection-settings',
      form: (
        <ConnectionSettings
          hostName={connectionSettingsData?.hostName}
          port={connectionSettingsData?.port}
          baseDN={connectionSettingsData?.baseDN}
          groupBaseDN={connectionSettingsData?.groupBaseDN}
          upnSuffix={connectionSettingsData?.upnSuffix}
          administratorDN={connectionSettingsData?.administratorDN}
          password={connectionSettingsData?.password}
          allowFallback={false}
          setData={setConnectionSettingsData}
          setError={setConnectionSettingsError}
          closeModal={closeModal}
          next={next}
        />
      ),
      error: connectionSettingsError,
    },
    {
      label: 'User Fields Mapping',
      id: 'user-fields-mapping',
      form: (
        <UserFieldsMapping
          email={userFieldsMappingData?.email}
          fullName={userFieldsMappingData?.fullName}
          title={userFieldsMappingData?.title}
          userName={userFieldsMappingData?.userName}
          userObjectFilter={userFieldsMappingData?.userObjectFilter}
          workMobile={userFieldsMappingData?.workMobile}
          setData={setUserFieldsMappingData}
          setError={setUserFieldsMappingError}
          closeModal={closeModal}
          next={next}
        />
      ),
      error: userFieldsMappingError,
    },
    {
      label: 'Group Fields Mapping',
      id: 'group-fields-mapping',
      form: (
        <GroupFieldsMapping
          groupName={groupFieldsMappingData?.groupName}
          groupMemberUID={groupFieldsMappingData?.groupMemberUID}
          groupObjectFilter={groupFieldsMappingData?.groupObjectFilter}
          connectionSettingsData={connectionSettingsData}
          userFieldsMappingData={userFieldsMappingData}
          setConnectionSettingsError={setConnectionSettingsError}
          setUserFieldsMappingError={setUserFieldsMappingError}
          setData={setGroupFieldsMappingData}
          closeModal={closeModal}
          refetch={refetch}
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
            <Divider className="!bg-gray-100" variant={Variant.Vertical} />
            {ldapForms[currentScreen].form}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfigureLDAP;
