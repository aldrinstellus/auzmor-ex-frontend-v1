import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Divider from 'components/Divider';
import Layout from 'components/Form';
import React, { ReactElement } from 'react';

type ConnectionSettingsProps = {
  connectionSettings: any;
  userSettings: any;
  authenticationSettings: any;
  handleSubmit: any;
  onSubmit: any;
  closeModal: () => void;
  isError: boolean;
};

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({
  connectionSettings,
  userSettings,
  authenticationSettings,
  handleSubmit,
  onSubmit,
  closeModal,
  isError,
}): ReactElement => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 ml-6 max-h-[400px] w-[450px] overflow-y-auto pr-6 pb-12">
        <Layout fields={connectionSettings} />
        <Divider className="mt-6 mb-4 !bg-neutral-100" />
        <p className="mb-6 text-neutral-900 font-bold text-base">
          User Setting:
        </p>
        <Divider className="mt-6 mb-4 !bg-neutral-100" />
        <Layout fields={userSettings} />
        <Divider className="mt-6 mb-4 !bg-neutral-100" />
        <p className="mb-6 text-neutral-900 font-bold text-base">
          Authentication:
        </p>
        <Divider className="mt-6 mb-4 !bg-neutral-100" />
        <Layout fields={authenticationSettings} />
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
            disabled={isError}
          />
        </div>
      </div>
    </form>
  );
};

export default ConnectionSettings;
