import React, { memo, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Card from 'components/Card';
import Divider from 'components/Divider';
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
import { twConfig } from 'utils/misc';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import DragDropList from 'components/DragDropList';

interface IPersonalDetails {
  birthDate: Date | string;
  gender: OptionType;
  permanentLocation: string;
  maritalStatus: OptionType;
  skills: string[];
}
interface IPersonalDetailsForm {
  personal: IPersonalDetails;
  skills: string;
}

export interface ISkillsOption {
  id: string;
  value: string;
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
  const [skills, setSkills] = useState<ISkillsOption[]>([]);

  const convertUpperCaseToPascalCase = (value: string) => {
    return value[0] + value.substring(1, value.length).toLowerCase();
  };

  const { control, handleSubmit, getValues, resetField } =
    useForm<IPersonalDetailsForm>({
      mode: 'onChange',
      defaultValues: {
        personal: {
          birthDate:
            personalDetails?.personal?.birthDate &&
            new Date(personalDetails?.personal?.birthDate),
          gender: {
            label: convertUpperCaseToPascalCase(
              personalDetails?.personal?.gender,
            ),
            value: personalDetails?.personal?.gender,
          },
          permanentLocation: personalDetails?.personal?.permanentAddress,
          maritalStatus: {
            label: convertUpperCaseToPascalCase(
              personalDetails?.personal?.maritalStatus,
            ),
            value: personalDetails?.personal?.maritalStatus,
          },
        },
        skills: '',
      },
    });

  const onHoverStyles = useMemo(
    () => clsx({ 'mb-8': true }, { 'shadow-xl': isHovered && canEdit }),
    [isHovered],
  );

  const setInitialSkills = () => {
    if (personalDetails?.personal?.skills) {
      const personalSkillsList = personalDetails?.personal?.skills?.map(
        (skill: string) => ({
          id: uuidv4(),
          value: skill,
        }),
      );
      setSkills(personalSkillsList);
    }
  };

  useEffect(() => {
    setInitialSkills();
  }, []);

  const updateUserPersonalDetailsMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-personal-details-mutation'],
    onError: (error: any) => {},
    onSuccess: (response: any) => {
      toast(<SuccessToast content={'User Profile Updated Successfully'} />, {
        closeButton: (
          <Icon
            name="closeCircleOutline"
            stroke={twConfig.theme.colors.primary['500']}
            size={20}
          />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: 2000,
      });
      setIsEditable(false);
    },
  });

  const onSubmit = async (personalDetailData: IPersonalDetailsForm) => {
    const updatedPersonalDetails = {
      personal: {
        gender: personalDetailData?.personal?.gender?.value,
        birthDate: personalDetailData?.personal?.birthDate,
        permanentAddress: personalDetailData?.personal?.permanentLocation,
        maritalStatus: personalDetailData?.personal?.maritalStatus?.value,
        skills:
          skills.length > 0
            ? skills.map((skill: ISkillsOption) => skill.value)
            : undefined,
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
      defaultValue: getValues()?.personal?.gender,
      dataTestId: 'personal-details-gender',
      options: [
        {
          value: 'MALE',
          label: 'Male',
          dataTestId: 'personal-details-gender-male',
        },
        {
          value: 'FEMALE',
          label: 'Female',
          dataTestId: 'personal-details-gender-female',
        },
      ],
      control,
    },
    {
      type: FieldType.Input,
      name: 'personal.permanentLocation',
      placeholder: 'Ex - Flat no, line Address',
      label: 'Permanent Address',
      defaultValue: getValues()?.personal?.permanentLocation,
      dataTestId: 'personal-details-address',
      control,
    },
    {
      type: FieldType.SingleSelect,
      name: 'personal.maritalStatus',
      placeholder: 'Select Marital Status',
      label: 'Marital Status',
      defaultValue: getValues()?.personal?.maritalStatus,
      dataTestId: 'personal-details-marital-status',
      options: [
        {
          value: 'MARRIED',
          label: 'Married',
          dataTestId: 'personal-details-marital-status-married',
        },
        {
          value: 'SINGLE',
          label: 'Single',
          dataTestId: 'personal-details-marital-status-single',
        },
      ],
      control,
      menuPlacement: 'top',
    },
    {
      name: 'skills',
      type: FieldType.Input,
      label: 'Skills',
      control,
      placeholder: 'Search for Skills',
      dataTestId: 'personal-details-skills',
      defaultValue: getValues()?.skills,
      onEnter: (event: any) => {
        if (event?.key === 'Enter') {
          event.preventDefault();
          const skillObject = {
            id: uuidv4(),
            value: event?.target?.value,
          };
          resetField('skills');
          console.log(skills, skillObject);
          setSkills([skillObject, ...skills]);
        }
      },
    },
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
          setInitialSkills={setInitialSkills}
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
                    <span data-testid="user-dob">
                      {(personalDetails?.personal?.birthDate &&
                        moment(personalDetails?.personal?.birthDate).format(
                          'DD MMMM YYYY',
                        )) ||
                        'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <IconWrapper type={Type.Square} className="cursor-pointer">
                    {personalDetails?.personal?.gender === 'FEMALE' ? (
                      <Icon name="femaleIcon" size={16} />
                    ) : (
                      <Icon name="male" size={16} />
                    )}
                  </IconWrapper>
                  <div
                    className="text-neutral-900 text-base font-medium"
                    data-testid="personal-details-gender"
                  >
                    {personalDetails?.personal?.gender
                      ?.charAt(0)
                      ?.toUpperCase() +
                      personalDetails?.personal?.gender
                        ?.slice(1)
                        ?.toLowerCase() || 'N/A'}
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
                    <div
                      className="text-neutral-900 text-base font-medium"
                      data-testid="personal-details-permanent-address"
                    >
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
                    <div
                      className="text-neutral-900 text-base font-medium"
                      data-testid={`user-marital-status`}
                    >
                      {personalDetails?.personal?.maritalStatus?.charAt(0) +
                        personalDetails?.personal?.maritalStatus
                          ?.slice(1)
                          ?.toLowerCase() || 'N/A'}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 text-sm font-bold">
                    Skills
                  </div>
                  <div
                    className="text-neutral-900 text-base font-medium px-4"
                    data-testid="added-skills"
                  >
                    {(personalDetails?.personal?.skills?.length > 0 &&
                      personalDetails?.personal?.skills.map(
                        (skill: string, index: number) => (
                          <ul key={index} className="list-disc">
                            <li data-testid={`personal-details-skill-${skill}`}>
                              {skill}
                            </li>
                          </ul>
                        ),
                      )) ||
                      'N/A'}
                  </div>
                </div>
              </>
            ) : (
              <form>
                <div className="text-neutral-900 text-sm font-bold">
                  Date of Birth
                </div>
                <Layout fields={fields} />
                <DragDropList
                  draggableItems={skills}
                  setDraggableItems={setSkills}
                  dataTestIdEdit={'edit-button'}
                  dataTestIdDelete={'delete-button'}
                />
              </form>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default memo(PersonalDetails);
