import React, { useEffect } from 'react';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayRemove,
  UseFormGetValues,
} from 'react-hook-form';
import { IEmailValidationErrors, IRoleOption, IUserForm, roleOptions } from '.';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant } from 'components/Input';
import Icon from 'components/Icon';
import { useIsUserExist } from 'queries/users';
import { useDebounce } from 'hooks/useDebounce';

export interface IInviteFormRowProps {
  field: FieldArrayWithId<IUserForm, 'members', 'id'>;
  errors: FieldErrors<IUserForm>;
  index: number;
  control: Control<IUserForm, any>;
  fieldsCount: number;
  remove: UseFieldArrayRemove;
  emailValidationErrors: IEmailValidationErrors | null;
  setErrorValidationErrors: (errors: IEmailValidationErrors | null) => void;
  member: { fullName: string; workEmail: string; role: IRoleOption };
}

const InviteFormRow: React.FC<IInviteFormRowProps> = ({
  errors,
  index,
  field,
  control,
  fieldsCount,
  remove,
  emailValidationErrors,
  setErrorValidationErrors,
  member,
}) => {
  const debouncedValue = useDebounce(member.workEmail, 500);
  const { isLoading, data } = useIsUserExist(debouncedValue);

  useEffect(() => {
    setErrorValidationErrors({
      ...emailValidationErrors,
      [index]: {
        isError: data ? !!data.result.data.userExists : false,
        isLoading,
      },
    });
  }, [isLoading, data]);

  return (
    <div>
      <div className="flex w-full items-center">
        <Layout
          className="flex mb-3 w-full"
          key={field.id}
          fields={[
            {
              type: FieldType.Input,
              InputVariant: InputVariant.Text,
              className: 'w-[37.5%] mr-1.5',
              placeholder: 'Enter name',
              name: `members.${index}.fullName`,
              label: 'Full Name',
              defaultValue: field.fullName,
              control,
            },
            {
              type: FieldType.Input,
              variant: InputVariant.Text,
              className: 'w-[37.5%] mx-1.5',
              placeholder: 'Add via email',
              name: `members.${index}.workEmail`,
              label: 'Email Address',
              defaultValue: field.workEmail,
              control,
            },
            {
              type: FieldType.SingleSelect,
              name: `members.${index}.role`,
              control,
              label: 'Role',
              className: 'w-[25%] ml-1.5',
              options: roleOptions,
              defautValue: field.role,
            },
          ]}
        />
        {fieldsCount > 1 && (
          <div className="ml-3" onClick={() => remove(index)}>
            <Icon name="close" size={16} />
          </div>
        )}
      </div>
      {errors.members && errors.members[index]?.fullName?.message && (
        <Banner
          title={errors.members[index]?.fullName?.message || 'Require field'}
          variant={BannerVariant.Error}
          className="mb-3"
        />
      )}
      {errors.members && errors.members[index]?.workEmail?.message && (
        <Banner
          title={errors.members[index]?.workEmail?.message || 'Require field'}
          variant={BannerVariant.Error}
          className="mb-3"
        />
      )}
      {emailValidationErrors &&
        emailValidationErrors[index] &&
        emailValidationErrors[index].isError && (
          <Banner
            title="User already belongs to the organization"
            variant={BannerVariant.Error}
            className="mb-3"
          />
        )}
      {errors.members && errors.members[index]?.role?.message && (
        <Banner
          title={errors.members[index]?.role?.message || 'Require field'}
          variant={BannerVariant.Error}
          className="mb-3"
        />
      )}
    </div>
  );
};

export default InviteFormRow;
