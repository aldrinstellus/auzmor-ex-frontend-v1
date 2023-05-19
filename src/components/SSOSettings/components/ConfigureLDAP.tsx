import Divider, { Variant } from 'components/Divider';
import Icon from 'components/Icon';
import Link from 'components/Link';
import Modal from 'components/Modal';
import React, {
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import ConnectionSettings, {
  IConnectionSettingsForm,
} from './ConnectionSettings';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import UserFieldsMapping, { IUserFieldsMappingForm } from './UserFieldsMapping';
import GroupFieldsMapping, {
  IGroupFieldsMappingForm,
} from './GroupFieldsMapping';
import useCarousel from 'hooks/useCarousel';

type ConfigureLDAPProps = {
  open: boolean;
  closeModal: () => void;
};

type LdapForm = {
  label: string;
  id: string;
  form: ReactNode;
  nextButtonText?: string;
};

const ConfigureLDAP: React.FC<ConfigureLDAPProps> = ({
  open,
  closeModal,
}): ReactElement => {
  const [currentScreen, prev, next, setCurrentScreen] = useCarousel(0, 3);
  // Data from all three forms
  const [connectionSettingsData, setConnectionSettingsData] =
    useState<IConnectionSettingsForm>();
  const [userFieldsMappingData, setUserFieldsMappingData] =
    useState<IUserFieldsMappingForm>();

  useEffect(() => {
    console.log({ connectionSettingsData });
  }, [connectionSettingsData]);

  const ldapForms = [
    {
      label: 'Connection Settings',
      id: 'connection-settings',
      form: (
        <ConnectionSettings
          hostname=""
          port=""
          baseDN=""
          groupBaseDN=""
          upnSuffix=""
          administratorDN=""
          password=""
          allowFallback={false}
          setData={setConnectionSettingsData}
          closeModal={closeModal}
          next={next}
        />
      ),
    },
    {
      label: 'User Fields Mapping',
      id: 'user-fields-mapping',
      form: (
        <UserFieldsMapping
          email=""
          fullName=""
          title=""
          username=""
          userObjectFilter=""
          workMobile=""
          setData={setUserFieldsMappingData}
          closeModal={closeModal}
          next={next}
        />
      ),
    },
    {
      label: 'Group Fields Mapping',
      id: 'group-fields-mapping',
      form: (
        <GroupFieldsMapping
          groupName=""
          groupMemberUid=""
          groupObjectFilter=""
          closeModal={closeModal}
          next={next}
          connectionSettingsData={connectionSettingsData}
          userFieldsMappingData={userFieldsMappingData}
        />
      ),
      nextButtonText: 'Activate',
    },
  ] as LdapForm[];

  const onNextClick = () => {
    next();
  };

  return (
    <Modal open={open} className="max-w-2xl max-h-[600px] overflow-y-visible">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="p-4">
          <p className="font-extrabold text-black text-lg">Active Directory</p>
          <p className="font-normal text-neutral-500 text-sm flex items-center gap-x-1">
            Seamlessly control access to anyone in your organization.
            <Link label="Learn More." />
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
      <div className="flex flex-col justify-between min-h-[500px]">
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
                      <p className="font-medium text-sm text-neutral-900 px-6 py-4">
                        {form.label}
                      </p>
                    </div>
                    {index !== ldapForms.length - 1 && (
                      <Divider className="!bg-gray-100" />
                    )}
                  </div>
                ))}
            </div>
            <div className="bg-blue-50 p-8" />
          </div>
          {/* <Divider variant={Variant.Vertical} /> */}
          {ldapForms[currentScreen].form}
        </div>

        {/* Footer */}
        {/* <div className="bg-blue-50 mt-4 p-0">
          <div className="p-3 flex items-center justify-end gap-x-3">
            <Button
              className="font-bold"
              label="Cancel"
              onClick={closeModal}
              variant={ButtonVariant.Primary}
            />
            <Button
              className="font-bold"
              label="Continue"
              variant={ButtonVariant.Primary}
              type={ButtonType.Submit}
              onClick={onNextClick}
            />
          </div>
        </div> */}
      </div>
    </Modal>
  );
};

export default ConfigureLDAP;
