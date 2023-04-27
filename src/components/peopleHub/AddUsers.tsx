import React, {
  ChangeEvent,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Layout, FieldType } from '@auzmorui/component-library.components.form';
import { Variant as InputVariant } from '@auzmorui/component-library.components.input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  Button,
  Variant as ButtonVariant,
} from '@auzmorui/component-library.components.button';
import { Divider } from '@auzmorui/component-library.components.divider';
import File from '../../images/file.svg';
import { createUsers } from 'queries/users';

export interface IAddUsersProps {
  reference: React.MutableRefObject<undefined>;
  setOpen: (show: boolean) => void;
  setOpenError: (show: boolean) => void;
}

export interface IForm {
  fullName: string;
  workEmail: string;
  role: string;
}

const AddUsers: React.FC<IAddUsersProps> = ({
  reference,
  setOpen,
  setOpenError,
}) => {
  useImperativeHandle(
    reference,
    () =>
      ({
        submitForm: () => {
          handleSubmit(onSubmit)();
        },
      } as any),
  );
  const [fileList, setFileList] = useState<FileList | null>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
  };

  const schema = yup.object({
    fullName: yup.string().required('Please enter name'),
    workEmail: yup.string().email('Please enter valid email address'),
    role: yup.string().required('Please enter role'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const Fields = [
    {
      type: FieldType.Input,
      InputVariant: InputVariant.Text,
      className: 'w-[37.5%]',
      placeholder: 'Enter name',
      name: 'fullName',
      label: 'Full Name',
      error: errors.fullName?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      className: 'w-[37.5%]',
      placeholder: 'Add via email',
      name: 'workEmail',
      label: 'Email Address',
      error: errors.workEmail?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      className: 'w-[25%]',
      placeholder: 'Select Role',
      name: 'role',
      label: 'Role',
      error: errors.role?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
  ];

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };
  const files = fileList ? [...fileList] : [];

  const onSubmit = async (data1: any) => {
    const users = [];
    users.push(data1);

    await createUsers({ users: users }).then((res: any) => {
      if (res.result.data[0].status === 'FAILED') {
        setOpen(false);
        setOpenError(true);
      } else {
        setOpen(false);
        alert('Successfully added');
      }
    });
  };

  return (
    <>
      <div className="h-[490px]">
        <div className="mx-6">
          <div className="flex flex-col   mb-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Layout className="flex space-x-4" fields={Fields} />
            </form>
          </div>

          <Button
            className="flex border-none  text-primary-500 !px-0 mb-6"
            label="Add Another"
            leftIcon="people"
            variant={ButtonVariant.Secondary}
            onClick={() => {}}
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
                  To invite a list of people, add your csv,xls or xlsx file in
                  the given format
                </div>
                <div>
                  {' '}
                  <Button
                    className="!border-none !bg-inherit !p-0 !text-primary-600 !text-xs !pt-0.5"
                    label="Download Format"
                    variant={ButtonVariant.Secondary}
                  />
                </div>
              </div>
              <div className="text-neutral-900 text-xs font-normal mt-1">
                File must be in csv, xls or xlsx format and must not exceed
                100mb
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
                variant={ButtonVariant.Secondary}
                onClick={handleUploadClick}
              />

              <ul className="">
                {files.map((file, i) => (
                  <li key={i}>
                    {file.name} - {file.type}
                  </li>
                ))}
              </ul>

              <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                multiple
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUsers;
