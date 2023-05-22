import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Layout from 'components/Form';
import React, { ReactElement } from 'react';

type UserFieldsMappingProps = {
  userFieldMappingFields: any;
  handleSubmit: any;
  onSubmit: any;
  closeModal: () => void;
  isError: boolean;
};

const UserFieldsMapping: React.FC<UserFieldsMappingProps> = ({
  userFieldMappingFields,
  handleSubmit,
  onSubmit,
  closeModal,
  isError,
}): ReactElement => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 ml-6 max-h-[400px] w-[450px] overflow-y-auto pb-12 pr-6">
        <Layout fields={userFieldMappingFields} />
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

export default UserFieldsMapping;
