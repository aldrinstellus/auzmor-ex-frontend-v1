import Button, { Variant as ButtonVariant } from 'components/Button';
import { UseFormHandleSubmit } from 'react-hook-form';
import { EntitySearchModalType, IAudienceForm } from '..';
import { FC } from 'react';

interface IFooter {
  handleSubmit: UseFormHandleSubmit<IAudienceForm>;
  entityType: EntitySearchModalType;
  onSubmit: (ids: string[]) => void;
  onCancel: () => void;
  submitButtonText: string;
  cancelButtonText: string;
}

const Footer: FC<IFooter> = ({
  handleSubmit,
  entityType,
  onSubmit,
  onCancel,
  submitButtonText,
  cancelButtonText,
}) => {
  return (
    <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-19xl">
      <div className="flex">
        <Button
          variant={ButtonVariant.Secondary}
          label={cancelButtonText}
          className="mr-3"
          onClick={onCancel}
          dataTestId="scheduledpost-back"
        />
        <Button
          label={submitButtonText}
          dataTestId="scheduledpost-next"
          onClick={handleSubmit((formData) => {
            if (entityType === EntitySearchModalType.User) {
              const ids: string[] = [];
              Object.keys(formData.users).forEach((key) => {
                if (formData.users[key]) {
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
