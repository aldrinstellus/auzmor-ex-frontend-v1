import { FC, useEffect } from 'react';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { IEmailValidationErrors, IRoleOption, IUserForm, roleOptions } from '.';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant } from 'components/Input';
import Icon from 'components/Icon';
import { useDebounce } from 'hooks/useDebounce';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

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

const InviteFormRow: FC<IInviteFormRowProps> = ({
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
  const { getApi } = usePermissions();
  const debouncedValue = useDebounce(member.workEmail, 500);
  const useIsUserExistAuthenticated = getApi(
    ApiEnum.GetUserExistsAuthenticated,
  );
  const { isLoading, data } = useIsUserExistAuthenticated(debouncedValue);
  const { t } = useTranslation('profile', {
    keyPrefix: 'inviteUserModal.inviteFormRow',
  });
  useEffect(() => {
    setErrorValidationErrors({
      ...emailValidationErrors,
      [index]: {
        isError: data ? !!data?.result?.data?.userExists : false,
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
              inputClassName: 'text-sm !py-[9px]',
              placeholder: t('fullNamePlaceholder'),
              name: `members.${index}.fullName`,
              label: t('fullNameLabel'),
              control,
              dataTestId: 'invite-people-name',
            },
            {
              type: FieldType.Input,
              variant: InputVariant.Text,
              className: 'w-[37.5%] mx-1.5',
              inputClassName: 'text-sm !py-[9px]',
              placeholder: t('emailPlaceholder'),
              name: `members.${index}.workEmail`,
              label: t('emailLabel'),
              control,
              dataTestId: 'invite-people-email',
            },
            {
              type: FieldType.SingleSelect,
              name: `members.${index}.role`,
              control,
              label: t('roleLabel'),
              className: 'w-[25%] ml-1.5',
              height: 40,
              options: roleOptions,
              dataTestId: 'invite-people-role',
              getPopupContainer: document.body,
              showSearch: false,
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
          title={errors.members[index]?.fullName?.message || t('requiredField')}
          variant={BannerVariant.Error}
          className="mb-3"
          dataTestId="invite-people-error-message"
        />
      )}
      {errors.members && errors.members[index]?.workEmail?.message && (
        <Banner
          title={
            errors.members[index]?.workEmail?.message || t('requiredField')
          }
          variant={BannerVariant.Error}
          className="mb-3"
          dataTestId="invite-people-error-message"
        />
      )}
      {emailValidationErrors &&
        emailValidationErrors[index] &&
        emailValidationErrors[index].isError && (
          <Banner
            title={t('userAlreadyExists')}
            variant={BannerVariant.Error}
            className="mb-3"
            dataTestId="invite-people-error-message"
          />
        )}
      {errors.members && errors.members[index]?.role?.message && (
        <Banner
          title={errors.members[index]?.role?.message || t('requiredField')}
          variant={BannerVariant.Error}
          className="mb-3"
          dataTestId="invite-people-error-message"
        />
      )}
    </div>
  );
};

export default InviteFormRow;
