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
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import InfoRow from './InfoRow';
import Button, { Size, Variant } from 'components/Button';

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
    if (!value) {
      return '';
    }
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
          <Icon name="closeCircleOutline" color="text-primar-500" size={20} />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
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
      label: 'Date of Birth',
      className: '',
      minDate: moment().subtract(100, 'years').toDate(),
      maxDate: new Date(),
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
          setSkills([skillObject, ...skills]);
        }
      },
    },
  ];

  return (
    <div {...eventHandlers}>
      <Header title="Personal Details" dataTestId="personal-details" />
      <Card className={onHoverStyles}>
        <div className="px-4">
          <InfoRow
            icon={{
              name: 'cake',
              color: 'text-purple-500',
              bgColor: 'bg-purple-50',
            }}
            label="Date of Birth"
            dataTestId="user-dob"
            value={
              personalDetails?.personal?.birthDate &&
              moment(personalDetails?.personal?.birthDate).format(
                'DD MMMM YYYY',
              )
            }
          />
          <InfoRow
            icon={{
              name:
                personalDetails?.personal?.gender === 'FEMALE'
                  ? 'femaleIcon'
                  : 'male',
              color: 'text-pink-500',
              bgColor: 'bg-pink-50',
            }}
            label="Gender"
            dataTestId="personal-details-gender"
            value={
              personalDetails?.personal?.gender?.charAt(0)?.toUpperCase() +
              personalDetails?.personal?.gender?.slice(1)?.toLowerCase()
            }
          />
          <InfoRow
            icon={{
              name: 'marriedIcon',
              color: 'text-red-500',
              bgColor: 'text-red-50',
            }}
            label="Marital Status"
            dataTestId="user-marital-status"
            value={
              personalDetails?.personal?.maritalStatus?.charAt(0) +
                personalDetails?.personal?.maritalStatus
                  ?.slice(1)
                  ?.toLowerCase() || 'Field not specified'
            }
          />
          <InfoRow
            icon={{
              name: 'edit',
              color: 'text-primary-500',
              bgColor: 'text-primary-50',
            }}
            label="Skills"
            dataTestId="added-skills"
            canEdit={false}
            value={
              personalDetails?.personal?.skills?.length > 0 && (
                <div className="flex items-center flex-wrap">
                  {personalDetails?.personal?.skills.map(
                    (skill: string, index: number) => (
                      <div
                        key={skill}
                        data-testid={`personal-details-skill-${skill}`}
                        className="bg-primary-50 text-primary-500 flex justify-center items-center px-2 py-2 text-xs rounded-16xl mr-2"
                      >
                        {skill}
                      </div>
                    ),
                  )}
                  <div>
                    <Button
                      label="Add Skills"
                      variant={Variant.Secondary}
                      size={Size.ExtraSmall}
                      leftIcon="add"
                      leftIconSize={16}
                    />
                  </div>
                </div>
              )
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default memo(PersonalDetails);
