import React, { memo, useMemo, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
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
  const [selectedValues, setSelectedValues] = useState<
    Record<string, string>[]
  >([]);

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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const updatedItems = [...selectedValues];
    const [removed] = updatedItems.splice(source.index, 1);
    updatedItems.splice(destination.index, 0, removed);
    setSelectedValues(updatedItems);
  };

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
      });
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
        skills: selectedValues?.map((value) => value.text),
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
    {
      name: 'personal.skills',
      type: FieldType.Input,
      label: 'Skills',
      control,
      placeholder: 'Search for Skills',
      dataTestId: 'personal-details-skills',
      defaultValue: getValues()?.personal?.skills,
      onEnter: (event: any) => {
        if (event?.key === 'Enter') {
          event.preventDefault();
          const skillObject = {
            id: uuidv4(),
            text: event?.target?.value,
          };
          console.log(skillObject);
          setSelectedValues([...selectedValues, skillObject]);
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
                    {personalDetails?.personal?.gender === 'FEMALE' ? (
                      <Icon name="femaleIcon" size={16} />
                    ) : (
                      <Icon name="male" size={16} />
                    )}
                  </IconWrapper>
                  <div className="text-neutral-900 text-base font-medium">
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
                  <div className="text-neutral-900 text-base font-medium px-4">
                    {(personalDetails?.personal?.skills?.length > 0 &&
                      personalDetails?.personal?.skills.map(
                        (skill: string, index: number) => (
                          <ul key={index} className="list-disc">
                            <li>{skill}</li>
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
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId={uuidv4()}>
                    {(provided) => (
                      <ul
                        className="mt-3 space-y-1"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {selectedValues.map((value, index) => (
                          <Draggable
                            key={index}
                            draggableId={value.id}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                className="flex items-center justify-between border border-solid border-neutral-200 rounded-17xl py-2 px-4"
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                key={value.id}
                              >
                                <div className="flex items-center space-x-4">
                                  <Icon name="reorder" />
                                  <span className="mr-2">{value.text}</span>
                                </div>
                                <div className="flex space-x-4 items-center">
                                  <Icon name="edit" size={20} />
                                  <Icon
                                    name="delete"
                                    stroke="#F05252"
                                    hover={false}
                                    fill="#F05252"
                                    size={20}
                                    onClick={() => {
                                      const updatedValues =
                                        selectedValues.filter(
                                          (selectedValue) =>
                                            selectedValue !== value,
                                        );
                                      setSelectedValues(updatedValues);
                                    }}
                                  />
                                </div>
                              </li>
                            )}
                          </Draggable>
                        ))}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </form>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default memo(PersonalDetails);
