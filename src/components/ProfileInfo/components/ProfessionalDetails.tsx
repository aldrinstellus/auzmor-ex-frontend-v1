import React, { useEffect, useMemo, useState } from 'react';
import Card from 'components/Card';
import Divider from 'components/Divider';
import useHover from 'hooks/useHover';
import clsx from 'clsx';
import Icon from 'components/Icon';
import moment from 'moment';
import * as yup from 'yup';
import 'moment-timezone';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import Header from './Header';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import SelectTimeZone from 'components/UserOnboard/components/SelectTimeZone';
import { OptionType } from 'components/UserOnboard/components/SelectTimezoneScreen';
import { useMutation } from '@tanstack/react-query';
import { EditUserSection, updateCurrentUser } from 'queries/users';
import { getDefaultTimezoneOption } from 'components/UserOnboard/utils';
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import { twConfig } from 'utils/misc';
import { getTimezoneNameFromIANA } from 'utils/time';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import InfoRow from './InfoRow';
import useRole from 'hooks/useRole';

export interface IProfessionalDetailsProps {
  professionalDetails: any;
  canEdit?: boolean;
  editSection?: string;
  setSearchParams?: any;
  searchParams?: any;
}

const ProfessionalDetails: React.FC<IProfessionalDetailsProps> = ({
  professionalDetails,
  canEdit,
  editSection,
  setSearchParams,
  searchParams,
}) => {
  const [isHovered, eventHandlers] = useHover();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const defaultTimezone = getDefaultTimezoneOption();
  const { isAdmin } = useRole();

  useEffect(() => {
    if (editSection === EditUserSection.PROFESSIONAL && canEdit) {
      setIsEditable(true);
    }
  }, [editSection]);

  useEffect(() => {
    if (!isEditable && searchParams.has('edit')) {
      searchParams.delete('edit');
      setSearchParams(searchParams);
    }
  }, [isEditable]);

  const schema = yup.object({
    timeZone: yup.object(),
  });

  const { handleSubmit, control, getValues } = useForm<any>({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onHoverStyles = useMemo(
    () => clsx({ 'mb-8': true }, { 'shadow-xl': isHovered && canEdit }),
    [isHovered],
  );

  const updateUserTimezoneMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-timeZone-mutation'],
    onError: (error: any) => {},
    onSuccess: (response: any) => {
      toast(<SuccessToast content={'User Profile Updated Successfully'} />, {
        closeButton: (
          <Icon name="closeCircleOutline" color="text-primary-500" size={20} />
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

  const onSubmit = async () => {
    const selectedTimezone = getValues();
    let timezoneValue;
    if (selectedTimezone.timeZone === undefined) {
      timezoneValue = professionalDetails?.timeZone || defaultTimezone.value[0];
    } else {
      timezoneValue = selectedTimezone.timeZone.value[0];
    }
    await updateUserTimezoneMutation.mutateAsync({
      timeZone: timezoneValue,
    });
    await queryClient.invalidateQueries(['current-user-me']);
    setIsEditable(false);
  };

  const userTimezone = getTimezoneNameFromIANA(professionalDetails?.timeZone);

  return (
    <div {...eventHandlers}>
      <Header title="Professional Details" dataTestId="professional-details" />
      <Card className={onHoverStyles}>
        <div className="px-4">
          <InfoRow
            icon={{
              name: 'employee-tag',
              color: 'text-teal-500',
              bgColor: 'bg-teal-50',
            }}
            label="Employee ID"
            value={professionalDetails?.employeeId}
            canEdit={isAdmin}
            dataTestId="professional-details-employee-id"
          />
          <InfoRow
            icon={{
              name: 'calendar',
              color: 'text-orange-500',
              bgColor: 'bg-orange-50',
            }}
            label="Date of Joining"
            dataTestId="professional-details-joining-date"
            value={moment(professionalDetails?.createdAt).format(
              'Do MMMM YYYY',
            )}
          />
          <InfoRow
            icon={{
              name: 'clock',
              color: '!text-blue-500',
              bgColor: '!bg-blue-50',
            }}
            label="Timezone"
            value={userTimezone}
            dataTestId="professional-details-timezone"
            border={false}
            editNode={
              <SelectTimeZone
                control={control}
                defaultTimezone={{
                  value: professionalDetails?.timeZone,
                  label: userTimezone,
                }}
                placeholder="Select your timezone"
                dataTestId="professional-details-timezone"
              />
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default ProfessionalDetails;
