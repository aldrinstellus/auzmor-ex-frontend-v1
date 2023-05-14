import React, { useEffect, useState } from 'react';
import Layout, { FieldType } from 'components/Form';
import Button, { Variant } from 'components/Button';
import Divider from 'components/Divider';
import _ from 'lodash';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormGetValues,
} from 'react-hook-form';
import { IUserForm, roleOptions } from '.';
import File from 'images/file.svg';
import { Variant as InputVariant } from 'components/Input';
import { twConfig } from 'utils/misc';
import Icon from 'components/Icon';
import useHover from 'hooks/useHover';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import { useDebounce } from 'hooks/useDebounce';

export interface IAddUsersProps {
  fields: FieldArrayWithId<IUserForm, 'members', 'id'>[];
  appendMembers: UseFieldArrayAppend<IUserForm, 'members'>;
  control: Control<IUserForm, any>;
  errors: FieldErrors<IUserForm>;
  remove: UseFieldArrayRemove;
}

const FIELD_LIMIT = 20;

const AddUsers: React.FC<IAddUsersProps> = ({
  fields,
  appendMembers,
  control,
  errors,
  remove,
}) => {
  const [isHovered, eventHandlers] = useHover();
  return (
    <form>
      <div className="pl-6 pr-2 pt-6 max-h-[50vh] w-full overflow-y-scroll">
        <div className="flex flex-col mb-3 w-full">
          {fields.map((field, index) => (
            <div key={field.id}>
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
                {fields.length > 1 && (
                  <div className="ml-3" onClick={() => remove(index)}>
                    <Icon name="close" size={16} />
                  </div>
                )}
              </div>
              {errors.members && errors.members[index]?.fullName?.message && (
                <Banner
                  title={
                    errors.members[index]?.fullName?.message || 'Require field'
                  }
                  variant={BannerVariant.Error}
                  className="mb-3"
                />
              )}
              {errors.members && errors.members[index]?.workEmail?.message && (
                <Banner
                  title={
                    errors.members[index]?.workEmail?.message || 'Require field'
                  }
                  variant={BannerVariant.Error}
                  className="mb-3"
                />
              )}
              {errors.members && errors.members[index]?.role?.message && (
                <Banner
                  title={
                    errors.members[index]?.role?.message || 'Require field'
                  }
                  variant={BannerVariant.Error}
                  className="mb-3"
                />
              )}
            </div>
          ))}
        </div>
        {fields.length >= FIELD_LIMIT && (
          <Banner
            title={'You can not add more than 20 people at a time'}
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
        >
          <div className="mr-1">
            <Icon
              name="addCircle"
              size={16}
              stroke={
                fields.length >= FIELD_LIMIT
                  ? twConfig.theme.colors.neutral['400']
                  : isHovered
                  ? twConfig.theme.colors.primary['700']
                  : twConfig.theme.colors.primary['500']
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
            Add another
          </div>
        </div>

        {/* <div className="flex justify-center item-center mb-6">
          <Divider className="w-[95%]" />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            {' '}
            <img width={56} height={56} src={File} />
          </div>
          <div className="flex flex-col justify-center items-center mt-2">
            <div className="flex flex-row items-start gap-2 p-0">
              <div className="font-normal text-sm text-neutral-900">
                To invite a list of people, add your csv,xls or xlsx file in the
                given format
              </div>
              <div>
                {' '}
                <Button
                  className="!border-none !bg-inherit !p-0 !text-primary-600 !text-xs !pt-0.5"
                  label="Download Format"
                  variant={Variant.Secondary}
                />
              </div>
            </div>
            <div className="text-neutral-900 text-xs font-normal mt-1">
              File must be in csv, xls or xlsx format and must not exceed 100mb
            </div>

            <div></div>
          </div>

          <div className="flex flex-col justify-center items-center border-box mt-4 mb-4 py-6 px-2 border-2 rounded-[12px] border-primary-500 border-dashed w-[100%]">
            <div className="text-base font-normal text-neutral-900">
              Drop Files Here{' '}
            </div>
            <div className="p-2 my-4 bg-neutral-100 rounded-[50px]">Or</div>

            <Button
              className="flex mb-2 text-neutral-900 !py-2 !px-4 gap-2 !rounded-[24px]"
              label=" Upload from existing documents"
              leftIcon="people"
              variant={Variant.Secondary}
              onClick={() => {}}
            />
          </div>
        </div> */}
      </div>
    </form>
  );
};

export default AddUsers;
