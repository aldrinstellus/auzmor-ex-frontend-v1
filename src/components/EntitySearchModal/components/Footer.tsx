import Button, { Variant as ButtonVariant } from 'components/Button';
import React from 'react';
import { UseFormHandleSubmit } from 'react-hook-form';
import { EntitySearchModalType, IMemberForm } from '..';

interface IFooter {
  handleSubmit: UseFormHandleSubmit<IMemberForm>;
  entityType: EntitySearchModalType;
  onSubmit: (ids: string[]) => void;
  onCancel: () => void;
  submitButtonText: string;
}

const Footer: React.FC<IFooter> = ({
  handleSubmit,
  entityType,
  onSubmit,
  onCancel,
  submitButtonText,
}) => {
  return (
    <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-19xl">
      <div className="flex">
        <Button
          variant={ButtonVariant.Secondary}
          label="Back"
          className="mr-3"
          onClick={onCancel}
          dataTestId="scheduledpost-back"
        />
        <Button
          label={submitButtonText}
          dataTestId="scheduledpost-next"
          onClick={handleSubmit((formData) => {
            if (entityType === EntitySearchModalType.Member) {
              const ids: string[] = [];
              Object.keys(formData).forEach((key) => {
                if (
                  !!![
                    'memberSearch',
                    'department',
                    'location',
                    'selectAll',
                    'showSelectedMembers',
                  ].includes(key) &&
                  (formData as any)[key]
                ) {
                  ids.push(key);
                }
              });
              onSubmit(ids);
            }
          })}
        />
      </div>
    </div>
  );
};

export default Footer;
