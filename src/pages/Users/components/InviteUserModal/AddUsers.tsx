import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { IEmailValidationErrors, IUserForm, roleOptions } from '.';
import Icon from 'components/Icon';
import useHover from 'hooks/useHover';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import InviteFormRow from './InviteFormRow';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface IAddUsersProps {
  fields: FieldArrayWithId<IUserForm, 'members', 'id'>[];
  appendMembers: UseFieldArrayAppend<IUserForm, 'members'>;
  control: Control<IUserForm, any>;
  errors: FieldErrors<IUserForm>;
  remove: UseFieldArrayRemove;
  emailValidationErrors: IEmailValidationErrors | null;
  setErrorValidationErrors: (errors: IEmailValidationErrors | null) => void;
  watch: any;
}

const FIELD_LIMIT = 20;

const AddUsers: FC<IAddUsersProps> = ({
  fields,
  appendMembers,
  control,
  errors,
  remove,
  emailValidationErrors,
  setErrorValidationErrors,
  watch,
}) => {
  const [isHovered, eventHandlers] = useHover();
  const members = watch('members');
  const { t } = useTranslation('profile', {
    keyPrefix: 'inviteUserModal.addUsers',
  });

  return (
    <form>
      <div className="pl-6 pr-2 pt-6 max-h-[50vh] w-full overflow-y-scroll">
        <div className="flex flex-col mb-3 w-full">
          {fields.map((field, index) => (
            <InviteFormRow
              key={field.id}
              field={field}
              control={control}
              remove={remove}
              fieldsCount={fields.length}
              errors={errors}
              index={index}
              member={members[index]}
              emailValidationErrors={emailValidationErrors}
              setErrorValidationErrors={setErrorValidationErrors}
            />
          ))}
        </div>
        {fields.length >= FIELD_LIMIT && (
          <Banner
            title={t('maxUsersLimitMessage')}
            variant={BannerVariant.Error}
            className="mb-3"
          />
        )}

        <div
          className={`flex items-center pb-5 w-max ${
            fields.length < FIELD_LIMIT && 'cursor-pointer'
          }`}
          onClick={() => {
            if (fields.length < FIELD_LIMIT) {
              appendMembers({
                fullName: '',
                workEmail: '',
                role: roleOptions[0],
              });
            }
          }}
          {...eventHandlers}
          data-testId="invite-people-add-another"
        >
          <div className="mr-1">
            <Icon
              name="addCircleOutline"
              size={16}
              color={
                fields.length >= FIELD_LIMIT
                  ? 'text-neutral-400'
                  : isHovered
                  ? 'text-primary-700'
                  : 'text-primary-500'
              }
            />
          </div>
          <div
            className={`text-sm font-bold ${
              fields.length >= FIELD_LIMIT
                ? 'text-neutral-400'
                : isHovered
                ? 'text-primary-700'
                : 'text-primary-500'
            }`}
          >
            {t('addAnother')}
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddUsers;
