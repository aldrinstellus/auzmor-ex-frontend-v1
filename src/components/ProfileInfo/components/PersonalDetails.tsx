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
import { OptionType } from 'components/UserOnboard/components/SelectTimeZone';

interface IPersonalDetails {
  birthDate: string;
  gender: OptionType;
  permanentAddress: string;
  maritalStatus: OptionType;
  skills: string[];
}
interface IPersonalDetailsForm {
  personal: IPersonalDetails;
}

type IPersonalDetailsProps = {
  personalDetails: any;
  canEdit?: boolean;
};

const PersonalDetails: React.FC<IPersonalDetailsProps> = ({
  personalDetails,
  canEdit,
}) => {
  const [isHovered, eventHandlers] = useHover();
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const { control, handleSubmit, getValues } = useForm<IPersonalDetailsForm>({
    mode: 'onChange',
    defaultValues: {
      personal: {
        birthDate: personalDetails?.personal?.birthDate,
        gender: personalDetails?.personal?.gender,
        permanentAddress: personalDetails?.personal?.permanentLocation,
        maritalStatus: personalDetails?.personal?.maritalStatus,
      },
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

  const onSubmit = async (personalDetailData: IPersonalDetailsForm) => {
    const updatedPersonalDetails = {
      personal: {
        gender: personalDetailData?.personal?.gender?.value,
        birthDate: personalDetailData?.personal?.birthDate,
        permanentAddress: personalDetailData?.personal?.permanentAddress,
        maritalStatus: personalDetailData?.personal?.maritalStatus?.value,
        skills: ['ReactJs'],
      },
    };
    await updateUserPersonalDetailsMutation.mutateAsync({
      personal: updatedPersonalDetails?.personal,
    });
    await queryClient.invalidateQueries(['current-user-me']);
    setIsEditable(false);
  };

  const fields = [
    {
      type: FieldType.DatePicker,
      name: 'personal.birthDate',
      control,
      dataTestId: 'personal-details-dob',
      defaultValue: getValues()?.personal?.birthDate,
    },
    {
      type: FieldType.SingleSelect,
      name: 'personal.gender',
      placeholder: 'Select Gender',
      label: 'Gender',
      defaultValue: getValues()?.personal?.gender?.label,
      dataTestId: 'personal-details-gender',
      options: [
        { value: 'MALE', label: 'Male' },
        { value: 'FEMALE', label: 'Female' },
      ],
      control,
    },
    {
      type: FieldType.Input,
      name: 'personal.permanentAddress',
      placeholder: 'Ex - Flat no, line Address',
      label: 'Permanent Address',
      defaultValue: getValues()?.personal?.permanentAddress,
      dataTestId: 'personal-details-address',
      control,
    },
    {
      type: FieldType.SingleSelect,
      name: 'personal.maritalStatus',
      placeholder: '',
      label: 'Marital Status',
      defaultValue: getValues()?.personal?.maritalStatus?.label,
      dataTestId: 'personal-details-marital-status',
      options: [
        { value: 'MARRIED', label: 'Married' },
        { value: 'SINGLE', label: 'Single' },
      ],
      control,
      menuPlacement: 'top',
    },
    // {
    //   type: FieldType.Input,
    //   name: 'personal.skills',
    //   placeholder: 'Search for Skills',
    //   label: 'Skills',
    //   defaultValue: getValues()?.personal?.skills,
    //   dataTestId: 'personal-details-skills',
    //   control,
    // },
  ];

  return (
    <div {...eventHandlers}>
      <Card className={onHoverStyles}>
        <Header
          title="Personal Details"
          dataTestId="personal-details"
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
                    {moment(personalDetails?.personal?.birthDate).format(
                      'Do MMMM YYYY',
                    ) || 'N/A'}
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
                {personalDetails?.personal?.skills?.length > 0 && (
                  <div>
                    <div className="text-neutral-500 text-sm font-bold">
                      Skills
                    </div>
                    <div className="text-neutral-900 text-base font-medium">
                      {personalDetails?.personal?.skills.map(
                        (skill: string, index: number) => (
                          <ul key={index}>
                            <li>{skill}</li>
                          </ul>
                        ),
                      ) || 'N/A'}
                    </div>
                  </div>
                )}
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
