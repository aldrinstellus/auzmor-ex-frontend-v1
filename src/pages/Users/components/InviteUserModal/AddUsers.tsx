import React from 'react';
import Layout, { FieldType } from 'components/Form';
import Button, { Variant } from 'components/Button';
import Divider from 'components/Divider';
import _ from 'lodash';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFormGetValues,
} from 'react-hook-form';
import { IUserForm, roleOptions } from '.';
import File from 'images/file.svg';
import { Variant as InputVariant } from 'components/Input';

export interface IAddUsersProps {
  fields: FieldArrayWithId<IUserForm, 'members', 'id'>[];
  appendMembers: UseFieldArrayAppend<IUserForm, 'members'>;
  control: Control<IUserForm, any>;
  errors: FieldErrors<IUserForm>;
}

const AddUsers: React.FC<IAddUsersProps> = ({
  fields,
  appendMembers,
  control,
  errors,
}) => {
  return (
    <form>
      <div className="px-6 pt-6 max-h-[50vh] overflow-y-scroll">
        <div className="flex flex-col mb-3">
          {fields.map((field, index) => (
            <Layout
              className="flex mb-3"
              key={field.id}
              fields={[
                {
                  type: FieldType.Input,
                  InputVariant: InputVariant.Text,
                  className: 'w-[37.5%] mr-1.5',
                  placeholder: 'Enter name',
                  name: `members.${index}.fullName`,
                  label: 'Full Name',
                  error:
                    errors.members && errors.members[index]?.fullName?.message,
                  control,
                  onChange: (data: string, e: React.ChangeEvent) => {},
                },
                {
                  type: FieldType.Input,
                  variant: InputVariant.Text,
                  className: 'w-[37.5%] mx-1.5',
                  placeholder: 'Add via email',
                  name: `members.${index}.workEmail`,
                  label: 'Email Address',
                  error:
                    errors.members && errors.members[index]?.workEmail?.message,
                  control,
                  onChange: (data: string, e: React.ChangeEvent) => {},
                },
                {
                  type: FieldType.SingleSelect,
                  name: `members.${index}.role`,
                  control,
                  label: 'Role',
                  className: 'w-[25%] ml-1.5',
                  error: errors.members && errors.members[index]?.role?.message,
                  options: roleOptions,
                  defautValue: 'MEMBER',
                  onChange: (
                    data: UseFormGetValues<any>,
                    e: React.ChangeEvent,
                  ) => {},
                },
              ]}
            />
          ))}
        </div>

        <Button
          className="flex text-primary-500 border-none"
          leftIconClassName="mr-1"
          label="Add Another"
          leftIcon="addCircle"
          variant={Variant.Secondary}
          onClick={() =>
            appendMembers({ fullName: '', workEmail: '', role: roleOptions[0] })
          }
          disabled={fields.length >= 20}
        />

        <div className="flex justify-center item-center mb-6">
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
        </div>
      </div>
    </form>
  );
};

export default AddUsers;
