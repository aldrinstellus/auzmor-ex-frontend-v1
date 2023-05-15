import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import Modal from 'components/Modal';
import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Avatar from 'components/Avatar';
import { Variant as InputVariant } from 'components/Input';

export interface IUpdateProfileForm {
  fullName: string;
  designation: string;
  department: string;
  location: string;
  profileImage: string;
  coverImage: string;
}

interface IEditProfileModal {
  data: Record<string, any>;
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
  coverImageRef: React.RefObject<HTMLInputElement> | null;
}

const EditProfileModal: React.FC<IEditProfileModal> = ({
  data,
  showModal,
  setShowModal,
  coverImageRef,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IUpdateProfileForm>({
    mode: 'onSubmit',
    defaultValues: {
      fullName: '',
      designation: '',
      department: '',
      location: '',
      profileImage: '',
      coverImage: '',
    },
  });

  const onSubmit = (userData: Record<string, any>) => {
    console.log('called?', userData);
  };

  const Header: React.FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        Edit Profile
      </div>
      <IconButton
        onClick={() => {
          setShowModal(false);
        }}
        icon={'close'}
        className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
        variant={IconVariant.Primary}
      />
    </div>
  );
  const Footer: React.FC = () => (
    <div className="flex justify-end items-center h-16 p-6 bg-blue-50">
      <Button
        variant={ButtonVariant.Secondary}
        size={Size.Small}
        label={'Cancel'}
        className="mr-3"
        onClick={() => {
          setShowModal(false);
        }}
      />
      <Button
        label={'Save Changes'}
        size={Size.Small}
        type={ButtonType.Submit}
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );

  const nameField = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: data?.userName,
      name: 'name',
      label: 'Name*',
      dataTestId: 'user-profile-name',
      control,
      disabled: true,
    },
  ];

  const positionTitlefields = [
    {
      type: FieldType.SingleSelect,
      name: 'position',
      placeholder: 'Software Engineer',
      label: 'Position title',
      defaultValue: '',
      options: [
        { id: '1', label: 'Software Engineer' },
        { id: '2', label: 'Research Analyst' },
      ],
      control,
    },
  ];

  const departmentField = [
    {
      type: FieldType.SingleSelect,
      name: 'department',
      placeholder: 'Engineering',
      label: 'Department',
      defaultValue: '',
      options: [
        { id: '1', label: 'Sales and Marketing' },
        { id: '2', label: 'Engineering' },
      ],
      classname: 'bg-red-400',
      control,
    },
  ];

  const locationField = [
    {
      type: FieldType.SingleSelect,
      name: 'location',
      placeholder: 'Mumbai, MH India',
      label: 'Location',
      defaultValue: 'Mumbai, India',
      options: [
        { id: '1', label: 'Mumbai, India' },
        { id: '2', label: 'Hydrabad, Talangana' },
      ],
      classname: 'bg-red-400',
      control,
    },
  ];

  return (
    <Modal
      open={showModal}
      closeModal={() => {
        setShowModal(false);
      }}
    >
      <Header />
      <div className="relative cursor-pointer">
        <img
          className="object-cover w-full h-[108px]"
          style={data?.coverImage?.original || { backgroundColor: '#3F83F8' }}
          src={data?.coverImage?.original}
        />
        <IconButton
          icon="edit"
          className="bg-white m-4 absolute top-0 right-0 p-3 text-black"
          variant={IconVariant.Secondary}
          size={Size.Medium}
          onClick={() => coverImageRef?.current?.click()}
        />
      </div>
      <div className="ml-8 mb-8 flex items-center">
        <div className="-mt-20">
          <div className="relative">
            <Avatar
              name={data?.fullName}
              image={data?.profileImage?.original}
              size={96}
              className="border-2 border-white mt-8"
            />
            <div>
              <IconButton
                icon="edit"
                className="bg-white m-0 absolute top-0 right-0 p-[7px] text-black"
                variant={IconVariant.Secondary}
                size={Size.Medium}
                onClick={() => coverImageRef?.current?.click()}
              />
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="mx-6 mb-14 space-y-6 overflow-y-auto">
        <Layout fields={nameField} />
        <div className="w-full flex space-x-6">
          <div className="w-[50%]">
            <Layout fields={positionTitlefields} />
          </div>
          <div className="w-[50%]">
            <Layout fields={departmentField} />
          </div>
        </div>
        <Layout fields={locationField} />
      </div>
      <Footer />
    </Modal>
  );
};

export default EditProfileModal;
