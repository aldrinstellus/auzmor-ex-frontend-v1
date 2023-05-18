import Card from 'components/Card';
import Divider from 'components/Divider';
import React, { memo, useMemo, useState } from 'react';
import clsx from 'clsx';
import useHover from 'hooks/useHover';
import Icon from 'components/Icon';
import moment from 'moment';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import Header from './Header';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { updateCurrentUser } from 'queries/users';
import queryClient from 'utils/queryClient';

export interface IPersonalDetailsProps {
  personalDetails: any;
  skills: string[];
  canEdit?: boolean;
}

interface IPersonalDetailsForm {
  dateOfBirth: string;
  gender: string;
  permanentAddress: string;
  maritalStatus: string;
}

const PersonalDetails: React.FC<IPersonalDetailsProps> = ({
  personalDetails,
  skills,
  canEdit,
}) => {
  const [isHovered, eventHandlers] = useHover();
  const [isEditable, setIsEditable] = useState<boolean>(false);

  console.log('person', personalDetails);

  const { control, handleSubmit, getValues } = useForm<IPersonalDetailsForm>({
    mode: 'onChange',
    defaultValues: {
      dateOfBirth: personalDetails?.personal?.birthDate,
      gender: personalDetails?.personal?.gender,
      permanentAddress: personalDetails?.personal?.permanentLocation,
      maritalStatus: personalDetails?.personal?.maritalStatus,
    },
  });

  const onHoverStyles = useMemo(
    () => clsx({ 'mb-8': true }, { 'shadow-xl': isHovered && canEdit }),
    [isHovered],
  );

  const updateUserPersonalDetailsMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-personal-details-mutation'],
    onError: (error: any) => {
      console.log('Error while updating the user: ', error);
    },
    onSuccess: (response: any) => {
      console.log('Updated User data successfully', response);
      setIsEditable(false);
    },
  });

  const onSubmit = async (personalDetailData: any) => {
    // await updateUserPersonalDetailsMutation.mutateAsync({
    //   ...personalDetails,
    //   personal: {
    //     about: 'Hello I am groot',
    //     birthDate: personalDetailData?.dateOfBirth.toISOString(),
    //     permanentLocation: personalDetailData?.permanentAddress,
    //     gender: personalDetailData?.gender?.value,
    //     maritalStatus: personalDetailData?.maritalStatus?.value,
    //     // skills: personalDetails?.skills, // array of string
    //     skills: ['Nodejs'],
    //   },
    // });
    await queryClient.invalidateQueries(['current-user-me']);
    setIsEditable(false);
  };

  const fields = [
    {
      type: FieldType.DatePicker,
      name: 'dateOfBirth',
      control,
      dataTestId: getValues().dateOfBirth,
      defaultValue: '08/08/2001',
    },
    {
      type: FieldType.SingleSelect,
      name: 'gender',
      placeholder: 'Select Gender',
      label: 'Gender',
      defaultValue: getValues().gender,
      dataTestId: '',
      options: [
        { value: 'MALE', label: 'Male' },
        { value: 'FEMALE', label: 'Female' },
      ],
      control,
    },
    {
      type: FieldType.Input,
      name: 'permanentAddress',
      placeholder: 'Ex - Flat no, line Address',
      label: 'Permanent Address',
      defaultValue: getValues().permanentAddress,
      dataTestId: '',
      control,
    },
    {
      type: FieldType.SingleSelect,
      name: 'maritalStatus',
      placeholder: '',
      label: 'Marital Status',
      defaultValue: getValues().maritalStatus,
      dataTestId: '',
      options: [
        { value: 'MARRIED', label: 'Married' },
        { value: 'UNMARRIED', label: 'Unmarried' },
        { value: 'SINGLE', label: 'Single' },
      ],
      control,
    },
    // {
    //   type: FieldType.Input,
    //   name: 'skills',
    //   placeholder: 'Search for Skills',
    //   label: 'Skills',
    //   defaultValue: '',
    //   dataTestId: '',
    //   control,
    // },
  ];

  return (
    <div {...eventHandlers}>
      <Card className={onHoverStyles}>
        <Header
          title="Personal Details"
          isHovered={isHovered}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          canEdit={canEdit}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isLoading={updateUserPersonalDetailsMutation.isLoading}
        />
        <Divider />
        <div className="p-6">
          <div className="pb-4 space-y-3">
            {!isEditable ? (
              <>
                <div className="flex space-x-3">
                  <IconWrapper type={Type.Square} className="cursor-pointer">
                    <Icon name="cake" size={16} />
                  </IconWrapper>
                  <div className="text-neutral-900 text-base font-medium">
                    Born on{' '}
                    {moment(personalDetails?.createdAt).format('Do MMMM')}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <IconWrapper type={Type.Square} className="cursor-pointer">
                    <Icon name="femaleIcon" size={16} />
                  </IconWrapper>
                  <div className="text-neutral-900 text-base font-medium">
                    {personalDetails?.personal?.gender || 'N/A'}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="text-neutral-500 text-sm font-bold">
                    Permanent Address
                  </div>
                  <div className="flex space-x-3">
                    <IconWrapper type={Type.Square} className="cursor-pointer">
                      <Icon name="location" size={16} />
                    </IconWrapper>
                    <div className="text-neutral-900 text-base font-medium">
                      {personalDetails?.personal?.permanentAddress || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="text-neutral-500 text-sm font-bold">
                    Marital Status
                  </div>
                  <div className="flex space-x-3">
                    <IconWrapper type={Type.Square} className="cursor-pointer">
                      <Icon name="marriedIcon" size={16} />
                    </IconWrapper>
                    <div className="text-neutral-900 text-base font-medium">
                      {personalDetails?.personal?.maritalStatus || 'N/A'}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 text-sm font-bold">
                    Skills
                  </div>
                  <div className="text-neutral-900 text-base font-medium">
                    {skills.map((skill, index) => (
                      <ul key={index}>
                        <li>{skill}</li>
                      </ul>
                    )) || 'N/A'}
                  </div>
                </div>
              </>
            ) : (
              <form>
                <div className="text-neutral-900 text-sm font-bold">
                  Date of Birth
                </div>
                <Layout fields={fields} />
              </form>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default memo(PersonalDetails);
